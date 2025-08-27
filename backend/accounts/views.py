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
from django.core.mail import send_mail
from django.conf import settings
from .models import CoachingRequest
from .serializers import CoachingRequestSerializer


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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def coaches_by_sport(request, sport):
    coaches = CoachProfile.objects.filter(sport__iexact=sport)
    serializer = CoachProfileSerializer(coaches, many=True)
    return Response(serializer.data)

class CreateCoachingRequestView(generics.CreateAPIView):
    queryset = CoachingRequest.objects.all()
    serializer_class = CoachingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        athlete_profile = AthleteProfile.objects.get(user=self.request.user)
        coach_profile = CoachProfile.objects.get(pk=self.request.data['coach'])

        instance = serializer.save(athlete=athlete_profile, coach=coach_profile)

        # Send email to coach
        send_mail(
            subject=f"New Coaching Request from {instance.athlete.user.name}",
            message=f"{instance.athlete.user.name} ({instance.athlete.user.email}) is interested in your coaching.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.coach.user.email],
            fail_silently=True
        )

# Coach updates status
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_request_status(request, pk):
    try:
        request_obj = CoachingRequest.objects.get(id=pk)
    except CoachingRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

    status_val = request.data.get("status")
    if status_val not in ["approved", "rejected"]:
        return Response({"error": "Invalid status"}, status=400)

    request_obj.status = status_val
    request_obj.save()
    serializer = CoachingRequestSerializer(request_obj)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_request(request, pk):
    try:
        request_obj = CoachingRequest.objects.get(id=pk)
    except CoachingRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

    # Only the assigned coach can delete the request
    if not hasattr(request.user, "coachprofile") or request.user.coachprofile != request_obj.coach:
        return Response({"error": "Not authorized"}, status=403)

    request_obj.delete()
    return Response({"message": "Request deleted successfully"}, status=204)



class MyCoachingRequestsView(generics.ListAPIView):
    serializer_class = CoachingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Check if user is a coach
        if hasattr(user, "coachprofile"):
            coach_profile = user.coachprofile
            return CoachingRequest.objects.filter(coach=coach_profile)

        # Check if user is an athlete
        elif hasattr(user, "athleteprofile"):
            athlete_profile = user.athleteprofile
            return CoachingRequest.objects.filter(athlete=athlete_profile)
        
        # If neither, return empty queryset
        return CoachingRequest.objects.none()
