
from django.db import models
from django.conf import settings

class Commentaire(models.Model):
    film_id = models.IntegerField()
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='commentaires')
    texte = models.TextField(blank=False)
    date = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='commentaire_like' )
    dislike = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='commentaire_dislike')





