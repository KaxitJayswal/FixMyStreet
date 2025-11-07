# FixMyStreet Frontend - API Integration Guide

This guide explains how the FixMyStreet frontend is integrated with the backend API using React Context API.

## 📁 Project Structure

```
src/
├── config/
│   └── api.js                 # API endpoints and base URL configuration
├── utils/
│   └── api.js                 # API client with fetch wrapper
├── contexts/
│   ├── AuthContext.jsx        # Authentication state management
│   └── IssuesContext.jsx      # Street issues state management
├── components/
│   ├── LoginForm.jsx          # Login form (uses AuthContext)
│   ├── RegisterForm.jsx       # Registration form (uses AuthContext)
│   ├── ReportForm.jsx         # Issue reporting form (uses IssuesContext)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ...
└── App.jsx                    # Root component with Context Providers
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will run on `http://localhost:5173` by default.

## 🌐 API Integration

### API Client (`src/utils/api.js`)

A custom API client using the Fetch API with the following features:

- Automatic JWT token management (stored in localStorage)
- Authorization header injection
- Error handling and response parsing
- Support for JSON and FormData requests

**Example Usage:**

```javascript
import apiClient from '../utils/api';

// GET request
const data = await apiClient.get('/api/issues');

// POST request (JSON)
const result = await apiClient.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// POST request (FormData)
const formData = new FormData();
formData.append('image', file);
const response = await apiClient.post('/api/issues/report', formData, true);
```

## 📦 Context API Implementation

### 1. AuthContext (`src/contexts/AuthContext.jsx`)

Manages authentication state and user data.

**Features:**
- User registration (with admin verification code support)
- User login
- User logout
- JWT token management
- Persistent authentication state
- Verification code validation

**Hook Usage:**

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      console.log('Logged in:', result.user);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

**Available Methods:**

| Method | Parameters | Description |
|--------|-----------|-------------|
| `login(credentials)` | `{ email, password }` | Authenticate user |
| `register(userData)` | `{ email, password, name, role?, verificationCode? }` | Register new user |
| `logout()` | - | Log out current user |
| `checkVerificationCode(code)` | `code: string` | Validate admin verification code |
| `clearError()` | - | Clear error state |

**State Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `Object \| null` | Current user data |
| `isAuthenticated` | `boolean` | Authentication status |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |

### 2. IssuesContext (`src/contexts/IssuesContext.jsx`)

Manages street issues data and operations.

**Features:**
- Report new issues with image upload
- Fetch all issues
- Fetch nearby issues
- Update issue status
- Image URL generation

**Hook Usage:**

```javascript
import { useIssues } from '../contexts/IssuesContext';

function MyComponent() {
  const { 
    issues, 
    isLoading, 
    reportIssue, 
    fetchIssues, 
    updateIssueStatus 
  } = useIssues();

  const handleReport = async () => {
    const result = await reportIssue({
      image: imageFile,
      latitude: 12.9716,
      longitude: 77.5946
    });
    
    if (result.success) {
      console.log('Issue reported:', result.issue);
    }
  };

  return (
    <div>
      {isLoading ? <p>Loading...</p> : <IssuesList issues={issues} />}
    </div>
  );
}
```

**Available Methods:**

| Method | Parameters | Description |
|--------|-----------|-------------|
| `reportIssue(issueData)` | `{ image: File, latitude: number, longitude: number }` | Report new street issue |
| `fetchIssues()` | - | Get all issues |
| `fetchNearbyIssues(params)` | `{ latitude, longitude, radius? }` | Get nearby issues |
| `updateIssueStatus(issueId, status)` | `issueId: string, status: string` | Update issue status |
| `getImageUrl(imagePath)` | `imagePath: string` | Get full URL for image |
| `clearError()` | - | Clear error state |
| `clearIssues()` | - | Clear issues array |

**State Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `issues` | `Array` | List of street issues |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |

## 🎯 Component Integration Examples

### Login Form

```javascript
import { useAuth } from '../contexts/AuthContext';

function LoginForm({ onLogin }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    
    if (result.success) {
      onLogin(result.user);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Register Form

```javascript
import { useAuth } from '../contexts/AuthContext';

function RegisterForm({ onRegister }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    verificationCode: '' // Required for admin registration
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    
    if (result.success) {
      onRegister(result.user);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Report Form

```javascript
import { useIssues } from '../contexts/IssuesContext';
import { useAuth } from '../contexts/AuthContext';

function ReportForm() {
  const { reportIssue } = useIssues();
  const { isAuthenticated } = useAuth();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to report an issue');
      return;
    }

    const result = await reportIssue({
      image,
      latitude: location.lat,
      longitude: location.lng
    });
    
    if (result.success) {
      alert('Issue reported successfully!');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🔐 Authentication Flow

1. **User Registration:**
   - User fills registration form
   - Frontend sends request to `/api/auth/register`
   - Backend validates and creates user
   - JWT token returned and stored in localStorage
   - User state updated in AuthContext

2. **User Login:**
   - User fills login form
   - Frontend sends request to `/api/auth/login`
   - Backend validates credentials
   - JWT token returned and stored in localStorage
   - User state updated in AuthContext

3. **Protected Requests:**
   - API client automatically includes JWT token in Authorization header
   - Backend validates token for protected endpoints

4. **User Logout:**
   - JWT token removed from localStorage
   - User state cleared in AuthContext

## 📸 Issue Reporting Flow

1. **Image Upload:**
   - User selects/captures image
   - Image preview shown
   - Location detected from device GPS

2. **Form Submission:**
   - FormData created with image and coordinates
   - Request sent to `/api/issues/report`
   - Backend processes image with AI classification
   - Issue saved to database with detected category

3. **Response Handling:**
   - Success: Issue added to local state
   - Error: Error message displayed to user

## 🗺️ Issue Categories

The backend AI classifies images into these categories:

- `pothole_on_road_india`
- `broken_streetlight_pole`
- `garbage_dump_on_street_india`
- `none_of_the_above`

## 🔄 Status Values

Issues can have the following statuses:

- `pending` - Newly reported
- `in_progress` - Being worked on
- `completed` - Resolved

## 🚨 Error Handling

All API calls return a standard response format:

```javascript
{
  success: boolean,
  data?: any,
  error?: string
}
```

**Example:**

```javascript
const result = await login({ email, password });

if (result.success) {
  console.log('User:', result.user);
} else {
  console.error('Error:', result.error);
}
```

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

## 📝 Notes

1. **Token Storage:** JWT tokens are stored in localStorage for persistence
2. **Auto-Login:** Users are automatically logged in if a valid token exists
3. **Image Classification:** The backend uses a Flask AI API for image classification
4. **Location Detection:** Uses browser's Geolocation API
5. **Admin Registration:** Requires a government verification code

## 🔗 Backend Requirements

The backend must be running on `http://localhost:3000` (or the URL specified in `.env`).

Required backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/issues/report`
- `GET /api/issues`
- `GET /api/issues/nearby`
- `PATCH /api/issues/:id/status`
- `GET /api/verification/check/:code`

## 🧪 Testing

To test the integration:

1. Start the backend server (Node.js + MongoDB)
2. Start the Flask AI classification API on port 5000
3. Start the frontend dev server: `npm run dev`
4. Navigate to `http://localhost:5173`
5. Register/login and try reporting an issue

## 📚 Additional Resources

- [API Documentation](./AI_INTEGRATION_GUIDE.md)
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🤝 Contributing

When adding new API endpoints:

1. Add endpoint to `src/config/api.js`
2. Create/update context provider if needed
3. Update components to use the new functionality
4. Update this documentation

---

**Last Updated:** November 7, 2025
