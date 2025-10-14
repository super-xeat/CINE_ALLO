

from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import os
import requests



class Recommandationview(APIView):
    
    def appel_tmdb(self, endpoint, params=None):

        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        url = f'{base_url}/{endpoint}'

        params_base = {
            'language': 'fr-FR',
            'api_key': api_key
        }

        if params:
            params_base.update(params)

        reponse = requests.get(url, params=params_base)
        return reponse


    def get(self, request):
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({'erreur dans la barre de recherche'})
        
        result = self.appel_tmdb(
            endpoint='search/movie',
            params={'query':query, 'include_adult': False}
        )
        if not result:
            return Response({'erreur de recherche'})
        
        response_recherche = result.json().get('results', [])
        if not response_recherche:
            return Response({'pas de film'})
        
        film = response_recherche[0]
        film_id = film['id']

        film_similar = self.appel_tmdb(
            endpoint= f'movie/{film_id}/similar',
            params={'language': 'fr-FR'}
        )

        if not film_similar:
            return Response({'pas de films similaires'})
        
        response_similar = film_similar.json().get('results', [])

        film_recommandation = self.appel_tmdb(
            endpoint= f'movie/{film_id}/recommendations'
        )

        if not film_recommandation:
            return Response({'erreur pas de films recommandé'})
        
        response_recommandation = film_recommandation.json()

        film_detail = self.appel_tmdb(
            endpoint= f'movie/{film_id}'
        )

        if not film_detail:
            return Response({'pas de film trouvé'})
        
        response_detail = film_detail.json()

        response_data = {
            'film_detail': response_detail,
            'film_similaire': response_similar,
            'film_recommande': response_recommandation
        }

        return Response(response_data)
