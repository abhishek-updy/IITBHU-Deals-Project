import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchProfile,
  updateProfile as updateProfileService,
  verifyEmail as verifyEmailService,
} from "../services/authService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend if the httpOnly cookie still represents a
  // valid session. Silently ignore failures — it just means we're logged out.
  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await loginUser(credentials);
    if (result.requiresVerification) {
      // Email not verified — throw so the Login page can redirect
      const err = new Error(result.message);
      err.requiresVerification = true;
      err.email = result.email;
      throw err;
    }
    setUser(result.data);
    toast.success(`Welcome back, ${result.data.name.split(" ")[0]}!`);
    return result.data;
  }, []);

  const register = useCallback(async (payload) => {
    // Returns { success, message, email } — does NOT set user (not logged in yet)
    const result = await registerUser(payload);
    return result;
  }, []);

  // Called from VerifyEmail page after successful OTP check
  const verifyAndLogin = useCallback(async (email, otp) => {
    const result = await verifyEmailService({ email, otp });
    setUser(result.data);
    toast.success("Email verified! Welcome to IITBHU Deals 🎉");
    return result.data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await updateProfileService(payload);
    setUser(data);
    toast.success("Profile updated");
    return data;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, verifyAndLogin, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};