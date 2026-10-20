# Encyclo Arena

Jeu web original de cartes encyclopédiques avec comptes, collection, boosters, échanges, duels et classement.

## Développement local
Node.js 20+ et une base PostgreSQL sont nécessaires.

1. `npm install`
2. Définir `DATABASE_URL` avec une URL PostgreSQL et `SESSION_SECRET` avec une longue valeur aléatoire.
3. `npm start`
4. Ouvrir `http://localhost:3000`.

## Déploiement gratuit
Voir [DEPLOY.md](DEPLOY.md). La configuration `render.yaml` est prévue pour Render Free et une base PostgreSQL externe. Le service Render gratuit s'endort après inactivité ; le premier chargement peut être lent.

## Fonctionnalités
- Comptes et mots de passe hachés
- Inventaire stocké dans PostgreSQL
- Boosters et raretés
- Échanges de cartes entre joueurs
- Défis multijoueurs en temps réel
- Classement global

Le projet est un prototype et nécessite des tests supplémentaires avant une ouverture publique.
