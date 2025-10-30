
from django.db import models
from django.conf import settings

class Commentaire(models.Model):
    film_id = models.IntegerField()
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='commentaires')
    texte = models.TextField(max_length=200, blank=False)
    date = models.DateTimeField(auto_now_add=True)