from django.contrib import admin
from .models import Commentaire

@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display = ('film_id', 'utilisateur', 'texte')
    list_filter = ('date',)
