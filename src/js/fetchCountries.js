const MY_KEY = '26722217-c4f85004f69e1760da5af6d6e';
const API_URL = 'https://pixabay.com/api/';
const axios = require('axios').default;

async function fetchCountries(name, page, per_page) {
   try {
      const response = await axios.get(
         `${API_URL}?key=${MY_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
		);
      return response.data;
   } catch (error) {
      console.log(error);
   }
}
export default { fetchCountries };
