

from django.urls import path
from .views import Liste_movie, Film_meilleur_note, DiscoverView


urlpatterns = [
    path('liste_movie/', Liste_movie.as_view(), name='liste_movie'),
    path('film_meilleur_note/', Film_meilleur_note.as_view(), name='film_meilleur_note'),
    path('discover/', DiscoverView.as_view(), name='discover')
]