from .models import Commentaire
from django import forms


class Commentaireform(forms.ModelForm):
    class Meta:
        model = Commentaire
        fields = ['texte']
