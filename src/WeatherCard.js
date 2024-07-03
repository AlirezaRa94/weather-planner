function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], '☀️'],
    [[1], '🌤'],
    [[2], '⛅️'],
    [[3], '☁️'],
    [[45, 48], '🌫'],
    [[51, 56, 61, 66, 80], '🌦'],
    [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
    [[71, 73, 75, 77, 85, 86], '🌨'],
    [[95], '🌩'],
    [[96, 99], '⛈'],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return 'NOT FOUND';
  return icons.get(arr);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}

function Day({ date, max_temp, min_temp, code }) {
  return (
    <li className='day'>
      <span>{getWeatherIcon(code)}</span>
      <p>{formatDay(date)}</p>
      <p>
        {Math.floor(min_temp)}&deg; &mdash; {Math.ceil(max_temp)}&deg;
      </p>
    </li>
  );
}

export default function WeatherCard({ weatherData, location }) {
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
