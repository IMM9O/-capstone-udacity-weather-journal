/* Global Variables */
const openWeatherApiUrl = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
// Personal API Key for OpenWeatherMap API
const openWeatherApiKey = '7b0a6b70ab6f91227ddea45b93964657';
const serverUrl = `http://localhost:3000/`;

/* Create a new date instance dynamically with JS */
const generateNewData = () => {
  let d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1 }/${d.getFullYear()}`;
};

/** Set error message on UI */
const setErrorMessage = (msg) =>
  (document.getElementById('error-message').innerHTML = msg);

/** Reset Input fields */
const restFields = () => {
  document.getElementById('zip').value = '';
  document.getElementById('feelings').value = '';
};

/** Reset Most Resent entry section */
const resetUIContent = () => {
  document.getElementById('date').innerHTML = '';
  document.getElementById('temp').innerHTML = '';
  document.getElementById('content').innerHTML = '';
  document.getElementById('zipCode').innerHTML = '';
  document.getElementById('city').innerHTML = '';
  document.getElementById('country').innerHTML = '';
};

/* Final step (UpdateUI) */
const updateUIContent = (data) => {
  setErrorMessage('');
  restFields();
  const { date, temperature, feelings, zipCode, city, country } = data;
  document.getElementById('date').innerHTML = `Date: ${date}`;
  document.getElementById('temp').innerHTML = `Temp: ${temperature} Celsius`;
  document.getElementById('content').innerHTML = `Feelings: ${feelings}`;
  document.getElementById('zipCode').innerHTML = `Zip Code: ${zipCode}`;
  document.getElementById('city').innerHTML = `City: ${city}`;
  document.getElementById('country').innerHTML = `Country: ${country}`;
};

/* Function to GET projectData from server */
const getDataFromServer = async () => {
  const response = await fetch(`${serverUrl}all`);
  try {
    const data = await response.json();
    if (data?.cod !== '200') throw data; // in this case data will be for example  {cod: '404', message: 'City not found'}
    else updateUIContent(data);
  } catch (err) {
    setErrorMessage(err?.message);
    resetUIContent();
  }
};

/* Function to Save data on server */
const saveDataToServer = async (saveData) => {
  const response = await fetch(`${serverUrl}saveData`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saveData),
  });
  try {
    const data = await response.json();
    if (data?.cod !== '200') throw data; // in this case data will be for example  {cod: '404', message: 'City not found'}
    else getDataFromServer();
  } catch (err) {
    setErrorMessage(err?.message);
    resetUIContent();
  }
};

/** Function to GET temp from OpenWeatherAPI */
const getTempFromWeatherAPI = async (zipCode) => {
  // get request
  const response = await fetch(
    `${openWeatherApiUrl}${zipCode}&appId=${openWeatherApiKey}&units=metric`
  );
  try {
    const data = await response.json(); // parses JSON response into native JavaScript objects
    if (data?.cod !== '200') throw data; // in this case data will be for example  {cod: '404', message: 'City not found'}
    else return data;
  } catch (err) {
    // err object will always be { cod, message }
    setErrorMessage(err?.message);
    resetUIContent();
  }
};

/** Function Click Callback */
const onGenerateButtonClicked = async () => {
  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  if (!zipCode) {
    setErrorMessage(
      'Zip Code is missing you have to enter zip code to see results!'
    );
    return;
  }
  //Now Post Data To Server For Saving And Display In Holder Section
  const data = await getTempFromWeatherAPI(zipCode);
  data?.cod === '200' &&
    saveDataToServer({
      date: generateNewData(),
      temperature: data.list[0].main.temp,
      city: data?.city?.name,
      country: data?.city?.country,
      feelings,
      zipCode,
    });
};

// Event listener to add function to existing HTML DOM element
const setAppListener = () => {
  document
    .getElementById('generate')
    .addEventListener('click', onGenerateButtonClicked);
};

(function () {
  restFields();
  resetUIContent();
  setAppListener();
})();
