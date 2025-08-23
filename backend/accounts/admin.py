from django.contrib import admin
from .models import User, AthleteProfile, CoachProfile

admin.site.register(User)
admin.site.register(AthleteProfile)
admin.site.register(CoachProfile)
# Register your models here.
