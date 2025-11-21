
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    username = models.CharField(max_length=20, unique=True)
    identifiant = models.CharField(max_length=20, blank=False)
    email = models.EmailField(blank=False, unique=True)
    bio = models.TextField(max_length=200, blank=True)
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username



class Liste_film(models.Model):
    
    STATUT = [
    ('VOIR', 'à voir'),
    ('VU', 'vu'), 
    ('FAVORI', 'favori'),  
    ]
    tmdb_id = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_ajout = models.DateField(auto_now_add=True)
    statut = models.CharField(choices=STATUT, max_length=20, default='FAVORI')
    note_personnel = models.DecimalField(blank=True, max_digits=3, null=True, decimal_places=1)
