# WikiGuessr

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c0fa28c225044b569bfc25e63924e287)](https://app.codacy.com/gh/Wiibleyde/WikiGuessr/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3FCF8E?logo=supabase&logoColor=white)
![BetterAuth](https://img.shields.io/badge/BetterAuth-Authentication-000000?logo=shield&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime_%26_Tests-F9F1E1?logo=bun&logoColor=black)
![License](https://img.shields.io/badge/Licence-GPL--3.0-4B5563)

Un jeu de devinettes quotidien basé sur Wikipédia. Chaque jour, une page Wikipédia est sélectionnée, son contenu est découpé en tokens, puis ses mots sont masqués. Le but est de retrouver progressivement l'article jusqu'à révéler son titre.

## Aperçu

- Un nouvel article Wikipédia chaque jour
- Masquage intelligent des mots avec ponctuation visible
- Correspondance floue pour accepter les propositions proches
- Indices image progressifs après plusieurs essais
- Authentification Discord via Supabase Auth
- Sauvegarde de progression pour les utilisateurs connectés
- Classements, statistiques de profil et historique
- Mode coopératif en temps réel

## Stack technique

| Couche | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Langage | TypeScript 5 |
| Style | Tailwind CSS 4 |
| Etat client | React Context + hooks |
| Data fetching | TanStack Query 5 |
| HTTP | Axios |
| Authentification | BetterAuth + Discord OAuth |
| Base de données | PostgreSQL via Prisma 7 |
| Temps réel | Supabase Realtime |
| Validation | Zod |
| Linter / Formatter | Biome 2.2 |
| Tests | Bun test |
| Package manager | Bun |

## Démarrage rapide

### Prérequis

- Bun >= 1.0
- Docker et Docker Compose pour PostgreSQL local
- Une application Discord si vous activez l'authentification

### Installation

```bash
git clone https://github.com/Wiibleyde/WikiGuessr.git
cd WikiGuessr
bun install
```

Le script post-install génère automatiquement le client Prisma.

### Configuration

Copier le fichier d'exemple et renseigner les valeurs :

```bash
cp .env.example .env
```

Le `.env.example` contient toutes les variables nécessaires (Supabase self-hosted, PostgreSQL, Discord OAuth, etc.). Les variables propres à l'application Next.js se trouvent dans la section **WikiGuessr App** du fichier.

### Lancer en local

```bash
# Démarrer PostgreSQL
docker compose up -d postgres

# Appliquer les migrations
bun run db:migrate

# Lancer le serveur Next.js
bun run dev
```

L'application est disponible sur `http://localhost:3000`.

## Développement avec Docker

Le dépôt contient un `docker-compose.yml` qui démarre PostgreSQL et l'application Next.js.

```bash
docker compose up --build
```

L'image applicative génère Prisma, build l'application en mode standalone, puis démarre le serveur via `docker-entrypoint.sh`.

## Commandes utiles

```bash
bun run dev            # Serveur de développement
bun run build          # Build de production
bun run start          # Serveur de production
bun run lint           # Vérification Biome
bun run format         # Formatage Biome

bun run test           # Tests unitaires Bun
bun run test:watch     # Tests en mode watch
bun run test:coverage  # Couverture de tests
bun run test:e2e       # Tests Playwright

bun run db:generate    # Générer le client Prisma
bun run db:migrate     # Créer/appliquer une migration Prisma
```

## Architecture

### Frontend

- `src/app/` contient les pages App Router, métadonnées et routes API
# WikiGuessr

![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-F9F1E1?logo=bun&logoColor=black)

Un jeu de devinettes quotidien basé sur Wikipédia. Chaque jour une page Wikipédia est choisie et son texte est progressivement masqué ; le joueur devine des mots pour révéler l'article et le titre.

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation & configuration](#installation--configuration)
- [Commandes utiles](#commandes-utiles)
- [Démarrage local (Bun)](#démarrage-local-bun)
- [Développement avec Docker](#développement-avec-docker)
- [Architecture et organisation du repo](#architecture-et-organisation-du-repo)
- [API & documentation (OpenAPI / Swagger)](#api--documentation-openapi--swagger)
- [Base de données & Prisma](#base-de-données--prisma)
- [Qualité, tests et CI](#qualité-tests-et-ci)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Aperçu

- Article quotidien tiré de Wikipédia
- Masquage de mots avec maintien de ponctuation
- Correspondance floue pour accepter les propositions proches
- Indices images progressifs
- Authentification (BetterAuth + Discord)
- Sauvegarde d'état pour utilisateurs authentifiés
- Mode coopératif en temps réel

## Stack technique

- Framework: Next.js 16 (App Router)
- UI: React 19
- Langage: TypeScript 5 (strict)
- Styling: Tailwind CSS 4
- Client state: Jotai / React Context + hooks
- HTTP / Fetching: SWR / fetch
- Base de données: PostgreSQL + Prisma 7
- Auth: BetterAuth (Prisma adapter) with Discord social provider
- Runtime & package manager: Bun
- Linter / Formatter: Biome
- Tests: Bun test

## Prérequis

- Bun (v1+)
- Node / npm non requis (Bun utilisé)
- Docker & Docker Compose (optionnel, pour Postgres local)
- PostgreSQL (local ou distant)

## Installation & configuration

1. Cloner le dépôt

```bash
git clone https://github.com/Wiibleyde/WikiGuessr.git
cd WikiGuessr
bun install
```

2. Copier les variables d'environnement

```bash
cp .env.example .env
```

3. Variables d'environnement importantes (extrait)

- `DATABASE_URL` (Postgres)
- `BETTER_AUTH_SECRET` (min 32 chars)
- `BETTER_AUTH_URL` (BetterAuth base URL)
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` (Discord OAuth)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optionnel pour Realtime)
- `GAME_TIMEZONE` (optionnel, défaut Europe/Paris)

Compléter le `.env` à partir du `.env.example` fourni.

## Commandes utiles

```bash
bun run dev          # Serveur de développement (Next.js)
bun run build        # Build de production
bun run start        # Lancer la build en production
bun run lint         # Biome lint
bun run format       # Biome format

bun run test         # Tests Bun
bun run test:watch   # Tests en watch

bun run db:generate  # Générer Prisma client
bun run db:migrate   # Appliquer les migrations
```

## Démarrage local (Bun)

1. Démarrer PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

2. Appliquer les migrations et générer le client

```bash
bun run db:migrate
bun run db:generate
```

3. Lancer l'app

```bash
bun run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Développement avec Docker

Le projet contient un `docker-compose.yml` permettant de lancer PostgreSQL et, si besoin, de builder l'application.

```bash
docker compose up --build
```

Le `Dockerfile` et `docker-entrypoint.sh` gèrent la génération du client Prisma et le démarrage.

## Architecture et organisation du repo

Structure principale (résumé)

```
src/
├── app/                # App Router pages, metadata et routes API
├── components/         # Composants UI (game, navbar, profile...)
├── atom/               # Atomes Jotai pour état global
├── constants/          # Constantes métier
├── context/            # Context providers (Coop, Game, Login)
├── hooks/              # Hooks client (useArticle, useGame, useGuess...)
├── lib/                # Backend logic: controllers, services, repos, game
├── provider/           # Providers React (CoopProvider, GameProvider)
└── test/               # Tests Bun

prisma/                 # schema.prisma + migrations
generated/prisma/       # Client Prisma généré (ne pas modifier)
```

Règles d'organisation

- `app/*` : pages + routes API (Next.js App Router)
- `lib/controllers/*` : validation HTTP et shaping des réponses
- `lib/services/*` : cas d'utilisation métier
- `lib/repositories/*` : accès à la base via Prisma
- `lib/game/*` : logique purement liée au jeu (normalisation, tokenisation)

## API & documentation (OpenAPI / Swagger)

Une spécification OpenAPI est générée automatiquement via `swagger-jsdoc` et est servie à :

- JSON spec: `/api/docs`
- UI interactive: `/docs` (Swagger UI)

Pour enrichir la documentation, ajouter des blocs JSDoc `@openapi` dans les fichiers de route (ex. `src/app/api/.../route.ts`) ou remplacer par des fichiers YAML si vous préférez.

Sécurité: la page `/docs` est publique par défaut ; si vous la déployez en production, pensez à la protéger (authentification ou IP allowlist).

## Base de données & Prisma

- Fichiers principaux: `prisma/schema.prisma` et le dossier `prisma/migrations/`.
- Le client Prisma généré se trouve dans `generated/prisma/`.

Migrations courantes

```bash
bun run db:migrate
```

Génération du client (si nécessaire)

```bash
bun run db:generate
```

Important: ne pas modifier manuellement `generated/prisma/`.

## Qualité, tests et CI

- Linter/formatter: Biome (`bun run lint`, `bun run format`)
- Tests: Bun test (`bun run test`) — la suite de tests actuelle passe localement.
- CI: workflows GitHub Actions présents pour lint, tests et build Docker.

Conseils avant PR

```bash
bun run lint
bun run test
bun run build
```

## Dépannage commun

- Si Prisma client est manquant: `bun run db:generate`
- Si migration bloquée: vérifier `DATABASE_URL` et relancer `bun run db:migrate`
- Si tests échouent localement: lancer `bun run test:watch` pour debug

## Contribution

1. Créer une branche `feature/xxx` depuis `develop`.
2. Respecter le style (TypeScript strict, Biome).
3. Ajouter des tests pour toute nouvelle logique métier.
4. Ouvrir une Pull Request vers `develop`.

## Prochaines améliorations suggérées

- Compléter l'annotation OpenAPI de toutes les routes API pour documentation complète.
- Introduire des schémas `zod` pour toutes les validations d'entrée (controllers) afin d'améliorer la robustesse et la doc.
- Protéger `/docs` en production.

## Licence

Ce projet est distribué sous licence GPL-3.0.

---

Si vous voulez que j'ajoute une version anglaise du README, des captures d'écran, ou que je complète les annotations OpenAPI pour toutes les routes, dites-le et je m'en occupe.
