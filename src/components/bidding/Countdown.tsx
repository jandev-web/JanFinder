import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  expiresAt: Date;
  onExpire?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ expiresAt, onExpire, className = '' }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = expiresAt.getTime() - now;
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        if (!hasExpired) {
          setHasExpired(true);
          onExpire?.();
        }
      } else {
        setTimeRemaining(remaining);
        setHasExpired(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire, hasExpired]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'Expired';
    
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getUrgencyClass = () => {
    if (hasExpired) return 'text-gray-500';
    if (timeRemaining <= 5 * 60 * 1000) return 'text-red-600'; // 5 minutes
    if (timeRemaining <= 60 * 60 * 1000) return 'text-orange-600'; // 1 hour
    return 'text-gray-500';
  };

  return (
    <div className={`inline-flex items-center gap-1 text-sm font-medium ${getUrgencyClass()} ${className}`}>
      <Clock className="h-3 w-3" />
      <span aria-live="polite" aria-label={hasExpired ? 'Bidding has expired' : `Time remaining: ${formatTime(timeRemaining)}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};