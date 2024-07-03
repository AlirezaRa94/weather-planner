import { useState } from 'react';

function Day({ date, max_temp, min_temp, code }) {
  return (
    <li className='day'>
      <span>{code}</span>
      <p>{date}</p>
      <p>
        {Math.floor(min_temp)}&deg; &mdash; {Math.ceil(max_temp)}&deg;
      </p>
    </li>
  );
}

function WeatherCard({ weatherData, location }) {
  const {
    temperature_2m_min: min_temps,
    temperature_2m_max: max_temps,
    time: dates,
    weathercode: codes,
  } = weatherData;

  return (
    <div>
      <h2>Weather {location}</h2>
      <ul className='weather'>
        {dates.map((date, i) => (
          <Day
            key={date}
            date={date}
            code={codes.at(i)}
            max_temp={max_temps.at(i)}
            min_temp={min_temps.at(i)}
          />
        ))}
      </ul>
    </div>
  );
}

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
      {weatherData?.weathercode && (
        <WeatherCard weatherData={weatherData} location={displayLocation} />
      )}
    </div>
  );
}
