
from django.db import models
from users.models import User

class Commentaire(models.Model):
    film_id = models.IntegerField()
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commentaires')
    texte = models.TextField(max_length=200, blank=False)
    date = models.DateTimeField(auto_now_add=True)