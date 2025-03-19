import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook for filtering and sorting data
 * @param {Array} data - The array of data to filter and sort
 * @param {Object} options - Configuration options
 * @returns {Object} - Filtered and sorted data with filter/sort state and handlers
 */
const useFilterSort = (data, options = {}) => {
  // Default options
  const defaultOptions = {
    initialFilters: {},
    initialSortBy: 'id',
    initialSortOrder: 'asc',
    filterFn: null, // Custom filter function
    sortFn: null    // Custom sort function
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const {
    initialFilters,
    initialSortBy,
    initialSortOrder,
    filterFn,
    sortFn
  } = mergedOptions;

  // State for filters, sort field, and sort order
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [filteredSortedData, setFilteredSortedData] = useState([]);

  // Default filter function if none provided
  const defaultFilterFn = useCallback((item, filters) => {
    // Check each filter field
    for (const [key, value] of Object.entries(filters)) {
      // Skip empty filter values
      if (value === null || value === undefined || value === '') continue;

      // If the field is a string, use includes for case-insensitive search
      if (typeof item[key] === 'string' && typeof value === 'string') {
        if (!item[key].toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
      // If the field is a number or boolean, use exact match
      else if (typeof item[key] === 'number' || typeof item[key] === 'boolean') {
        if (item[key] !== value) {
          return false;
        }
      }
      // If the field is an array, check if value is in the array
      else if (Array.isArray(item[key])) {
        if (!item[key].includes(value)) {
          return false;
        }
      }
      // Special case for dates
      else if (item[key] instanceof Date && value instanceof Date) {
        if (item[key].getTime() !== value.getTime()) {
          return false;
        }
      }
      // Special case for objects
      else if (typeof item[key] === 'object' && item[key] !== null) {
        // This could be expanded for more complex object filtering
        return false;
      }
      // Default to strict equality for other types
      else if (item[key] !== value) {
        return false;
      }
    }
    return true;
  }, []);

  // Default sort function if none provided
  const defaultSortFn = useCallback((a, b, sortBy, sortOrder) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    let comparison = 0;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
    } else {
      // Fallback for other types
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    const applyFiltersAndSort = () => {
      // Step 1: Filter the data
      let result = [...data];
      
      // Only filter if we have filters
      if (Object.keys(filters).length > 0) {
        const actualFilterFn = filterFn || defaultFilterFn;
        result = result.filter(item => actualFilterFn(item, filters));
      }
      
      // Step 2: Sort the filtered data
      if (sortBy) {
        const actualSortFn = sortFn || defaultSortFn;
        result.sort((a, b) => actualSortFn(a, b, sortBy, sortOrder));
      }
      
      setFilteredSortedData(result);
    };
    
    applyFiltersAndSort();
  }, [data, filters, sortBy, sortOrder, filterFn, sortFn, defaultFilterFn, defaultSortFn]);

  // Handler to update a single filter
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  // Handler to update multiple filters at once
  const setMultipleFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handler to clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Handler to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Handler to set sort field and optionally order
  const handleSortChange = (field, order = null) => {
    setSortBy(field);
    if (order) {
      setSortOrder(order);
    } else if (field === sortBy) {
      // If clicking the same field, toggle order
      toggleSortOrder();
    } else {
      // If new field, default to ascending
      setSortOrder('asc');
    }
  };

  return {
    filteredData: filteredSortedData,
    filters,
    sortBy,
    sortOrder,
    handleFilterChange,
    setMultipleFilters,
    clearFilters,
    handleSortChange,
    toggleSortOrder,
    setFilters
  };
};

export default useFilterSort;