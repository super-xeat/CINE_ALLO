from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .form import CustomUserForm
from .models import CustomUser


def connexion(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('accueil')
        else:
            return render(request, 'connexion.html')
    return render(request, 'connexion.html')


def deconnexion(request):
    logout(request)
    return redirect('users:connexion')


def inscription(request):
    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('users:connexion')
    else:
        form = CustomUserForm()
    return render(request, 'inscription.html', {'form':form})


