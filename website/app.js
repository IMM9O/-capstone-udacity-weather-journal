/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
// Personal API Key for OpenWeatherMap API
const apiKey = '&appId=7b0a6b70ab6f91227ddea45b93964657&units=imperial';
const apiUrl = `http://localhost:3000/`;
// get HTML DOM elements
const zipCodeElm = document.getElementById('zip');
const feelingsElm = document.getElementById('feelings');
const dateElm = document.getElementById('date');
const tempElm = document.getElementById('temp');
const contentElm = document.getElementById('content');

// handling error
const errorHandling = (err) => {
  err?.message && alert(err?.message);
};

/* Function to GET Web API Data*/
const onGenerateButtonClicked = () => {
  let sendData = {
    zipCode: zipCodeElm.value,
    content: feelingsElm.value,
    date: newDate,
  };
  getZipCodeInfo(sendData.zipCode).then((data) => {
    //Now Post Data To Server For Saving And Display In Holder Section
    if (data && data.cod === '200') {
      sendData.temp = data.list[0].main.temp;
      postDataToServer(sendData);
    }
  });
};

const getZipCodeInfo = async (zipCode) => {
  // get request
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?id=${zipCode}${apiKey}`
    );
    const data = await response.json(); // parses JSON response into native JavaScript objects
    if (!response.ok) throw data;

    return data;
  } catch (err) {
    errorHandling(err);
  }
};



/* Function to GET Project Data */
const getDataFromServer = async (data) => {
  try {
    const response = await fetch(`${apiUrl}all`);
    const data = await response.json();
    if (!response.ok) throw data;

    dateElm.innerHTML = `Date Is: ${data.date}`;
    tempElm.innerHTML = `Temp Is: ${data.temp}`;
    contentElm.innerHTML = `My Feelings Is: ${data.content}`;
  } catch (err) {
    errorHandling(err);
  }
};

/* Function to POST data */
const postDataToServer = async (postData) => {
    try {
      const response = await fetch(`${apiUrl}postData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) throw data;
  
      getDataFromServer();
    } catch (err) {
      errorHandling(err);
    }
  };

// Event listener to add function to existing HTML DOM element
document
  .getElementById('generate')
  .addEventListener('click', onGenerateButtonClicked);
