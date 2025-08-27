from django.contrib import admin
from django.urls import path
from accounts.views import (
    RegisterCoachView,
    RegisterAthleteView,
    CustomTokenObtainPairView,
    athlete_profile,
    coach_profile,
    coaches_by_sport,
    CreateCoachingRequestView,
    update_request_status,
    MyCoachingRequestsView,
    delete_request  # new view to fetch athlete requests
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth / Registration
    path('api/register/coach/', RegisterCoachView.as_view(), name="register-coach"),
    path('api/register/athlete/', RegisterAthleteView.as_view(), name="register-athlete"),
    path('api/login/', CustomTokenObtainPairView.as_view(), name="login"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),

    # Profiles
    path("api/athlete/me/", athlete_profile, name="athlete-profile"),
    path("api/coach/me/", coach_profile, name="coach-profile"),
    path("api/coaches/<str:sport>/", coaches_by_sport, name="coaches-by-sport"),

    # Coaching Requests
    path('api/requests/create/', CreateCoachingRequestView.as_view(), name='create-request'),
    path('api/requests/my/', MyCoachingRequestsView.as_view(), name='my-requests'),  # NEW
    path('api/requests/update/<int:pk>/', update_request_status, name='update-request'),
     path('api/requests/delete/<int:pk>/', delete_request, name='delete-request'),
]
