import React from 'react';
import { useWeather } from '../context/WeatherContext';
import toast from 'react-hot-toast';

export const ErrorDisplay: React.FC = () => {
  const { error } = useWeather();

  if (!error) return null;

  // Capitalize the first letter of the error message
  const formattedError = error.charAt(0).toUpperCase() + error.slice(1);

  // Show toast notification
  toast.error(formattedError);

  return null;
};
