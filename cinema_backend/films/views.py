
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.conf import settings
import requests
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializer import CommentaireSerializer
from .models import Commentaire
from rest_framework.pagination import PageNumberPagination


class CommentairePagination(PageNumberPagination):
    page_size = 5
    page_query_param = 'sizecom'
    max_page_size = 30

class FilmPagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'sizefilm'
    max_page_size = 30


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

    def get(self, request):

        liste_movie = self.appel_tmdb(
            endpoint='movie/popular',
            params={'include_adult': False}
        ) 

        if not liste_movie:
            return Response({'erreur pas de film'}, status=400)
         
        result = liste_movie.json().get('results', [])
        for item in result:
            item['type'] = "films"

        return Response({
           'liste_movie': result  
        })
    

class Film_meilleur_note(APIView, Listeview):

    permission_classes = [AllowAny]

    def get(self, request):

        meilleure_note = self.appel_tmdb(
            endpoint='movie/top_rated',
            params={'include_adult': False}
        )
        if not meilleure_note:
            return Response({'erreur pas de films'})
        
        result = meilleure_note.json().get('results', [])

        for item in result:
            item['type'] = "films"
            
        return Response({
            'top_rated': result
        })     


class Serie_meilleur_note(APIView, Listeview):
    permission_classes = [AllowAny]

    def get(self, request):

        meilleur_serie = self.appel_tmdb(
            endpoint='tv/top_rated',
            params={'include_adult': False}
        )
        if not meilleur_serie:
            return Response({'erreur de liste'})
        
        response = meilleur_serie.json().get('results', [])

        for item in response:
            item['type'] = "serie"
            
        return Response({
            'Serie_meilleur_note': response
        })
    

class Serie_popular(APIView, Listeview):
    permission_classes = [AllowAny]

    def get(self, request):

        popular_serie = self.appel_tmdb(
            endpoint='tv/popular',
            params={'include_adult': False}
        )
        if not popular_serie:
            return Response({'erreur de liste'})
        
        meilleur_serie = popular_serie.json().get('results', [])
        for item in meilleur_serie:
            item['type'] = "serie"
            
        return Response({
            'Serie_meilleur': meilleur_serie
        })


class DiscoverView(APIView, Listeview):
    permission_classes = [AllowAny]
    
    def get(self, request):
         
        genre = request.GET.get('with_genres') 
        sort_by = request.GET.get('sort_by', 'popularity.desc')  
        release_year = request.GET.get('year') 
        vote_average1 = request.GET.get('vote_average.gte')
        vote_average2 = request.GET.get('vote_average.lte')
        pays = request.GET.get('with_origin_country')

        params = {
            'include_adult': False,
            'sort_by': sort_by,
            'vote_count.gte': 500,
            'language': 'fr-FR'
        }  
        if genre:
            params['with_genres'] = genre  
        if release_year:
            params['primary_release_year'] = release_year   
        if vote_average1:
            params['vote_average.gte'] = vote_average1
        if vote_average2:
            params['vote_average.lte'] = vote_average2    
        if pays:
            params['with_origin_country'] = pays
            
        movie_genre = self.appel_tmdb(
            endpoint='discover/movie',
            params=params
        )
        if not movie_genre or movie_genre.status_code != 200:
            return Response({'erreur': 'TMDB indisponible'}, status=503)
        
        result = movie_genre.json().get('results', []) 
        for item in result:
            item['type'] = "films"
            
        return Response({
            'liste_discover_filtre': result
        })

class DiscoverTvView(APIView, Listeview):
    permission_classes = [AllowAny]
    
    def get(self, request):
         
        genre = request.GET.get('with_genres') 
        sort_by = request.GET.get('sort_by', 'popularity.desc')  
        release_year = request.GET.get('year') 
        vote_average1 = request.GET.get('vote_average.gte')
        vote_average2 = request.GET.get('vote_average.lte')
        pays = request.GET.get('with_origin_country')

        params = {
            'include_adult': False,
            'sort_by': sort_by,
            'vote_count.gte': 500,
            'language': 'fr-FR'
        }  
        if genre:
            params['with_genres'] = genre  
        if release_year:
            params['primary_release_year'] = release_year   
        if vote_average1:
            params['vote_average.gte'] = vote_average1
        if vote_average2:
            params['vote_average.lte'] = vote_average2    
        if pays:
            params['with_origin_country'] = pays
            
        tv_genre = self.appel_tmdb(
            endpoint='discover/tv',
            params=params
        )
        if not tv_genre or tv_genre.status_code != 200:
            return Response({'erreur': 'TMDB indisponible'}, status=503)
        
        result = tv_genre.json().get('results', []) 
        for item in result:
            item['type'] = "serie"
            
        return Response({
            'liste_discover_filtre': result
        })

class Detail_movie(APIView, Listeview):
    permission_classes = [AllowAny]
    
    def get(self, request):

        movie_serie_id = request.GET.get('movie_id')
        type = request.GET.get('type')
        
        if type not in ['movie', 'tv']:
            if type == 'films':
                type = 'movie'
            else:
                type = 'tv'

        detail_movie = self.appel_tmdb(
            endpoint=f'{type}/{movie_serie_id}',
            params={'include_adult': False, 'language': 'fr-FR'}
        )

        if not detail_movie:
            return Response({'erreur film introuvable'})
        
        response = detail_movie.json()

        credit_movie = self.appel_tmdb(
            endpoint=f"{type}/{movie_serie_id}/credits",
            params={'include_adult': False, 'language': 'fr-FR'}
        )

        if not credit_movie:
            return Response({'erreur ps de credit'})
        
        response_credit = credit_movie.json()

        similaire_movie = self.appel_tmdb(
            endpoint=f'{type}/{movie_serie_id}/similar',
            params={'include_adult': False}
        )

        if not similaire_movie:
            return Response({'erreur pas de film similaire'})
        
        film_similaire = similaire_movie.json().get('results', [])
        for item in film_similaire:
            if type == 'movie':
                item['type'] = 'movie'
            else:
                item['type'] = 'tv'
                
        return Response({
            'detail_film_serie': response,
            'credit_film_serie': response_credit,
            'film_similaire_serie': film_similaire,
            'type': type
        })
    
class CommentaireFilmView(APIView):
    
    def get(self, request):
        movie_id = request.GET.get('movie_id')
        queryset = Commentaire.objects.filter(film_id=movie_id)
        serializer = CommentaireSerializer(queryset, many=True)
        return Response(serializer.data)
        
        
    def post(self, request):
        user = self.request.user
        serializer = CommentaireSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(utilisateur=request.user)
            return Response(serializer.data, status=200)
        return Response()


class CommentaireUpdateDeleteView(APIView):

    def get(self, request, pk):
        try:
            commentaire = Commentaire.objects.get(id=pk)
            serializer =  CommentaireSerializer(commentaire)
            return Response(serializer.data)
        except Commentaire.DoesNotExist:
            return Response({'erreur':'ce commmentaire exite pas'}, status=404)
        
    def delete(self, request, pk):
        try:
            commentaire = Commentaire.objects.get(id=pk)
            if commentaire.utilisateur == request.user or request.user.is_superuser:
                commentaire.delete()
                return Response({'ok':'votre commentaire est bien supprimé'}, status=204)
        except Commentaire.DoesNotExist:
            return Response({'erreur':'ce commentaire existe pas'}, status=404)

    def put(self, request, pk):
        try:
            commentaire = Commentaire.objects.get(id=pk)
            if commentaire.utilisateur == request.user:
                serializer = CommentaireSerializer(commentaire, data=request.data)    
                if serializer.is_valid():       
                    serializer.save()
                    return Response(serializer.data, status=200)
            else:
                return Response({'erreur': 'vous navez pas les permissions'}, status=403)
        except Commentaire.DoesNotExist:
            return Response({'erreur':'ce commentaire existe pas'}, status=404)


class LikeCommentaire(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            commentaire = Commentaire.objects.get(id=pk)
            if commentaire.like.filter(id=request.user_id).exists():
                return Response({'erreur': 'vous avez deja liké ce post'}, status=400)
            commentaire.like.add(request.user)
            serializer = CommentaireSerializer(commentaire)           
            return Response(serializer.data, status=200)
        except Commentaire.DoesNotExist:
            return Response({'erreur':'ce commentaire existe pas'}, status=404)


class DislikeCommentaire(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            commentaire = Commentaire.objects.get(id=pk)
            if commentaire.dislike.filter(id=request.user_id).exists():
                return Response({'erreur': 'vous avez deja disliké ce post'}, status=400)
            commentaire.dislike.add(request.user)
            serializer = CommentaireSerializer(commentaire)           
            return Response(serializer.data, status=200)
        except Commentaire.DoesNotExist:
            return Response({'erreur':'ce commentaire existe pas'}, status=404)
