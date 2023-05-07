import './css/styles.css';
import refs from './js/refs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(event) {
  const searchBoxInput = event.target.value.trim();

  if (!searchBoxInput) {
    refs.countryInfo.innerHTML = '';
    refs.countriesList.innerHTML = '';
    return;
  }

  fetchCountries(searchBoxInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length < 10 && data.length >= 2) {
        refs.countryInfo.innerHTML = '';
        refs.countriesList.innerHTML = createCountriesList(data);
      } else {
        refs.countriesList.innerHTML = '';
        refs.countryInfo.innerHTML = createCountryInfo(data);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      } else {
        console.log(error);
      }
      refs.countriesList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    });
}

function createCountriesList(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img src="${flags.svg}" alt="${name.official}" width="30" height="20">${name.official}</li>`
    )
    .join('');
}

function createCountryInfo(data) {
  return data
    .map(
      ({ name, population, flags, languages, capital }) =>
        `<h2 class="country-name">
        <img src="${flags.svg}" alt="${name.official}" width="50" height="30">
        ${name.official}
        </h2>
        <ul class="country-info-list">
            <li class="country-info-item">
                <span class="country-info-type">Capital:</span>
                ${capital}
            </li>
            <li class="country-info-item">
                <span class="country-info-type">Population:</span>
                ${population}
            </li>
            <li class="country-info-item">
                <span class="country-info-type">Languages:</span>
                ${Object.values(languages).join(', ')}
            </li>
        </ul>`
    )
    .join('');
}