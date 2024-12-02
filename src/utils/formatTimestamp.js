const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    // Set up the date formatter
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',   // Abbreviated month
      day: 'numeric',   // Day without leading zero
      hour: 'numeric',  // Hour in 12-hour format
      minute: '2-digit', // Minute with leading zero
      hour12: true      // 12-hour format with am/pm
    });
  
    return formatter.format(date);
  }

export default formatTimestamp