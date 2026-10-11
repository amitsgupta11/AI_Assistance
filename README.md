# 🤖 Nova AI — AI-Powered Chat Assistant

Nova AI is a web-based AI chat assistant built with **React, Vite, Node.js, Express.js, and Groq AI**. It provides an interactive chat interface where users can ask questions and receive AI-generated responses.

🌐 **Live Demo:** [Try Nova AI](https://ai-assistance-kln8brpeg-amitsgupta11s-projects.vercel.app/)

## ✨ Features

- 💬 **AI-Powered Chat** — Get responses to your questions using Groq AI.
- 🎨 **Interactive UI** — A clean, responsive interface built with React.
- ⚡ **Fast Frontend** — Powered by Vite for a fast development and build experience.
- 🔗 **REST API Integration** — Communicates with the backend through an Express.js API.
- 🎙️ **Voice Interaction** — Uses browser speech capabilities for voice input/output, where supported.
- 🔐 **Environment-Based Configuration** — Keeps API credentials on the backend instead of exposing them in frontend code.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5 & CSS3
- Web Speech API

**Backend**
- Node.js
- Express.js
- REST API

**AI Integration & Deployment**
- Groq API
- Vercel — Frontend deployment
- Render — Backend deployment
- Git & GitHub — Version control

## 🏗️ Project Architecture

```text
Nova-AI/
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── server/                 # Node.js + Express backend
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

*Note: The directory structure above is illustrative. Adjust filenames to match your actual repository.*

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amitsgupta11/AI_Assistance.git
cd AI_Assistance
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
CLIENT_URL=http://localhost:5173
```

Get your API key from the [Groq Console](https://console.groq.com/keys).

Start the backend:

```bash
npm start
```

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Secret API key used by the backend to access Groq AI |
| `GROQ_MODEL` | Groq model identifier used for AI responses |
| `PORT` | Port used by the backend server |
| `CLIENT_URL` | Frontend origin allowed by the backend's CORS configuration |
| `VITE_API_URL` | Backend base URL used by the frontend |

**Security:** Never commit your real API key or `.env` files to GitHub. Configure production environment variables in Render and Vercel.

## 🚀 Deployment

- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Render

Live frontend: [Nova AI](https://ai-assistance-kln8brpeg-amitsgupta11s-projects.vercel.app/)

## 🔮 Future Improvements

- Conversation history and persistent chats
- Multiple AI model options
- Improved voice interaction
- Markdown formatting and code highlighting in responses
- User authentication and personalized settings

## 👨‍💻 Author

**Amit Gupta**

- GitHub: [@amitsgupta11](https://github.com/amitsgupta11)
- Project Repository: [AI_Assistance](https://github.com/amitsgupta11/AI_Assistance)

---

⭐ If you find this project interesting, consider giving the repository a star!

*Built with ❤️ by Amit Gupta*
