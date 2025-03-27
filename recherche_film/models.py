from django.db import models

class Film(models.Model):
    titre = models.CharField(max_length=200)
    date = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    affiche = models.ImageField(upload_to='image/', null=True, blank=True)

    def __str__(self):
        return self.titre
    


