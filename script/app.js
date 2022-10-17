// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}
// 5 TODO: maak updateSun functie
const updateSun = (l) => {
  if (l > 100) {
    document.querySelector('.js-sun').style.left = 100 + '%';
  } else {
    document.querySelector('.js-sun').style.left = l + '%';
  }
  let b;
  if (l >= 100 || l <= 0) {
    b = 0;
  } else if (l > 50) {
    b = 100 - (l % 50) * 2;
  } else {
    b = l * 2;
  }
  document.querySelector('.js-sun').style.bottom = b + '%';
};
function addHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

  return date;
}
function checkTime(i) {
  if (i < 0) {
    document.getElementsByTagName('html')[0].classList.add('is-night');
    document.querySelector('.js-time-left').innerHTML = '0';
    document.querySelector('.js-sun').setAttribute('data-time', '');
  } else {
    document.getElementsByTagName('html')[0].classList.remove('is-night');
    document.querySelector('.js-time-left').innerHTML = Math.floor(i / 60);
  }
}
let seconds;
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // var date = new Date();
  var date = addHours(5);
  document
    .querySelector('.js-sun')
    .setAttribute('data-time', date.getHours() + ':' + date.getMinutes());
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  let timenow = Math.floor(date.getTime() / 1000);
  let minutesSunUp = timenow - sunrise;
  let éénprocent = totalMinutes / 100;
  let minutesLeft = totalMinutes - minutesSunUp;
  console.log(Math.floor(minutesSunUp / éénprocent));
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  updateSun(Math.floor(minutesSunUp / éénprocent));
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  document.querySelector('body').classList.add('is-loaded');
  // Vergeet niet om het resterende aantal minuten in te vullen.
  checkTime(minutesLeft);
  // Nu maken we een functie die de zon elke minuut zal updaten
  const interval = setInterval(() => {
    // date = new Date();
    date = addHours(5);
    timenow = Math.floor(date.getTime() / 1000);
    minutesSunUp = timenow - sunrise;
    minutesLeft = totalMinutes - minutesSunUp;
    document
      .querySelector('.js-sun')
      .setAttribute('data-time', date.getHours() + ':' + date.getMinutes());
    // console.log('test');
    updateSun(Math.floor(minutesSunUp / éénprocent));
    checkTime(minutesLeft);
  }, 1000);
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  document.querySelector('.js-location').innerHTML =
    // We gaan eerst een paar onderdelen opvullen
    // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
    queryResponse.city.name + ', ' + queryResponse.city.country;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  const sunrise = _parseMillisecondsIntoReadableTime(
    queryResponse.city.sunrise
  );
  const sunset = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
  document.querySelector('.js-sunrise').innerHTML = sunrise;
  document.querySelector('.js-sunset').innerHTML = sunset;
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  placeSunAndStartMoving(
    queryResponse.city.sunset - queryResponse.city.sunrise,
    queryResponse.city.sunrise
  );
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // API KEY: 55ae2470e6091819b01835b71a57dfd8
  // Eerst bouwen we onze url op
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=55ae2470e6091819b01835b71a57dfd8&units=metric&lang=nl&cnt=1`;
  const data = await getData(url);
  showResult(data);
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
};
const getData = (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};
document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
