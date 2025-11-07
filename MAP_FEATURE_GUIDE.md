# Map Feature Integration Guide

## Overview
The map feature displays all reported street issues with color-coded markers based on their status. This guide explains the implementation and usage.

## API Endpoint Used

**Endpoint:** `GET /api/issues/map`

**Description:** Retrieves all reports formatted for map display with coordinates and markers.

**Response Format:**
```json
[
  {
    "id": "690cc46a3209aa5f13750922",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "category": "pothole_on_road_india",
    "status": "pending",
    "userName": "John Doe",
    "date": "2025-11-06T15:53:14.957Z",
    "imageUrl": "/uploads/1762444382919-73360770.jpg"
  }
]
```

## Components Created

### 1. MapView Component (`src/components/MapView.jsx`)

**Features:**
- **Color-coded Markers**: Different colors for different statuses
  - 🔴 Red = Pending
  - 🟡 Orange = In Progress
  - 🟢 Green = Completed
  
- **Status Filter**: Dropdown to filter issues by status
  - All Status
  - Pending
  - In Progress
  - Completed

- **Auto-fit Bounds**: Map automatically zooms to show all markers

- **Rich Popups**: Each marker shows:
  - Issue image
  - Category name (formatted)
  - Status badge
  - Reporter name
  - Report date
  - Coordinates
  - "View on Google Maps" link

- **Refresh Button**: Manually reload map data

- **Statistics**: Shows count of filtered vs. total reports

### 2. Custom Marker Icons

Teardrop-shaped markers with inner circles:
```javascript
const createCustomIcon = (status) => {
  const colors = {
    pending: '#EF4444',      // Red
    in_progress: '#F59E0B',  // Orange
    completed: '#10B981'     // Green
  };
  // Returns custom Leaflet DivIcon
};
```

### 3. Auto-fit Component

Automatically adjusts map view to fit all visible markers:
```javascript
const MapBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers]);
};
```

## Context Integration

### Added to IssuesContext

```javascript
const fetchMapData = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_MAP_DATA);
  // Returns formatted data with full image URLs
  return { success: true, data: mapData };
};
```

### Added to API Config

```javascript
GET_MAP_DATA: '/api/issues/map'
```

## Usage

### In HomePage

```jsx
import MapView from '../src/components/MapView';

// In render:
{activeTab === 'map' && (
  <MapView />
)}
```

The MapView component is self-contained and handles:
- Data fetching
- Loading states
- Error handling
- Filtering
- Map rendering

## Features Breakdown

### 1. Data Loading
- Fetches on component mount
- Shows loading indicator
- Handles errors gracefully
- Manual refresh available

### 2. Filtering
- Filter by status using dropdown
- Updates marker count dynamically
- No data message when filtered results are empty

### 3. Map Interaction
- Click markers to see details
- Popup shows full information
- Click "View on Google Maps" to open in new tab
- Smooth zoom to fit all markers

### 4. Responsive Design
- Mobile-friendly layout
- Adaptive map height
- Touch-friendly popups
- Responsive filters and controls

### 5. Error Handling
- Network errors shown in red banner
- Image fallback for missing images
- Graceful handling of missing data

## Styling

### Marker Colors
```javascript
pending: '#EF4444'      // Tailwind red-500
in_progress: '#F59E0B'  // Tailwind yellow-500
completed: '#10B981'    // Tailwind green-500
```

### Status Badges
```javascript
pending: 'bg-red-100 text-red-800'
in_progress: 'bg-yellow-100 text-yellow-800'
completed: 'bg-green-100 text-green-800'
```

## Data Formatting

### Category Display
```javascript
// Input: "pothole_on_road_india"
// Output: "Pothole On Road"

const formatCategory = (category) => {
  return category
    .replace(/_/g, ' ')
    .replace(/india/gi, '')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
```

### Date Display
```javascript
// Input: "2025-11-06T15:53:14.957Z"
// Output: "Nov 6, 2025, 03:53 PM"

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

## Testing

### 1. Test with No Data
- Empty map message displays
- No errors in console

### 2. Test with Multiple Statuses
- Apply different filters
- Verify marker colors
- Check count updates

### 3. Test Marker Interaction
- Click each marker
- Verify popup content
- Test Google Maps link

### 4. Test Refresh
- Click refresh button
- Verify data reloads
- Check loading state

### 5. Test Responsive Design
- Resize browser window
- Test on mobile viewport
- Check touch interactions

## Dependencies

Required packages (already installed):
- `react-leaflet` - React wrapper for Leaflet
- `leaflet` - Map library

## Common Issues

### 1. Markers Not Showing
**Solution**: Check that:
- Backend is returning data with latitude/longitude
- Image URLs are properly formatted
- No CORS issues

### 2. Map Not Centering
**Solution**: 
- MapBounds component requires at least 1 marker
- Default center is New Delhi (28.6139, 77.2090)

### 3. Images Not Loading
**Solution**:
- Check VITE_API_BASE_URL in .env
- Verify image paths from backend
- Check browser console for 404 errors

### 4. Filter Not Working
**Solution**:
- Check status values match exactly: 'pending', 'in_progress', 'completed'
- Case-sensitive matching

## Future Enhancements

Potential improvements:
1. **Clustering**: Group nearby markers when zoomed out
2. **Search**: Search by location or category
3. **Date Range Filter**: Filter by report date
4. **User Filter**: Show only your reports
5. **Drawing Tools**: Draw area to find issues within
6. **Export**: Export filtered results as CSV/JSON
7. **Heatmap**: Show density of issues in areas
8. **Real-time Updates**: WebSocket for live marker updates

## Performance

- Map loads all markers at once (fine for < 1000 markers)
- For larger datasets, consider:
  - Marker clustering
  - Server-side filtering
  - Pagination
  - Viewport-based loading

---

**Last Updated**: November 7, 2025
**Status**: ✅ Fully Implemented and Tested
