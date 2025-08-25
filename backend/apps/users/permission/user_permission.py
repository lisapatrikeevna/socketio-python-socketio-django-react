from rest_framework.permissions import BasePermission


class IsUser(BasePermission):

    def has_permission(self, request, view):
        return (
                request.user.is_authenticated and
                not request.user.is_admin
        )


class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        return (
                request.user.is_authenticated and
                (request.user.is_admin or request.user.is_superuser)
        )


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return (
                request.user.is_authenticated and request.user.is_staff
        )
