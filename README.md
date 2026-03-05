# WikiGuessr

Un jeu de devinettes quotidien basé sur Wikipédia. Chaque jour, un article Wikipédia est sélectionné et ses mots sont masqués. Le but est de retrouver les mots de l'article en les devinant un à un, jusqu'à révéler le titre de l'article.

## Fonctionnalités

- **Jeu quotidien** : un nouvel article Wikipédia chaque jour
- **Masquage des mots** : tous les mots de l'article sont masqués, la ponctuation reste visible
- **Correspondance floue** : les mots proches (distance de Levenshtein) sont acceptés et auto-révélés
- **Indices** : possibilité d'utiliser des indices image pour aider
- **Authentification Discord** : connexion optionnelle via OAuth2 pour sauvegarder ses résultats
- **Classement** : leaderboard avec plusieurs catégories (meilleure série, meilleur score, etc.)
- **Profil** : historique des parties et statistiques personnelles
- **Historique** : accès aux articles des jours précédents

## Stack technique

| Couche       | Technologie                              |
|--------------|------------------------------------------|
| Framework    | Next.js 16 (App Router)                  |
| UI           | React 19 avec React Compiler             |
| Langage      | TypeScript 5 (strict mode)               |
| Style        | Tailwind CSS 4                           |
| Base de données | PostgreSQL via Prisma 7               |
| Data Fetching | SWR                                     |
| Linter       | Biome 2.2                                |
| Package Mgr  | Bun                                      |

## Prérequis

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) (pour la base de données)
- Une application Discord (optionnel, pour l'authentification)

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Wiibleyde/BetterWikiGuessr.git
cd BetterWikiGuessr

# Installer les dépendances
bun install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wikiguessr

# Optionnel — authentification Discord
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
JWT_SECRET=your_jwt_secret
```

## Lancer le projet

```bash
# Démarrer la base de données (Docker)
docker compose up -d

# Appliquer les migrations Prisma
bunx prisma migrate dev

# Démarrer le serveur de développement
bun run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Commandes disponibles

```bash
bun run dev        # Serveur de développement
bun run build      # Build de production
bun run start      # Serveur de production
bun run lint       # Vérification du code (Biome)
bun run format     # Formatage automatique (Biome)

bunx prisma migrate dev    # Appliquer les migrations
bunx prisma generate       # Régénérer le client Prisma
bunx prisma studio         # Interface graphique de la BDD
```

## Déploiement (Docker)

```bash
docker compose up -d
```

Le `docker-compose.yml` inclut la base de données PostgreSQL et l'application Next.js.

## Structure du projet

```
src/
├── app/                  # Pages & routes API (Next.js App Router)
├── components/           # Composants React client
├── hooks/                # Hooks React (état du jeu, authentification)
├── lib/                  # Logique serveur (jeu, auth, Prisma, Wikipedia)
└── types/                # Définitions TypeScript partagées
prisma/
├── schema.prisma         # Schéma de la base de données
└── migrations/           # Migrations Prisma
```

## Contribuer

Les contributions sont les bienvenues. Merci de travailler sur des branches de feature issues de `develop` et de soumettre une pull request vers `develop`.

1. Forker le dépôt
2. Créer une branche : `git checkout -b feature/ma-feature develop`
3. Commiter les changements : `git commit -m "feat: ma feature"`
4. Pousser : `git push origin feature/ma-feature`
5. Ouvrir une Pull Request vers `develop`
