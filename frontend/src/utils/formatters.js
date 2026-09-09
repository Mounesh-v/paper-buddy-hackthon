export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  return timeString.substring(0, 5);
};

export const formatDurationMinutes = (minutes) => {
  if (!minutes && minutes !== 0) return 'N/A';
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  const num = typeof value === 'number' ? value : parseFloat(value);
  return `${Math.round(num)}%`;
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'SUBMITTED':
    case 'ACTIVE':
    case 'UP':
    case 'PASSED':
    case 'HEALTHY':
      return 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white';
    case 'DRAFT':
    case 'PLANNED':
    case 'IN_PROGRESS':
    case 'PENDING':
    case 'MEDIUM':
      return 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600';
    case 'CANCELLED':
    case 'CLOSED':
    case 'OVERDUE':
    case 'FAILED':
    case 'HIGH':
    case 'HARD':
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-600 line-through';
    case 'ADMIN':
    case 'ROLE_ADMIN':
      return 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white';
    case 'TEACHER':
    case 'ROLE_TEACHER':
      return 'bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-900 border-neutral-700 dark:border-neutral-300';
    case 'STUDENT':
    case 'ROLE_STUDENT':
      return 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600';
    case 'EASY':
    case 'LOW':
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
    default:
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  }
};
