from django.urls import path

from apps.chats.views import ChatView

urlpatterns = [
    path('', ChatView.as_view(), name='chats'),
]