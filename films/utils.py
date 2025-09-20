import requests
from django.conf import settings
from films.models import Genre


def genre():
    url = "https://api.themoviedb.org/3/genre/movie/list"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "fr-FR",
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("Erreur lors de la récupération des genres:", response.json())
        
    data = response.json()
    result = data.get("genres", [])
    for i in result:
        Genre.objects.update_or_create(id = i["id"], defaults={"name": i["name"]})
