from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import Liste_film
 

class Logintest(APITestCase):
    def test_login(self):
        User = get_user_model()
        User.objects.create_user(
            username='testuser',
            email='user123@gmail.com',
            password='password' 
        )

        url = reverse('login')
        data = {
            'email':'user123@gmail.com',
            'password':'password'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestregisterUser(APITestCase):
    def test_register(self):

        url = reverse('register')
        
        data = {
            'username': 'user_sans_photo',
            'identifiant': 'user',
            'email': 'user@gmail.com',
            'bio': 'tic-tac boom',
            'password': 'groscaca',
            'confirm_password': 'groscaca'
        }

        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        User = get_user_model()
        user = User.objects.get(username='user_sans_photo')
        self.assertFalse(not user.image)


class Modifytest(APITestCase):
    def test_modify(self):
        user = get_user_model()
        user_obj = user.objects.create_user(
            username='sacha',
            bio='yoyo'
        )
        self.client.force_authenticate(user=user_obj)

        url = reverse('profile')
        data = {
            'username': 'tom',
            'bio':'yoyo'
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data['username'], 'sacha')
        self.assertEqual(response.data['username'], 'tom')


class Supprime_film_test(APITestCase):
    def test_supprime_film(self):
        user = get_user_model()
        user_obj = user.objects.create_user(username='sonic')
        film_liste = Liste_film.objects.create(tmdb_id='52', user=user_obj)

        self.client.force_authenticate(user=user_obj)
        url = reverse('supprimer', kwargs={'tmdb_id':52})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertFalse(Liste_film.objects.filter(tmdb_id='52').exists())