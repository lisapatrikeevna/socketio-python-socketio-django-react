from social_core.exceptions import AuthForbidden
from apps.users.models import User
from apps.users.views.login_view import LoginView
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from django.contrib.auth import get_user_model

import logging
logger = logging.getLogger(__name__)

User = get_user_model()


def require_existing_user(strategy, details, backend, user=None, *args, **kwargs):
    """
    Проверяет, существует ли пользователь в базе перед тем, как разрешить вход через Microsoft 365.
    Использует существующую логику `login_view.py`, но отключает проверку пароля.
    """
    email = details.get("email")

    if not email:
        logger.warning("SSO: Не передан email")
        raise AuthForbidden("Microsoft 365 не предоставил email")

    try:
        # Проверяем пользователя в БД
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logger.warning("SSO: Пользователь с email %s не найден", email)
        raise AuthForbidden(f"Пользователь с email {email} не найден в системе.")

    # ✅ Создаём тестовый запрос для использования LoginView
    factory = APIRequestFactory()
    request = factory.post('/api/login/', {"identifier": email})
    request._request.sso_login = True  # <--- ВАЖНО: отключает проверку пароля

    # ✅ Вызываем существующую логику login_view
    login_view = LoginView.as_view()
    response: Response = login_view(request)

    if response.status_code != 200:
        raise AuthForbidden("Ошибка входа через Microsoft 365.")

    return {"user": user}  # ✅ Возвращаем пользователя
