# from django.contrib import admin
# from django import forms
# from django.contrib.auth import get_user_model
# from django.contrib.auth.admin import UserAdmin
# from django.utils.translation import gettext_lazy as _
# from .models import User
#
# admin.site.unregister(get_user_model())
#
# class CustomUserChangeForm(forms.ModelForm):
#     password = forms.CharField(
#         label=_("Password"),
#         required=False,
#         widget=forms.PasswordInput,
#         help_text=_("Leave blank if you don't want to change the password."),
#     )
#
#     class Meta:
#         model = User
#         fields = ('email', 'username', 'password', 'is_admin', 'is_staff', 'is_active')
#
#     def save(self, commit=True):
#         user = super().save(commit=False)
#         password = self.cleaned_data.get("password")
#         if password:
#             user.set_password(password)
#         if commit:
#             user.save()
#         return user
#
#
#
# class CustomUserCreationForm(forms.ModelForm):
#     password1 = forms.CharField(
#         label=_("Password"),
#         widget=forms.PasswordInput,
#         help_text=_("Enter the password."),
#     )
#     password2 = forms.CharField(
#         label=_("Password confirmation"),
#         widget=forms.PasswordInput,
#         help_text=_("Enter the same password as before, for verification."),
#     )
#
#     class Meta:
#         model = User
#         fields = ('email', 'username', 'is_admin', 'is_staff', 'is_active')
#
#     def clean_password2(self):
#         password1 = self.cleaned_data.get("password1")
#         password2 = self.cleaned_data.get("password2")
#         if password1 and password2 and password1 != password2:
#             raise forms.ValidationError(_("Passwords don't match"))
#         return password2
#
#     def save(self, commit=True):
#         user = super().save(commit=False)
#         user.set_password(self.cleaned_data["password1"])
#         if commit:
#             user.save()
#         return user
#
#
# class CustomUserAdmin(UserAdmin):
#     form = CustomUserChangeForm
#     add_form = CustomUserCreationForm
#
#
#     list_display = ('email', 'username', 'is_admin', 'is_staff', 'is_active')
#     list_filter = ('is_admin', 'is_staff', 'is_active')
#     search_fields = ('email', 'username')
#     ordering = ('email',)
#
#
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         (_('Personal info'), {'fields': ('username',)}),
#         (_('Permissions'), {'fields': ('is_admin', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
#         (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
#     )
#
#
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'username', 'password1', 'password2', 'is_admin', 'is_staff', 'is_active'),
#         }),
#     )
#
#     filter_horizontal = ('groups', 'user_permissions')
#
#
#
# admin.site.register(User, CustomUserAdmin)
