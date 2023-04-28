const API_KEY = 'a4ba92dfa1b035b320ae6ecc40897eb0';
const searchButton = $('#search-form button');
const tabs = $('div[role="tablist"]');

let savedCities = [];
let fiveDayArray = [];
let currentWeather;

const iconImage = (imgId) =>
  `https://openweathermap.org/img/wn/${imgId}@2x.png`;

// Updating the global variable for weather with the api
async function updateCurrentWeather(newCity) {
  const currentWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${newCity.lat}&lon=${newCity.lon}&appid=${API_KEY}&units=imperial`,
  );

  currentWeather = await currentWeatherRes.json();
}
async function updateFiveDayArray(newCity) {
  const fiveDayWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${newCity.lat}&lon=${newCity.lon}&appid=${API_KEY}&units=imperial`,
  );

  const weather = await fiveDayWeatherRes.json();

  fiveDayArray = weather.list.filter((day) => {
    return day.dt_txt.includes('15:00:00');
  });
}

// Main function for fetching the data from the api and setting them in the global variables and localStorage.
async function fetchApi(cityName) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`,
  );
  const data = await res.json();
  const newCity = {
    name: cityName,
    lat: data[0].lat,
    lon: data[0].lon,
  };

  const currentWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${newCity.lat}&lon=${newCity.lon}&appid=${API_KEY}&units=imperial`,
  );

  currentWeather = await currentWeatherRes.json();

  const fiveDayWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${newCity.lat}&lon=${newCity.lon}&appid=${API_KEY}&units=imperial`,
  );

  const weather = await fiveDayWeatherRes.json();

  fiveDayArray = weather.list.filter((day) => {
    return day.dt_txt.includes('15:00:00');
  });

  return newCity;
}

// Function for saving the city into the localStorage right next to the previously saved cities
function saveCity(cityObj) {
  const previous = localStorage.getItem('forecast');
  const olderCities = previous ? JSON.parse(previous) : [];
  olderCities.push(cityObj);
  savedCities.push(cityObj);
  localStorage.setItem('forecast', JSON.stringify(olderCities));
}

// Function to loop through the fiveDayForcast array and dynamically create the data
function createFiveDayForecast() {
  let innerHTML = ``;
  for (let i = 0; i < fiveDayArray.length; i++) {
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

// Using Jquery to append an button element with template literals to input the dynamic values
function createTab(cityName) {
  tabs.prepend(`
    <button
      id="tab-${cityName.replace(' ', '').toLowerCase()}"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="tabpanel-${cityName.replace(' ', '').toLowerCase()}"
    >
      <span class="focus">${cityName}</span>
    </button>
  `);
}

function createPanel(cityName) {
  $('main').prepend(`
    <div
      id="tabpanel-${cityName.replace(' ', '').toLowerCase()}"
      role="tabpanel"
      tabindex="0"
      aria-labelledby="tab-${cityName.replace(' ', '').toLowerCase()}"
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
}

async function handleSearchButton(e) {
  e.preventDefault();
  const cityName = $('#search-form input').val().trim();

  if (!cityName) return alert('City Name cannot be blank');

  // loop through the cities in local storage that were set within the init function
  // To check if the cityName being searched is already in their so we can return and not add it again
  for (let i = 0; i < savedCities.length; i++) {
    if (savedCities[i].name === cityName) {
      alert('City is already Saved');
      return;
    }
  }

  const newCity = await fetchApi(cityName);

  saveCity(newCity);

  createTab(newCity.name);

  //Create the tab panel for the city's weather.
  createPanel(newCity.name);

  // In the accessible.js file for making the keyboard navigation work with the tablist
  makeAccessible();
}

async function init() {
  const storage = localStorage.getItem('forecast');
  const parsedStorage = storage ? JSON.parse(storage) : [];

  parsedStorage.forEach((city) => {
    savedCities.push(city);
  });

  savedCities.forEach(async (city) => {
    fetchApi(city.name).then(async (newCity) => {
      await updateCurrentWeather(newCity);
      await updateFiveDayArray(newCity);

      // console.log(currentWeather);

      createTab(newCity.name);

      createPanel(newCity.name);

      makeAccessible();
    });
  });

  searchButton.click(handleSearchButton);
}

$(() => {
  init();
});
