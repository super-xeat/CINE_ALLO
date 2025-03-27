from django.urls import path
from . import views


app_name = 'users'

urlpatterns = [
    path('connexion/', views.connexion, name='connexion'),
    path('inscription/',views.inscription, name='inscription'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
]
