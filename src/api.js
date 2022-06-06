import Notiflix from 'notiflix';
import API from './js/fetchCountries';
import SimpleLightbox from 'simplelightbox';
import LoadMoreBtn from './js/lode-more-btn';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const refs = {
   input: document.querySelector('[name="searchQuery"]'),
   form: document.querySelector('#search-form'),
   btn: document.querySelector('[type="submit"]'),
   divImages: document.querySelector('.gallery'),
};
const LoadeMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
let countPage = 1;
let totalHits = 0;
const per_page = 40;
let allCards = [];

async function apiAndRender() {
   const name = refs.input.value;
   await API.fetchCountries(name, countPage, per_page).then(renderListImage).catch(onFetchError);
   allCards = document.querySelectorAll('.gallery__item');
}

// first cards
refs.form.addEventListener('click', async evt => {
   evt.preventDefault();
   countPage = 1;
   if (evt.target.type === 'submit') {
      refs.btn.disabled = true;
      window.scroll({ top: 0 });
      refs.divImages.innerHTML = '';
      LoadeMoreBtn.show();
      LoadeMoreBtn.disable();
      await apiAndRender();
      if (allCards.length) {
         Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      LoadeMoreBtn.enable();
      if (totalHits <= allCards.length) {
         LoadeMoreBtn.hide();
         if (allCards.length) {
            setTimeout(() => {
               Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }, 2000);
         }
      }
      refs.btn.disabled = false;
      createGallerySimplelightbox();
      // scrollSlowly();
   }
});

// load more cards
LoadeMoreBtn.refs.button.addEventListener('click', loadeMore);

async function loadeMore() {
   countPage += 1;
   LoadeMoreBtn.disable();
   await apiAndRender();
   LoadeMoreBtn.enable();
   if (totalHits === allCards.length) {
      LoadeMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
   }
   refreshGallerySimplelightbox();
   scrollSlowly();
}

// render function
function renderListImage(images) {
   totalHits = images.totalHits;
   if (!images.hits.length) {
      throw new Error();
   }
   if (images.hits.length) {
      const markup = images.hits
         .map(image => {
            const { webformatURL, largeImageURL, tags, likes, comments, views, downloads } = image;
            return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
								<img class="gallery__image" height="240" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
							</div></a>`;
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
   LoadeMoreBtn.hide();
}

// gallery simplelightbox
function createGallerySimplelightbox() {
   let gallery = new SimpleLightbox('.gallery a');
   gallery.on('show.simplelightbox', function () {
      // do something…
   });
}
function refreshGallerySimplelightbox() {
   let gallery = new SimpleLightbox('.gallery a');
   gallery.refresh('show.simplelightbox', function () {
      // do something…
   });
}

// scroll slowly
function scrollSlowly() {
   const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

   window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
   });
}

// scroll more
window.addEventListener(
   'scroll',
   throttle(() => {
      let contentHeight = refs.divImages.offsetHeight; // 1) высота блока контента вместе с границами
      let yOffset = window.pageYOffset; // 2) текущее положение скролбара
      let window_height = window.innerHeight; // 3) высота внутренней области окна документа
      let y = yOffset + window_height;
      // если пользователь достиг конца
      if (y - 100 >= contentHeight) {
         //загружаем новое содержимое в элемент
         if (contentHeight !== 40 && totalHits !== allCards.length) {
            loadeMore();
         }
      }
   }, 500)
);
