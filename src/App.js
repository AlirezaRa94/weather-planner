import { useState } from 'react';
import { useWeather } from './useWeather';
import WeatherCard from './WeatherCard';

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>🛑</span> {message}
    </p>
  );
}

export default function App() {
  const [location, setLocation] = useState('');
  const { displayLocation, weatherData, isLoading, error, fetchWeather } =
    useWeather();

  function handleLocationChange(e) {
    setLocation(e.target.value);
  }

  function handleClick() {
    fetchWeather(location);
  }

  return (
    <div className='app'>
      <h1>Weather Planner</h1>
      <div>
        <input
          value={location}
          type='text'
          placeholder='Search from location'
          onChange={handleLocationChange}
        />
      </div>
      <button onClick={handleClick}>Get Weather</button>

      {error && <ErrorMessage message={error} />}
      {isLoading && <Loader />}
      {!error && !isLoading && weatherData?.weathercode && (
        <WeatherCard weatherData={weatherData} location={displayLocation} />
      )}
    </div>
  );
}
