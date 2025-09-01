from django.contrib.auth import get_user_model
from .server import sio
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie

# [added] extra imports for role-based logic
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async


print('--------handlers.py-------')
@sio.event
async def connect(sid, environ):
    # [changed] role-aware connect: save is_admin and auto-join non-admin into their room
    from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
    from rest_framework_simplejwt.exceptions import TokenError
    from http.cookies import SimpleCookie
    from apps.chats.models import Chat

    print(f"🔌 Connected: {sid}, Environment: {environ}")
    cookie_header = environ.get("HTTP_COOKIE", "")
    cookies = SimpleCookie()
    cookies.load(cookie_header)

    access_token = cookies.get("access_token")
    refresh_token = cookies.get("refresh_token")

    token = None

    if access_token:
        print('--------------access_token--------------', access_token.value)
        try:
            token = AccessToken(access_token.value)
            print("✅ Access token valid")
        except TokenError as e:
            print(f"⚠️ Access token error: {e}")

    if token is None and refresh_token:
        try:
            token = RefreshToken(refresh_token.value)
            print("♻️ Used refresh token instead")
        except TokenError as e:
            print(f"⚠️ Refresh token error: {e}")

    if token is not None:
        try:
            user_id = token["user_id"]
            print(f"✅ User ID: {user_id}")

            # [added] load user and store is_admin in session
            get_user = sync_to_async(get_user_model().objects.get)
            user = await get_user(id=user_id)
            await sio.save_session(sid, {"user_id": user_id, "is_admin": user.is_admin})

            if user.is_admin:
                # [added] ADMIN: join ALL rooms on connect
                get_all_room_names = sync_to_async(
                    lambda: list(Chat.objects.values_list("room_name", flat=True))
                )
                room_names = await get_all_room_names()
                for room in room_names:
                    await sio.enter_room(sid, room)
                print(f"👑 Admin auto-joined {len(room_names)} rooms")
            else:
                get_chat = sync_to_async(Chat.objects.get)
                chat = await get_chat(owner=user)
                await sio.enter_room(sid, chat.room_name)
                print(f"➡️ Non-admin joined own room: {chat.room_name}")


            # [note] admins do not auto-join rooms here; they can join via `join` event
        except Exception as e:
            print(f"⚠️ Failed to initialize user session: {e}")
    else:
        print("❌ No valid token found. Proceeding without user session.")

@sio.event
async def disconnect(sid,reason):
    print(f"🔌 Disconnected: {sid}, Reason: {reason}")

@sio.event
async def join(sid, data):
    # [changed] allow only admins to join rooms; prefer target_user_id
    from apps.chats.models import Chat
    session = await sio.get_session(sid)
    if not session:
        await sio.emit('error', {'detail': 'no session'}, to=sid)
        return

    if not session.get('is_admin'):
        await sio.emit('error', {'detail': 'only admins can join chats'}, to=sid)
        return

    target_user_id = (data or {}).get('target_user_id')
    chat_id = (data or {}).get('chat_id')  # legacy support

    room_name = None
    if target_user_id:
        room_name = f"chat_{target_user_id}"
        # [added] ensure chat exists for the target non-admin
        from django.contrib.auth import get_user_model as _gum
        get_user = sync_to_async(_gum().objects.get)
        try:
            target_user = await get_user(id=target_user_id)
            if target_user.is_admin:
                await sio.emit('error', {'detail': 'target is admin, expected non-admin user'}, to=sid)
                return
        except Exception:
            await sio.emit('error', {'detail': 'target user not found'}, to=sid)
            return
        get_or_create_chat = sync_to_async(Chat.objects.get_or_create)
        await get_or_create_chat(owner=target_user, defaults={'room_name': room_name})
    elif chat_id:
        # fallback: join by chat_id
        # we'll compute room name based on convention
        room_name = f"chat_{chat_id}"
    else:
        await sio.emit('error', {'detail': 'target_user_id (preferred) or chat_id is required'}, to=sid)
        return

    await sio.enter_room(sid, room_name)
    await sio.emit('joined', {'room': room_name}, to=sid)

@sio.event
async def send_message(sid, data):
    # [changed] role-aware send: non-admin -> own room; admin -> target_user_id room
    print('------data-------', data)
    print('------sid-------', sid)
    from apps.chat_messages.models import ChatMessage
    from apps.chats.models import Chat

    session = await sio.get_session(sid)
    if session is None:
        print(f"No session with sid {sid} found")
        return

    if "user_id" not in session:
        print("No user_id in session")
        return

    user_id = session["user_id"]
    is_admin = session.get("is_admin", False)
    print(f"User in session: {user_id}, is_admin={is_admin}")

    text = (data or {}).get("text", "").strip()
    if not text:
        await sio.emit('error', {'detail': 'text is required'}, to=sid)
        return

    get_user = sync_to_async(get_user_model().objects.get)
    user = await get_user(id=user_id)

    if is_admin:
        target_user_id = (data or {}).get("target_user_id")
        if not target_user_id:
            await sio.emit('error', {'detail': 'target_user_id is required for admin'}, to=sid)
            return

        # ensure target is non-admin and chat exists
        target_user = await get_user(id=target_user_id)
        if target_user.is_admin:
            await sio.emit('error', {'detail': 'target must be a non-admin user'}, to=sid)
            return

        room_name = f"chat_{target_user.id}"
        get_or_create_chat = sync_to_async(Chat.objects.get_or_create)
        chat, _ = await get_or_create_chat(owner=target_user, defaults={"room_name": room_name})
    else:
        # non-admin always writes to their own room
        room_name = f"chat_{user.id}"
        get_or_create_chat = sync_to_async(Chat.objects.get_or_create)
        chat, _ = await get_or_create_chat(owner=user, defaults={"room_name": room_name})

    create_message = sync_to_async(ChatMessage.objects.create)
    message = await create_message(
        chat=chat,
        user=user,
        text=text
    )
    print('---------message----------', message)

    await sio.emit("new_message", {
        "chat": chat.room_name,  # [changed] include room name
        "chat_id": chat.id,
        "user_id": message.user_id,
        "nick": message.user.username,
        "text": message.text,
        "created_at": str(message.created_at),
    }, room=room_name)