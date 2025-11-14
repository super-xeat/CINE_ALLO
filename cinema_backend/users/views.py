from .serializer import (RegisterSerializer, Liste_film_Serializer, ProfileSerializer, 
                         AjoutFilmSerializer)
from .models import User, Liste_film
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework import  status
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework.parsers import MultiPartParser
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.conf import settings



class RegisterViews(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)
            token = jwt.encode(
                {
                    'user_id': user.id,
                    'exp': timezone.now() + timedelta(hours=24)
                },
                settings.SECRET_KEY,  
                algorithm='HS256'
            )

            send_mail(
                'Activez votre compte Cine Allo',
                f'Cliquez ici pour activer votre compte : http://localhost:8000/auth/confirm-email/{token}/',
                'xeatteam@gmail.com',
                [user.email],
                fail_silently=False
            )
            return Response({'succé': 'compte créé : vérifiez vos mails'})
        else:
            return Response(serializer.errors, status=404)



class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try :
            decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=decode['user_id'])
            user.is_active = True
            user.save()
            return redirect('http://localhost:5173/login?statut=success')
        
        except User.DoesNotExist:
            return Response({'lien de confirmation invalide'}, status=400)
        
        except jwt.ExpiredSignatureError:
            return Response({'erreur le token a expiré'})


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        try:
            user = User.objects.get(email=email)
            token = jwt.encode({
                'user_id': user.id,
                'exp': timezone.now() + timedelta(hours=24)
            }, settings.SECRET_KEY, algorithm='HS256')
            
            reset_url = f"http://localhost:5173/reset-password?token={token}"
            
            send_mail(
                'Réinitialisez votre mot de passe Cine Allo',
                f'Cliquez ici pour réinitialiser : {reset_url}',
                'noreply@cineallo.com',
                [user.email],
                fail_silently=False
            ) 
        except User.DoesNotExist:
            pass
            
        return Response({'message': 'Si cet email existe, un lien de réinitialisation a été envoyé'})
        


class PasswordResetConfirmview(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')
        if new_password:
            try:
                decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = User.objects.get(id=decode['user_id'])
                user.set_password(new_password)
                user.save()
                return Response({'mot de passe changer'})
            
            except jwt.InvalidTokenError:
                return Response({'erreur pas le bon token'}, status=400)
            except User.DoesNotExist:
                return Response({'erreur user introuvable'}, status=400)

        else:
            return Response({"erreur"})
        

class AjoutFilmview(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AjoutFilmSerializer


class ListeFilmViews(generics.ListAPIView):

    queryset = Liste_film.objects.all()
    serializer_class = Liste_film_Serializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset() 
        return queryset.filter(user=self.request.user)
    

class SupprimeView(generics.RetrieveDestroyAPIView):

    queryset = Liste_film.objects.all()
    serializer_class = Liste_film_Serializer
    permission_classes = [IsAuthenticated]


class ProfileView(generics.RetrieveUpdateAPIView):

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class UpdateFilmListeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Liste_film_Serializer
    
    def get_object(self):
        tmdb_id = self.kwargs.get('tmdb_id')
        return Liste_film.objects.get(user=self.request.user, tmdb_id=tmdb_id)
    
    
class Recup_filmViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tmdb_id):
        if not tmdb_id:
            return Response({'erreur il manque le tmdb_id'})
        
        response = requests.get(
            f'https://api.themoviedb.org/3/movie/{tmdb_id}',
            params={
                'api_key': settings.API_KEY,
                'language':"fr-FR"
                }                   
            )
        
        if not response:
            return Response({'error pas de reponse pour appel tmdb_id'})
        
        result = response.json()

        return Response({
            'titre': result['title'],
            'image': f"https://image.tmdb.org/t/p/w500{result['poster_path']}",
            'synopsis': result['overview'],
            'date_sortie': result['release_date']
        })
