
from rest_framework import serializers
from .models import Commentaire
from django.utils import timezone

class CommentaireSerializer(serializers.ModelSerializer):

    nb_like = serializers.SerializerMethodField()
    nb_dislike = serializers.SerializerMethodField()
    deja_like = serializers.SerializerMethodField()
    deja_dislike = serializers.SerializerMethodField()
    username = serializers.CharField(source='utilisateur.username', read_only=True)

    class Meta:
        model = Commentaire
        fields = ['id','texte', 'username', 'nb_like', 'nb_dislike', 'deja_like', 'deja_dislike']  
        read_only_fields = ['id', 'utilisateur', 'date', 'film_id']

    def get_nb_like(self, obj):
        return obj.like.count()
    
    def get_nb_dislike(self, obj):
        return obj.dislike.count()

    def get_deja_like(self, obj):
        request = self.context['request']
        user = request.user
        if obj.like.filter(id=user.id).exists():
            return True
        return False
        
    def get_deja_dislike(self, obj):
        request = self.context['request']
        user = request.user
        if obj.dislike.filter(id=user.id).exists():
            return True
        return False
    
    def validate_texte(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('erreur votre texte doit faire au moins 1 caratères')
        if len(value) >= 1000:
            raise serializers.ValidationError('erreur votre commentaire dépasse la limite autorisé')
        return value
    
    def validate(self, attrs):    
        request = self.context.get('request')    
        user = request.user
        film_id = request.GET.get('movie_id')
        if Commentaire.objects.filter(utilisateur=user, 
            texte=attrs['texte'], 
            film_id=film_id).exists():
            raise serializers.ValidationError('erreur vous avez deja fait ce commentaire')
        return attrs 
    



