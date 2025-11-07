# Image Upload Troubleshooting Guide

## Issue: Images not uploading when using IP address (http://10.93.199.109:3000)

### Frontend Changes Made

1. **Enhanced Logging in `src/utils/api.js`**
   - Logs POST request URL, headers, and data type
   - Logs response status
   - Better error handling

2. **File Validation in `src/contexts/IssuesContext.jsx`**
   - Max file size: 5MB
   - Allowed types: JPG, JPEG, PNG
   - Logs file details and FormData entries

3. **Better Error Messages in `src/components/ReportForm.jsx`**
   - Validates file type before upload
   - Validates file size before upload
   - Shows user-friendly error messages

4. **Fixed `.env` file**
   - Removed extra space in `VITE_API_BASE_URL`

### Testing Steps

1. **Restart Development Server** (IMPORTANT!)
   ```powershell
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```
   *Note: Vite requires restart to pick up .env changes*

2. **Open Browser Console** (F12)
   - Go to Console tab
   - Clear previous logs

3. **Try Uploading an Image**
   - Select a JPG/PNG image under 5MB
   - Check console for detailed logs

### What to Look For in Console

#### Success Case:
```
Image selected: {name: "pothole.jpg", type: "image/jpeg", size: "2.34 MB"}
Validating file: pothole.jpg (image/jpeg, 2.34 MB)
File validation passed
FormData created with entries:
  image [object File]
  latitude 28.6139
  longitude 77.2090
POST Request: {url: "http://10.93.199.109:3000/api/issues/report", ...}
Response Status: 201
```

#### Common Error Cases:

**1. CORS Error**
```
Access to fetch at 'http://10.93.199.109:3000/api/issues/report' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Solution**: Backend needs CORS configuration:
```javascript
// In your backend server.js or app.js
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'http://10.93.199.109:5173'], // Add frontend URLs
  credentials: true
}));
```

**2. Network Error**
```
POST Request: {...}
TypeError: Failed to fetch
```
**Solutions**:
- Check backend server is running on http://10.93.199.109:3000
- Check firewall allows connections to port 3000
- Try accessing http://10.93.199.109:3000/api/health in browser

**3. 413 Payload Too Large**
```
Response Status: 413
```
**Solution**: Backend needs to increase file size limit:
```javascript
// In backend
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// For multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

**4. 400 Bad Request**
```
Response Status: 400
```
**Possible causes**:
- Backend expects different field names
- Missing required fields
- Check FormData entries in console match backend expectations

**5. File Type Error (Frontend)**
```
Please upload only JPG, JPEG, or PNG images
```
**Solution**: Only use JPG, JPEG, or PNG images

**6. File Size Error (Frontend)**
```
Image size must be less than 5MB
```
**Solution**: Compress or resize image before uploading

### Backend Verification Checklist

On the backend server (http://10.93.199.109:3000), verify:

1. **Server is Running**
   ```bash
   curl http://10.93.199.109:3000/api/health
   ```

2. **CORS Configuration**
   - Check if CORS middleware is installed: `npm list cors`
   - Verify CORS origin includes your frontend URL
   - Check CORS credentials option if using cookies/auth

3. **Multer Configuration**
   ```javascript
   // Should accept 'image' field
   upload.single('image')
   
   // Check file size limits
   limits: { fileSize: 10 * 1024 * 1024 }
   ```

4. **Route Handler**
   ```javascript
   router.post('/report', authMiddleware, upload.single('image'), async (req, res) => {
     console.log('Received file:', req.file);
     console.log('Received body:', req.body);
     // ...
   });
   ```

5. **File Storage Directory**
   - Verify `uploads/` directory exists
   - Check write permissions

### Network Configuration

If using IP addresses across devices:

1. **Firewall Rules**
   - Allow inbound connections on port 3000 (backend)
   - Allow inbound connections on port 5173 (frontend, if accessing from another device)

2. **Windows Firewall** (if backend on Windows)
   ```powershell
   # Add firewall rule for port 3000
   New-NetFirewallRule -DisplayName "FixMyStreet Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

3. **Access from Same Device**
   - Backend: http://10.93.199.109:3000
   - Frontend: http://10.93.199.109:5173 or http://localhost:5173

### Quick Debug Script

Add this to your backend to log all incoming requests:

```javascript
// In backend server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});
```

### Environment Variables

Make sure your `.env` file is correct:

```properties
VITE_API_BASE_URL=http://10.93.199.109:3000
```

**Remember**: After changing `.env`, restart the dev server!

### Still Not Working?

If you've tried everything above:

1. **Check Browser Network Tab**
   - F12 → Network tab
   - Try upload
   - Click on the failed request
   - Check Headers, Payload, and Response

2. **Try with Postman/Insomnia**
   - Create POST request to http://10.93.199.109:3000/api/issues/report
   - Set Content-Type to `multipart/form-data`
   - Add `image` file field
   - Add `latitude` and `longitude` fields
   - If this works, issue is in frontend code

3. **Check Backend Logs**
   - Look for errors when request arrives
   - Check if multer is processing file
   - Verify authentication middleware

### Contact Information

If issue persists, provide:
- Browser console logs (full output)
- Network tab screenshot
- Backend console logs
- Any error messages

---

**Last Updated**: [Current Date]
**Status**: Debugging in progress
