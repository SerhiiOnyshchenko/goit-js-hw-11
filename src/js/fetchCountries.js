const MY_KEY = '26722217-c4f85004f69e1760da5af6d6e';
const API_URL = 'https://pixabay.com/api/';
const per_page = 5;

function fetchCountries(name, page) {
   return fetch(
      `${API_URL}?key=${MY_KEY}&q=${name}&image_type=photo$orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
   ).then(response => {
      if (!response.ok) {
         throw new Error(response.status);
      }
      return response.json();
   });
}
export default { fetchCountries };
