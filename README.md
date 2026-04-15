# 🌙 LUNA – AI ChatBot 🤖💬

Welcome to **LUNA**, your friendly, futuristic AI ChatBot — smart enough to chat, cool enough to vibe! 😎✨  
Built with ❤️ using **React**, **Node.js**, and a sprinkle of **AI magic**, LUNA is designed to give intelligent, fast, and fun conversational experiences.

---

## 🚀 Features

🔥 **Interactive UI** – Sleek and responsi

https://github.com/user-attachments/assets/f2108ba3-e005-4304-bbbe-8f1bd088291a

ve design powered by TailwindCSS  
🧠 **Smart Conversations** – Handles dynamic responses using intelligent string matching  
💬 **Message Bubbles** – Clean chat layout with glowing user & bot message effects  
🌈 **Animated Intro** – Smooth looping “Hi, I’m LUNA / AI” text animation  
⚡ **Real-time Typing & Responses** – Instant feedback to user inputs  
🎨 **Customizable Themes** – Easily change colors, shadows, and glow styles  
📱 **Fully Responsive** – Works beautifully on both desktop and mobile  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| 🖥️ Frontend | React.js (Vite) |




| 🎨 Styling | Tailwind CSS + Custom CSS |
| 🧠 Logic | JavaScript + Context API / Store |
| 🎵 UI Enhancements | Framer Motion (animations) |
| 🪄 Optional | String-similarity, Toast notifications, etc. |

---

## 🏗️ Project Structure


frontend/
├── src/
│ ├── components/
│ │ ├── Bot.jsx # Main chat UI
│ │ ├── MessageInput.jsx# Input + send functionality
│ │ └── ...other files
│ ├── store/
│ │ └── useChatStore.js # Handles message state
│ ├── hooks/
│ │ └── useKeyboardSound.js # Optional sound effect
│ ├── index.css # Global + custom CSS animations
│ ├── App.jsx # Entry point for LUNA UI
│ └── main.jsx # React root
└── package.json

---

## 🪄 Cool UI Animations

### 👋 Welcome Animation
LUNA greets you with a looping text:
Hi, I'm LUNA 👩‍🚀
Hi, I'm AI 🤖
Animated with smooth transitions using CSS or Framer Motion.

### 💡 Message Shadows
- **User message** → Blue glow (`shadow-blue-500/50`)
- **Bot message** → Greenish-gray glow (`shadow-green-300/30`)
- Optional glass effect using custom CSS.

---

## ⚙️ Installation & Setup

Clone the repo:
```bash
git clone https://github.com/yourusername/LUNA-AI-ChatBot.git



## Deploy backend on Railway and frontend on Vercel

### 1) Deploy backend to Railway
- Create a new Railway project from this repo.
- Set **Root Directory** to `backend`.
- Add environment variable:
  - `MONGO_URI=your_mongodb_connection_string`
- Railway will run `npm start` (configured in `backend/package.json`).
- After deploy, copy backend URL (example: `https://your-app.up.railway.app`).

### 2) Redeploy frontend to Vercel
- Keep Vercel pointed to this repo (or set root to `frontend`).
- Add frontend env var in Vercel:
  - `VITE_API_BASE_URL=https://your-app.up.railway.app`
- Redeploy the project from Vercel dashboard.

### 3) Local development
- Backend local: `cd backend && npm run dev`
- Frontend local: `cd frontend && npm run dev`
- Frontend will use:
  - `VITE_API_BASE_URL` when provided
  - otherwise fallback `http://localhost:4002`

