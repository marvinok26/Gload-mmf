// utils/response.utils.js

/**
 * Generate a success response
 */
const successResponse = (data = {}, message = 'Success') => {
    return {
      success: true,
      message,
      ...data
    };
  };
  
  /**
   * Generate an error response
   */
  const errorResponse = (message = 'An error occurred', statusCode = 500, errors = null) => {
    const response = {
      success: false,
      message
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return {
      response,
      statusCode
    };
  };
  
  /**
   * Generate a validation error response
   */
  const validationErrorResponse = (errors) => {
    return errorResponse('Validation failed', 400, errors);
  };
  
  /**
   * Generate a not found error response
   */
  const notFoundErrorResponse = (resource = 'Resource') => {
    return errorResponse(`${resource} not found`, 404);
  };
  
  /**
   * Generate an unauthorized error response
   */
  const unauthorizedErrorResponse = () => {
    return errorResponse('Unauthorized access', 401);
  };
  
  /**
   * Generate a forbidden error response
   */
  const forbiddenErrorResponse = () => {
    return errorResponse('Access forbidden', 403);
  };
  
  module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse
  };