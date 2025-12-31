from rest_framework.test import APITestCase
from films.models import Commentaire
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status


class Commentairetest(APITestCase):
    def test_commentaire_create(self):

        user = get_user_model()
        user_obj = user.objects.create_user(username='test', password='password')

        self.client.force_authenticate(user=user_obj)
        url = reverse('commentaires')

        data = {
            'film_id': 52,
            'texte': 'salut cava'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_commentaire_get(self):
        user = get_user_model()
        user_obj = user.objects.create_user(username='test', password='password')
        Commentaire.objects.create(
            film_id=52,
            utilisateur=user_obj,
            texte='salut cava'
        )

        url = reverse('commentaires')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
