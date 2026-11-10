import api from "./api.js";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // Returns { success, message, email }
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // Returns { success, message, data: user } or requiresVerification flag
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};

export const fetchProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/profile", payload);
  return data.data;
};

// Verify email with OTP
export const verifyEmail = async (payload) => {
  const { data } = await api.post("/auth/verify-email", payload);
  return data; // Returns { success, message, data: user }
};

// Resend OTP
export const resendOTP = async (email) => {
  const { data } = await api.post("/auth/resend-otp", { email });
  return data;
};

// Request password reset email
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// Submit new password with the token from the URL
export const resetPassword = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};
