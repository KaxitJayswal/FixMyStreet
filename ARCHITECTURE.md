# FixMyStreet - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React + Vite)                            │
│                  http://localhost:5173                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    App.jsx                            │   │
│  │              (Root Component)                         │   │
│  └────────────────┬────────────────┬────────────────────┘   │
│                   │                 │                         │
│  ┌────────────────▼────────────┐  ┌▼────────────────────┐   │
│  │      AuthProvider            │  │   IssuesProvider     │   │
│  │   (AuthContext.jsx)          │  │ (IssuesContext.jsx)  │   │
│  │                              │  │                      │   │
│  │  • login()                   │  │  • reportIssue()     │   │
│  │  • register()                │  │  • fetchIssues()     │   │
│  │  • logout()                  │  │  • updateStatus()    │   │
│  │  • user state                │  │  • issues state      │   │
│  └────────────┬─────────────────┘  └──────┬───────────────┘   │
│               │                            │                   │
│  ┌────────────▼────────────────────────────▼───────────────┐  │
│  │              Components Layer                           │  │
│  │                                                          │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐            │  │
│  │  │LoginForm │  │RegisterForm│  │ReportForm│            │  │
│  │  │          │  │            │  │          │            │  │
│  │  │useAuth() │  │useAuth()   │  │useIssues()│           │  │
│  │  └──────────┘  └───────────┘  └──────────┘            │  │
│  │                                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │ Navbar   │  │ HomePage │  │  Footer  │             │  │
│  │  └──────────┘  └──────────┘  └──────────┘             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Client Layer                         │   │
│  │           (src/utils/api.js)                          │   │
│  │                                                        │   │
│  │  • get(endpoint, params)                              │   │
│  │  • post(endpoint, data, isFormData)                   │   │
│  │  • patch(endpoint, data)                              │   │
│  │  • Automatic JWT injection                            │   │
│  │  • Error handling                                     │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (JWT in Authorization header)
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                      BACKEND                                  │
│                 (Node.js + Express)                           │
│                http://localhost:3000                          │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  API Routes                           │   │
│  │                                                        │   │
│  │  POST   /api/auth/register                            │   │
│  │  POST   /api/auth/login                               │   │
│  │  GET    /api/verification/check/:code                 │   │
│  │  POST   /api/issues/report                            │   │
│  │  GET    /api/issues                                   │   │
│  │  GET    /api/issues/nearby                            │   │
│  │  PATCH  /api/issues/:id/status                        │   │
│  │  GET    /uploads/:filename                            │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │            Middleware                                │   │
│  │                                                       │   │
│  │  • JWT Verification                                  │   │
│  │  • Multer (File Upload)                              │   │
│  │  • CORS                                              │   │
│  │  • Body Parser                                       │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │          Controllers/Services                        │   │
│  │                                                       │   │
│  │  • Auth Controller                                   │   │
│  │  • Issues Controller                                 │   │
│  │  • Verification Controller                           │   │
│  └──────┬────────────────────────────────────┬─────────┘   │
│         │                                     │             │
│         │                                     │             │
│  ┌──────▼────────┐                    ┌──────▼────────┐   │
│  │   MongoDB     │                    │  Flask AI API │   │
│  │               │                    │  (port 5000)  │   │
│  │  • Users      │                    │               │   │
│  │  • Issues     │                    │  Image        │   │
│  │  • VerifCodes │                    │  Classification│   │
│  └───────────────┘                    └───────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User fills form → RegisterForm
                      ↓
              useAuth().register()
                      ↓
              AuthContext.register()
                      ↓
          apiClient.post('/api/auth/register')
                      ↓
              Backend validates data
                      ↓
         Checks verification code (if admin)
                      ↓
            Creates user in MongoDB
                      ↓
          Generates JWT token
                      ↓
          Returns { token, user }
                      ↓
      Frontend stores token in localStorage
                      ↓
         Updates AuthContext state
                      ↓
              User logged in ✓
```

### 2. User Login Flow

```
User enters credentials → LoginForm
                              ↓
                      useAuth().login()
                              ↓
                    AuthContext.login()
                              ↓
              apiClient.post('/api/auth/login')
                              ↓
                  Backend validates credentials
                              ↓
                    Generates JWT token
                              ↓
                  Returns { token, user }
                              ↓
          Frontend stores token in localStorage
                              ↓
             Updates AuthContext state
                              ↓
                      User logged in ✓
```

### 3. Issue Reporting Flow

```
User selects image → ReportForm
                          ↓
              Detects GPS location
                          ↓
                useIssues().reportIssue()
                          ↓
              IssuesContext.reportIssue()
                          ↓
            Creates FormData with image
                          ↓
    apiClient.post('/api/issues/report', formData)
    (JWT automatically included in header)
                          ↓
              Backend receives request
                          ↓
          Multer saves image to /uploads
                          ↓
    Backend sends image to Flask AI API
              (http://localhost:5000)
                          ↓
            AI classifies image
    (pothole, streetlight, garbage, etc.)
                          ↓
      Backend saves issue to MongoDB
      with category, location, image path
                          ↓
        Returns { issue, message }
                          ↓
      Frontend updates IssuesContext
                          ↓
          Shows success message
                          ↓
              Issue reported ✓
```

### 4. Fetching Issues Flow

```
Component mounts → useEffect()
                        ↓
              useIssues().fetchIssues()
                        ↓
            IssuesContext.fetchIssues()
                        ↓
          apiClient.get('/api/issues')
                        ↓
          Backend queries MongoDB
                        ↓
            Returns array of issues
                        ↓
        Frontend updates state
                        ↓
          Component renders issues
```

## Context API Structure

```
┌─────────────────────────────────────┐
│          AuthContext                │
├─────────────────────────────────────┤
│ State:                              │
│  • user: Object | null              │
│  • isAuthenticated: boolean         │
│  • isLoading: boolean               │
│  • error: string | null             │
│                                     │
│ Methods:                            │
│  • login(credentials)               │
│  • register(userData)               │
│  • logout()                         │
│  • checkVerificationCode(code)      │
│  • clearError()                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        IssuesContext                │
├─────────────────────────────────────┤
│ State:                              │
│  • issues: Array                    │
│  • isLoading: boolean               │
│  • error: string | null             │
│                                     │
│ Methods:                            │
│  • reportIssue(data)                │
│  • fetchIssues()                    │
│  • fetchNearbyIssues(params)        │
│  • updateIssueStatus(id, status)    │
│  • getImageUrl(path)                │
│  • clearError()                     │
│  • clearIssues()                    │
└─────────────────────────────────────┘
```

## API Client Architecture

```
┌────────────────────────────────────────┐
│         API Client                     │
│      (src/utils/api.js)                │
├────────────────────────────────────────┤
│                                        │
│  Base URL: http://localhost:3000      │
│                                        │
│  Token Management:                     │
│  • getToken()     → localStorage       │
│  • setToken()     → localStorage       │
│  • removeToken()  → localStorage       │
│                                        │
│  Request Methods:                      │
│  • get(endpoint, params)               │
│  • post(endpoint, data, isFormData)    │
│  • patch(endpoint, data)               │
│  • put(endpoint, data)                 │
│  • delete(endpoint)                    │
│                                        │
│  Auto Features:                        │
│  • Adds Authorization header           │
│  • Handles JSON/FormData               │
│  • Parses responses                    │
│  • Error handling                      │
│                                        │
└────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── AuthProvider
│   └── IssuesProvider
│       └── HomePage
│           ├── Navbar
│           │   └── uses: useAuth()
│           │
│           ├── Main Content
│           │   ├── Home Tab
│           │   │   └── Welcome Section
│           │   │
│           │   ├── Map Tab
│           │   │   └── MapContainer (Leaflet)
│           │   │       └── uses: useIssues()
│           │   │
│           │   ├── Reports Tab
│           │   │   └── Issues Table
│           │   │       └── uses: useIssues()
│           │   │
│           │   └── Report Tab
│           │       └── ReportForm
│           │           └── uses: useAuth(), useIssues()
│           │
│           ├── Footer
│           │
│           └── AuthPage (Modal)
│               ├── LoginForm
│               │   └── uses: useAuth()
│               │
│               └── RegisterForm
│                   └── uses: useAuth()
```

## Security Flow

```
1. User authenticates
        ↓
2. Backend generates JWT
        ↓
3. Frontend stores JWT
        ↓
4. Every API request includes JWT
        ↓
5. Backend validates JWT
        ↓
6. Request processed if valid
        ↓
7. Error if invalid/expired
```

## File Upload Flow

```
User selects image file
        ↓
Frontend creates FormData
        ↓
        formData.append('image', file)
        formData.append('latitude', lat)
        formData.append('longitude', lng)
        ↓
POST to /api/issues/report
        ↓
Multer middleware processes upload
        ↓
File saved to /uploads directory
        ↓
Image path stored in database
        ↓
Frontend receives imageUrl
        ↓
Image displayed: <img src="baseUrl + imageUrl" />
```

---

This architecture provides a scalable, maintainable, and secure foundation for the FixMyStreet application!
