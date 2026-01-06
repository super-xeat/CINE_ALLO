from .serializer import (RegisterSerializer, Liste_film_Serializer, 
ProfileSerializer, AjoutFilmSerializer,LoginSerializer)
from .models import User, Liste_film
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework import  status
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework.parsers import MultiPartParser
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
import requests
from django.conf import settings
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate
from django.http import HttpResponse
from users.authentification import JWTcookieAuth
from django.contrib.auth import logout
from django.template.loader import render_to_string

class Pagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'limit'
    max_page_size = 5


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

            backend_domain = os.getenv('SITE_DOMAIN_BACKEND', 'cine-allo.onrender.com')
            context = {'confirmation_url': f"https://{backend_domain}/auth/confirm-email/{token}/"}
            
            html_message = render_to_string('email/activation.html', context)
            
            payload = {
                "sender": {"name": "Cine Allo", "email": "quizzmaster1998@gmail.com"},
                "to": [{"email": user.email}],
                "subject": "Activez votre compte Cine Allo",
                "htmlContent": html_message
            }
            
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": os.getenv('BREVO_API_KEY')
            }

            try:
                requests.post("https://api.api.brevo.com/v3/smtp/email", json=payload, headers=headers, timeout=10)
                return Response({'succès': 'Compte créé : vérifiez vos mails'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': 'Erreur envoi mail'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginViews(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response({'message': 'connexion réussi', 'username': user.username })
 
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                path='/',
                samesite='None',
                secure=True
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                path='/',
                samesite='None',
                secure=True
            )
            print('cookie dans la reponse')
            return response
        
        print('serializer invalide')
        return Response(serializer.errors, status=400)
    

class RefreshViews(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'erreur':'le token est introuvable'}, status=401)
        try:
            new_token = RefreshToken(refresh_token)
            new_access_token = str(new_token.access_token)
            response = Response({'succée': 'nouveau token'})
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=new_access_token,
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                path='/',
                samesite='None',
                secure=True
            )
            print('refresh cest bon')
            return response
        except TokenError as e:
            return Response({'erreur':'token invalide'}, status=401)


class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try :
            decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=decode['user_id'])
            user.is_active = True
            user.save()
            frontend = os.getenv('SITE_DOMAIN_FRONTEND')
            return redirect(f'https://{frontend}/login?statut=success')
        
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
            frontend = os.getenv('SITE_DOMAIN_FRONTEND')
            reset_url = f"https://{frontend}/reset-password?token={token}"
            email = os.getenv('EMAIL_USER')
            send_mail(
                'Réinitialisez votre mot de passe Cine Allo',
                f'Cliquez ici pour réinitialiser : {reset_url}',
                f'{email}',
                [user.email],
                fail_silently=False 
            ) 
        except User.DoesNotExist:
            pass
            
        return Response({'message': 'Si cet email existe, un lien de réinitialisation a été envoyé'})
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    # On garde ton JWTcookieAuth si c'est ta classe personnalisée
    authentication_classes = [JWTcookieAuth] 

    def post(self, request):
        # 1. Déconnexion côté Django (nettoie la session)
        logout(request)
        
        response = Response({'message': 'déconnexion réussie'}, status=status.HTTP_200_OK)
        
        cookie_params = {
            'path': '/',
            'samesite': 'None',
            'secure': True,  
            'httponly': True
        }

        response.delete_cookie('access_token', **cookie_params)
        response.delete_cookie('refresh_token', **cookie_params)
        response.delete_cookie('sessionid', **cookie_params)
        response.delete_cookie('csrftoken', **cookie_params) 
        
        return response


class Force_logout(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTcookieAuth]

    def get(self, request):
        logout(request)
        response = Response({'success': 'Cookies nettoyés'})
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response


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
        

class AjoutFilmview(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTcookieAuth]

    def post(self, request):
        serializer = AjoutFilmSerializer(data=request.data, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response({'succé':'film ajouté au favorie'}, status=200)
        else:
            return Response(serializer.errors, status=400)


class ListeFilmViews(generics.ListAPIView):

    queryset = Liste_film.objects.all()
    serializer_class = Liste_film_Serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTcookieAuth]
    pagination_class = Pagination

    def get_queryset(self):
        queryset = super().get_queryset() 
        return queryset.filter(user=self.request.user)
    

class SupprimeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTcookieAuth]
    
    def delete(self, request, tmdb_id):
        try:
            film = Liste_film.objects.get(tmdb_id=tmdb_id, user=request.user)
            film.delete()
            return Response({'le film a correctement été supprimé'}, status=200)
        except Liste_film.DoesNotExist:
            return Response({'le film existe pas'})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTcookieAuth]
    
    def get(self, request):
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data,status=200)
    
    def patch(self, request): 
        try:
            user = request.user
            serializer = ProfileSerializer(
                user,
                data=request.data,
                context={'request': request},
                partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
        except:
            return Response({'erreur': 'erreur de requete'})


class UpdateFilmListeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Liste_film_Serializer
    authentication_classes = [JWTcookieAuth]
    
    def get_object(self):
        tmdb_id = self.kwargs.get('tmdb_id')
        return Liste_film.objects.get(user=self.request.user, tmdb_id=tmdb_id)
    
    
class Recup_filmViews(APIView):
    permission_classes = [AllowAny]

    def get(self, request, tmdb_id):
        if not tmdb_id:
            return Response({'erreur': 'il manque le tmdb_id'}, status=400)
        
        try:
            response_film = requests.get(
                f'https://api.themoviedb.org/3/movie/{tmdb_id}',
                params={
                    'api_key': settings.TMDB_API_KEY,
                    'language': "fr-FR"
                })
            
            if response_film.status_code == 200:
                result = response_film.json()
                print('result', result)
                return Response({
                    'titre': result.get('title'),
                    'image': f"https://image.tmdb.org/t/p/w500{result.get('poster_path')}" ,
                    'synopsis': result.get('overview'),
                    'date_sortie': result.get('release_date'),
                    'type': 'movie'
                })
        except:
            pass  
        
        try:
            response_serie = requests.get(
                f'https://api.themoviedb.org/3/tv/{tmdb_id}',
                params={
                    'api_key': settings.TMDB_API_KEY,
                    'language': "fr-FR"
                })
            
            if response_serie.status_code == 200:
                result = response_serie.json()
                print('result', result)
                return Response({
                    'titre': result.get('name'),
                    'image': f"https://image.tmdb.org/t/p/w500{result.get('poster_path')}",
                    'synopsis': result.get('overview'),
                    'date_sortie': result.get('first_air_date'),
                    'type': 'tv' 
                })
        except:
            pass

        return Response({'error': 'Contenu non trouvé'}, status=404)