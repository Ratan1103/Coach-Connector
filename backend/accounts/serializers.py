from rest_framework import serializers
from .models import User, CoachProfile, AthleteProfile, CoachingRequest


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "is_coach", "is_athlete"]


class CoachRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField()
    experience = serializers.IntegerField()
    sport = serializers.CharField()
    photo = serializers.ImageField(required=False)

    class Meta:
        model = CoachProfile
        fields = ["email", "name", "password", "phone", "experience", "sport", "photo"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        name = validated_data.pop("name")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            is_coach=True
        )

        coach_profile = CoachProfile.objects.create(user=user, **validated_data)
        return coach_profile

class AthleteRegisterSerializer(serializers.ModelSerializer):
    # extra fields for AthleteProfile
    phone = serializers.CharField()
    age = serializers.IntegerField()
    sport = serializers.CharField()
    location = serializers.CharField()

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "name", "password", "phone", "age", "sport", "location"]

    def create(self, validated_data):
        phone = validated_data.pop("phone")
        age = validated_data.pop("age")
        sport = validated_data.pop("sport")
        location = validated_data.pop("location")

        # Create User with is_athlete=True
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            is_athlete=True
        )

        # Create AthleteProfile
        AthleteProfile.objects.create(
            user=user,
            phone=phone,
            age=age,
            sport=sport,
            location=location
        )

        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "is_coach", "is_athlete"]


# ---------------------------
# Coach Profile serializer
# ---------------------------
class CoachProfileSerializer(serializers.ModelSerializer):
    # Nested user details
    user = UserSerializer()

    class Meta:
        model = CoachProfile
        fields = ["id", "user", "phone", "experience", "sport"]

class AthleteProfileSerializer(serializers.ModelSerializer):
    # Nested user details
    user = UserSerializer()

    class Meta:
        model = AthleteProfile
        fields = ["id", "user", "phone", "age", "sport", "location"]

class CoachingRequestSerializer(serializers.ModelSerializer):
    athlete = AthleteProfileSerializer(read_only=True)
    class Meta:
        model = CoachingRequest
        fields = ['id', 'athlete', 'coach', 'status', 'created_at']
        read_only_fields = ['athlete', 'status', 'created_at']

    def get_status(self, obj):
        """Return status in lowercase for consistency."""
        if obj.status:
            return obj.status.lower()
        return None
