
from .serializer import RegisterSerializer, Liste_film_Serializer, ProfileSerializer, AjoutFilmSerializer
from .models import User, Liste_film
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication


class RegisterViews(generics.CreateAPIView):

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class AjoutFilmview(generics.CreateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = AjoutFilmSerializer
    authentication_classes = [JWTAuthentication]

class ListeFilmViews(generics.ListAPIView):

    queryset = Liste_film.objects.all()
    serializer_class = Liste_film_Serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = super().get_queryset() 
        return queryset.filter(user=self.request.user)
    

class SupprimeView(generics.RetrieveDestroyAPIView):

    queryset = Liste_film.objects.all()
    serializer_class = Liste_film_Serializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class ProfileView(generics.RetrieveAPIView):

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


