/**
 * API utilities for making requests to the backend
 */

/**
 * Upload a file with form data
 */
export async function uploadFileWithData(
  url: string,
  file: File,
  data: Record<string, string>
): Promise<Response> {
  const formData = new FormData();
  
  // Append all data fields
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  // Append the file
  formData.append("image", file);
  
  // Send the request
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response;
}

/**
 * Format a date in a user-friendly format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if invalid date
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
