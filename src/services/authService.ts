import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://fakestoreapi.com';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const register = async (userData: User): Promise<User> => {
  try {
    // Note: The API will auto-generate an ID if not provided
    const response = await axios.post<User>(`${API_URL}/users`, {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Registration failed. Please try again.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    // Note: FakeStoreAPI has a separate auth endpoint
    const response = await axios.post<{token: string}>(`${API_URL}/auth/login`, {
      username: credentials.username,
      password: credentials.password
    });
    
    const { token } = response.data;
    await AsyncStorage.setItem('userToken', token);
    return token;
  } catch (error: unknown) {
    let errorMessage = 'Login failed. Please check your credentials.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
// Similarly for other functions
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during logout');
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to get token:', error.message);
    }
    return null;
  }
};