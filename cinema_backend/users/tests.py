from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

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
        fake_image = SimpleUploadedFile(
            name='test_avatar.jpg',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b',
            content_type='image/jpeg'
        )
        data = {
            'username': 'user123',
            'identifiant': 'user',
            'email': 'user@gmail.com',
            'bio': 'tic-tac boom',
            'password': 'groscaca',
            'image': fake_image
        }

        response = self.client.post(url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        User = get_user_model()
        self.assertTrue(User.objects.filter(email='user@gmail.com').exists())

        print(f"URL testée : {url}")
        print(f"Contenu de la réponse : {response.data}")