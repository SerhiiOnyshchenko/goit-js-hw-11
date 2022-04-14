const MY_KEY = '26722217-c4f85004f69e1760da5af6d6e';
const API_URL = 'https://pixabay.com/api/';


async function fetchCountries(name, page, per_page) {
   const response = await fetch(
      `${API_URL}?key=${MY_KEY}&q=${name}&image_type=photo$orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
   );
   const cards = await response.json();
   return cards;
}
export default { fetchCountries };
