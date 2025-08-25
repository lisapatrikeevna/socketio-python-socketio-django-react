from django.urls import path

# from apps.users.views.change_password import ChangePasswordView
from apps.users.views.registration_view import RegistrationView
from apps.users.views.login_view import LoginView
from apps.users.views.logout_view import LogoutView
# from apps.users.views.refresh_view import RefreshTokenView
# from apps.users.views.get_me_view import MeView


urlpatterns = [
    path('register/', RegistrationView.as_view(), name='registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('change_password/', ChangePasswordView.as_view(), name='registration'),
    # path('me/', MeView.as_view(), name='about'),
    # path('refreshToken/', RefreshTokenView.as_view(), name='refresh_token'),

]
