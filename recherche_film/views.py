from django.shortcuts import render
from django.conf import settings
import requests



def recommandation(request):
    film_name = request.GET.get("film", "Inception") 

    url_search = "https://api.themoviedb.org/3/search/movie"

    params_search = {
        "api_key": settings.TMDB_API_KEY,
        "language": "fr-FR",
        "query": film_name,
    }

    response_film = requests.get(url_search, params=params_search)

    if response_film.status_code != 200:
        return render(request, "error.html")

    data = response_film.json()
    results = data.get("results", [])

    if not results:
        return render(request, "error.html")

    film_id = results[0]["id"] 
    films_recommande = []
    if results:
        i = results[0]
        films_recommande.append({
            'titre': i.get('original_title'),
            'resume': i.get('overview'),
            'note': i.get('popularity'),
            'image_url': f"https://image.tmdb.org/t/p/w500{i.get('poster_path')}" if i.get('poster_path') else None,
            'movie_id': i.get('id')
        })

    
    url_credits = f"https://api.themoviedb.org/3/movie/{film_id}/credits"

    params_credits = {
        "api_key": settings.TMDB_API_KEY,
        "language": "fr-FR",
    }

    response_credits = requests.get(url_credits, params=params_credits)

    if response_credits.status_code != 200:
        return render(request, "error.html")

    credit_data = response_credits.json()
    crew = credit_data.get("crew", [])

    
    realisator = None
    for person in crew:
        if person["job"] == "Director":  
            realisator = person
            break

    if not realisator:
        return render(request, "error.html")

    realisator_id = realisator["id"]

    
    url_realisator_movies = f"https://api.themoviedb.org/3/person/{realisator_id}/movie_credits"

    response_realisator_movies = requests.get(url_realisator_movies, params={"api_key": settings.TMDB_API_KEY, "language": "fr-FR"})

    if response_realisator_movies.status_code != 200:
        return render(request, "error.html", {"message": "Erreur lors de la récupération des films du réalisateur."})

    movies_data = response_realisator_movies.json()
    movies = movies_data.get("crew", [])

    
    directed_movies = []
    for movie in movies:
        if movie["job"] == "Director":
            directed_movies.append(movie)
            if len(directed_movies) == 5:
                break
    
    url_similar = f"https://api.themoviedb.org/3/movie/{film_id}/similar"
    params_similar = {
        'api_key': settings.TMDB_API_KEY,
        'language': "fr-FR",
    }

    response_similar = requests.get(url_similar, params=params_similar)

    if response_similar.status_code != 200:
        return render(request, "error.html")
    
    data_similar = response_similar.json()
    movies_similar = data_similar.get("results", [])[:5]
    overview = []
    for movie in movies_similar:
        if movie.get('overview'):
            overview.append(movie['overview'])
        else:
            overview.append('pas de résumé')


    return render(request, "accueil.html", {
        "films_recommande":films_recommande,
        "movies": directed_movies, 
        "realisator": realisator["name"],
        "movies_similar": movies_similar,
        "film_name": film_name,
        "overview": overview,
    })

    


