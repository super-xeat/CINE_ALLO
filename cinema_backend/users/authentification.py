from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class JWTcookieAuth(JWTAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get('access_token')
    
        if token is None:
            return None
        
        try:
            validated_token = self.get_validated_token(token)           
            user = self.get_user(validated_token)
            
            return user, validated_token
            
        except AuthenticationFailed as e:
            print(f"❌ Échec de l'authentification: {str(e)}")
            raise AuthenticationFailed(str(e))
        except Exception as e:
            print(f"❌ Erreur inattendue: {type(e).__name__}: {str(e)}")
            return None
        