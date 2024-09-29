import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionHandler = ({ children, setToast }) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkSession = () => {
        const exp = sessionStorage.getItem('exp');
        console.log('expired session', exp)
        if (!exp) {
          handleSessionExpiry();
          return;
        }
  
        try {
          const currentTime = Date.now() / 1000; // Convert to seconds
          if (exp < currentTime) {
            handleSessionExpiry();
          } else {
            // Optionally, reset toast state if session is valid
            setToast('', '', false); // Reset toast state or set to a valid state
          }
        } catch (error) {
          handleSessionExpiry();
        }
      };
  
      const handleSessionExpiry = () => {
        sessionStorage.clear();
        //setToast('Session expired. Please log in again.', 'error', true); // Show the toast message
        navigate('/'); // Redirect to the login page
      };
  
      checkSession();
  
      // Optional: Set up a periodic session check
      // const intervalId = setInterval(checkSession, 60000); // Every 60 seconds
      // return () => clearInterval(intervalId); // Clean up the interval on unmount
    }, [navigate, setToast]);
  
    return children;
  };
  
  export default SessionHandler;
  
