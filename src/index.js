import { debounce } from 'lodash';
import { Notify } from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const NOTIFY_OPTION = {
  clickToClose: true,
};

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryThumb: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const country = e.target.value.trim();

  refs.countryList.innerHTML = '';
  refs.countryThumb.innerHTML = '';

  if (!country) {
    return;
  }

  fetchCountry(country)
    .then(appendCountries)
    .catch(() => Notify.failure('Oops, there is no country with that name', NOTIFY_OPTION));
}

function fetchCountry(country) {
  if (!country) {
    return new Promise(() => {
      throw new Error();
    });
  }

  return fetch(
    `https://restcountries.eu/rest/v2/name/${country}?fields=name;capital;population;flag;languages`,
  )
    .then(respond => {
      return respond.json();
    })
    .then(countries => {
      return countries;
    });
}

function appendCountries(arr) {
  if (arr.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', NOTIFY_OPTION);
    return;
  }

  if (arr.length === 1) {
    refs.countryThumb.innerHTML = makeOneCountryMarkUp(arr);
  } else {
    refs.countryList.innerHTML = makeCountriesListMarkUp(arr);
  }

  // const markUp = arr.length === 1 ? makeOneCountryMarkUp(arr) : makeCountriesListMarkUp(arr);
  // refs.countryList.innerHTML = markUp;
}

function makeOneCountryMarkUp(arr) {
  return arr
    .map(obj => {
      return `<div class="country-thumb">
      <div class="title">
        <img src="${obj.flag}" alt="flag" height="30px" width="40px" />
        <h1 class="country-info__name">Name: ${obj.name}</h1>
      </div>
      <ul class="country-properties">
        <li class="country-properties__item"><b>Capital:</b> ${obj.capital}</li>
        <li class="country-properties__item"><b>Population:</b> ${obj.population}</li>
        <li class="country-properties__item"><b>Languages:</b> ${obj.languages
          .map(el => el.name)
          .join(', ')}</li>
      </ul>
      </div>`;
    })
    .join('');
}

function makeCountriesListMarkUp(arr) {
  return arr
    .map(
      obj =>
        `<li class="country-list__item"><img class="country-flag" width="20px" height="15px" src="${obj.flag}">${obj.name}</li>`,
    )
    .join('');
}
