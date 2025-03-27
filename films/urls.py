from django.urls import path
from . import views


app_name = 'films'

urlpatterns = [
    path('', views.films, name='films'),
    path('recherche/', views.recherche, name='recherche'),
    path('<int:movie_id>/', views.detail_film, name='detail_film'),
]