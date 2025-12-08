import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:3000';
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REQUEST_TIMEOUT = 15000;

// Error codes for different failure scenarios
export const ApiErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ApiErrorCodeType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

// Custom error class for typed error handling
export class ApiClientError extends Error {
  status: number;
  code: ApiErrorCodeType;
  originalError?: Error;

  constructor(
    message: string,
    status: number,
    code: ApiErrorCodeType,
    originalError?: Error
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }

  // Helper to check if it's a network/connectivity issue
  get isNetworkError(): boolean {
    return this.code === ApiErrorCode.NETWORK_ERROR || this.code === ApiErrorCode.TIMEOUT;
  }

  // Helper to check if user needs to re-authenticate
  get isAuthError(): boolean {
    return this.code === ApiErrorCode.UNAUTHORIZED;
  }
}

// Helper to get user-friendly error messages
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    switch (error.code) {
      case ApiErrorCode.NETWORK_ERROR:
        return 'No internet connection. Please check your network and try again.';
      case ApiErrorCode.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ApiErrorCode.UNAUTHORIZED:
        return 'Your session has expired. Please log in again.';
      case ApiErrorCode.SERVER_ERROR:
        return 'Server error. Please try again later.';
      case ApiErrorCode.NOT_FOUND:
        return 'The requested resource was not found.';
      case ApiErrorCode.VALIDATION_ERROR:
        return error.message || 'Invalid request. Please check your input.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}

// Utility function to show error alert
export function showErrorAlert(
  error: unknown,
  options?: {
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  }
): void {
  const message = getErrorMessage(error);
  const title = options?.title ?? 'Error';

  const buttons: { text: string; onPress?: () => void; style?: 'cancel' | 'default' | 'destructive' }[] = [];

  if (options?.onRetry) {
    buttons.push({
      text: 'Retry',
      onPress: options.onRetry,
    });
    buttons.push({
      text: 'Cancel',
      style: 'cancel',
      onPress: options?.onDismiss,
    });
  } else {
    buttons.push({
      text: 'OK',
      onPress: options?.onDismiss,
    });
  }

  Alert.alert(title, message, buttons);
}

// Map HTTP status codes to error codes
function getErrorCodeFromStatus(status: number): ApiErrorCodeType {
  if (status === 401) return ApiErrorCode.UNAUTHORIZED;
  if (status === 404) return ApiErrorCode.NOT_FOUND;
  if (status >= 400 && status < 500) return ApiErrorCode.VALIDATION_ERROR;
  if (status >= 500) return ApiErrorCode.SERVER_ERROR;
  return ApiErrorCode.UNKNOWN;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to retrieve token from secure storage:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
      throw new ApiClientError(
        'Failed to save authentication token',
        0,
        ApiErrorCode.UNKNOWN,
        error instanceof Error ? error : undefined
      );
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw new ApiClientError(
        'Failed to save refresh token',
        0,
        ApiErrorCode.UNKNOWN,
        error instanceof Error ? error : undefined
      );
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Set up timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: any = null;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          // Response claimed to be JSON but wasn't parseable
          data = null;
        }
      } else {
        // For non-JSON responses
        try {
          const text = await response.text();
          data = { message: text };
        } catch {
          data = null;
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorCode = getErrorCodeFromStatus(response.status);
        const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;

        throw new ApiClientError(errorMessage, response.status, errorCode);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Already an ApiClientError - rethrow as-is
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(
          'Request timed out',
          0,
          ApiErrorCode.TIMEOUT,
          error
        );
      }

      if (error instanceof TypeError) {
        throw new ApiClientError(
          'Unable to connect to server',
          0,
          ApiErrorCode.NETWORK_ERROR,
          error
        );
      }

      // Catch-all for any other errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        0,
        ApiErrorCode.UNKNOWN,
        error instanceof Error ? error : undefined
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
