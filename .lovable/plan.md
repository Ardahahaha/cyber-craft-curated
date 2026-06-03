## V1 — Discovery GitHub uniquement

### Backend (Lovable Cloud)
Activation de Lovable Cloud + tables :

- `discovered_tools` : outils détectés (nom, github_url, description, stars, forks, language, license, topics, readme_excerpt, last_commit, score, source, status `pending|approved|rejected`, suggested_category, detected_at)
- `daily_tool` : (tool_id, featured_date unique) — rotation auto
- `discovery_runs` : logs (run_at, source, fetched_count, kept_count, error)
- `user_roles` + enum `app_role` + fonction `has_role` (pattern sécurisé)

RLS :
- `discovered_tools` lecture : approved → tout le monde ; pending/rejected → admin uniquement. Écriture : admin + service_role
- `daily_tool` lecture publique ; écriture admin/service
- `discovery_runs` admin uniquement

### Auth
- Email/password via Supabase (page `/auth`)
- Premier user → admin manuel (script SQL ou seed)
- Layout `_authenticated/admin` protégé par `has_role('admin')`

### Scraper GitHub
Server function `runDiscovery` (appelable manuellement + cron pg_cron quotidien) :
- Recherche GitHub API sur ~10 mots-clés (cli, osint, pentest, forensic, devops, sysadmin, blue-team, recon, network-security, threat-hunting)
- Filtres : stars >= seuil configurable (50), pushed dans les 12 derniers mois, licence présente
- Pour chaque repo : récup README (extrait), topics, langage
- Scoring (0-100) : stars (log), activité récente, README qualité, présence "install"/"usage"/code-block, topics pertinents, licence open source
- Catégorisation auto par mots-clés dans topics/description
- Déduplication par github_url
- Insertion en `pending` dans `discovered_tools`

Rotation **Tool du jour** : server function qui sélectionne le meilleur score parmi `approved` sans entrée récente dans `daily_tool`, insère pour aujourd'hui.

### Frontend
- **Page d'accueil** : nouvelle section "Tool du jour" (carte premium en haut) + section "Nouveaux outils détectés" (= 6 derniers approved). Logos GitHub conservés.
- **`/admin/discovery`** (admin only) :
  - KPIs (détectés aujourd'hui, en attente, score moyen, sources actives)
  - Bouton "Lancer analyse" + "Choisir Tool du jour"
  - Tableau filtrable (status, score, langage, catégorie, source, date)
  - Actions par ligne : approuver / rejeter / éditer (catégorie, description, level, tags) / mettre en Tool du jour
  - Bouton "Valider tous score >= 80"
- **`/auth`** : email/password

### Sécurité
- GitHub API : token stocké en secret `GITHUB_TOKEN` (optionnel, augmente les rate limits) — fallback unauthenticated si absent
- Toutes les server functions de discovery : `requireSupabaseAuth` + `has_role('admin')` (sauf cron via service_role)
- Aucun token côté client
- Validation Zod sur toutes les mutations admin
- Edge cases logs dans `discovery_runs`

### Cron
pg_cron daily 06:00 UTC → appelle `/api/public/cron/discovery` (vérifie un header `CRON_SECRET`) qui exécute discovery + rotation Tool du jour.

### Design
Réutilise tokens existants (`cyber-cyan`, `primary`, `accent`, `bg-gradient-card`). Aucun emoji. Cartes premium identiques au reste du site. Logos GitHub via `ToolLogo` existant.

### Hors scope v1 (it. suivantes)
- Hacker News, Awesome lists, RSS, Product Hunt, PyPI/npm/crates → v2+
- Multi-admin/invitations
- Édition avancée Markdown des fiches
