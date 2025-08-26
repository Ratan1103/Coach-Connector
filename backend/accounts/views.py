from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, CoachProfile, AthleteProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CoachRegisterSerializer, AthleteRegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import AthleteProfileSerializer, CoachProfileSerializer


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
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = "coach" if user.is_coach else "athlete" if user.is_athlete else "unknown"
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Also include role in response
        data['role'] = "coach" if self.user.is_coach else "athlete" if self.user.is_athlete else "unknown"
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def athlete_profile(request):
    try:
        athlete = AthleteProfile.objects.get(user=request.user)
        serializer = AthleteProfileSerializer(athlete)
        return Response(serializer.data)
    except AthleteProfile.DoesNotExist:
        return Response({"error": "Athlete profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def coach_profile(request):
    try:
        coach = CoachProfile.objects.get(user=request.user)
        serializer = CoachProfileSerializer(coach)
        return Response(serializer.data)
    except CoachProfile.DoesNotExist:
        return Response({"error": "Coach profile not found"}, status=status.HTTP_404_NOT_FOUND)
