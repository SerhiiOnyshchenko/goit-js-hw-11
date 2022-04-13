import Notiflix from 'notiflix';
import API from './js/fetchCountries';

const refs = {
   input: document.querySelector('[name="searchQuery"]'),
   form: document.querySelector('#search-form'),
   btn: document.querySelector('[type="submit"]'),
   divImages: document.querySelector('.gallery'),
   loadMore: document.querySelector('.load-more'),
};
let countPage = 1;

refs.form.addEventListener('click', evt => {
   evt.preventDefault();
   countPage = 1;
   if (evt.target.type === 'submit') {
      const name = refs.input.value;
      refs.divImages.innerHTML = '';
      API.fetchCountries(name, countPage).then(renderListImage).catch(onFetchError);
		refs.loadMore.classList.remove("selector")
	}
});

refs.loadMore.addEventListener('click', evt => {
   evt.preventDefault();
   countPage += 1;
   const name = refs.input.value;
   API.fetchCountries(name, countPage).then(renderListImage).catch(onFetchError);
});

// render function
function renderListImage(images) {
   console.log(images);
   if (!images.hits.length) {
      throw new Error();
   }
   if (images.hits.length) {
      const markup = images.hits
         .map(image => {
            const { webformatURL, largeImageURL, tags, likes, comments, views, downloads } = image;
            return `<div class="photo-card">
								<img height="240" src="${webformatURL}" alt="${tags}" loading="lazy" />
								<div class="info">
									<p class="info-item">
										<b>Likes</b> ${likes}
									</p>
									<p class="info-item">
										<b>Views</b> ${views}
									</p>
									<p class="info-item">
										<b>Comments</b> ${comments}
									</p>
									<p class="info-item">
										<b>Downloads</b> ${downloads}
									</p>
								</div>
							</div>`;
         })
         .join(' ');
      return (refs.divImages.innerHTML += markup);
   }
}

// error function
function onFetchError() {
   Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
   );
}
