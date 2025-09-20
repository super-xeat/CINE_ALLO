from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
import requests
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Films, Genre
from .forms import Commentaireform



def films(request):
    genres = Genre.objects.all()
    genre_list = request.GET.getlist("genre")
    genre_id = ",".join(genre_list)

    url = "https://api.themoviedb.org/3/movie/top_rated"
    params = {
        'api_key':settings.TMDB_API_KEY,
        'language': "fr-FR",
        "page": 1
    }

    if genre_id:
        params["with_genres"] = genre_id
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
        'date': i['release_date'],
        'note' : i['popularity'],
        'image_url': f"https://image.tmdb.org/t/p/w500{i['poster_path']}" if i.get('poster_path') else None
        })

    return render(request, "films/liste_films.html", {'films':films, 'genres':genres})


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
    
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"
    params_credit = {
        'api_key': settings.TMDB_API_KEY,
        'language': 'fr-FR',
    }

    response = requests.get(url, params=params_credit)

    if response.status_code != 200:
        return JsonResponse({'error':'pas acteur'})
    
    data = response.json()
    casting = data.get("cast",[])[:5]

    ajouter = []
    for i in casting:
        ajouter.append({
        'nom': i.get('name'),
        'personnage': i.get('character'),
        'photo': f"https://image.tmdb.org/t/p/w185{i['profile_path']}" if i.get('profile_path') else None
        })
        
    
    return render(request, "films/detail_film.html", {'film_details':film_details, 'movie_id': movie_id,'api_key': settings.TMDB_API_KEY, 'acteur': ajouter})




def recherche_avancer(request):
    url = "https://api.themoviedb.org/3/discover/movie"
    genre_list = request.GET.getlist("genre")
    genre_id = ",".join(genre_list)
    params = {
        "api_key": settings.TMDB_API_KEY,
        'language': 'fr-FR',
        "with_genres": genre_id,
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        films = data.get("results", [])

    genres = Genre.objects.all()

    return render(request, "films/liste_films.html", {"films_recherche": films, "genres": genres})


@login_required
def commentaire(request, movie_id):
    film = get_object_or_404(Films,id=movie_id)
    if request.method == 'POST':
        form = Commentaireform(request.POST)
        if form.is_valid():
            commentaire = form.save(commit=False)
            commentaire.auteur = request.user
            commentaire.film = film
            commentaire.save()
            return redirect('detail_film', movie=film.id)
    form = Commentaireform()
    return render(request, "films/detail_film.html", {'form':form, 'film':film})


def all_commentaire(request, movie_id):
    film = get_object_or_404(Films, id=movie_id)
    commentaires = film.commentaire.all()
    return render(request, 'films/detail_film.html', {'commentaires': commentaires, 'film':film})
    