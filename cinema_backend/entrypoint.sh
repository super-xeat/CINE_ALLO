#!/bin/sh

# On quitte immédiatement si une commande échoue
set -e

echo "--- Application des migrations sur Neon ---"
python manage.py migrate --noinput

echo "--- Collecte des fichiers statiques ---"
python manage.py collectstatic --noinput

echo "--- Démarrage de Gunicorn ---"
# Remplace 'mon_projet' par le nom du dossier contenant ton wsgi.py
exec gunicorn cinema.wsgi:application --bind 0.0.0.0:10000