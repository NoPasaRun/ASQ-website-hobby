const basicConfig = {
  // Optional parameters
  direction: 'horizontal',
  speed: 350,
  allowTouchMove: true,

  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
}

function get_config(total_width, item_width) {

  let min_space = 25
  let dict = {slidesPerView: 1, spaceBetween: 0}

  switch (true) {
    case (item_width * 3 + min_space * 2 <= total_width):
      dict.slidesPerView = 3
      dict.spaceBetween = (total_width - item_width * 3) / 2
      break
    case (item_width * 2 + min_space <= total_width):
      dict.slidesPerView = 2
      dict.spaceBetween = total_width - item_width * 2
      break
  }

  return {...basicConfig, ...dict}
}

function init_slider(card, slider) {
  let Slider = new Swiper(slider, get_config(slider.clientWidth, card.clientWidth));
  return Slider
}


$(document).ready(function main() {
  const dev_card = document.querySelector(".slider__item")
  const prod_card = document.querySelector(".slider__product")

  const dev_el = document.querySelector('.swiper-developers');
  const prod_el = document.querySelector('.swiper-products');

  const sliders = new Array()
  const sliders_data = [[dev_card, dev_el], [prod_card, prod_el]]
  const iter_sliders_data = () => {
    sliders_data.forEach((item) => {
      let [card, slider] = item
      sliders.push(init_slider(card, slider))
    })
  }

  iter_sliders_data()

  $(window).on("resize", (event) => {
    event.preventDefault();
    sliders.forEach((el) => {
      el.destroy()
      sliders.pop(el)
    })
    iter_sliders_data()
  })
})
