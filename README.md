# OutVenture
In main folder:

Front
cd outventure-frontend 
npm start

Back:
activate venv
python manage.py runserver

APIS:
https://portail-api.meteofrance.fr/web/fr/

Pour l'escalade => rien d'innovant

https://oblyk.org/api-and-developers => pas possible pour l'instant 

Explorer API Maps

Prévision sur les prochainees heures / jours 

** 2 Fonctionnalités principales **
- Suggestion de sport en fonction de la méteo, localisation et préférences utilisateur. Modéliser ça comme un arbre de décision. On va ensuite minimiser l'entropie de l'arbre.
- Suggestion de spot en fonction du sport, localisation et préférences utilisateur

J'ai une vue qui prend en entrée une localisation (LAT/Long) et qui me sort la méteo de la commune la plus proche, les spots...

J'ai une vue qui prend une localisation, je peux ensuite fournir une liste de sport classé en fonction des conditions météo, de la distance et de la direction du vent

Définir des préférences utilisateur pour le sport (vélo, randonnée, surf, )

Envie d'activité (pourrait être dans les préférences utilisateur), temps dispo (ou alors date et heure ?) et localisation, à partir de ça fournir une liste de spot, peu importe les sports et triée selon un score. En bas de la liste, les gens peuvent ajouter des spots

