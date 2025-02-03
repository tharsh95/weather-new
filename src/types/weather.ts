export interface WeatherData {
    name: string;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt: number;
    sys: {
      sunrise: number;
      sunset: number;
    };
  }
  
  export interface ForecastData {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }
  
  
  export interface HourlyForecast {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }
  
  export interface WeatherContextType {
    weatherData: WeatherData | null;
    forecastData: ForecastData[];
    hourlyForecast: HourlyForecast[];
    loading: boolean;
    error: string | null;
    searchCity: (city: string) => Promise<void>;
    getHourlyForecast: (date: number) => Promise<void>;
    toggleUnit: () => void;
    isCelsius: boolean;
  }