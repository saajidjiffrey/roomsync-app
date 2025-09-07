/**
 * Format amount to display with 2 decimal places
 * @param value - The value to format (can be number, string, or unknown)
 * @returns Formatted string with 2 decimal places
 */
export const formatAmount = (value: unknown): string => {
  const num = parseFloat(String(value ?? '0'));
  return num.toFixed(2);
};

/**
 * Format currency amount with LKR prefix
 * @param value - The value to format
 * @returns Formatted string with LKR prefix and 2 decimal places
 */
export const formatCurrency = (value: unknown): string => {
  return `LKR ${formatAmount(value)}`;
};

/**
 * Format date to a readable string
 * @param date - The date to format (Date object or string)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time to a readable string
 * @param date - The date to format (Date object or string)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted time string
 */
export const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return dateObj.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

