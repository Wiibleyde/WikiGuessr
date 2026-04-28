# WikiGuessr

Un jeu de devinettes quotidien basé sur Wikipédia. Chaque jour, une page Wikipédia est sélectionnée, son texte est découpé et ses mots sont masqués. Le joueur devine des mots pour révéler progressivement l'article, débloquer des indices et finir la partie.

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c0fa28c225044b569bfc25e63924e287)](https://app.codacy.com/gh/Wiibleyde/WikiGuessr/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-F9F1E1?logo=bun&logoColor=black)

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
- [Ajouter un provider OAuth (BetterAuth)](#ajouter-un-provider-oauth-betterauth)
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

## Architecture et organisation du repo

Le projet est un monorepo Next.js avec code frontend et backend cohabitant dans `src/`. La séparation principale est :

- `src/app/` : pages App Router, métadonnées, routes API et middleware de rendu côté serveur
- `src/components/` : UI réutilisables et présentation des pages
- `src/hooks/` : hooks de logique client
- `src/lib/` : logique serveur, services, repositories, validation, auth et utilitaires partagés
- `src/context/` et `src/provider/` : providers React et contextes applicatifs
- `src/types/` : types partagés
- `src/utils/` : aides et helpers
- `src/test/` : suites de tests Bun
- `prisma/` : schéma et migrations de base de données
- `generated/prisma/` : client Prisma généré (ne pas modifier)
- `public/` : ressources statiques

### Frontend

- `src/app/layout.tsx` : layout global, Navbar, Footer, providers
- `src/app/page.tsx` : page d'accueil principale
- `src/app/error.tsx`, `loading.tsx`, `not-found.tsx` : UI d'état global
- `src/app/robots.ts`, `src/app/sitemap.ts` : génération de robots/sitemap
- `src/app/api/` : route handlers côté serveur
  - `auth/` : BetterAuth callback et auth route
  - `game/` : endpoints de jeu (`route.ts`, `guess`, `complete`, `state`, `reveal`, `yesterday`, `hint`, `hint/image`)
  - `historic/` : historique des articles
  - `leaderboard/` : classements
  - `profile/stats/` : statistiques de profil auth
- `src/components/` : composants de jeu, historique, leaderboard, profil, coop, UI partagée
- `src/constants/` : constantes de jeu, taux limites, thèmes et navigation
- `src/context/` : contextes globaux (`CoopContext.ts`, `GameContext.ts`, `LoginContext.tsx`)
- `src/hooks/` : hooks spécifiques pour article, auth, coop, jeu, db, état de partie, etc.
- `src/provider/` : providers React (`CoopProvider.tsx`, `GameProvider.tsx`, `LoginProvider.tsx`, `QueryProvider.tsx`)

### Backend / Server

- `src/env.ts` : validation des variables d'environnement avec Zod
- `src/instrumentation.ts` : démarrage, vérification DB et bootstrap de l'article quotidien
- `src/proxy.ts` : injection d'en-têtes de requête côté serveur
- `src/lib/prisma.ts` : singleton Prisma
- `src/lib/db-check.ts` : vérification de la connexion DB
- `src/lib/auth/` : configuration BetterAuth et clients auth
- `src/lib/services/` : cas d'utilisation applicatifs (jeu, profil, historique, leaderboard)
- `src/lib/repositories/` : accès DB Prisma et abstractions de données
- `src/lib/controllers/` : validation des requêtes et réponse HTTP
- `src/lib/game/` : logique de jeu pure, normalisation, rotation quotidienne, fetch wiki
- `src/lib/errors/` : erreurs partagées et formatage d'erreur
- `src/lib/query/` : helpers de requêtes communes
- `src/lib/supabase/` : integration Supabase Realtime pour le mode coopératif
- `src/lib/batches/` : tâches batch et gestion de données

### Tests

- `src/test/` : tests unitaires et d'intégration Bun
  - `game.test.ts`, `normalize.test.ts`, `hintImage.test.ts`, `rate-limit.test.ts`, `historic.test.ts`, etc.
- `src/test/mocks/` : données et utilitaires de test

### Configuration et scripts

- `package.json` : scripts Bun et dépendances
- `bunfig.toml` : configuration Bun pour les tests
- `biome.json` : configuration Biome
- `tsconfig.json` : configuration TypeScript
- `next.config.ts` : configuration Next.js
- `prisma.config.ts` : configuration Prisma
- `docker-compose.yml` : environnement local Docker
- `Dockerfile` : image de production
- `docker-entrypoint.sh` : entrée du conteneur
- `scripts/` : scripts de migration et migration de l'ancien auth

### Base de données

- `prisma/schema.prisma` : modèle de données
- `prisma/migrations/` : historique des migrations
- `generated/prisma/` : client Prisma généré

## Notes importantes

- Le backend utilise BetterAuth pour l'authentification.
- Les routes API se trouvent dans `src/app/api/` et restent légères : elles orchestrent les contrôleurs, l'auth et les services.
- Ne pas modifier `generated/prisma/` manuellement

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

3. Démarrer Supabase Realtime pour le mode coopératif en ligne

```bash
docker compose up -d
```

4. Lancer l'app

```bash
bun run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Développement avec Docker

Le projet contient un `docker-compose.yml` permettant de lancer PostgreSQL et, si besoin, de builder l'application (partie commentée du fichier).

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

## Ajouter un provider OAuth (BetterAuth)

Exemple : ajouter Google en plus de Discord.

1. Ajouter les variables dans `.env` (et dans `.env.example` pour documenter le setup) :

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

2. Étendre la validation Zod dans `src/env.ts` :

```ts
const envSchema = z.object({
    // ...
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
});

const env = envSchema.parse({
    // ...
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});
```

3. Déclarer le provider dans BetterAuth (`src/lib/auth/auth.ts`) :

```ts
socialProviders: {
    discord: {
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
},
```

4. Si vous voulez l'afficher dans l'UI de login, ajouter une entrée dans `src/constants/navbar.tsx` (`providers`).

5. Configurer l'URL de redirection dans le dashboard OAuth du provider (obligatoire) :
   - Base app : `BETTER_AUTH_URL` (ex: `http://localhost:3000`)
   - Route BetterAuth : `src/app/api/auth/[...betterauth]/route.ts`
   - Callback OAuth attendue par BetterAuth : `${BETTER_AUTH_URL}/api/auth/callback/<provider>` (ex: `/api/auth/callback/google`)
   - Exemple Discord local : `http://localhost:3000/api/auth/callback/discord`

6. Redémarrer le serveur après changement de variables d'environnement.


## Licence

Ce projet est distribué sous licence GPL-3.0.

---
