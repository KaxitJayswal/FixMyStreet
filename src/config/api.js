// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Issue endpoints
  REPORT_ISSUE: '/api/issues/report',
  GET_ISSUES: '/api/issues',
  GET_REPORTS: '/api/issues/reports',
  GET_MAP_DATA: '/api/issues/map',
  GET_NEARBY_ISSUES: '/api/issues/nearby',
  UPDATE_ISSUE_STATUS: (issueId) => `/api/issues/${issueId}/status`,
  
  // Verification endpoints
  CHECK_VERIFICATION: (code) => `/api/verification/check/${code}`,
  LIST_VERIFICATION: '/api/verification/list',
  
  // Static files
  UPLOADS: (filename) => `/uploads/${filename}`
};

export default API_BASE_URL;
