import './styles/style.sass'
import Carousel from './js/carousel';

const myCarousel = new Carousel({
  selector: '.carousel',
  frame: '.frame',
  indicatorList: '.carousel-indicators',
  startIndex: 2,
  easing: 'ease-out',
  duration: 400,
});

hljs.initHighlightingOnLoad();

const selectElement = document.querySelector('#button-17 .checkbox');
selectElement.addEventListener('change', (event) => {
  if (event.target.checked === true) {
    document.body.classList.add('debug');
  } else {
    document.body.classList.remove('debug');
  }
});

if (module && module.hot) module.hot.accept();