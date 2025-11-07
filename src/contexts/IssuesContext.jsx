import React, { createContext, useContext, useState, useCallback } from 'react';
import apiClient from '../utils/api';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const IssuesContext = createContext(null);

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};

export const IssuesProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Report a new street issue
   * @param {Object} issueData - Issue data
   * @param {File} issueData.image - Image file
   * @param {number} issueData.latitude - Latitude coordinate
   * @param {number} issueData.longitude - Longitude coordinate
   */
  const reportIssue = async (issueData) => {
    try {
      setError(null);
      setIsLoading(true);

      // Validate image file
      if (!issueData.image || !(issueData.image instanceof File)) {
        throw new Error('Invalid image file');
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (issueData.image.size > maxSize) {
        throw new Error('Image file size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(issueData.image.type)) {
        throw new Error('Only JPG, JPEG, and PNG images are allowed');
      }

      console.log('Preparing to upload image:', {
        name: issueData.image.name,
        type: issueData.image.type,
        size: issueData.image.size,
        latitude: issueData.latitude,
        longitude: issueData.longitude
      });

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('image', issueData.image, issueData.image.name);
      formData.append('latitude', issueData.latitude.toString());
      formData.append('longitude', issueData.longitude.toString());

      console.log('FormData created with entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? pair[1] : pair[1]);
      }

      const response = await apiClient.post(
        API_ENDPOINTS.REPORT_ISSUE,
        formData,
        true // isFormData flag
      );

      console.log('Issue reported successfully:', response);

      // Add new issue to local state
      if (response.issue) {
        setIssues(prev => [response.issue, ...prev]);
      }

      return { success: true, issue: response.issue, message: response.message };
    } catch (err) {
      console.error('Error reporting issue:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all street issues
   */
  const fetchIssues = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.get(API_ENDPOINTS.GET_ISSUES);
      setIssues(response);

      return { success: true, issues: response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get simplified reports list
   */
  const fetchReports = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.get(API_ENDPOINTS.GET_REPORTS);
      
      return { success: true, reports: response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get nearby issues
   * @param {Object} params - Query parameters
   * @param {number} params.latitude - Latitude coordinate
   * @param {number} params.longitude - Longitude coordinate
   * @param {number} [params.radius] - Search radius in meters (default: 5000)
   */
  const fetchNearbyIssues = async (params) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.get(API_ENDPOINTS.GET_NEARBY_ISSUES, {
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5000
      });

      return { success: true, issues: response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch map data - all reports formatted for map display
   * @returns {Promise<Array>} Array of issues with coordinates and markers
   */
  const fetchMapData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      console.log('Fetching map data from:', API_BASE_URL + API_ENDPOINTS.GET_MAP_DATA);
      const response = await apiClient.get(API_ENDPOINTS.GET_MAP_DATA);
      
      console.log('Map data fetched successfully:', response);
      
      // Map data is already formatted for display with coordinates
      const mapData = Array.isArray(response) ? response.map(issue => ({
        ...issue,
        imageUrl: getImageUrl(issue.imageUrl)
      })) : [];

      return { success: true, data: mapData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch map data';
      setError(errorMessage);
      console.error('Error fetching map data:', {
        url: API_BASE_URL + API_ENDPOINTS.GET_MAP_DATA,
        error: err,
        message: errorMessage
      });
      return { success: false, error: errorMessage, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update issue status
   * @param {string} issueId - Issue ID
   * @param {string} status - New status (pending, in_progress, completed)
   */
  const updateIssueStatus = async (issueId, status) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.patch(
        API_ENDPOINTS.UPDATE_ISSUE_STATUS(issueId),
        { status }
      );

      // Update issue in local state
      setIssues(prev =>
        prev.map(issue =>
          issue._id === issueId ? { ...issue, status } : issue
        )
      );

      return { success: true, issue: response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get image URL for an issue
   * @param {string} imagePath - Image path from API response
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove leading slash if present and construct full URL
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Clear issues
   */
  const clearIssues = () => {
    setIssues([]);
  };

  const value = {
    issues,
    isLoading,
    error,
    reportIssue,
    fetchIssues,
    fetchReports,
    fetchMapData,
    fetchNearbyIssues,
    updateIssueStatus,
    getImageUrl,
    clearError,
    clearIssues
  };

  return <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>;
};

export default IssuesContext;
