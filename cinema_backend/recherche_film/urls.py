from django.urls import path
from .views import Recommandationview, Recherche_navbar

urlpatterns = [
    path('recommandation/', Recommandationview.as_view(), name='recommandation'),
    path('recherche_navbar/', Recherche_navbar.as_view(), name='recherche_navbar')
]