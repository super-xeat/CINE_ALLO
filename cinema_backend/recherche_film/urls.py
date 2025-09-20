from django.urls import path
from . import views


app_name = 'recherche_film'

urlpatterns = [
    path('recommandation/', views.recommandation, name='recommandation'),
]