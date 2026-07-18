import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, Profile, Goal } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  goal: Goal | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  setGoal: React.Dispatch<React.SetStateAction<Goal | null>>;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set auth header helper
  const setAuthHeader = (jwtToken: string | null) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // On mount, if token exists, verify and get user info
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthHeader(token);
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            setGoal(res.data.goal);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Auth check error', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setAuthHeader(receivedToken);
        setUser(receivedUser);

        // Fetch profile and goal
        const meRes = await axios.get('/api/auth/me');
        if (meRes.data.success) {
          setProfile(meRes.data.profile);
          setGoal(meRes.data.goal);
        }
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err: any) {
      console.error('Login error', err);
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setAuthHeader(receivedToken);
        setUser(receivedUser);

        // Fetch profile and goal (which the backend auto-created)
        const meRes = await axios.get('/api/auth/me');
        if (meRes.data.success) {
          setProfile(meRes.data.profile);
          setGoal(meRes.data.goal);
        }
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err: any) {
      console.error('Registration error', err);
      const msg = err.response?.data?.message || 'Error creating account';
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthHeader(null);
    setUser(null);
    setProfile(null);
    setGoal(null);
    setError(null);
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setProfile(res.data.profile);
        setGoal(res.data.goal);
      }
    } catch (err) {
      console.error('Failed to refresh user details', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        goal,
        token,
        loading,
        error,
        login,
        register,
        logout,
        refreshMe,
        setProfile,
        setGoal,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
