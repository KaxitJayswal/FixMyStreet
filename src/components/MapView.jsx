import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import { useIssues } from '../contexts/IssuesContext';

// Custom marker icons for different issue statuses
const getMarkerIcon = (status) => {
  const iconUrls = {
    pending: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    in_progress: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    completed: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
  };

  const iconUrl = iconUrls[status] || iconUrls.pending;
  const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

  return new L.Icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to adjust map view when markers are loaded
const MapBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = markers.map(marker => [marker.latitude, marker.longitude]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [markers, map]);

  return null;
};

const MapView = () => {
  const { fetchMapData } = useIssues();
  const [mapData, setMapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Default center (India - New Delhi)
  const defaultCenter = [28.6139, 77.2090];
  const defaultZoom = 6;

  const loadMapData = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await fetchMapData();
    
    if (result.success) {
      setMapData(result.data);
      console.log('Loaded map data:', result.data);
    } else {
      setError(result.error || 'Failed to load map data');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter markers by status
  const filteredMarkers = selectedStatus === 'all'
    ? mapData
    : mapData.filter(marker => marker.status === selectedStatus);

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return 'Unknown Issue';
    return category
      .replace(/_/g, ' ')
      .replace(/india/gi, '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date
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

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Street Issues Map</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `Showing ${filteredMarkers.length} of ${mapData.length} reports`}
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={loadMapData}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Completed</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Map Container */}
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          className="z-0"
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Auto-fit bounds to markers */}
          {filteredMarkers.length > 0 && <MapBounds markers={filteredMarkers} />}
          
          {/* Render markers */}
          {filteredMarkers.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={getMarkerIcon(issue.status)}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  {/* Image */}
                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={formatCategory(issue.category)}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                      }}
                    />
                  )}
                  
                  {/* Category */}
                  <h3 className="font-bold text-lg mb-2">
                    {formatCategory(issue.category)}
                  </h3>
                  
                  {/* Status Badge */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  {/* Details */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Reported by:</strong> {issue.userName || 'Anonymous'}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(issue.date)}
                    </p>
                    <p>
                      <strong>Location:</strong> {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </p>
                  </div>
                  
                  {/* View on Google Maps */}
                  <a
                    href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* No data message */}
      {!isLoading && filteredMarkers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {selectedStatus === 'all'
            ? 'No reports found. Be the first to report an issue!'
            : `No ${selectedStatus.replace('_', ' ')} reports found.`}
        </div>
      )}
    </div>
  );
};

export default MapView;
