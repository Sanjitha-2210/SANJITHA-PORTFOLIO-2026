# Portfolio CMS: Developer-Controlled UI & Admin-Controlled Content

A modern, high-velocity portfolio system built with a **developer-designed UI template** and a **private administrative CMS**. All content is managed dynamically via forms and stored in SQLite + Cloudinary, ensuring zero code modification is required for routine updates.

---

## 🎯 Architectural Principles

1. **Developer-Controlled UI**: The public templates, typography, layout, animations, and design tokens remain strictly in code. Admin cannot inadvertently break the website's visual integrity.
2. **Admin-Controlled Content**: All portfolio content (Projects, Milestones, Skills, Accreditations, Biography, Social links) is managed via private CMS dashboards.
3. **Draft & Archive Isolation**: Items set to `draft` or `archived` are filtered out at the FastAPI database query layer (`/api/public/...`), ensuring unreleased content never leaks to public visitors.
4. **Port Safety**: Runs on **Port 3001** (Next.js) and **Port 8000** (FastAPI). Your existing project running on **Port 3000** remains completely untouched.
5. **Dual-Mode Media Storage**: Seamless upload endpoint (`/api/upload`) stores media directly in **Cloudinary** when credentials are provided in `.env`, or falls back automatically to local static storage so everything works out-of-the-box.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Public & Admin Frontend** | Next.js 15 + React 19 + TypeScript | Tailwind CSS, Lucide icons, Frosted Glass, Spotlight cursor, Interactive CLI HUD |
| **Backend API** | FastAPI + Python 3 | Pydantic v2 validation, JWT Bearer authentication, RESTful architecture |
| **Database & ORM** | SQLite + SQLAlchemy 2.0 | Single source of truth, automated seeding and migration tables |
| **Media Storage** | Cloudinary + Local Fallback | Direct image, video, certificate document upload & CDN delivery |

---

## 🚀 Quick Start

### 1. Launch Everything Together
In PowerShell:
```powershell
.\start-all.ps1
```
This automatically starts both the FastAPI backend on port 8000 and the Next.js frontend on port 3001 in dedicated terminal windows.

### 2. Or Launch Separately

**FastAPI Backend (Port 8000)**:
```powershell
.\start-backend.ps1
```
*(Interactive API documentation available at `http://localhost:8000/docs`)*

**Next.js Frontend (Port 3001)**:
```powershell
.\start-frontend.ps1
```

---

## 🔐 Administrative Credentials

- **Admin Login URL**: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
- **Default Username**: `admin`
- **Default Password**: `admin123456`

*(You can also click the quick auto-fill button on the login screen to test immediately).*

---

## ☁️ Cloudinary Integration (Optional)

To enable Cloudinary CDN media delivery, open `backend/.env` and supply your cloud credentials:

```ini
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Restart the backend. Any media uploaded via the CMS dashboard will instantly route to Cloudinary. Without these keys, the system gracefully uses local media storage in `backend/uploads/`.

---

## 🌟 Unique Extreme UI/UX Developer Features

1. **Interactive Developer CLI (Terminal HUD)**:
   - Press `~` or click **"CLI Mode"** in the navigation bar.
   - Run interactive commands like `whoami`, `projects`, `skills`, `experience`, `certs`, `admin`, `clear`.
2. **Spotlight Cursor**:
   - Subtle dynamic radial glow tracking the visitor's cursor across cyber glass cards.
3. **Bento Grid Showcase**:
   - Filter by category (`Distributed Systems`, `AI`, `FinTech`, `Systems Programming`) with instant debounce search.
   - Modal deep-dive with architectural specifications, video walkthroughs, and GitHub source links.
4. **Verified Credential Lightbox**:
   - Click certificate thumbnails to view full high-resolution accreditation documents with one-click credential ID copy.
5. **Direct Inquiries Inbox**:
   - Public contact form submissions are persisted to the database and accessible in the Admin Messages panel.

