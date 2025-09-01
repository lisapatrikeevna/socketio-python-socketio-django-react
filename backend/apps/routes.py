from django.urls import path, include

urlpatterns = [
    path('users/', include('apps.users.urls')),
    path('chats/', include('apps.chats.urls')),
]
