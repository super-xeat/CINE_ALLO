

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.conf import settings
import requests
from rest_framework.permissions import AllowAny


class Listeview:
 
    def appel_tmdb(self, endpoint, params=None):
        base_url = "https://api.themoviedb.org/3"
        api_key = settings.TMDB_API_KEY
        url = f'{base_url}/{endpoint}'

        params_base = {
            'language': 'fr-FR',
            'api_key': api_key
        }

        if params: 
            params_base.update(params)

        response = requests.get(url, params=params_base)
        return response
    


class Liste_movie(APIView, Listeview):
    
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):

        liste_movie = self.appel_tmdb(
            endpoint='movie/popular',
            params={'include_adult': False}
        ) 

        if not liste_movie:
            return Response({'erreur pas de film'}, status=400)
         
        result = liste_movie.json().get('results', [])
        return Response({
           'liste_movie': result  
        })
    

class Film_meilleur_note(APIView, Listeview):

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):

        meilleure_note = self.appel_tmdb(
            endpoint='movie/top_rated',
            params={'include_adult': False}
        )

        if not meilleure_note:
            return Response({'erreur pas de films'})
        
        result = meilleure_note.json().get('results', [])

        return Response({
            'top_rated': result
        })
      

class DiscoverView(APIView, Listeview):

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        
        genre = request.GET.get('with_genres') 
        sort_by = request.GET.get('sort_by', 'popularity.desc')  
        release_year = request.GET.get('year') 
        
        params = {
            'include_adult': False,
            'sort_by': sort_by
        }  
        if genre:
            params['with_genres'] = genre  
        if release_year:
            params['primary_release_year'] = release_year       
        movie_genre = self.appel_tmdb(
            endpoint='discover/movie',
            params=params
        )

        if not movie_genre or movie_genre.status_code != 200:
            return Response({'erreur': 'TMDB indisponible'}, status=503)
        
        result = movie_genre.json().get('results', []) 

        return Response({
            'liste_discover_filtre': result
        })
    

class Detail_movie(APIView, Listeview):

    permission_classes = [AllowAny]
    authentication_classes = []
    
    def get(self, request):

        movie_id = request.GET.get('movie_id')

        detail_movie = self.appel_tmdb(
            endpoint=f'movie/{movie_id}',
            params={'include_adult': False}
        )

        if not detail_movie:
            return Response({'erreur film introuvable'})
        
        response = detail_movie.json()

        return Response({
            'detail_film': response
        })