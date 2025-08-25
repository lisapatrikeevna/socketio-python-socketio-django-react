# from django.contrib.auth.models import User
from .server import sio
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie



print('--------handlers.py-------')
@sio.event
async def connect(sid, environ):
    from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
    from rest_framework_simplejwt.exceptions import TokenError
    from http.cookies import SimpleCookie

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
            sio.save_session(sid, {"user_id": user_id})
        except Exception as e:
            print(f"⚠️ Failed to extract user_id: {e}")
    else:
        print("❌ No valid token found. Proceeding without user session.")

@sio.event
async def disconnect(sid,reason):
    print(f"🔌 Disconnected: {sid}, Reason: {reason}")

@sio.event
async def join(sid, data):
    chat_id = data["chat_id"]
    await sio.enter_room(sid, f"chat_{chat_id}")

@sio.event
# async def send_message(sid, data):
#     print('------data-------',data)
#     print('------sid-------',sid)
#     from apps.chat_messages.models import ChatMessage
#     create_message = sync_to_async(ChatMessage.objects.create)
#     message = await create_message(
#         chat_id=data["chat_id"],
#         nick=data["nick"],
#         text=data["text"]
#     )
#     print('---------message----------',message)
#     await sio.emit("new_message", {
#         "chat_id": message.chat_id,
#         "nick": message.nick,
#         "text": message.text,
#         "created_at": str(message.created_at),
#     }, room=f"chat_{message.chat_id}")
async def send_message(sid, data):
    print('------data-------',data)
    print('------sid-------',sid)
    from apps.chat_messages.models import ChatMessage
    create_message = sync_to_async(ChatMessage.objects.create)
    message = await create_message(
        chat_id=data["chat_id"],
        nick=data["nick"],
        text=data["text"]
    )
    print('---------message----------',message)
    await sio.emit("new_message", {
        "chat_id": message.chat_id,
        "nick": message.nick,
        "text": message.text,
        "created_at": str(message.created_at),
    }, room=f"chat_{message.chat_id}")