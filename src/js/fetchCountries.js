const BASE_URL = 'https://restcountries.com/v3.1/name';
const URL_PARAMS = 'fields=name,population,flags,languages,capital';

export function fetchCountries(name) {
  return fetch(`${BASE_URL}/${name}?${URL_PARAMS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
