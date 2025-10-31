import React, { useState } from 'react';

function ReportForm() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedIssue, setDetectedIssue] = useState(null);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simulated AI detection function (replace with actual AI API call)
  // TODO: Integrate with actual AI model API
  // Example AI services: Google Cloud Vision API, AWS Rekognition, Azure Computer Vision
  // or a custom trained model for street issue detection
  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    
    // TODO: Replace this simulation with actual API call
    // Example:
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await fetch('YOUR_AI_API_ENDPOINT', {
    //   method: 'POST',
    //   body: formData
    // });
    // const result = await response.json();
    // setDetectedIssue({ type: result.detectedType, confidence: result.confidence });
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI detection results
    const mockDetections = [
      { type: 'Pothole', confidence: 0.95 },
      { type: 'Broken Streetlight', confidence: 0.88 },
      { type: 'Graffiti', confidence: 0.92 },
      { type: 'Fly-tipping', confidence: 0.87 },
      { type: 'Damaged Road Sign', confidence: 0.90 }
    ];
    
    const randomDetection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
    
    setDetectedIssue(randomDetection);
    
    // Try to get location from image EXIF data or device GPS
    // TODO: In production, extract GPS from image EXIF data first
    // Libraries like 'exif-js' or 'piexifjs' can help extract EXIF data
    // If no EXIF GPS data, fall back to device location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: Use reverse geocoding API to get actual address
          // Example: Google Maps Geocoding API, OpenStreetMap Nominatim
          setDetectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Location detected from device' // Replace with actual address
          });
        },
        () => {
          setDetectedLocation({
            lat: 51.505,
            lng: -0.09,
            address: 'Location not available - using default'
          });
        }
      );
    }
    
    setIsAnalyzing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Analyze image with AI
      analyzeImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setSubmitSuccess(true);
    setTimeout(() => {
      setUploadedImage(null);
      setImagePreview(null);
      setDetectedIssue(null);
      setDetectedLocation(null);
      setAdditionalNotes('');
      setEmail('');
      setSubmitSuccess(false);
      setIsSubmitting(false);
    }, 3000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setDetectedIssue(null);
    setDetectedLocation(null);
    setAdditionalNotes('');
    setSubmitSuccess(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 text-center">
          Report a Street Issue with AI
        </h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8">
          Simply upload a photo - our AI will automatically detect the issue type and location
        </p>

        {submitSuccess ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 sm:p-8 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Report Submitted Successfully!</h3>
            <p className="text-gray-700">Thank you for helping improve our community. You'll receive updates via email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
              {!imagePreview ? (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm sm:text-base font-medium text-gray-900">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-1 block text-xs sm:text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-upload').click()}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Choose Photo
                    </button>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden max-w-md mx-auto">
                    <img src={imagePreview} alt="Uploaded" className="w-full h-auto" />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Results */}
            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-blue-700 font-medium">Analyzing image with AI...</p>
                <p className="text-blue-600 text-sm mt-2">Detecting issue type and extracting location data</p>
              </div>
            )}

            {detectedIssue && !isAnalyzing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Detected Issue */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">Detected Issue</h3>
                      <p className="text-lg font-bold text-green-700">{detectedIssue.type}</p>
                      <p className="text-sm text-green-600 mt-1">
                        Confidence: {(detectedIssue.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detected Location */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">Location Detected</h3>
                      {detectedLocation ? (
                        <>
                          <p className="text-sm text-green-700">{detectedLocation.address}</p>
                          <p className="text-xs text-green-600 mt-1">
                            {detectedLocation.lat.toFixed(4)}, {detectedLocation.lng.toFixed(4)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-green-600">Extracting location...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {detectedIssue && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Add any additional details about the issue..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email for Updates (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
                  >
                    Upload Different Photo
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Report...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>• Take or upload a clear photo of the street issue</li>
            <li>• Our AI automatically detects the type of problem</li>
            <li>• Location is extracted from the photo's metadata</li>
            <li>• Review the details and submit your report</li>
            <li>• Local authorities will be notified immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReportForm;
