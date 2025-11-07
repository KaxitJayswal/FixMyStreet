import API_BASE_URL from '../config/api';

/**
 * Custom API client using Fetch API
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authorization token from localStorage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set authorization token in localStorage
   */
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Remove authorization token from localStorage
   */
  removeToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Build headers for API requests
   */
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      
      throw new Error(errorMessage);
    }
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const url = new URL(this.baseURL + endpoint);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  /**
   * POST request
   */
  async post(endpoint, data, isFormData = false) {
    try {
      const headers = this.getHeaders(isFormData);
      
      // Log request details for debugging
      console.log('POST Request:', {
        url: this.baseURL + endpoint,
        isFormData,
        headers: headers,
        dataType: isFormData ? 'FormData' : 'JSON'
      });

      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers: headers,
        body: isFormData ? data : JSON.stringify(data)
      });

      console.log('Response Status:', response.status, response.statusText);

      return this.handleResponse(response);
    } catch (error) {
      console.error('POST Request Error:', error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
