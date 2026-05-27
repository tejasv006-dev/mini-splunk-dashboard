# 🛡️ Mini Splunk: Distributed Log Ingestion & SIEM Command Center

This application is a clinical-grade, high-performance **SIEM (Security Information and Event Management) Log Monitoring & Ingestion Dashboard** built on the modern **MERN Stack**. 

It is engineered as a state-of-the-art enterprise security console, demonstrating advanced full-stack competencies, secure failover infrastructure, and high-fidelity interactive UI/UX components.

---

## 🚀 Key Features

*   **⚡ Real-Time Log Ingestion**: High-throughput REST API endpoint `/api/logs` registers structural JSON server logs in real-time from independent distributed external services.
*   **🔌 Hybrid Database Failover**: Validates database connectivity and automatically mounts an **In-Memory Sandbox Catalog** if MongoDB is offline, avoiding application crashes.
*   **🚨 Incident Command Center**: Monitors incoming telemetry streams, matching logs against custom Alert Rules (Admin-only creation/deletion) to auto-trigger incidents.
*   **🔔 In-App Toast Alerts**: Global polling coordinates with backend endpoints, triggering glowing red sliding warning toast notifications immediately on alert rule validation.
*   **🤖 Offline AI Chatbot Navigator**: A floating AI chat assistant parses natural language commands completely offline, routing pages and querying active database statistics.
*   **🔎 Regex Search & Highlight**: Upgraded text explorer supporting raw **Regular Expressions (Regex)**, instantly highlighting substring matches in glowing badges.
*   **📊 SIEM Network Node Visualizer**: An animated active topology map showing floating responsive nodes (`user-dashboard`, `auth-service`, `image-processor`, `payment-gateway`, `billing-engine`) that pulse blue on activity and flash red on errors. Symmetrically aligned with absolute percentage connections.
*   **⚙️ Global Theme Accent Selector**: Elegant settings customizer that shifts console visual accents (Splunk Blue, Cyberpunk Amber, Standard Green, Dracula Purple) globally, persisting state via local storage.
*   **🗑️ Data Retention Policies**: Control panel in Settings allowing operators to prune older database records (wipe all logs, or prune logs older than 5 minutes or 1 hour).
*   **🔒 Complete Security Shields**:
    *   **JWT session validation** protecting retrieval and alert channels.
    *   **BCrypt password hashing** with 10 cryptographic salts.
    *   **Brute-Force Rate Limiting** restricting login attempts (max 5/minute per IP).
    *   **Role-Based Access Control (RBAC)** dividing standard Operators (read-only triage) from Admins (full systems authorization).

---

## 🛠️ Technological Stack

*   **Frontend**: React.js, React Router, Recharts, Lucide Icons, Vanilla CSS Glassmorphism
*   **Backend**: Node.js, Express.js, JWT, BCrypt, Express Rate Limit
*   **Database**: MongoDB (Mongoose ODM) or In-Memory local array backup
*   **Streaming**: Concurrent background telemetry thread generator

---

## 📁 System Architecture Directory Map

```text
├── backend/
│   ├── config/db.js          # Hybrid DB validation & connection handshake
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Bearer validation & Admin RBAC gates
│   │   └── rateLimiter.js    # Brute-force auth rate-limiter middleware
│   ├── models/
│   │   ├── User.js           # BCrypt hashed User operator schema
│   │   ├── Incident.js       # Auto-triggered threat incidents schema
│   │   └── AlertRule.js      # Custom alert rule matrix criteria schema
│   ├── routes/
│   │   ├── authRoutes.js     # User registration, login, profile checks
│   │   ├── alertRoutes.js    # Rules administration and incidents triage
│   │   └── logRoutes.js      # Logs retrieval, statistics, and retentions
│   └── server.js             # Core Express server registration & middleware
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios interface instances (authApi, alertApi, logApi)
│   │   ├── components/
│   │   │   ├── App.jsx       # Route registration, Toast container, global theme state
│   │   │   ├── Login.jsx     # SaaS Auth login/register tab panel with success redirect
│   │   │   ├── Dashboard.jsx # Stat cards, area charts, node visualizer, marquee ticker
│   │   │   ├── LogExplorer.jsx # Regex search, log data tables, prev/next paginations
│   │   │   ├── AlertRules.jsx # Incidents command matrix & modal rule establishers
│   │   │   ├── Settings.jsx  # Retentions pruning console & theme accent selectors
│   │   │   ├── AboutThis.jsx # Blueprint visualizer & detailed pipeline reviews
│   │   │   └── ChatAssistant.jsx # Floating offline AI NLP navigator assistant
│   │   └── index.css         # Cosmic carbon SaaS design stylesheet
```

---

## 🚀 Installation & Local Setup

### Prerequisite
*   **Node.js** (version 16+)
*   **MongoDB** (Optional. Connection is auto-validated; if offline, sandbox database failover takes over automatically).

### Step 1: Start the Backend & Ingestion API
```bash
# Navigate to the backend directory
cd backend

# Install Node dependencies
npm install

# Start the Express server on port 5000
npm run start
```
*   The API server will listen at `http://localhost:5000/`.
*   Pre-seeded Admin account created automatically:
    *   **Username**: `admin`
    *   **Password**: `adminpassword`
    *   **Role**: `admin`

### Step 2: Start the React Frontend Client
```bash
# Open a new terminal in the root and navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start the Vite development client
npm run dev
```
*   The Vite web client will serve at `http://localhost:5173/`.

### Step 3: Run the Telemetry Generator
To stream simulated microservice logs in real-time:
```bash
# Open a new terminal in the root and run the generator
npm run generator
```
*   *(Alternatively, run `npm run dev:all` in the root to launch Backend, Frontend, and Generator concurrently with one command).*

---

## ✅ Live Verification & Testing Steps

To demonstrate the full capability of the SIEM platform to evaluators, complete the following steps:

1.  **Authorize Session (Sign-In Redirect)**:
    *   Navigate to `http://localhost:5173/` and register a new user operator account.
    *   **Verify:** On clicking submit, notice the flow automatically shifts back to the **Sign In** tab, pre-fills your username, and triggers a glowing green registration success banner.
    *   Log in with the pre-seeded admin user details (**admin** / **adminpassword**).
2.  **Symmetric Topology Map & Threat Marquee**:
    *   Open the **Overview** dashboard.
    *   **Verify:** Note the perfectly aligned, symmetrically spaced horizontal columns (15%, 50%, 85%) on the topology map. As the background telemetry streams, watch the nodes pulse blue on activity and flash red on errors.
    *   **Verify:** Observe the chronologically scrolling horizontal ticker marquee cleanly sliding *behind* the static red threat badge at the top.
3.  **Accent Customization & persistence**:
    *   Go to **Settings**. Click **Dracula Purple** or **Cyberpunk Amber** under the accent theme chip card.
    *   **Verify:** All panel borders, settings borders, button glows, and dashboard charts transition instantly. Refresh the browser and verify the theme remains active (persisted in local storage).
4.  **Database Failover Triage**:
    *   Review the status card in settings.
    *   **Verify:** Confirms connection state (Green pulsing dot for Atlas MongoDB, Amber pulsing dot for local offline Sandbox Memory mode).
5.  **Offline AI Chat Assistant**:
    *   Click the chatbot trigger at the bottom right.
    *   Type **`how many logs do we have?`** to query live statistics.
    *   Type **`what is this project?`** or **`go to settings`**.
    *   **Verify:** The bot replies and programmatically redirects your browser page route to the respective view in real-time.
6.  **Regex Substring Highlighter**:
    *   Navigate to **Log Explorer**. Type a Regular Expression query (e.g., `^Database.*` or specific services).
    *   **Verify:** Matching text matches are cleanly compiled and highlighted in glowing red/yellow badges inside table rows.
7.  **Role-Based Access Control (RBAC)**:
    *   Log out and log in with your newly registered Operator account.
    *   **Verify:** Navigate to the **Incident Center**. Notice that the **Create Rule** and rule **Trash** icons are disabled, rendering an administrative tooltip lock.
