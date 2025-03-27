from django.shortcuts import render, get_object_or_404
from .models import Films, Note
from django.conf import settings
import requests
from django.http import JsonResponse


def films(request):
    url = "https://api.themoviedb.org/3/movie/top_rated"
    params = {
        'api_key':settings.TMDB_API_KEY,
        'language': "fr-FR",
    }
    response = requests.get(url, params=params)

    if response.status_code != 200:
        return JsonResponse({'error': 'Film non trouvé'}, status=404)
    
    data = response.json()
    results = data.get("results", [])[:30]

    films = []
    for i in results:
        films.append({
        'titre': i['title'],
        'genre' : i['genre_ids'],
        'movie_id':i['id'],
        'note' : i['popularity'],
        'image_url': f"https://image.tmdb.org/t/p/w500{i['poster_path']}" if i.get('poster_path') else None
        })

    return render(request, "films/liste_films.html", {'films':films})
    
def recherche(request):
    query = request.GET.get('query', '')
    films_search = []
    if query:
        url = f"{settings.TMDB_BASE_URL}/search/movie"

        params = {
            "api_key": settings.TMDB_API_KEY,
            "query": query,
            "language": "fr-FR",
        }
        response = requests.get(url, params=params)

        if response.status_code != 200:
            return JsonResponse({"erreur: pas de film trouvé"})
        
        data = response.json()
        result = data.get("results", [])

        if result:
            i = result[0]
            films_search.append({
                'titre': i.get('original_title'),
                'resume': i.get('overview'),
                'note': i.get('popularity'),
                'image_url': f"https://image.tmdb.org/t/p/w500{i.get('poster_path')}" if i.get('poster_path') else None,
                'movie_id': i.get('id')
            })
    
    return render(request, "films/liste_films.html", {'films_search':films_search, 'query':query})



def detail_film(request, movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}'
    params = {
        'api_key': settings.TMDB_API_KEY,
        'language': 'fr-FR',
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return JsonResponse({'error': 'Film non trouvé'}, status=404)
    
    data = response.json()
    film_details = {
        'budget': data.get('budget', 'Inconnu'),
        'original_title': data.get('original_title', 'Titre inconnu'),
        'popularity': data.get('popularity', 'Inconnu'),
        'movie_id': data.get('id'),
        'image_url': f"https://image.tmdb.org/t/p/w500{data.get('poster_path')}" if data.get('poster_path') else None
    }
    
    
    return render(request, "films/detail_film.html", {'film_details':film_details})