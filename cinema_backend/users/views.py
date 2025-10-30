from .serializer import RegisterSerializer, Liste_film_Serializer, ProfileSerializer, AjoutFilmSerializer
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


class RegisterViews(APIView):
    permission_classes = [AllowAny]
    
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
                'noreply@cinema.com',
                [user.email],
                fail_silently=False
            )
            return Response({'succé': 'compte créé : vérifiez vos mails'})
        else:
            return Response('erreur', status=404)


class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try :
            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()
            return Response({'compte créé avec succés'})
        except User.DoesNotExist:
            return Response({'lien de confirmation invalide'}, status=400)



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
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            self.get_object(),
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    
    
    
