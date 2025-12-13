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
            return Response({'erreur': 'Requête vide'})
        
        try:
            result_multi = self.appel_tmdb(
                endpoint='search/multi',
                params={'query': query, 'include_adult': False, 'language': 'fr-FR'}
            )
            
            if not result_multi:
                return Response({'erreur': 'Aucun résultat trouvé'})
            
            multi_results = result_multi.json().get('results', [])
            if not multi_results:
                return Response({'erreur': 'Aucun résultat trouvé'})
            
        
            first_result = multi_results[0]
            media_type = first_result.get('media_type')
            media_id = first_result.get('id')
            
            result_film = {}
            result_serie = {}  
            
            if media_type == 'movie':
                film_similar = self.appel_tmdb(
                    endpoint=f'movie/{media_id}/similar',
                    params={'language': 'fr-FR'}
                )          

                response_similar = film_similar.json().get('results', []) if film_similar else []     
                film_recommandation = self.appel_tmdb(
                    endpoint=f'movie/{media_id}/recommendations',
                    params={'language': 'fr-FR'}
                )
                              
                response_recommandation = film_recommandation.json().get('results', []) if film_recommandation else []
                
                result_film = {
                    'film_similaire': response_similar,
                    'film_recommande': response_recommandation
                }
                result_serie = {'message': 'Recherche de film - pas de séries'}
                
            elif media_type == 'tv':
                tv_recommandation = self.appel_tmdb(
                    endpoint=f"tv/{media_id}/recommendations",
                    params={'language': 'fr-FR'}
                )
                recommandation_tv = tv_recommandation.json().get('results', []) if tv_recommandation else []

                tv_similaire = self.appel_tmdb(
                    endpoint=f'tv/{media_id}/similar',
                    params={'language': 'fr-FR'}
                )
            
                reponse_similaire = tv_similaire.json().get('results', []) if tv_similaire else []
                
                result_serie = {
                    'serie_recommandation': recommandation_tv,
                    'serie_similaire': reponse_similaire
                }
                result_film = {'message': 'Recherche de série - pas de films'}
                
            else:
                result_film = {'erreur': 'no resultat'}
                result_serie = {'erreur': 'no resultat'}
                
        except:
            return Response({'erreur dans recommandationview'}, status=500)
        
        return Response({
            'result_film': result_film,
            'result_serie': result_serie,
            'type': media_type 
        })


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
                            
                            tri = sorted(result_filmographie['cast'], key=lambda x: x['vote_average'], reverse=True)   
                                      
                            data_person = { 
                                'actor': result,
                                'detail': result_personne,
                                'top_filmographie': tri
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