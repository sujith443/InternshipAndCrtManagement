/**
 * Utility functions for form validation
 */

// Validate a required field
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  };
  
  // Validate email format
  export const validateEmail = (email) => {
    if (!email) return validateRequired(email, 'Email');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };
  
  // Validate phone number format (Indian format)
  export const validatePhone = (phone) => {
    if (!phone) return validateRequired(phone, 'Phone number');
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return 'Please enter a valid 10-digit phone number';
    }
    return null;
  };
  
  // Validate date format and range
  export const validateDate = (date, options = {}) => {
    if (!date) return validateRequired(date, 'Date');
    
    const { minDate, maxDate } = options;
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (minDate && dateObj < new Date(minDate)) {
      return `Date cannot be before ${new Date(minDate).toLocaleDateString()}`;
    }
    
    if (maxDate && dateObj > new Date(maxDate)) {
      return `Date cannot be after ${new Date(maxDate).toLocaleDateString()}`;
    }
    
    return null;
  };
  
  // Validate a number field (min, max, integer)
  export const validateNumber = (value, options = {}) => {
    if (!value && value !== 0) return validateRequired(value, 'This field');
    
    const { min, max, integer } = options;
    const num = Number(value);
    
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    if (integer && !Number.isInteger(num)) {
      return 'Please enter a whole number';
    }
    
    if (min !== undefined && num < min) {
      return `Value must be at least ${min}`;
    }
    
    if (max !== undefined && num > max) {
      return `Value must be at most ${max}`;
    }
    
    return null;
  };
  
  // Validate minimum length for text
  export const validateMinLength = (value, minLength = 3, fieldName = 'This field') => {
    if (!value) return validateRequired(value, fieldName);
    
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  };
  
  // Validate maximum length for text
  export const validateMaxLength = (value, maxLength = 100, fieldName = 'This field') => {
    if (!value) return null; // Not required
    
    if (value.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters`;
    }
    return null;
  };
  
  // Validate that a value matches another value (e.g., for password confirmation)
  export const validateMatch = (value, matchValue, fieldName = 'This field') => {
    if (value !== matchValue) {
      return `${fieldName} does not match`;
    }
    return null;
  };
  
  // Validate a password has required complexity
  export const validatePassword = (password, options = {}) => {
    if (!password) return validateRequired(password, 'Password');
    
    const {
      minLength = 8,
      requireLowercase = true,
      requireUppercase = true,
      requireNumber = true,
      requireSpecial = false
    } = options;
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters`);
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must include at least one lowercase letter');
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must include at least one uppercase letter');
    }
    
    if (requireNumber && !/\d/.test(password)) {
      errors.push('Password must include at least one number');
    }
    
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must include at least one special character');
    }
    
    return errors.length ? errors.join(', ') : null;
  };
  
  // Validate a form object with multiple fields
  export const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const fieldRules = validationRules[fieldName];
      
      for (const rule of fieldRules) {
        const error = rule(value, formData);
        if (error) {
          errors[fieldName] = error;
          isValid = false;
          break;
        }
      }
    });
    
    return { isValid, errors };
  };