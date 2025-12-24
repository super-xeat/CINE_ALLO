
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
        print("=== DEBUG get_deja_like ===")
        print("Contexte disponible:", hasattr(self, 'context'))
        
        if hasattr(self, 'context') and self.context is not None:
            request = self.context.get('request')
            print("Request dans contexte:", request)
            print("User authentifié:", request.user.is_authenticated if request else "No request")
            
            if request and request.user.is_authenticated:
                user = request.user
                print(f"Vérification like: user={user.id}, commentaire={obj.id}")
                exists = obj.like.filter(id=user.id).exists()
                print(f"Résultat exists: {exists}")
                return exists
        
        print("Return False par défaut")
        return False
        
    def get_deja_dislike(self, obj):
        request = self.context.get('request')
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
    



