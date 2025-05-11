# 📖 LoreLight

**LoreLight** is a collaborative storytelling and worldbuilding platform that empowers creators to build immersive universes, write narrative arcs, manage characters and lore, and share content with readers through rich, accessible interfaces.

---

## 🚀 Features

### ✍️ Creator Tools
- Create and manage **universes**, **stories**, **chapters**, and **lore**
- Inline editing with auto-saving and immersive writing modes
- Asset support (banners, portraits, voice samples)
- PWA support for offline editing

### 🧠 Reader Experience
- Seamless story playback
- Audio scene rendering per chapter
- Chapter-based bookmarks and highlights (WIP)

### 🔄 Sync + Offline Mode
- LocalStorage fallback with per-user caching
- Offline editing support
- Intelligent sync queue for re-connecting users

### 🧩 Modular Layout System
- Flexible `QLayout` and drawer-based dashboard UIs
- Immersive fullscreen editor modes
- Theme-aware and fully responsive

---

## ⚙️ Tech Stack

- **Vue 3** + **Pinia** for state management
- **Quasar Framework** (SPA + PWA)
- **Supabase** (PostgreSQL + Auth + Storage)
- **Vite** for modern build tooling
- **Lodash** for debounced writing utilities

---

## 📁 Project Structure

src/
├── assets/ # Static themed assets
├── boot/ # Quasar boot files (e.g. supabase, dark-mode)
├── components/ # Reusable components
├── elements/ # Themed inputs, selectors, uploaders
├── layouts/ # Main, Auth, Editor, Universe layouts
├── localStorage/ # Offline storage manager class
├── pages/ # Route-level views
├── router/ # Vue Router configuration
├── stores/ # Pinia stores (user, universes, characters...)
└── utils/ # Notify, parseLore, formatting, etc.

---

## 🛠 Setup Instructions

```bash
# Install dependencies
npm install

# Build for PWA (SPA + offline support)
quasar build -m pwa

# Serve locally
quasar dev
```

🔐 Environment Variables
Create a .env file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```
💡 Development Tips
Use LocalStorageManager for offline-first edits

Supabase table schemas are mapped to consistent local data models

All critical user changes are tracked and can be synced later

🧪 Coming Soon
Timeline editor view for stories

Lore linking visualizer

Collaboration & shared universe editing

Integrated AI tools for writing support

👥 Contributors
@TyNorth – Creator, Designer, Engineer

@contributor – UI / Feedback

📜 License
MIT © TyNorth
