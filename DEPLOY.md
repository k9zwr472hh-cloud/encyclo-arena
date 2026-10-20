# Publier Encyclo Arena (configuration gratuite)

Le code est préparé pour un service web Render gratuit et une base PostgreSQL externe persistante (par exemple Neon). Le service Render gratuit peut s'endormir après inactivité ; le premier chargement peut alors prendre environ une minute. Le compte gratuit de la base choisie a ses propres limites et conditions : vérifie-les avant d'y stocker des données importantes.

## 1. Créer le dépôt GitHub
1. Ouvre https://github.com/new
2. Nom du dépôt : `encyclo-arena`
3. Choisis **Public** (nécessaire pour le chemin le plus simple de déploiement) ou privé si tu sais configurer les autorisations Render.
4. Coche **Add a README file**, puis clique **Create repository**.
5. Dans le dépôt, choisis **Add file → Upload files**. Décompresse le ZIP du projet sur ton ordinateur et téléverse les fichiers et dossiers du projet (pas le dossier parent). Valide avec **Commit changes**.

## 2. Créer une base PostgreSQL gratuite
1. Ouvre https://neon.tech/ et crée un compte.
2. Crée un projet PostgreSQL.
3. Copie l'URL de connexion (connection string) fournie. Traite-la comme un mot de passe : ne la partage pas et ne la publie jamais dans GitHub.

## 3. Déployer sur Render
1. Ouvre https://render.com/ et crée un compte.
2. Dans le tableau de bord, sélectionne **New → Blueprint**.
3. Connecte GitHub, puis sélectionne le dépôt `encyclo-arena`.
4. Render détectera `render.yaml`. Dans la variable `DATABASE_URL`, colle la chaîne de connexion PostgreSQL de Neon.
5. Valide le déploiement. Render génèrera `SESSION_SECRET` automatiquement.
6. Lorsque le service indique **Live**, ouvre son URL `https://...onrender.com` depuis ton iPhone ou ton PC.

## 4. Vérification
- Ouvre `/api/cards` à la fin de l'URL du service : une liste de cartes doit s'afficher.
- Ouvre la page principale, crée deux comptes dans deux navigateurs et teste boosters, échanges et défis.

## Sécurité et limites
- Ne colle jamais un mot de passe ou une chaîne de connexion dans une conversation publique ou dans un fichier versionné.
- Le code est un prototype : avant une vraie ouverture publique, ajouter récupération de mot de passe, politique de confidentialité, conditions d'utilisation, sauvegardes, alertes et tests de sécurité.
- La session est conservée dans un cookie signé et HTTP-only ; la progression est stockée dans PostgreSQL.
- Le service gratuit peut s'endormir et la base gratuite peut imposer des quotas ou une suspension selon le fournisseur. Les offres changent : vérifie les conditions actuelles.
