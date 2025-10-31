# AI Integration Guide for Fix My Street

This guide explains how to integrate a real AI model for automatic street issue detection in the Report Form.

## Current Implementation

The current implementation in `ReportForm.jsx` uses **simulated AI detection** for demonstration purposes. Users can upload a photo and see how the AI detection would work.

## Required AI Capabilities

Your AI model needs to:

1. **Image Classification**: Detect and classify street issues into categories:
   - Potholes
   - Broken Streetlights
   - Graffiti
   - Fly-tipping
   - Damaged Road Signs
   - Other infrastructure issues

2. **Location Extraction**: Extract GPS coordinates from:
   - Image EXIF metadata (if available)
   - Fall back to device location

## Integration Steps

### Option 1: Using Cloud AI Services

#### Google Cloud Vision API
```javascript
const analyzeImage = async (file) => {
  setIsAnalyzing(true);
  
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('YOUR_BACKEND_API/analyze', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  setDetectedIssue({
    type: result.detectedIssueType,
    confidence: result.confidence
  });
  
  setIsAnalyzing(false);
};
```

#### AWS Rekognition
- Use custom labels trained on street issue images
- Set up Lambda function to process images
- Return classification results

#### Azure Computer Vision
- Train custom vision model with street issue categories
- Use prediction API to classify uploaded images

### Option 2: Custom Trained Model

#### Using TensorFlow.js (Client-side)
```javascript
import * as tf from '@tensorflow/tfjs';

let model;

// Load model on component mount
useEffect(() => {
  const loadModel = async () => {
    model = await tf.loadLayersModel('/models/street-issue-detector/model.json');
  };
  loadModel();
}, []);

const analyzeImage = async (file) => {
  setIsAnalyzing(true);
  
  // Convert image to tensor
  const img = await loadImage(file);
  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();
  
  // Run prediction
  const prediction = await model.predict(tensor);
  const result = prediction.dataSync();
  
  // Map to issue types
  const issueTypes = ['Pothole', 'Broken Streetlight', 'Graffiti', 'Fly-tipping', 'Other'];
  const maxIndex = result.indexOf(Math.max(...result));
  
  setDetectedIssue({
    type: issueTypes[maxIndex],
    confidence: result[maxIndex]
  });
  
  setIsAnalyzing(false);
};
```

#### Using a Backend API
```javascript
const analyzeImage = async (file) => {
  setIsAnalyzing(true);
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch('http://your-api.com/detect-issue', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    setDetectedIssue({
      type: data.issueType,
      confidence: data.confidence
    });
    
    if (data.location) {
      setDetectedLocation({
        lat: data.location.latitude,
        lng: data.location.longitude,
        address: data.location.address
      });
    }
  } catch (error) {
    console.error('AI detection failed:', error);
    // Handle error
  }
  
  setIsAnalyzing(false);
};
```

## Location Extraction

### Extract EXIF GPS Data

Install a library for EXIF extraction:
```bash
npm install exif-js
```

```javascript
import EXIF from 'exif-js';

const extractLocationFromImage = (file) => {
  return new Promise((resolve) => {
    EXIF.getData(file, function() {
      const lat = EXIF.getTag(this, 'GPSLatitude');
      const lng = EXIF.getTag(this, 'GPSLongitude');
      
      if (lat && lng) {
        // Convert to decimal format
        const latitude = convertDMSToDD(lat);
        const longitude = convertDMSToDD(lng);
        
        resolve({ latitude, longitude });
      } else {
        resolve(null);
      }
    });
  });
};

const convertDMSToDD = (dms) => {
  return dms[0] + dms[1]/60 + dms[2]/3600;
};
```

### Reverse Geocoding

Convert coordinates to address:

```javascript
const getAddressFromCoords = async (lat, lng) => {
  // Using OpenStreetMap Nominatim (free)
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await response.json();
  return data.display_name;
  
  // Or using Google Maps Geocoding API
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
  // );
  // const data = await response.json();
  // return data.results[0].formatted_address;
};
```

## Training Your Own Model

### Dataset Requirements
- Collect 1000+ images per category
- Ensure diverse lighting, angles, and conditions
- Label images accurately

### Recommended Frameworks
- **PyTorch** or **TensorFlow** for training
- **MobileNet** or **EfficientNet** for mobile-friendly models
- **YOLO** or **SSD** for object detection (if needed)

### Model Training Steps
1. Collect and label dataset
2. Split into train/validation/test sets
3. Train classification model
4. Export to TensorFlow.js or ONNX format
5. Optimize for web deployment

## Security Considerations

- **Image Size Limits**: Restrict uploads to 10MB
- **File Type Validation**: Only allow image formats (JPEG, PNG)
- **Rate Limiting**: Prevent API abuse
- **Authentication**: Secure your AI endpoint
- **Privacy**: Handle location data responsibly (GDPR compliance)

## Testing

Test your AI integration with:
- Clear, well-lit images
- Poor lighting conditions
- Multiple issues in one image
- Edge cases (no issue present)

## Performance Optimization

- **Compress images** before sending to API
- **Cache model** if using client-side inference
- **Show progress indicators** for long processing
- **Implement retry logic** for failed requests

## Cost Considerations

- Cloud AI APIs charge per request
- Consider batch processing for cost efficiency
- Client-side models are free but require more client resources
- Hybrid approach: simple detection on client, complex on server

## Next Steps

1. Choose your AI approach (cloud vs custom)
2. Set up backend API if needed
3. Replace simulation code in `analyzeImage()` function
4. Test with real images
5. Monitor accuracy and adjust model as needed

## Support

For questions or issues with AI integration, consult:
- TensorFlow.js documentation
- Cloud provider AI documentation
- Computer vision tutorials and courses
