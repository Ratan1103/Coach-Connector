from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User, CoachProfile, AthleteProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CoachRegisterSerializer, AthleteRegisterSerializer


class RegisterCoachView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        user = User.objects.create_user(
            email=data["email"],
            name=data["name"],
            password=data["password"],
            is_coach=True,
        )
        CoachProfile.objects.create(
            user=user,
            phone=data["phone"],
            experience=data["experience"],
            sport=data["sport"],
        )
        return Response({"message": "Coach registered successfully"})


class RegisterAthleteView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        user = User.objects.create_user(
            email=data["email"],
            name=data["name"],
            password=data["password"],
            is_athlete=True,
        )
        AthleteProfile.objects.create(
            user=user,
            phone=data["phone"],
            age=data["age"],
            sport=data["sport"],
            location=data["location"],
        )
        return Response({"message": "Athlete registered successfully"})
