# from django.db.models import Q
# from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser
# from rest_framework.views import APIView
#
# from apps.users.models import User
# from apps.users.serializers.user import SafeUserSerializer
#
#
# class UserSearchView(APIView):
#     permission_classes = [IsAdminUser]
#
#     def get(self, request, *args, **kwargs):
#         search_query = request.query_params.get('search', '')
#         users = User.objects.filter(
#             is_superuser=False,
#             is_staff=False,
#             is_active=True
#         )
#
#         if search_query:
#             users = users.filter(
#                 Q(username__icontains=search_query) |
#                 Q(email__icontains=search_query) |
#                 Q(first_name__icontains=search_query) |
#                 Q(last_name__icontains=search_query)
#             )
#
#         serializer = SafeUserSerializer(users, many=True)
#         return Response(serializer.data)
#
