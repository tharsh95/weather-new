import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Toaster } from 'react-hot-toast';
import { Cloud } from 'lucide-react';


function App() {
  return (
      <div 
        className="min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-red-500 py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Cloud className="text-white" size={32} />
              <h1 className="text-3xl font-bold text-white">Weather</h1>
            </div>
          </div>
          
          <SearchBar />
          
          <div className="mt-8">
            <ErrorDisplay />
            <WeatherDisplay />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>

  );
}

export default App;