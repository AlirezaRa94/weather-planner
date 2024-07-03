import { useState } from 'react';

export default function App() {
  const [location, setLocation] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleLocationChange(e) {
    setLocation(e.target.value);
  }

  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  async function fetchWeather() {
    try {
      setIsLoading(true);
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error('Location not found');

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      setWeatherData(weatherData.daily);
    } catch (err) {
      console.err(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
      <button onClick={fetchWeather}>Get Weather</button>

      {isLoading && <p>Loading...</p>}
    </div>
  );
}
