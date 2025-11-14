

from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from .models import User, Liste_film
from django.utils import timezone
from datetime import timedelta


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','password', 'bio', 'image', 'confirm_password', 'email']

    def validate_email(self, value):
        if '@' not in value:
            raise serializers.ValidationError('erreur')
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('cette email existe deja')
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError('erreur')
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        new_user = User.objects.create_user(**validated_data)
        new_user.set_password(password)
        new_user.save()
        return new_user
    

class Liste_film_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Liste_film
        fields = ['id', 'user' ,'statut', 'note_personnel', 'date_ajout']

    
    def validate_note_personnel(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError('erreur')
        return value
    
    

class AjoutFilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liste_film
        fields = ['tmdb_id', 'date_ajout', 'statut']

    def validate(self, attrs):
        tmdb_id = attrs.get('tmdb_id')
        user = self.context['request'].user
        
        if Liste_film.objects.filter(user=user, tmdb_id=tmdb_id).exists():
            raise serializers.ValidationError('Film déjà présent')
        
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'image']


