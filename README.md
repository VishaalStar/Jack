# Jack AI — Executive Business & Marketing Workstation

> **Zero Blind Execution • Multi-Tenant Enterprise Governance • Multi-Modal Voice & Chat**
> Built by **Vishaal S.** and powered by Google Gemini & Firebase.

Jack AI is an executive AI agent designed for founders, CMOs, and corporate leaders. Unlike raw generative bots that unilaterally execute destructive external actions, Jack operates under a strict **Zero Blind Send safeguard**: all high-impact actions (sending client emails, mutating CRM deal stages, adjusting ad spend, or competitor alerts) are automatically held in a staged approval queue requiring human verification before dispatch.

---

## 🌟 Key Features

1. **Zero Blind Send Human-in-the-Loop Safeguard**:
   - Every external execution is inspected and staged with explicit risk ratings (`Low`, `Medium`, `High`, `Critical`).
   - Corporate leaders can inspect the exact payload, edit drafts, verify recipients, and sign off with a single click or voice approval.
2. **Multi-Tenant Enterprise Governance (RBAC)**:
   - Super Admin, Governing Org Heads, and Team Member roles.
   - Dedicated `demo` sandbox tenant with pre-configured demo persona (**Alex Vance**) for instant testing.
   - Real-time audit trails capturing who approved what, when, and through which verification channel.
3. **Multi-Modal Voice & Text Interface**:
   - Voice feedback is muted by default on site entry; Jack will **never speak until explicitly commanded or requested**.
   - One-click "Speak / Read Aloud" toggle allows listening to spoken responses on-demand.
   - Full Web Speech recognition and text command dispatch.
4. **Market & Competitor Intelligence**:
   - Live competitor pricing benchmarks, product updates, and executive briefings.
5. **Multi-Platform Deployment Ready**:
   - Optimized for Google Cloud Run, Firebase Hosting, Vercel, Netlify, and Docker.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm (comes with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```
The optimized production bundle will be generated in `./dist`.

---

## 🐙 Pushing to Your GitHub Repository

To push this complete project to your personal or organization GitHub account:

### Step 1: Create a New GitHub Repository
Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `jack-ai-business-workstation`). Do not initialize with README since you already have this one.

### Step 2: Push via Terminal
Run the following commands in the root of this project folder:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files and create initial commit
git add .
git commit -m "feat: Jack AI Business & Marketing Workstation initial release"

# 3. Ensure branch is main
git branch -M main

# 4. Link to your GitHub repo (replace with your GitHub username and repository name)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## ☁️ Production Deployment Options

### Option 1: Google Cloud Run (Recommended)
Deploy directly from container source:
```bash
gcloud run deploy jack-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### Option 2: Firebase Hosting & Firestore Rules
Deploy the static SPA and Firestore security rules:
```bash
npm run build
firebase deploy --only hosting,firestore:rules
```

### Option 3: Vercel / Netlify
Deploy static build directly to Vercel:
```bash
npm run build
npx vercel --prod
```

### Option 4: Docker Container
```bash
docker build -t jack-ai-workstation .
docker run -p 3000:3000 jack-ai-workstation
```

---

## 🔒 Security & Privacy Architecture
- **Zero API Key Leakage**: Browser clients never have access to secret API credentials.
- **Role-Based Security Rules**: Firestore security rules restrict write operations according to tenant membership and administrative delegation.
- **SOC2 Type II Compatible Audit Trail**: All user logins, staged approvals, and governance mutations are stamped with cryptographic status.

---

## 📄 License
MIT License. Created by Vishaal S.
