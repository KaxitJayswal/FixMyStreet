import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage({ onAuthenticated }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-8">
        {/* Left Side - Info (Hidden on mobile, shown on large screens) */}
        <div className="hidden lg:block text-white space-y-6">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">Fix My Street</h1>
            <p className="text-xl xl:text-2xl text-blue-100">
              Report and track street issues in your community
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Detection</h3>
                <p className="text-blue-100 text-sm">Upload a photo and let AI identify the issue automatically</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track Progress</h3>
                <p className="text-blue-100 text-sm">Monitor the status of reported issues on the map</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Community Impact</h3>
                <p className="text-blue-100 text-sm">Help improve your neighborhood together</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-blue-400">
            <p className="text-blue-100 text-sm">
              Join thousands of community members making a difference
            </p>
          </div>
        </div>

        {/* Mobile Header - Only shown on small screens */}
        <div className="lg:hidden text-center text-white mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Fix My Street</h1>
          <p className="text-base sm:text-lg text-blue-100">
            Report and track street issues
          </p>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex justify-center w-full">
          {showLogin ? (
            <LoginForm 
              onLogin={onAuthenticated}
              onSwitchToRegister={() => setShowLogin(false)}
            />
          ) : (
            <RegisterForm
              onRegister={onAuthenticated}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
