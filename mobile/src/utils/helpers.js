export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const getStatusColor = (status) => {
  const colors = {
    PAID: 'success',
    SUBMITTED: 'success',
    PRESENT: 'success',
    PENDING: 'warning',
    UPCOMING: 'info',
    OVERDUE: 'error',
    ABSENT: 'error',
    LATE: 'warning',
    GRADED: 'info',
  };
  return colors[status] || 'info';
};

export const groupByDate = (items, dateKey = 'date') => {
  const grouped = {};
  items.forEach((item) => {
    const date = item[dateKey]?.split('T')[0] || 'unknown';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  return grouped;
};
