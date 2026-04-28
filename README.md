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
- [Similarité des mots](#similarité-des-mots)
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

## Similarité des mots

Cette section explique la logique de similarité des mots utilisée par WikiGuessr et pourquoi nous préférons l'algorithme de Levenshtein à Jaro–Winkler pour la détection de propositions proches.

### Levenshtein (distance d'édition)

Levenshtein calcule le nombre minimum d'opérations élémentaires nécessaires pour transformer une chaîne en une autre : insertion, suppression ou substitution d'un caractère.

Exemple simple :

- mot A : `chat`
- mot B : `chats`

Il suffit d'insérer le caractère `s` pour transformer `chat` en `chats` → distance = 1.

Nous normalisons la distance pour obtenir un score de similarité entre 0 et 1 :

$$
	ext{similarité} = 1 - \frac{\text{distance\_Levenshtein}(A,B)}{\max(|A|,|B|)}
$$

Dans l'exemple ci‑dessus :

$$
	ext{similarité} = 1 - \frac{1}{5} = 0{,}8
$$

Un score proche de 1 signifie que les mots sont très proches ; un score proche de 0 signifie qu'ils sont très différents.

### Pourquoi pas Jaro–Winkler ?

Nous avons testé Jaro–Winkler mais constaté qu'il ramenait trop de bruit pour notre cas d'usage. Concrètement, Jaro–Winkler attribuait souvent des scores élevés à des paires de mots qui restaient significativement différentes dans le contexte du jeu, ce qui augmentait les faux positifs et pouvait induire en erreur les joueurs (propositions acceptées ou considérées comme « proches » alors qu'elles n'étaient pas suffisamment pertinentes).

Pour ces raisons nous privilégions Levenshtein (avec normalisation) : il est simple, interprétable et nous permet d'ajuster précisément le seuil de similarité pour l'expérience de jeu.

### Seuil recommandé

Un seuil raisonnable pour accepter une proposition comme "similaire" peut se situer autour de 0.75–0.85 selon le niveau de tolérance souhaité ; ajuster ce seuil en fonction des retours joueurs et des tests opératifs est recommandé.

## Notes importantes

- Le backend utilise BetterAuth pour l'authentification.
- Les routes API se trouvent dans `src/app/api/` et restent légères : elles orchestrent les contrôleurs, l'auth et les services.
- Ne pas modifier `generated/prisma/` manuellement

## Routes HTTP

Ci-dessous un résumé des principales routes API exposées par l'application, le verbe HTTP, la nécessité d'authentification et le format du body attendu (JSON). Les routes renvoient des réponses JSON sauf indication contraire.

- **GET /api/game**
    - Auth: Non
    - Body: Aucun
    - Description: Récupère l'article masqué du jour (MaskedArticle).

- **POST /api/game/guess**
    - Auth: Non
    - Body: {
        "word": "string" (required),
        "revealedWords": ["string", ...] (optional)
        }
    - Description: Soumet une proposition de mot et reçoit le résultat de la recherche.

- **POST /api/game/complete**
    - Auth: Oui
    - Body: {
        "guessCount": number (required),
        "guessedWords": ["string", ...] (required),
        "hintsUsed": number (optional)
        }
    - Description: Persiste une partie vérifiée pour un utilisateur authentifié.

- **GET /api/game/state**
    - Auth: Oui
    - Body: Aucun
    - Description: Récupère l'état sauvegardé (`GameCache`) pour l'utilisateur.

- **PUT /api/game/state**
    - Auth: Oui
    - Body: GameCache {
        "guesses": [{ "word": string, "found": boolean, ... }, ...],
        "revealed": { "<tokenId>": "displayText", ... },
        "saved": boolean (optional),
        "revealedImages": ["string", ...] (optional)
        }
    - Description: Enregistre l'état de la partie pour l'utilisateur connecté.

- **POST /api/game/reveal**
    - Auth: Non
    - Body: { "words": ["string", ...] }
    - Description: Demande de révéler une liste de mots (utilisé pour vérification côté client/outil).

- **GET /api/game/yesterday**
    - Auth: Non
    - Body: Aucun
    - Description: Récupère le titre de l'article d'hier. Réponse: { "title": string }

- **POST /api/game/hint**
    - Auth: Optionnel (auth disponible mais non obligatoire)
    - Body: {
        "hintIndex": number (required),
        "guesses": ["string", ...] (optional),
        "won": boolean (optional)
        }
    - Description: Demande un indice (image) ; certains indices peuvent nécessiter un utilisateur authentifié ou conditions métier.

- **GET /api/game/hint/image?index=<n>**
    - Auth: Non
    - Query: `index` (required, integer)
    - Body: Aucun
    - Description: Retourne l'image d'indice obfusquée en `image/webp` pour l'index donné.

- **GET /api/historic**
    - Auth: Non
    - Body: Aucun
    - Description: Liste les articles historiques disponibles.

- **GET /api/leaderboard**
    - Auth: Non
    - Body: Aucun
    - Description: Récupère les classements publics.

- **GET /api/profile/stats**
    - Auth: Oui
    - Body: Aucun
    - Description: Statistiques de profil pour l'utilisateur connecté.

- **Routes d'authentification (BetterAuth)**
    - Base: `/api/auth/[...betterauth]`
    - Description: Toutes les routes d'auth sont gérées par BetterAuth (échange OAuth, session, callbacks). Voir la configuration dans `src/lib/auth/`.

- **Coop (temps réel)**
    - Base: `/api/coop/*`
    - Exemples (JSON bodies):
        - `POST /api/coop` (create lobby): { "displayName": "string", "userId": "string" (optional) }
        - `POST /api/coop/join`: { "code": "STRING", "displayName": "string", "userId": "string" (optional) }
        - `POST /api/coop/{code}/guess`: { "playerToken": "string", "word": "string" }
    - Description: Endpoints pour la création/jointure de lobby et le jeu coopératif (voir `src/lib/controllers/coopController.ts`).

Si vous souhaitez, je peux générer un schéma OpenAPI minimal à partir de ces définitions.
 
### Documentation détaillée des routes API

Chaque route est décrite avec une courte présentation, un exemple d'appel et un exemple de réponse (HTTP 200 ou type attendu). Les exemples utilisent `http://localhost:3000` comme base locale.

---

### GET `/api/game`

Retourne l'article masqué du jour (structure `MaskedArticle`).

Exemple :
```
GET http://localhost:3000/api/game
```

Réponse 200 :
```json
{
    "sections": [ /* MaskedSection[] */ ],
    "totalWords": 123,
    "date": "2026-04-28",
    "imageCount": 2
}
```

---

### POST `/api/game/guess`

Soumet un mot proposé par le joueur et renvoie le résultat de la recherche (positions, similarité, occurrences...).

Exemple :
```
POST http://localhost:3000/api/game/guess
Content-Type: application/json

{
    "word": "Napoléon",
    "revealedWords": ["empereur"]
}
```

Réponse 200 :
```json
{
    "found": true,
    "word": "Napoléon",
    "positions": [ /* WordPosition[] */ ],
    "occurrences": 2,
    "similarity": 1.0,
    "serverDate": "2026-04-28T12:34:56.000Z"
}
```

---

### POST `/api/game/complete`  (auth requis)

Persiste une partie validée pour l'utilisateur authentifié.

Exemple :
```
POST http://localhost:3000/api/game/complete
Authorization: Bearer <token>
Content-Type: application/json

{
    "guessCount": 12,
    "guessedWords": ["mot1","mot2","mot3"],
    "hintsUsed": 1
}
```

Réponse 200 :
```json
{
    "success": true,
    "resultId": "abc123"
}
```

---

### GET `/api/game/state`  (auth requis)

Récupère l'état sauvegardé (`GameCache`) pour l'utilisateur connecté.

Exemple :
```
GET http://localhost:3000/api/game/state
Authorization: Bearer <token>
```

Réponse 200 :
```json
{
    "state": {
        "guesses": [ /* StoredGuess[] */ ],
        "revealed": { "tokenId": "texte affiché" },
        "saved": true,
        "revealedImages": ["/images/hint1.webp"]
    }
}
```

---

### PUT `/api/game/state`  (auth requis)

Enregistre l'état de la partie pour l'utilisateur connecté (forme `GameCache`).

Exemple :
```
PUT http://localhost:3000/api/game/state
Authorization: Bearer <token>
Content-Type: application/json

{
    "guesses": [{ "word":"Paris","found":true,"occurrences":1 }],
    "revealed": { "t_1": "Paris" },
    "saved": true
}
```

Réponse 200 :
```json
{ "success": true }
```

---

### POST `/api/game/reveal`

Demande de révéler une liste de mots (utilisé pour vérification ou outils).

Exemple :
```
POST http://localhost:3000/api/game/reveal
Content-Type: application/json

{ "words": ["mot1","mot2"] }
```

Réponse 200 :
```json
{
    "positions": [ /* WordPosition[] */ ]
}
```

---

### GET `/api/game/yesterday`

Renvoie le titre de l'article d'hier.

Exemple :
```
GET http://localhost:3000/api/game/yesterday
```

Réponse 200 :
```json
{ "title": "Article d'hier" }
```

---

### POST `/api/game/hint`

Demande un indice (image). Authentication optionnelle — si l'utilisateur est connecté, la logique métier peut débloquer plus d'options.

Exemple :
```
POST http://localhost:3000/api/game/hint
Content-Type: application/json

{
    "hintIndex": 0,
    "guesses": ["mot1"],
    "won": false
}
```

Réponse 200 :
```json
{
    "imageUrl": "https://.../hint0.webp",
    "hintIndex": 0,
    "totalImages": 3
}
```

---

### GET `/api/game/hint/image?index=<n>`

Récupère l'image d'indice obfusquée (réponse binaire `image/webp`).

Exemple :
```
GET http://localhost:3000/api/game/hint/image?index=0
```

Réponse 200 :
- Content-Type: image/webp (corps binaire)
- Headers: `X-WikiGuessr-Obfuscation`, `Cache-Control`

---

### GET `/api/historic`

Liste les articles historiques disponibles.

Exemple :
```
GET http://localhost:3000/api/historic
```

Réponse 200 :
```json
[
    { "id": 1, "title":"...", "date":"2026-04-01", "url":"...", "resolvedCount": 12 }
]
```

---

### GET `/api/leaderboard`

Récupère les classements publics.

Exemple :
```
GET http://localhost:3000/api/leaderboard
```

Réponse 200 :
```json
{
    "categories": [ /* LeaderboardCategoryData[] */ ]
}
```

---

### GET `/api/profile/stats`  (auth requis)

Statistiques du profil pour l'utilisateur connecté.

Exemple :
```
GET http://localhost:3000/api/profile/stats
Authorization: Bearer <token>
```

Réponse 200 :
```json
{ /* statistiques utilisateur */ }
```

---

### POST `/api/coop` (créer un lobby)

Crée un lobby coopératif et retourne le code + token joueur.

Exemple :
```
POST http://localhost:3000/api/coop
Content-Type: application/json

{ "displayName": "Alice", "userId": "optional-user-id" }
```

Réponse 200 :
```json
{ "code": "ABC123", "playerId": 1, "playerToken": "tok..", "isLeader": true }
```

---

### POST `/api/coop/join`

Rejoint un lobby existant.

Exemple :
```
POST http://localhost:3000/api/coop/join
Content-Type: application/json

{ "code": "ABC123", "displayName": "Bob" }
```

Réponse 200 :
```json
{ "code": "ABC123", "playerId": 2, "playerToken": "tok..", "isLeader": false }
```

---

### GET `/api/coop/{code}`

Récupère l'état du lobby (remplacer `{code}` par le code du lobby).

Exemple :
```
GET http://localhost:3000/api/coop/ABC123
```

Réponse 200 :
```json
{ /* état du lobby : joueurs, statut, leader, etc. */ }
```

---

### POST `/api/coop/{code}/start`

Démarre la partie coop (le body doit contenir `playerToken` ; la route vérifie que le joueur est leader).

Exemple :
```
POST http://localhost:3000/api/coop/ABC123/start
Content-Type: application/json

{ "playerToken": "tok.." }
```

Réponse 200 :
```json
{ "article": { /* MaskedArticle */ } }
```

---

### POST `/api/coop/{code}/guess`

Soumet une proposition en mode coop (rate-limited).

Exemple :
```
POST http://localhost:3000/api/coop/ABC123/guess
Content-Type: application/json

{ "playerToken": "tok..", "word": "Paris" }
```

Réponse 200 :
```json
{ /* GuessResult + "won": boolean */ }
```

---

### POST `/api/coop/{code}/leave`

Permet à un joueur de quitter le lobby.

Exemple :
```
POST http://localhost:3000/api/coop/ABC123/leave
Content-Type: application/json

{ "playerToken": "tok.." }
```

Réponse 200 :
```json
{ "success": true }
```

---

### GET/POST `/api/auth/[...betterauth]`

Routes d'authentification gérées par BetterAuth (OAuth, sessions, callbacks). Le détail dépend de l'opération BetterAuth.

Exemples :
```
GET /api/auth/session
POST /api/auth/callback/discord
```

Réponse : variable selon l'opération BetterAuth (JSON ou redirection OAuth).

---

Si vous voulez, je peux :
- extraire ces exemples dans `docs/API.md` au format plus long;
- ou générer un fichier OpenAPI (YAML/JSON) minimal.


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
