

from django.urls import path
from .views import (Liste_movie, Film_meilleur_note, DiscoverView, 
                    Detail_movie, CommentaireFilmView, Serie_meilleur_note,
                    Serie_popular, DiscoverTvView, CommentaireUpdateDeleteView,
                    LikeCommentaire, DislikeCommentaire)

 
urlpatterns = [  
    path('liste_movie/', Liste_movie.as_view(), name='liste_movie'),
    path('film_meilleur_note/', Film_meilleur_note.as_view(), name='film_meilleur_note'),
    path('serie_meilleur_note/', Serie_meilleur_note.as_view(), name='serie_meilleur_note' ),
    path('serie_populaire/', Serie_popular.as_view(), name='serie_popular'),
    path('films/discover/', DiscoverView.as_view(), name='discover'),
    path('serie/discover/', DiscoverTvView.as_view(), name='discovertv'),
    path('detail_movie/', Detail_movie.as_view(), name='detail_movie'),
    path('commentaires/', CommentaireFilmView.as_view(), name='commentaires'),
    path('commentaires/<int:pk>/', CommentaireUpdateDeleteView.as_view(), name='commentaire_update_delete'),
    path('commentaires/<int:pk>/like/', LikeCommentaire.as_view(), name='like'),
    path('commentaires/<int:pk>/dislike/', DislikeCommentaire.as_view(), name='dislike')
 
]