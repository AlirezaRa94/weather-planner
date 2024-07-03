import { useEffect, useState } from 'react';

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export function useWeather(query) {
  const [displayLocation, setDisplayLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather(location) {
      try {
        setIsLoading(true);
        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
          { signal: controller.signal }
        );
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
          { signal: controller.signal }
        );
        if (!weatherRes.ok)
          throw new Error('Something went wrong while fetching weather data!');
        const weatherData = await weatherRes.json();
        setWeatherData(weatherData.daily);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    setError(null);

    if (query.length < 3) {
      setWeatherData({});
      return;
    }

    fetchWeather(query);

    return () => controller.abort();
  }, [query]);

  return { displayLocation, weatherData, isLoading, error };
}
