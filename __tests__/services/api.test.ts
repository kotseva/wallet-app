import {
  ApiClientError,
  ApiErrorCode,
  getErrorMessage,
} from '@/services/api';

describe('API Error Handling', () => {
  describe('ApiClientError', () => {
    it('should create error with correct properties', () => {
      const error = new ApiClientError(
        'Test error',
        401,
        ApiErrorCode.UNAUTHORIZED
      );

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(401);
      expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
      expect(error.name).toBe('ApiClientError');
    });

    it('should store original error', () => {
      const originalError = new Error('Original');
      const error = new ApiClientError(
        'Wrapped error',
        500,
        ApiErrorCode.SERVER_ERROR,
        originalError
      );

      expect(error.originalError).toBe(originalError);
    });

    describe('isNetworkError', () => {
      it('should return true for NETWORK_ERROR', () => {
        const error = new ApiClientError('', 0, ApiErrorCode.NETWORK_ERROR);
        expect(error.isNetworkError).toBe(true);
      });

      it('should return true for TIMEOUT', () => {
        const error = new ApiClientError('', 0, ApiErrorCode.TIMEOUT);
        expect(error.isNetworkError).toBe(true);
      });

      it('should return false for other errors', () => {
        const error = new ApiClientError('', 500, ApiErrorCode.SERVER_ERROR);
        expect(error.isNetworkError).toBe(false);
      });
    });

    describe('isAuthError', () => {
      it('should return true for UNAUTHORIZED', () => {
        const error = new ApiClientError('', 401, ApiErrorCode.UNAUTHORIZED);
        expect(error.isAuthError).toBe(true);
      });

      it('should return false for other errors', () => {
        const error = new ApiClientError('', 500, ApiErrorCode.SERVER_ERROR);
        expect(error.isAuthError).toBe(false);
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return network error message', () => {
      const error = new ApiClientError('', 0, ApiErrorCode.NETWORK_ERROR);
      expect(getErrorMessage(error)).toBe(
        'No internet connection. Please check your network and try again.'
      );
    });

    it('should return timeout message', () => {
      const error = new ApiClientError('', 0, ApiErrorCode.TIMEOUT);
      expect(getErrorMessage(error)).toBe('Request timed out. Please try again.');
    });

    it('should return unauthorized message', () => {
      const error = new ApiClientError('', 401, ApiErrorCode.UNAUTHORIZED);
      expect(getErrorMessage(error)).toBe(
        'Your session has expired. Please log in again.'
      );
    });

    it('should return server error message', () => {
      const error = new ApiClientError('', 500, ApiErrorCode.SERVER_ERROR);
      expect(getErrorMessage(error)).toBe('Server error. Please try again later.');
    });

    it('should return not found message', () => {
      const error = new ApiClientError('', 404, ApiErrorCode.NOT_FOUND);
      expect(getErrorMessage(error)).toBe('The requested resource was not found.');
    });

    it('should return validation error message when provided', () => {
      const error = new ApiClientError(
        'Email is invalid',
        400,
        ApiErrorCode.VALIDATION_ERROR
      );
      expect(getErrorMessage(error)).toBe('Email is invalid');
    });

    it('should return default validation message when empty', () => {
      const error = new ApiClientError('', 400, ApiErrorCode.VALIDATION_ERROR);
      expect(getErrorMessage(error)).toBe('Invalid request. Please check your input.');
    });

    it('should return message from standard Error', () => {
      const error = new Error('Standard error');
      expect(getErrorMessage(error)).toBe('Standard error');
    });

    it('should return default message for unknown error types', () => {
      expect(getErrorMessage('string error')).toBe('An unexpected error occurred.');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred.');
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred.');
    });
  });
});
