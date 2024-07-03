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

function SearchBar({ query, setQuery }) {
  return (
    <div>
      <input
        value={query}
        type='text'
        placeholder='Search from location'
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const { displayLocation, weatherData, isLoading, error } = useWeather(query);

  return (
    <div className='app'>
      <h1>Weather Planner</h1>
      <SearchBar query={query} setQuery={setQuery} />

      {error && <ErrorMessage message={error} />}
      {isLoading && <Loader />}
      {!error && !isLoading && weatherData?.weathercode && (
        <WeatherCard weatherData={weatherData} location={displayLocation} />
      )}
    </div>
  );
}
