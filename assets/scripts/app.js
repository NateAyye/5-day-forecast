const API_KEY = 'a4ba92dfa1b035b320ae6ecc40897eb0';
const searchButton = $('#search-form button');
const tabLi = $('div[role="tablist"]');
let fiveDayArray = [];
let currentWeather;

const iconImage = (imgId) =>
  `https://openweathermap.org/img/wn/${imgId}@2x.png`;

function createFiveDayForecast() {
  let innerHTML = ``;
  for (let i = 0; i < 5; i++) {
    innerHTML += `
      <div tabindex="0" class="single-day-forecast">
        <p class="dynamic-date">${dayjs(fiveDayArray[i].dt_txt).format(
          'dddd MMM, DD',
        )}</p>
        <img src=${iconImage(
          fiveDayArray[i].weather[0].icon.replace('n', 'd'),
        )} />
        <p>Temp: ${Math.floor(fiveDayArray[i].main.temp)}&deg;</p>
        <p>Wind: ${fiveDayArray[i].wind.speed}<small>mph</small></p>
        <p>Humidity: ${fiveDayArray[i].main.humidity}%</p>
      </div>
    `;
  }

  return innerHTML;
}

function createTab(cityName) {
  tabLi.prepend(`
    <button
      id="tab-${cityName}"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="tabpanel-${cityName}"
    >
      <span class="focus">${cityName}</span>
    </button>
  `);

  $('main').prepend(`
    <div
      id="tabpanel-${cityName}"
      role="tabpanel"
      tabindex="0"
      aria-labelledby="tab-${cityName}"
      class=""
    >
      <section tabindex="0" class="current-forecast">
        <h2>${cityName} - ${dayjs(currentWeather.dt_txt).format(
    'dddd MMM, DD',
  )}</h2>
        <p>Temp: ${Math.floor(
          currentWeather.main.temp,
        )}&deg; - <small>feels like (${Math.floor(
    currentWeather.main.feels_like,
  )}&deg;)</small></p>
        <p>Wind: ${currentWeather.wind.speed}<small>mph</small></p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
      </section>
      <section tabindex="0" class="five-day-forecast">
        <h3>5-Day Forcast</h3>
        <div class="dynamic-days">
          ${createFiveDayForecast()}
        </div>
      </section>
    </div>
  `);
  makeAccessible();
}

async function fetchApi(cityName) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`,
  );
  const data = await response.json();
  const { lat, lon } = data[0];

  const fiveDayWeatherRes = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
  );

  const currentWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
  );

  currentWeather = await currentWeatherRes.json();
  const weather = await fiveDayWeatherRes.json();

  // console.log(currentWeather);
  // console.log(weather);
  const currentPanelIds = [...$(`[role="tabpanel"]`)].map((val) => val.id);
  // console.log(currentPanelIds);
  if (currentPanelIds.includes(`tabpanel-${cityName}`)) {
    return alert('City Already Searched');
  }

  fiveDayArray = weather.list.filter((day) => {
    return day.dt_txt.includes('15:00:00');
  });
  console.log(fiveDayArray);

  createTab(weather.city.name);
}

searchButton.click((e) => {
  e.preventDefault();

  const input = $('#search-form input').val();

  fetchApi(input ? input : 'Sacramento');
  // if (!input.trim()) return alert('Please Try Again');
});

// Search Button Click  Function
// Add Longitude and latitude to the localStorage based off of cityname.toLowerCase()
// Create Tab and tabpanel Accordingly
// reset Accessibility
//

// Tab Button Click Function
// fetch Current Weather Data for the lon and lat saved to localStorage
// save the data into a local variable .
// empty out the panel tied to the tab button and redisplay the new data. (Make function to update Data based off panelId)
