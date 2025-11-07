# Quick Start Guide - API Integration

## 🚀 Getting Started (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

## 📝 Common Usage Patterns

### Using Authentication

```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login({ 
      email: 'user@example.com', 
      password: 'password123' 
    });
    if (result.success) {
      console.log('Welcome!', result.user);
    } else {
      console.error(result.error);
    }
  };

  // Register
  const handleRegister = async () => {
    const result = await register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user' // or 'admin' with verificationCode
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hello, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Reporting Issues

```javascript
import { useIssues } from './contexts/IssuesContext';

function ReportComponent() {
  const { reportIssue, isLoading } = useIssues();
  const [imageFile, setImageFile] = useState(null);

  const handleReport = async () => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const result = await reportIssue({
        image: imageFile,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      if (result.success) {
        alert(`Issue reported! Category: ${result.issue.category}`);
      }
    });
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])} 
      />
      <button onClick={handleReport} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Report Issue'}
      </button>
    </div>
  );
}
```

### Fetching Issues

```javascript
import { useIssues } from './contexts/IssuesContext';
import { useEffect } from 'react';

function IssuesList() {
  const { issues, fetchIssues, isLoading } = useIssues();

  useEffect(() => {
    fetchIssues(); // Load issues on mount
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {issues.map(issue => (
        <div key={issue._id}>
          <h3>{issue.category}</h3>
          <p>Status: {issue.status}</p>
          <img src={`http://localhost:3000${issue.imageUrl}`} alt={issue.category} />
        </div>
      ))}
    </div>
  );
}
```

### Updating Issue Status (Admin)

```javascript
import { useIssues } from './contexts/IssuesContext';

function AdminPanel({ issueId }) {
  const { updateIssueStatus } = useIssues();

  const handleStatusChange = async (newStatus) => {
    const result = await updateIssueStatus(issueId, newStatus);
    if (result.success) {
      alert('Status updated!');
    }
  };

  return (
    <div>
      <button onClick={() => handleStatusChange('in_progress')}>
        Mark In Progress
      </button>
      <button onClick={() => handleStatusChange('completed')}>
        Mark Completed
      </button>
    </div>
  );
}
```

## 🔑 Key Concepts

### 1. Context Providers
Wrap your app with context providers in `App.jsx`:

```javascript
import { AuthProvider } from './contexts/AuthContext';
import { IssuesProvider } from './contexts/IssuesContext';

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <YourApp />
      </IssuesProvider>
    </AuthProvider>
  );
}
```

### 2. Protected Routes
Check authentication before allowing access:

```javascript
function ProtectedComponent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login to continue</p>;
  }

  return <div>Protected Content</div>;
}
```

### 3. Error Handling
All API calls return `{ success, data/user/issue, error }`:

```javascript
const result = await someApiCall();

if (!result.success) {
  // Handle error
  console.error(result.error);
  showErrorToUser(result.error);
}
```

## 📊 API Response Examples

### Login Response
```json
{
  "success": true,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Report Issue Response
```json
{
  "success": true,
  "issue": {
    "id": "456",
    "category": "pothole_on_road_india",
    "status": "pending",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "imageUrl": "/uploads/image.jpg",
    "confidence": 0.95,
    "createdAt": "2025-11-07T10:00:00.000Z"
  },
  "message": "Street issue reported successfully"
}
```

## 🛠️ Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
**Solution:** Make sure backend is running on `http://localhost:3000`

### Issue: "Authentication required"
**Solution:** User needs to login first. Check `isAuthenticated` state.

### Issue: "Invalid token"
**Solution:** Token might be expired. User needs to login again.

### Issue: Image upload fails
**Solution:** 
- Check file size (max 5MB)
- Check file format (JPG, JPEG, PNG only)
- Ensure Flask AI API is running on port 5000

## 📞 Need Help?

1. Check [FRONTEND_API_INTEGRATION.md](./FRONTEND_API_INTEGRATION.md) for detailed documentation
2. Check [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md) for API documentation
3. Review browser console for error messages

---

**Happy Coding! 🎉**
