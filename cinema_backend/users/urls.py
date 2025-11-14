
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (ListeFilmViews, RegisterViews, SupprimeView, 
                    ProfileView, AjoutFilmview, ConfirmEmailView, PasswordResetView,
                    PasswordResetConfirmview, UpdateFilmListeView, Recup_filmViews)


urlpatterns = [
    path('login', TokenObtainPairView.as_view(), name='register'),
    path('logout', TokenBlacklistView.as_view(), name='logout'), 
    path('register/', RegisterViews.as_view(), name='register'),
    path('refresh', TokenRefreshView.as_view()),
    path('ajout_film', AjoutFilmview.as_view(), name='ajouter_film'),
    path('recup_film/<int:tmdb_id>', Recup_filmViews.as_view(), name='recup_film'),
    path('supprimer/<int:pk>', SupprimeView.as_view(), name='supprimer'),
    path('modifier/<int:pk>', UpdateFilmListeView.as_view(), name='modifier'),
    path('voir_liste', ListeFilmViews.as_view(), name='voir_liste'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('confirm-email/<str:token>/', ConfirmEmailView.as_view(), name='confirm_email'),
    path('oubli-mdp', PasswordResetView.as_view(), name='passwordreset'),
    path('passwordreset/confirm', PasswordResetConfirmview.as_view(), name='confirm_reset') 
] 