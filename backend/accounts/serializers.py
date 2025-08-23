from rest_framework import serializers
from .models import User, CoachProfile, AthleteProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "is_coach", "is_athlete"]


class CoachRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachProfile
        fields = ["phone", "experience", "sport", "photo"]


class AthleteRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AthleteProfile
        fields = ["phone", "age", "sport", "location"]
