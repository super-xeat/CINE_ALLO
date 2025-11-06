

from django.urls import path
from .views import (Liste_movie, Film_meilleur_note, DiscoverView, 
                    Detail_movie, Commentaireview, Serie_meilleur_note,
                    Serie_popular)

 
urlpatterns = [
    path('liste_movie', Liste_movie.as_view(), name='liste_movie'),
    path('film_meilleur_note', Film_meilleur_note.as_view(), name='film_meilleur_note'),
    path('serie_meilleur_note', Serie_meilleur_note.as_view(), name='serie_meilleur_note' ),
    path('serie_populaire', Serie_popular.as_view(), name='serie_popular'),
    path('discover', DiscoverView.as_view(), name='discover'),
    path('detail_movie', Detail_movie.as_view(), name='detail_movie'),
    path('commentaires', Commentaireview.as_view(), name='commentaires'),
    
]