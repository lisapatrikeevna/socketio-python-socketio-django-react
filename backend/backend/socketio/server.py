import socketio
# import os
from django.core.asgi import get_asgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
print('--------server.py-------')
from . import handlers

app = socketio.ASGIApp(sio, get_asgi_application())