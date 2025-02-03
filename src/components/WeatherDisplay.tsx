import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Thermometer, Droplets, Wind, Sunrise } from 'lucide-react';
import { HourlyForecastModal } from './HourlyForecastModal';

export const WeatherDisplay: React.FC = () => {
  const { weatherData, forecastData, isCelsius, toggleUnit, getHourlyForecast } = useWeather();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  if (!weatherData) return null;

  const convertTemp = (temp: number) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const formatTemp = (temp: number) => {
    return `${Math.round(convertTemp(temp))}°${isCelsius ? 'C' : 'F'}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDayName = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleDayClick = async (date: number) => {
    await getHourlyForecast(date);
    setSelectedDate(date);
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Current Weather */}
      <div 
        role="button"
        tabIndex={0}
        onClick={() => handleDayClick(weatherData.dt)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDayClick(weatherData.dt);
          }
        }}
        className="w-full backdrop-blur-md bg-white/30 hover:bg-white/40 transition-colors rounded-3xl shadow-2xl p-8 mb-8 text-left cursor-pointer"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-4xl font-bold text-white">{weatherData.name}</h2>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleUnit();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleUnit();
                  }
                }}
                className="px-4 py-2 text-sm bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors cursor-pointer"
              >
                °{isCelsius ? 'C' : 'F'}
              </div>
            </div>
            <p className="text-7xl font-bold text-white mb-4">
              {formatTemp(weatherData.main.temp)}
            </p>
            <p className="text-xl text-white/80 capitalize">{weatherData.weather[0].description}</p>
          </div>

          <div className="flex-shrink-0">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}
              className="w-40 h-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-2 text-white">
              <Thermometer className="text-yellow-300" size={24} />
              <div>
                <p className="text-sm opacity-80">Feels like</p>
                <p className="font-semibold">{formatTemp(weatherData.main.feels_like)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Droplets className="text-blue-300" size={24} />
              <div>
                <p className="text-sm opacity-80">Humidity</p>
                <p className="font-semibold">{weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Wind className="text-green-300" size={24} />
              <div>
                <p className="text-sm opacity-80">Wind</p>
                <p className="font-semibold">{Math.round(weatherData.wind.speed)} m/s</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Sunrise className="text-orange-300" size={24} />
              <div>
                <p className="text-sm opacity-80">Sunrise</p>
                <p className="font-semibold">{formatTime(weatherData.sys.sunrise)}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-white/70 text-sm text-center mt-4">Click to view today's hourly forecast</p>
      </div>

      {/* Forecast */}
      <div 

      className='grid lg:grid-cols-5 gap-4 md:grid-cols-2 sm:grid-cols-1 '
      >
        {forecastData.map((day) => (
          
          <div
            key={day.dt}
            role="button"
            tabIndex={0}
            onClick={() => handleDayClick(day.dt)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleDayClick(day.dt);
              }
            }}
            className="backdrop-blur-md bg-white/30 rounded-2xl p-6 text-center text-white hover:bg-white/40 transition-colors cursor-pointer"
          >
            <p className="text-lg font-semibold mb-2">{getDayName(day.dt)}</p>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-16 h-16 mx-auto"
            />
            <p className="text-2xl font-bold mb-1">{formatTemp(day.main.temp)}</p>
            <p className="text-sm opacity-80 capitalize">{day.weather[0].description}</p>
            <p className="text-white/70 text-sm text-center mt-4">Click to view hourly forecast</p>
          </div>
        ))}
      </div>

      {/* Hourly Forecast Modal */}
      <HourlyForecastModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate!}
      />
    </div>
  );
};