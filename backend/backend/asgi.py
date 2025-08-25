import os
import django
import socketio
from django.core.asgi import get_asgi_application

print('--------!!!!!!!!!!!!asgi.py!!!!!!!!!!!!-------')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()  # 🔴 обязательно — чтобы всё было готово до импорта socketio

# from socketio.socketio_instance import sio
# from backend.socketio.socketio_instance import sio
# application = socketio.ASGIApp(sio, get_asgi_application())

# import os
# # from django.core.asgi import get_asgi_application
# print('--------!!!!!!!!!!!!asgi.py!!!!!!!!!!!!-------')
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# # application = get_asgi_application()