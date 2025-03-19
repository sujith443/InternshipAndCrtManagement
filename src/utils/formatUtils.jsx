/**
 * Utility functions for formatting and displaying data
 */

// Format date string to a localized date format
export const formatDate = (dateString, options = {}) => {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', mergedOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Format date to a more readable format (e.g., "2 days ago", "Yesterday")
  export const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    
    const diffInMillis = now - date;
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 30) {
      return formatDate(dateString);
    } else if (diffInDays > 1) {
      return `${diffInDays} days ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInHours > 1) {
      return `${diffInHours} hours ago`;
    } else if (diffInMinutes > 1) {
      return `${diffInMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Get badge variant based on status
  export const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'upcoming':
        return 'info';
      case 'delayed':
      case 'on hold':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  // Format phone number to a readable format
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // For Indian phone numbers (10 digits)
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    
    return phoneNumber;
  };
  
  // Truncate text to specified length with ellipsis
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
  
  // Format file size (bytes to KB, MB, etc.)
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Convert time string to 12-hour format
  export const formatTimeToAmPm = (timeString) => {
    // Check if already in 12-hour format with AM/PM
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      return timeString;
    }
    
    try {
      // Try to parse 24-hour format
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      // Return the original if parsing fails
      return timeString;
    }
  };
  
  // Format duration as a readable string
  export const formatDuration = (durationString) => {
    if (!durationString) return '';
    
    // If duration is already formatted
    if (durationString.includes('month') || durationString.includes('week') || durationString.includes('day')) {
      return durationString;
    }
    
    // Try to parse duration as a number of days
    const days = parseInt(durationString);
    if (!isNaN(days)) {
      if (days % 30 === 0) {
        const months = days / 30;
        return `${months} ${months === 1 ? 'month' : 'months'}`;
      } else if (days % 7 === 0) {
        const weeks = days / 7;
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      } else {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
    }
    
    return durationString;
  };