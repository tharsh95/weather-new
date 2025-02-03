import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { WeatherData, ForecastData, HourlyForecast, WeatherContextType } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPEN_API_KEY
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchWeather = async (city: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: { q: city, appid: API_KEY, units: 'metric' },
      });
      return response.data;
    } catch (err) {
      throw new Error(axios.isAxiosError(err) && err.response ? err.response.data.message : 'Failed to fetch weather data');
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast`, {
        params: { q: city, appid: API_KEY, units: 'metric' },
      });
      return response.data.list;
    } catch {
      throw new Error('Failed to fetch forecast data');
    }
  };

  const searchCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecast] = await Promise.all([fetchWeather(city), fetchForecast(city)]);
      setWeatherData(weather);
      const dailyForecasts = forecast.reduce((acc: ForecastData[], curr: ForecastData) => {
        const date = new Date(curr.dt * 1000).toDateString();
        if (!acc.find((item) => new Date(item.dt * 1000).toDateString() === date)) {
          acc.push(curr);
        }
        return acc;
      }, []).slice(1, 6);

      setForecastData(dailyForecasts);
      localStorage.setItem('lastCity', city);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } 
    } finally {
      setLoading(false);
    }
  }, []);

  const getHourlyForecast = useCallback(async (date: number) => {
    if (!weatherData) return;
    try {
      const forecast = await fetchForecast(weatherData.name);
      const selectedDate = new Date(date * 1000).toDateString();
      const hourlyData = forecast.filter((item: HourlyForecast) => new Date(item.dt * 1000).toDateString() === selectedDate);
      setHourlyForecast(hourlyData);
    } catch {
      toast.error('Failed to fetch hourly forecast');
    }
  }, [weatherData]);

  const toggleUnit = useCallback(() => setIsCelsius((prev) => !prev), []);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) searchCity(lastCity);
  }, [searchCity]);

  useEffect(() => {
    if (!weatherData?.name) return;
    const interval = setInterval(() => searchCity(weatherData.name), 30000);
    return () => clearInterval(interval);
  }, [weatherData?.name, searchCity]);

  const contextValue = useMemo(() => ({
    weatherData,
    forecastData,
    hourlyForecast,
    loading,
    error,
    searchCity,
    getHourlyForecast,
    toggleUnit,
    isCelsius
  }), [weatherData, forecastData, hourlyForecast, loading, error, isCelsius, searchCity, getHourlyForecast, toggleUnit]);

  return <WeatherContext.Provider value={contextValue}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
