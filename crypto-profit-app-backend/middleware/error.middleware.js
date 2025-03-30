// middleware/error.middleware.js

/**
 * Global error handler
 */
const errorHandler = (error, req, reply) => {
    console.error(`Error [${req.method}] ${req.url}:`, error);
    
    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: error.validation
      });
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return reply.status(400).send({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    
    // Handle other errors
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    
    return reply.status(statusCode).send({
      success: false,
      message
    });
  };
  
  /**
   * Not found handler
   */
  const notFoundHandler = (req, reply) => {
    return reply.status(404).send({
      success: false,
      message: 'Route not found'
    });
  };
  
  /**
   * Register error handlers with Fastify
   */
  const registerErrorHandlers = (fastify) => {
    // Set error handler
    fastify.setErrorHandler(errorHandler);
    
    // Set not found handler
    fastify.setNotFoundHandler(notFoundHandler);
  };
  
  module.exports = {
    errorHandler,
    notFoundHandler,
    registerErrorHandlers
  };