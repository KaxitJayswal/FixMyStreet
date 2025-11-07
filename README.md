# FixMyStreet - AI-Powered Street Issue Reporting

A modern, full-stack web application for reporting and tracking street issues like potholes, broken streetlights, and garbage dumps using AI-powered image classification.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![AI](https://img.shields.io/badge/AI-Image%20Classification-orange)

## 🌟 Features

- 🤖 **AI-Powered Detection** - Automatic issue classification using machine learning
- 📍 **GPS Location** - Automatic location detection from device
- 🔐 **Secure Authentication** - JWT-based user authentication
- 👥 **Role-Based Access** - User and Admin roles with verification codes
- 📸 **Image Upload** - Report issues with photo evidence
- 🗺️ **Interactive Map** - View all reported issues on a map
- 📊 **Status Tracking** - Track issue progress (Pending, In Progress, Completed)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

### Frontend
- **Framework:** React 19.1.1 with Vite
- **State Management:** Context API (no Redux needed!)
- **Styling:** Tailwind CSS
- **Maps:** Leaflet & React-Leaflet
- **API Client:** Custom Fetch wrapper

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **AI Classification:** Flask API integration

### AI Service
- **Framework:** Flask (Python)
- **Model:** Custom trained model for street issue classification
- **Categories:** Potholes, Streetlights, Garbage Dumps

## 📁 Project Structure

```
FixMyStreet/
├── src/
│   ├── config/
│   │   └── api.js                 # API configuration
│   ├── utils/
│   │   └── api.js                 # API client
│   ├── contexts/
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── IssuesContext.jsx      # Issues state
│   ├── components/
│   │   ├── LoginForm.jsx          # Login component
│   │   ├── RegisterForm.jsx       # Registration component
│   │   ├── ReportForm.jsx         # Issue reporting component
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── App.jsx                    # Root component
│   └── main.jsx                   # Entry point
├── page/
│   └── HomePage.jsx               # Main page layout
├── public/
├── .env                           # Environment variables
├── package.json
└── Documentation/
    ├── INTEGRATION_SUMMARY.md     # Implementation overview
    ├── FRONTEND_API_INTEGRATION.md # Detailed API guide
    ├── QUICK_START.md             # Quick reference
    ├── ARCHITECTURE.md            # System architecture
    └── TESTING_CHECKLIST.md       # Testing guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Python 3.x (for Flask AI API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FixMyStreet.git
   cd FixMyStreet
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Set up backend** (in separate directory)
   - Install backend dependencies
   - Configure MongoDB connection
   - Set JWT secret
   - Initialize verification codes
   - Start backend server on port 3000

5. **Set up Flask AI API** (in separate directory)
   - Install Flask and dependencies
   - Load classification model
   - Start Flask server on port 5000

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎯 Usage

### For Users

1. **Register an Account**
   - Click "Sign Up"
   - Fill in your details
   - Choose "User" role
   - Submit

2. **Report an Issue**
   - Click "Report Issue"
   - Upload a photo of the street problem
   - Allow location access
   - Add optional notes
   - Submit

3. **Track Issues**
   - View all issues on the map
   - Check status updates
   - Get email notifications

### For Admins

1. **Register as Admin**
   - Select "Admin" role during registration
   - Enter government verification code
   - Complete registration

2. **Manage Issues**
   - View all reported issues
   - Update issue status
   - Mark issues as in-progress or completed

## 🔐 Authentication

### User Registration
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Admin Registration
```javascript
POST /api/auth/register
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin",
  "verificationCode": "GOV123456"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📸 Issue Reporting

### Report Issue with Image
```javascript
POST /api/issues/report
Content-Type: multipart/form-data

{
  image: [file],
  latitude: 12.9716,
  longitude: 77.5946
}
```

**Response:**
```json
{
  "message": "Street issue reported successfully",
  "issue": {
    "id": "...",
    "category": "pothole_on_road_india",
    "status": "pending",
    "imageUrl": "/uploads/image.jpg",
    "confidence": 0.95
  }
}
```

## 🗺️ API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/issues/report` | Report issue | Yes |
| GET | `/api/issues` | Get all issues | No |
| GET | `/api/issues/nearby` | Get nearby issues | No |
| PATCH | `/api/issues/:id/status` | Update status | Yes |
| GET | `/api/verification/check/:code` | Check verification code | No |

## 🧪 Testing

Run the test checklist to ensure everything works:

```bash
# See TESTING_CHECKLIST.md for complete guide
```

**Quick Test:**
1. Register a user
2. Login
3. Report an issue with image
4. Check if issue appears in the list
5. Verify AI classification worked

## 📚 Documentation

- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Complete integration overview
- **[FRONTEND_API_INTEGRATION.md](./FRONTEND_API_INTEGRATION.md)** - Detailed API integration guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for developers
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture diagrams
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing guide
- **[AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)** - Backend API documentation

## 🛠️ Built With

### Frontend
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Leaflet](https://leafletjs.com/) - Maps
- [React Leaflet](https://react-leaflet.js.org/) - React bindings for Leaflet

### Backend
- [Node.js](https://nodejs.org/) - Runtime
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [JWT](https://jwt.io/) - Authentication
- [Multer](https://github.com/expressjs/multer) - File upload

### AI
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [TensorFlow](https://www.tensorflow.org/) / [PyTorch](https://pytorch.org/) - ML frameworks

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend (.env)**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fixmystreet
JWT_SECRET=your-secret-key
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku/AWS/Railway)
- Set environment variables
- Configure MongoDB Atlas
- Deploy backend
- Update frontend VITE_API_BASE_URL

### Flask API
- Deploy to cloud service
- Update backend to use production Flask URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- AI model for street issue classification
- OpenStreetMap for map data
- Community contributors

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation files
- Review API documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Email notifications for status updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] Image compression before upload
- [ ] Bulk issue upload

---

**Made with ❤️ for better communities**
