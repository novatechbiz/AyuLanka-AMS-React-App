import Routers from './Routers';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import SessionHandler from './services/sessionHandler';
import ToastMessage from './components/toastMessage/toastMessage';

const queryClient = new QueryClient();

function App() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleShowToast = (message, type = 'success', show) => {
    console.log("Showing toast:", message, type); // Debugging
    setToastMessage(message);
    setToastType(type);
    setShowToast(show);
  };

  const handleCloseToast = () => {
    console.log("Toast is being closed"); // Debugging
    setShowToast(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router> {/* Wrap the entire app inside Router */}
        <SessionHandler setToast={handleShowToast}>
          <div className="App">
            <Routers />
          </div>
        </SessionHandler>
      </Router>
      <ToastMessage 
        show={showToast} 
        onClose={handleCloseToast}
        type={toastType} 
        message={toastMessage} 
      />
    </QueryClientProvider>
  );
}

export default App;
