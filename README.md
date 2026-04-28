# BetterWikiGuessr

Jeu quotidien de devinettes basé sur un article Wikipédia. Le texte de l'article est tokenisé et certains mots sont masqués ; le joueur devine des mots pour révéler progressivement l'article et son titre.

## Table des matières

- Aperçu
- Stack technique
- Prérequis
- Installation rapide
- Variables d'environnement importantes
- Commandes utiles
- Structure du dépôt
- Tests et CI
- Contribuer
- Licence

## Aperçu

- Article quotidien tiré de Wikipédia
- Masquage de mots (punctuation conservée)
- Correspondance tolérante pour les propositions proches
- Indices image optionnels
- Authentification via BetterAuth (Discord)
- Persistance de progression pour utilisateurs authentifiés
- Option Realtime (Supabase Realtime) pour fonctionnalités coopératives

## Stack technique

- Framework : Next.js 16 (App Router)
- UI : React 19
- Langage : TypeScript 5 (strict)
- Style : Tailwind CSS 4
- Base de données : PostgreSQL via Prisma 7
- Authentification : BetterAuth (Prisma adapter) — Discord social provider
- Realtime (optionnel) : Supabase Realtime (pour coopération)
- Runtime / package manager : Bun
- Linter / Formatter : Biome
- Tests : Bun test

## Prérequis

- Bun (v1+)
- PostgreSQL (local ou distant). Pour le développement local, Docker Compose est recommandé.
- Variables d'environnement configurées (voir ci-dessous)

## Installation rapide

```bash
git clone <repo-url>
cd BetterWikiGuessr
bun install
cp .env.example .env
# éditer .env
bun run db:generate    # génère le client Prisma
bun run db:migrate     # applique les migrations
bun run dev            # démarre le serveur en dev
```

L'application est disponible par défaut sur `http://localhost:3000`.

## Variables d'environnement importantes

Remplir `.env` à partir de `.env.example`.

- DATABASE_URL — URL de connexion PostgreSQL (required)
- BETTER_AUTH_SECRET — secret pour BetterAuth (min 32 chars) (required)
- BETTER_AUTH_URL — URL publique de BetterAuth (required)
- DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET — pour Discord OAuth (si activé)
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY — (optionnel) pour Realtime
- GAME_TIMEZONE — timezone du jeu (optionnel, défaut : Europe/Paris)

## Commandes utiles

- bun run dev          # Serveur de développement
- bun run build        # Build de production
- bun run start        # Démarrer la build en production
- bun run lint         # Biome lint
- bun run format       # Biome format
- bun run test         # Tests Bun
- bun run db:generate  # Générer Prisma client
- bun run db:migrate   # Appliquer migrations

## Structure du dépôt (résumé)

src/
- app/           : pages App Router, routes API
- components/    : UI et composants métier
- atom/          : atomes Jotai (état client)
- lib/           : logique serveur (controllers, services, repositories, game)
- hooks/         : hooks React côté client
- prisma/        : schema et migrations
- generated/     : client Prisma généré (ne pas modifier)

Consignes : garder la logique métier dans `lib/services` et l'accès DB dans `lib/repositories`.

## Tests et CI

- Linter & formatter : Biome
- Tests unitaires : Bun test
- Avant PR : lancer `bun run lint`, `bun run test`, `bun run build`

## Contribuer

1. Créer une branche `feature/xxx` depuis `develop` ou `main` selon le workflow.
2. Respecter TypeScript strict et les règles Biome.
3. Ajouter des tests pour la logique métier modifiée.
4. Ouvrir une PR avec description claire et capture d'écran si nécessaire.

## Licence

Ce projet est sous licence GPL-3.0.

---

Pour toute question relative au développement ou à l'architecture, se référer à AGENTS.md et aux commentaires de code dans `src/`.
