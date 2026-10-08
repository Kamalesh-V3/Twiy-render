# Solo Leveling V2 — Multi-user starter

## What this is
A React/Vite starter implementing the next stage of the Solo Leveling concept:
- Founder/Admin login
- Employee login selection (demo)
- Role-based navigation
- Founder command center
- Employee dashboard
- Task ownership/status
- Blocker investigation UI
- AI training/skill profile
- Founder Advisor
- Level/XP layer

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Changelog v1.1
- Fixed: login and blocker form no longer use `document.getElementById`/`innerHTML`; now controlled React state
- Fixed: founder login validates the demo credentials; error messages added
- Fixed: blocker form now uses the selected task, reason and explanation, and keeps a log
- Fixed: task creation works (was an `alert` placeholder); employees can only change their own tasks
- Fixed: state updates are functional (no stale data); overdue detection added
- Fixed: employee insights and training now come from each person's skill profile (were hard-coded)
- Fixed: removed fake "+6 vs last month" and "↑" trend figures; remaining AI insights labelled sample data
- Setup: added `vite.config.js`, pinned dependency versions, proper `index.html` (lang, viewport, title)

## Important
Authentication, database persistence, real AI API calls, email invites, and production security are NOT implemented yet. The login is demo-only. Do not use this version with real employee credentials or sensitive company data.

## Recommended production stack
Frontend: React/Next.js
Backend: Node/TypeScript
Database: PostgreSQL
Auth: managed authentication (SSO/email/password)
AI: model API behind a server-side service
Storage: object storage for evidence/files
