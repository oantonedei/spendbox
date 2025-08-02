# SpendBox

SpendBox is an AI-powered, full-stack PWA for real-time expense tracking, multimodal input (text, photo, voice), and actionable financial insights. Built with React, TypeScript, Express, and MongoDB.

---

## Features
- **Real-time expense tracking** with instant prompts
- **Multimodal input**: text, photo (OCR), voice
- **AI-driven categorization** and insights
- **PWA**: offline support, push notifications, installable
- **Bank integration** via Plaid
- **Charts, analytics, and export**
- **Social & shared wallets**
- **Freemium & premium plans**

---

## Monorepo Structure
```
spendbox/
  frontend/   # React PWA (TypeScript)
  backend/    # Express API (TypeScript, MongoDB)
```

---

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or Atlas)

---

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd spendbox
```

---

## 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

**Note**: If you encounter dependency conflicts, try:
```bash
npm install --legacy-peer-deps
```

---

## 3. Environment Variables
- Copy and configure environment files:

```bash
cp backend/env.example backend/.env
cp frontend/.env.example frontend/.env
```
- Edit `.env` files with your secrets (MongoDB URI, Plaid, OpenAI, etc.)

---

## 4. Running the App (Development)
### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm start
```

Or, from the root (if using workspaces):
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000

---

## 5. Build for Production
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

---

## 6. PWA Features
- Installable on mobile/desktop
- Offline support (service worker)
- Push notifications
- Camera and microphone access (for receipts/voice)

---

## 7. Testing
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

---

## 8. Linting & Formatting
- Backend: `cd backend && npm run lint`
- Frontend: `cd frontend && npm run lint`

---

## 9. Deployment
- Deploy backend to services like Heroku, Render, Railway, or your own VPS
- Deploy frontend to Vercel, Netlify, or static hosting
- Set environment variables for production

---

## 10. Configuration & Customization
- Update PWA icons and manifest in `frontend/public/`
- Adjust backend `.env` for production secrets
- Integrate with your own Plaid, OpenAI, and email credentials

---

## License
MIT

---

## Contact
For support or questions, open an issue or contact the SpendBox team.
