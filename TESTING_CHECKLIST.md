# FixMyStreet - Deployment & Testing Checklist

## ✅ Pre-Deployment Checklist

### Backend Setup
- [ ] Node.js backend server created
- [ ] MongoDB database running
- [ ] Express server configured on port 3000
- [ ] JWT_SECRET set in backend .env
- [ ] CORS enabled for frontend origin
- [ ] Multer configured for file uploads
- [ ] Verification codes initialized (`npm run init-codes`)
- [ ] Backend dependencies installed

### Flask AI API Setup
- [ ] Flask API running on port 5000
- [ ] Image classification model loaded
- [ ] Can classify these categories:
  - pothole_on_road_india
  - broken_streetlight_pole
  - garbage_dump_on_street_india
  - none_of_the_above
- [ ] Accepts POST requests with image file

### Frontend Setup
- [ ] Node modules installed (`npm install`)
- [ ] `.env` file created with VITE_API_BASE_URL
- [ ] All context providers properly wrapped in App.jsx
- [ ] No console errors on startup
- [ ] Dev server runs successfully

## 🧪 Testing Checklist

### Authentication Tests

#### User Registration (Regular User)
- [ ] Can open registration form
- [ ] Can fill in name, email, password
- [ ] Password confirmation validation works
- [ ] Min 6 characters password validation works
- [ ] Form submits successfully
- [ ] User receives JWT token
- [ ] User automatically logged in
- [ ] Token stored in localStorage
- [ ] Can see user name in navbar

#### User Registration (Admin)
- [ ] Can select "Admin" role
- [ ] Verification code field appears
- [ ] Invalid code shows error
- [ ] Valid code allows registration
- [ ] Admin user created successfully

#### User Login
- [ ] Can open login form
- [ ] Can enter email and password
- [ ] Invalid credentials show error
- [ ] Valid credentials login successfully
- [ ] JWT token stored
- [ ] User state updated
- [ ] Can see user name in navbar
- [ ] "Remember me" checkbox works

#### User Logout
- [ ] Logout button visible when logged in
- [ ] Clicking logout clears user state
- [ ] JWT token removed from localStorage
- [ ] Redirected to home page
- [ ] Can no longer access protected features

### Issue Reporting Tests

#### Pre-Requirements
- [ ] User must be logged in to report
- [ ] Redirect to login if not authenticated
- [ ] Report form only accessible when logged in

#### Image Upload
- [ ] Can click "Choose Photo" button
- [ ] Can select image from device
- [ ] Image preview appears
- [ ] Supported formats: JPG, JPEG, PNG
- [ ] File size limit enforced (5MB)
- [ ] Can remove uploaded image
- [ ] Can upload different image

#### Location Detection
- [ ] Browser asks for location permission
- [ ] Location detected if permission granted
- [ ] Default location used if denied
- [ ] Latitude/longitude displayed
- [ ] Location address shown (if available)

#### Form Submission
- [ ] Submit button disabled while uploading
- [ ] Loading spinner shows during submission
- [ ] Image uploaded successfully
- [ ] Backend receives image file
- [ ] Flask AI classifies image
- [ ] Issue category detected correctly
- [ ] Issue saved to database
- [ ] Success message displayed
- [ ] Form resets after submission
- [ ] Can report another issue

#### Error Handling
- [ ] Error shown if no image uploaded
- [ ] Error shown if location not available
- [ ] Error shown if upload fails
- [ ] Error shown if classification fails
- [ ] User can retry after error

### Issues Display Tests

#### Fetch Issues
- [ ] Can view all reported issues
- [ ] Issues load from backend
- [ ] Loading state shows while fetching
- [ ] Issues displayed in list/table
- [ ] Issue images displayed correctly
- [ ] Issue status shown (pending/in_progress/completed)
- [ ] Issue location displayed
- [ ] Issue timestamp shown

#### Map Display
- [ ] Map loads correctly
- [ ] Issues shown as markers on map
- [ ] Click marker shows issue details
- [ ] Issue category displayed in popup
- [ ] Issue status shown in popup
- [ ] Image shown in popup (optional)

#### Nearby Issues
- [ ] Can filter by location
- [ ] Can set search radius
- [ ] Returns only nearby issues
- [ ] Distance calculated correctly

### Admin Features Tests

#### Status Update
- [ ] Admin can see status update buttons
- [ ] Can change status to "In Progress"
- [ ] Can change status to "Completed"
- [ ] Status update reflects in database
- [ ] Status update shows in UI immediately
- [ ] Non-admin users cannot update status

#### View Verification Codes
- [ ] Admin can view verification codes list
- [ ] Shows used/unused status
- [ ] Shows who used each code
- [ ] Regular users cannot access this page

## 🔍 Integration Tests

### API Communication
- [ ] Frontend successfully connects to backend
- [ ] JWT token sent in Authorization header
- [ ] CORS headers work correctly
- [ ] File upload works with FormData
- [ ] Error responses handled properly
- [ ] Network errors caught and displayed

### State Management
- [ ] AuthContext state updates correctly
- [ ] IssuesContext state updates correctly
- [ ] State persists across page refreshes
- [ ] Multiple components can access state
- [ ] State changes trigger re-renders
- [ ] No unnecessary re-renders

### Security
- [ ] JWT expires after 24 hours
- [ ] Expired tokens trigger re-login
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Passwords not stored in localStorage
- [ ] Images served from backend securely

## 📱 Responsive Design Tests

### Mobile (< 640px)
- [ ] Navigation menu works on mobile
- [ ] Forms are readable and usable
- [ ] Images display properly
- [ ] Map is accessible
- [ ] Buttons are touch-friendly
- [ ] No horizontal scrolling

### Tablet (640px - 1024px)
- [ ] Layout adapts to tablet size
- [ ] Touch interactions work
- [ ] Forms are well-spaced
- [ ] Map is usable

### Desktop (> 1024px)
- [ ] Full layout displays correctly
- [ ] Images are high quality
- [ ] Forms are centered and readable
- [ ] Map has good aspect ratio

## 🚀 Performance Tests

- [ ] Initial page load < 3 seconds
- [ ] Image upload completes < 10 seconds
- [ ] API responses < 2 seconds
- [ ] No memory leaks in long sessions
- [ ] Images optimized for web
- [ ] No excessive API calls

## 🔒 Security Tests

- [ ] XSS protection enabled
- [ ] CSRF protection for forms
- [ ] Input validation on frontend
- [ ] Input validation on backend
- [ ] File upload restrictions enforced
- [ ] SQL injection protected (MongoDB)
- [ ] JWT secret is secure
- [ ] Environment variables not exposed

## 📊 Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## 🐛 Error Scenarios

- [ ] Backend server offline
- [ ] Flask API offline
- [ ] MongoDB connection lost
- [ ] Invalid JWT token
- [ ] Expired JWT token
- [ ] Large file upload (> 5MB)
- [ ] Invalid image format
- [ ] Network timeout
- [ ] CORS errors
- [ ] Duplicate email registration

## 📝 Final Checks

- [ ] README.md updated with setup instructions
- [ ] Environment variables documented
- [ ] API documentation complete
- [ ] Code comments added
- [ ] No console.log statements in production
- [ ] Error messages are user-friendly
- [ ] Success messages are clear
- [ ] Loading states everywhere
- [ ] All forms have validation

## 🎯 Production Readiness

- [ ] Environment variables for production URLs
- [ ] API base URL configurable
- [ ] Build script works (`npm run build`)
- [ ] Production build optimized
- [ ] Assets properly bundled
- [ ] Source maps enabled for debugging
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)

## 📦 Deployment Steps

### Backend Deployment
1. [ ] Deploy to hosting service (Heroku, AWS, etc.)
2. [ ] Set production environment variables
3. [ ] Configure MongoDB Atlas or cloud DB
4. [ ] Set up CORS for production domain
5. [ ] Test all endpoints in production

### Flask AI API Deployment
1. [ ] Deploy to cloud service
2. [ ] Configure production URL
3. [ ] Test classification endpoint
4. [ ] Set up monitoring

### Frontend Deployment
1. [ ] Update VITE_API_BASE_URL to production
2. [ ] Run `npm run build`
3. [ ] Deploy to hosting (Vercel, Netlify, etc.)
4. [ ] Configure custom domain (optional)
5. [ ] Test all features in production
6. [ ] Set up SSL certificate

## ✅ Sign-off

- [ ] All tests passed
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Team reviewed
- [ ] Ready for production

---

**Testing Date:** ______________  
**Tested By:** ______________  
**Sign-off:** ______________

**Notes:**
_______________________________________
_______________________________________
_______________________________________
