# DevMatch - Find Your Perfect Coding Partner

A platform that connects developers based on their skills, interests, and project preferences to facilitate collaboration and team formation.

## 🚀 Features

- **Profile Creation** – Users create profiles specifying their skills, interests, and project preferences
- **Project Posting & Discovery** – Users can post projects with detailed descriptions and required skill sets
- **Interest-Based Matching** – Developers can indicate interest in projects and get connected to project owners
- **Optional Mutual Matching** – Users can browse developer profiles and match if both parties express interest
- **Tech Tags & Filters** – Match projects and developers based on programming languages, experience, and availability
- **Chat & Collaboration Tools** – In-app messaging for project discussions and planning

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with custom auth system
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Context API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd S63_Hasan_Capstone_DevMatch
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/devmatch
   JWT_SECRET=your_jwt_secret_here
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately:
   npm run dev:frontend  # Frontend on http://localhost:5173
   npm run dev:backend   # Backend on http://localhost:8000
   ```

## 🏗️ Project Structure

```
S63_Hasan_Capstone_DevMatch/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main application component
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── uploads/            # File upload directory
│   └── index.js            # Server entry point
└── package.json            # Root package.json with scripts
```

## 🎨 Components Added

### UI Components
- **Modal** - Reusable modal dialog with transitions
- **LoadingSpinner** - Customizable loading indicator
- **Breadcrumbs** - Navigation breadcrumbs
- **Navbar** - Responsive navigation with user menu
- **Footer** - Site footer with links and social media
- **Layout** - Main layout wrapper

### Core Components
- **ErrorBoundary** - Error handling component
- **ProtectedRoute** - Authentication guard
- **AuthContext** - Authentication state management

## 🔧 Available Scripts

- `npm run install-all` - Install dependencies for all packages
- `npm run dev` - Run both frontend and backend in development
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/matches` - Search for user matches

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get profile details
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile

## 🚀 Deployment

### Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variables: Set `VITE_API_URL` to your backend URL

### Backend (Heroku/Railway)
- Set environment variables in deployment platform
- Ensure MongoDB connection string is configured
- Set `NODE_ENV=production`

## 🔒 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/devmatch
JWT_SECRET=your_secret_key
PORT=8000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [Netlify](https://storied-rabanadas-c9d26b.netlify.app/)
- **Backend API**: Running on localhost:8000
- **Frontend**: Running on localhost:5173

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.