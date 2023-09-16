
export const toFriendlyTime = (dateString) => {
  if (!dateString) return 'Never';

  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  
  const seconds = Math.round(diffInMs / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44);  // Using average number of days in a month
  const years = Math.round(days / 365.25);  // Considering leap years
  
  if (seconds < 60) return "a few seconds ago";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return "1 week ago";
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  if (years === 1) return "1 year ago";
  return `${years} years ago`;
};

export const formatTime = (timeStr) => {
  const dateObj = new Date(timeStr);
  const formattedTime = dateObj.toLocaleString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
  }) + '.' + String(dateObj.getMilliseconds()).padStart(3, '0');

  return formattedTime;
}