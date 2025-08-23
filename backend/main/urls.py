from django.contrib import admin
from django.urls import path
from accounts.views import RegisterCoachView, RegisterAthleteView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/coach/', RegisterCoachView.as_view(), name="register-coach"),
    path('api/register/athlete/', RegisterAthleteView.as_view(), name="register-athlete"),
    path('api/login/', CustomTokenObtainPairView.as_view(), name="login"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),
]
