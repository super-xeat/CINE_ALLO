from django.db import models
from users.models import CustomUser
from django.contrib.auth.models import User
from django.conf import settings


class Films(models.Model):
    titre = models.CharField(max_length=200)
    image = models.ImageField(upload_to='profil_pic', null=True, blank=True)
    date_creation = models.DateField()
    genre = models.CharField(max_length=150)

    def __str__(self):
        return self.titre
    

class Note(models.Model):
    utilisateur = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    film = models.ForeignKey(Films, on_delete=models.CASCADE)
    note = models.FloatField()

    def __str__(self):
        return f"{self.utilisateur} {self.film} {self.note} "
    
class Genre(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    

class Commentaire(models.Model):
    film = models.ForeignKey(Films, on_delete=models.CASCADE, related_name='commentaire')
    auteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    texte = models.TextField()

    def __str__(self):
        return f"{self.auteur} {self.film.titre} {self.texte}"

