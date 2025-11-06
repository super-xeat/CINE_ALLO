
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import os
import requests
from rest_framework.permissions import AllowAny


class Appel_TMDB:

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


class Recommandationview(APIView, Appel_TMDB):
    permission_classes = [AllowAny]
    
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
            endpoint= f'movie/{film_id}/recommendations',
            params={'language': 'fr-FR'}
        )

        if not film_recommandation:
            return Response({'erreur pas de films recommandé'})
        
        response_recommandation = film_recommandation.json().get('results', [])

        film_detail = self.appel_tmdb(
            endpoint= f'movie/{film_id}',
            params={'language': 'fr-FR'}
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
    

class Recherche_navbar(APIView, Appel_TMDB):
    permission_classes = [AllowAny]
    
    def get(self, request):
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({'erreur': 'Query required'}, status=400)
        
        data_person = {}
        data_movie = {}
        
        try:
            response = self.appel_tmdb(
            endpoint='search/person', #appel 1
            params={'query':query, 'include_adult': False}
            )
            if not response:
                data_person = {'erreur': 'probleme search person'} 
            else:
                result = response.json().get('results', [])
                if result:
                    person_id = result[0]['id']  

                    personne = self.appel_tmdb(
                        endpoint=f'person/{person_id}',  #appel 2 
                        params={'language': 'FR-fr'}
                    )
                    if not personne:
                        data_person = {'erreur': 'personne not find'}
                    else:
                        result_personne = personne.json()

                        filmographie = self.appel_tmdb(
                            endpoint=f'person/{person_id}/movie_credits', #appel 3
                            params={'language': 'FR-fr'}
                        )
                        if not filmographie:
                            data_person = {'erreur': 'Pas de filmographie'}
                        else:
                            result_filmographie = filmographie.json()       

                            data_person = { 
                                'actor': result,
                                'detail': result_personne,
                                'filmographie': result_filmographie
                           }
                else:
                    data_person = {'erreur':'aucune personne find  '}
        except:
            data_person = {'erreur data_person':'aucune personne trouvé'}
        
        try:
            response = self.appel_tmdb(
            endpoint='search/movie',
            params={'query': query, 'language': 'FR-fr'}
            )
            if not response:
                data_movie = {'erreur': 'probleme recherche film'}  
            else:
                result = response.json().get('results', [])          
                if result:
                    movie_id = result[0]['id']  
                    film_detail = self.appel_tmdb(
                        endpoint=f'movie/{movie_id}',
                        params={'language':'FR-fr'}
                    )
                    if not film_detail:
                        data_movie = {'erreur': 'Détails non disponibles'}
                    else:
                        result_film_detail = film_detail.json()

                        film_similar = self.appel_tmdb(
                            endpoint=f'movie/{movie_id}/similar',
                            params={'language': 'FR-fr'} 
                        )
                        if not film_similar:
                            data_movie = {'erreur': 'Pas de films similaires'}
                        else:
                            result_film_similaire = film_similar.json()

                            data_movie = {  
                                'film': result,
                                'detail': result_film_detail,
                                'film_similaire': result_film_similaire
                            }
                else:
                    data_movie = {'erreur': 'aucun film trouvé'}
        except:
            data_movie = {'erreur de daata_movie': 'aucun film trouvé'}

        return Response({
            'personne': data_person,
            'films': data_movie
        })