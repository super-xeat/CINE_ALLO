from django.db import models
from users.models import CustomUser



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


