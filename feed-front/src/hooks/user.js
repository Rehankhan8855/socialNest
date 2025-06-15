import { useState, useEffect } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    setIsLoading(false);
  };

  // Check for user on initial load
  useEffect(() => {
    checkUser();
  }, []);

  // Watch for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    user, 
    token,
    isLoading,
    checkUser,
    isAuthenticated: !!token && !!user
  };
};