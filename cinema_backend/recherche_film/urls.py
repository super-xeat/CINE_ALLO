from django.urls import path
from .views import Recommandationview

urlpatterns = [
    path('recommandation/', Recommandationview.as_view(), name='recommandation'),
]