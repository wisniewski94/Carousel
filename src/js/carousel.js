function Carousel(options) {

  const _config = Object.assign({
    selector: '.carousel',
    frame: '.frame',
    indicatorList: '.carousel-indicators',
    startIndex: 0,
    easing: 'ease-out',
    duration: 400,
    items: [],
  }, options);

  const _status = {
    startX: 0,
    endX: 0,
    position: 0,
    dragging: false,
    pointerDown: false,
    dragOffset: 0,
    clickedItem: 0,
    previousItem: _config.startIndex,
    currentItem: _config.startIndex,
    floor: _config.startIndex,
    ceil: _config.startIndex + 1,
    needRAF: true,
  };

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const self = this;
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;

      function later() {
        timeout = null;
        if (!immediate) {
          func.apply(self, args);
        }
      }
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(self, args);
      }
    };
  }

  function enableTransition() {
    _config.frame.style.webkitTransition = `all ${_config.duration}ms ${_config.easing}`;
    _config.frame.style.transition = `all ${_config.duration}ms ${_config.easing}`;
  }

  function setClasses() {
    const current = _status.currentItem;
    const previous = _status.previousItem;
    _config.items[current] && _config.items[current].classList.add('active');
    _config.indicators[current].classList.add('active');
    if (current !== previous) {
      _config.items[previous].classList.remove('active');
      _config.indicators[previous].classList.remove('active');
    }
  }

  function slideCurrent() {
    const offset = _status.currentItem * _status.selectorWidth;
    enableTransition();
    _config.frame.style.transform = `translate3d(${offset * (-1)}px, 0, 0)`;
    _status.position = offset * (-1);
    setClasses();
  }

  function slideTo(i) {
    let slideToItem = i;
    if (slideToItem < 0) {
      slideToItem = 0;
    }
    if (slideToItem > _config.items.length - 1) {
      slideToItem = _config.items.length - 1;
    }
    _status.previousItem = _status.currentItem;
    _status.currentItem = slideToItem;
    slideCurrent();
  }

  function setItemSizes(reset = false) {
    if (reset === false) {
      const position = ((_status.position + _status.dragOffset) / _status.selectorWidth) * (-1);
      const zero = _config.items.map(function (x) {
        return x;
      });
      const calc = Math.round((position - _status.floor) * 50) / 100;
      if (_status.ceil <= _config.items.length - 1 && _status.ceil >= 0) {
        zero.splice(_status.ceil, 1);
        _config.items[_status.ceil].getElementsByClassName('box')[0].style.transform = `scale(${0.5 + calc})`;
      }
      if (_status.floor >= 0 && _status.floor <= _config.items.length - 1) {
        zero.splice(_status.floor, 1);
        _config.items[_status.floor].getElementsByClassName('box')[0].style.transform = `scale(${1 - calc})`;
      }
      for (let i = 0; i < zero.length; i += 1) {
        zero[i].getElementsByClassName('box')[0].style.transform = `scale(${0.5})`;
      }
    } else if (reset === true) {
      const zero = _config.items.map(function (x) {
        return x;
      });
      const index = _status.currentItem;
      if (index > -1) {
        zero.splice(index, 1);
      }
      for (let i = 0; i < zero.length; i += 1) {
        zero[i].getElementsByClassName('box')[0].style.transform = `scale(${0.5})`;

      }
      _config.items[_status.currentItem].getElementsByClassName('box')[0].style.transform = `scale(${1})`;

    }
  }

  function isDragging() {
    return Math.abs(_status.dragOffset) > 50;
  }

  function updateCarousel() {
    if (isDragging()) {
      const movement = _status.endX - _status.startX;
      const movementDistance = Math.abs(movement);
      const howManySliderToSlide = Math.ceil(movementDistance / _status.selectorWidth);
      if (movement < 0) {
        slideTo(_status.currentItem + howManySliderToSlide);
      }
      if (movement > 0) {
        slideTo(_status.currentItem - howManySliderToSlide);
      }
    } else {
      slideTo(_status.currentItem);
    }
    setItemSizes(true);
  }

  function mouseDownHandler(event) {
    event.stopPropagation();
    _config.selector.style.cursor = '-webkit-grabbing';
    _status.startX = event.pageX;
    _status.pointerDown = true;
  }

  function mouseUpHandler(event) {
    event.stopPropagation();
    if (_status.dragging === true) {
      _status.dragging = false;
      updateCarousel();
    } else {
      slideTo(_status.clickedItem);
      setItemSizes(true);
    }
    _status.pointerDown = false;
    _config.selector.style.cursor = '-webkit-grab';
  }

  function getVisible() {
    const position = ((_status.position + _status.dragOffset) / _status.selectorWidth) * (-1);
    _status.ceil = Math.ceil(position);
    _status.floor = Math.floor(position);
  }

  function update() {
    _status.dragOffset = _status.endX - _status.startX;
    _config.frame.style.webkitTransition = `all 0ms ${_config.easing}`;
    _config.frame.style.transition = `all 0ms ${_config.easing}`;
    _config.frame.style.transform = `translate3d(${_status.position + _status.dragOffset}px, 0, 0)`;
    getVisible();
    setItemSizes();
    _status.needRAF = true;
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    if (_status.pointerDown === true) {
      _status.endX = event.pageX;
      if (isDragging()) {
        _status.dragging = true;
      }
      _status.dragOffset = _status.endX - _status.startX;
      if (_status.needRAF === true) {
        _status.needRAF = false;
        _status.raf = requestAnimationFrame(update);
      }
    }
  }

  function mouseLeaveHandler(event) {
    event.stopPropagation();
    if (_status.dragging === true) {
      cancelAnimationFrame(_status.raf);
      _config.selector.style.cursor = '-webkit-grab';
      _status.pointerDown = false;
      _status.dragging = false;
      _status.position += _status.dragOffset;
      updateCarousel();
      _status.needRAF = true;
    }
  }

  function mouseClickHandler(event) {
    _status.clickedItem = parseInt(event.currentTarget.getAttribute('data-item'), 10) - 1;
  }

  function touchStartHandler(event) {
    event.stopPropagation();
    _status.startX = event.touches[0].pageX;
    _status.pointerDown = true;
  }

  function touchEndHandler(event) {
    cancelAnimationFrame(_status.raf);
    _status.needRAF = true;
    updateCarousel();
    event.stopPropagation();
    if (_status.dragging === true) {
      _status.dragging = false;
    }
    _status.pointerDown = false;
  }

  function touchMoveHandler(event) {
    if (_status.pointerDown === true) {
      _status.endX = event.touches[0].pageX;
      _status.dragOffset = _status.endX - _status.startX;
      if (isDragging()) {
        _status.dragging = true;
      }
      if (_status.needRAF === true) {
        _status.needRAF = false;
        _status.raf = requestAnimationFrame(update);
      }
    }
    return false;
  }

  function indicatorsClickHandler(event) {
    _status.clickedItem = parseInt(event.currentTarget.getAttribute('data-item'), 10) - 1;
    slideTo(_status.clickedItem);
    setItemSizes(true);
  }

  function buildFrame() {
    _config.selector = typeof _config.selector === 'string' ? document.querySelector(_config.selector) : _config.selector;
    _status.selectorWidth = _config.selector.offsetWidth;
    _config.frame = typeof _config.frame === 'string' ? document.querySelector(_config.frame) : _config.frame;
    _config.items = [].slice.call(_config.frame.children);
    _config.frame.style.width = `${_config.items.length * _status.selectorWidth}px`;
    const percent = 100 / _config.items.length;
    for (let i = 0; i < _config.items.length; i += 1) {
      _config.items[i].style.width = `${percent}%`;
    }
  }

  function buildRest() {
    _config.indicatorList = typeof _config.indicatorList === 'string' ? document.querySelector(_config.indicatorList) : _config.indicatorList;
    _config.indicators = [].slice.call(_config.indicatorList.children);
  }
  const windowResizeHandler = debounce(function () {
    buildFrame();
    slideCurrent();
  }, 250);

  function attachEvents() {
    _config.selector.addEventListener('mousedown', mouseDownHandler);
    _config.selector.addEventListener('mouseup', mouseUpHandler);
    _config.selector.addEventListener('mousemove', mouseMoveHandler);
    _config.selector.addEventListener('mouseleave', mouseLeaveHandler);
    _config.selector.addEventListener('touchstart', touchStartHandler);
    _config.selector.addEventListener('touchend', touchEndHandler);
    _config.selector.addEventListener('touchmove', touchMoveHandler);
    window.addEventListener('resize', windowResizeHandler);
    for (let i = 0; i < _config.items.length; i += 1) {
      _config.items[i].addEventListener('mousedown', mouseClickHandler, true);
      _config.indicators[i].addEventListener('click', indicatorsClickHandler, true);
    }
  }

  function init() {
    buildFrame();
    buildRest();
    slideCurrent();
    attachEvents();
    setItemSizes();
  }

  init();

  return {
    buildFrame,
    slideCurrent,
  };
}

export default Carousel;