import { createApiClient } from './api.js';

export const loginRequest = async (credentials) => {
  const { data } = await createApiClient().post('/auth/login', credentials);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await createApiClient().post('/auth/register', payload);
  return data;
};

export const getProfile = async (token) => {
  const { data } = await createApiClient(token).get('/auth/me');
  return data;
};

export const forgotPasswordRequest = async (payload) => {
  const { data } = await createApiClient().post('/auth/forgot-password', payload);
  return data;
};

export const resetPasswordRequest = async (payload) => {
  const { data } = await createApiClient().post('/auth/reset-password', payload);
  return data;
};
