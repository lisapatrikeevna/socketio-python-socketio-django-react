from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)  # add is_admin for superUser



        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    email = models.EmailField(unique=True, verbose_name='Email')
    username = models.CharField(max_length=55, unique=True, blank=True, null=True, verbose_name='Username')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    is_admin = models.BooleanField(default=False)  # new fields is_admin

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_tokens(self):
        refresh = RefreshToken.for_user(self)
        return str(refresh.access_token), str(refresh)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['email']
        db_table = 'users'

class CommonLoggerErrors(models.Model):
    status = models.BooleanField()
    data = models.DateTimeField(auto_now=True)
    userName = models.CharField(max_length=250, blank=True, null=True)
    descriptionProcess = models.TextField(blank=True, null=True)


    def __str__(self):
        return self.data
    class Meta:
        ordering = ('data', )