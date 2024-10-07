import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google Client ID
const clientId = '872195979745-v2otegricmipgm03ll65gct28astlb7q.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Wrap the App with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Performance measuring
reportWebVitals();
