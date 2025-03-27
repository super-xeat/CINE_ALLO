from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    nom = models.CharField(max_length=200)
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
