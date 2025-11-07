import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const { register, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    verificationCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAdminFields, setShowAdminFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    clearError();
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData(prev => ({ ...prev, role }));
    setShowAdminFields(role === 'admin');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    if (formData.role === 'admin' && !formData.verificationCode) {
      setError('Verification code is required for admin registration');
      setIsSubmitting(false);
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      ...(formData.role === 'admin' && { verificationCode: formData.verificationCode })
    });

    if (result.success) {
      onRegister(result.user);
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-2">Create Account</h2>
        <p className="text-sm sm:text-base text-gray-600">Join us to report and track street issues</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            placeholder="Re-enter your password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 sm:py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
          >
            <option value="user">User</option>
            <option value="admin">Admin (Government Official)</option>
          </select>
        </div>

        {showAdminFields && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Verification Code
            </label>
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter government verification code"
              required={formData.role === 'admin'}
            />
            <p className="text-xs text-gray-600 mt-1">
              Contact your administrator to obtain a verification code
            </p>
          </div>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            required
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
