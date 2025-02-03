import React from 'react';
import { X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

interface HourlyForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: number;
}

export const HourlyForecastModal: React.FC<HourlyForecastModalProps> = ({
  isOpen,
  onClose,
  date,
}) => {
  const { hourlyForecast, isCelsius } = useWeather();

  if (!isOpen) return null;

  const formatTemp = (temp: number) => {
    const temperature = isCelsius ? temp : (temp * 9/5) + 32;
    return `${Math.round(temperature)}°${isCelsius ? 'C' : 'F'}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Hourly Forecast for {formatDate(date)}
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(80vh-100px)]">
          <div className="grid gap-4">
            {hourlyForecast?.map((hour) => (
              <div
                key={hour.dt}
                className="flex items-center justify-between bg-white/10 rounded-2xl p-4"
              >
                <div className="flex items-center gap-4">
                  <p className="text-white font-semibold w-20">
                    {formatTime(hour.dt)}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-xl font-bold text-white">
                      {formatTemp(hour.main.temp)}
                    </p>
                    <p className="text-white/70 capitalize">
                      {hour.weather[0].description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-white">
                  <div>
                    <p className="text-white/70 text-sm">Humidity</p>
                    <p className="font-semibold">{hour.main.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Wind</p>
                    <p className="font-semibold">{Math.round(hour.wind.speed)} m/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};