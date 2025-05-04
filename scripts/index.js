const animation_duration = 800
const circle_count = 2
const animation_delay = 300
const default_styles = {"display": "block", "opacity": "0.4", "width": "50%"}

/* Mobile nav menu animation */

function wavingHandler(element, seconds) {
  $(element).animate({
    width: "100%",
    opacity: "0"
  }, seconds, () => {
    element.style.display = "none"
  })
}

function AnimWaveCircles(array) {
  array.forEach((item, index) => {
    let duration = animation_duration - (circle_count - 1) * animation_delay
    $(item).css(default_styles)
    setTimeout(wavingHandler, animation_delay * index, item, duration)
  })
}

/* Text wrapping functions */

function changeText(container, textBlock, htmlBlock) {
  let height = parseInt($(container).css("height"))

  let value = $(container).css("line-height")
  let line_height = parseInt((value === "normal") ? 1
   : value)

  let lines = Math.floor(height / line_height)

  if ($(container).hasClass("section__content-wrapper_open")) {
    let class_name = htmlBlock.className
    let child = textBlock.querySelector("." + class_name)

    if (textBlock.contains(child)) {
      textBlock.removeChild(child)
    }
  } else {
    let htmlText = getWrappedText(textBlock, htmlBlock, 0, lines)
    $(textBlock).html(htmlText)
  }
}

function getWrappedText(el, seperator, iter = 0, lines = 1) {

  let current = $(el)
  let words = current.text().replace(
    /(\r\n|\n|\r)/gm, ""
    ).split(' ').filter(w => w != '');

  current.text(words[0]);
  let height = current.height();
  let max_height = height * lines

  for(let i = 1; i < words.length; i++){
    current.text(current.text() + ' ' + words[i]);
    height = current.height();

    if(height > max_height) {
      words[i-1] += seperator.outerHTML
      if (iter == 0) {
        break
      } else {
        max_height = height
        iter--
      }
    }
  }
  return words.join([seperator = " "])
}

function setObserver(element) {
  const resizeObserver = new ResizeObserver(() => {
    let sep = document.createElement("br")
    let htmlText = getWrappedText(element, sep, 3)

    $(element).html(htmlText)
  });

  resizeObserver.observe(element);
}

/* Toggle classes */

function toogleVisibility(selector) {
  $(selector).toggleClass('form__select-field_hidden')
}

/* Math functions */

function range(end) {
  let array = [];
  for (let i = 0; i <= end; i++) {
      array.push(i);
  }
  return array;
}

function getRandomIndex(min, max) {
  let seed = Math.random()
  let random_number = min + Math.round((max-min)*seed)
  return random_number
}

/* Parse Sound function */

function sendPlaySoundOrGetHeaders() {
  const header_params = (new URL(document.location)).searchParams;
  let play_sound_data = header_params.get("play-sound", null)
  if (play_sound_data !== null) {
    document.body.classList.remove("hide-content")
    return Boolean(parseInt(play_sound_data))
  } else {
    ConfirmPlaySound.open()
  }
}

/* Custom dialogue window */

const ConfirmPlaySound = {
  open(args) {
    args = Object.assign({}, {
      genInfo: "Message from https://asq.com",
      message: "Would you mind whether website gonna play sound effects?",
      submit_text: "Ok",
      cancel_text: "Cancel",
      action: (get_data) => {
        window.location = window.location + get_data
      }
    }, args)

    const template = `
    <div class="dialog">
      <h5 class="dialog__heading">${args.genInfo}</h5>
      <p class="dialog__content">${args.message}</p>
      <span class="dialog__cross"></span>
      <div class="dialog__form">
        <label id="dialog-confirm" class="dialog__button">${args.submit_text}</label>
        <label id="dialog-decline" class="dialog__button">${args.cancel_text}</label>
      </div>
    </div>
    `
    const dialog = document.createElement("div")

    dialog.classList.add("dialog__wrapper")
    dialog.innerHTML = template

    document.body.appendChild(dialog)

    const submit_button = document.querySelector("#dialog-confirm")
    const cancel_button = document.querySelector("#dialog-decline")
    const cross_button = document.querySelector(".dialog__cross")


    submit_button.addEventListener("click", () => {
      args.action("?play-sound=1")
      this._close(dialog)
    })
    Array(cancel_button, cross_button).forEach(el => {
      el.addEventListener("click", () => {
        args.action("?play-sound=0")
        this._close(dialog)
      })
    });
  },

  _close(el) {
    const dialog_content = el.querySelector(".dialog")

    el.classList.add("dialog__wrapper_disappear")
    dialog_content.classList.add("dialog_disappear")

    dialog_content.addEventListener("animationend", () => {
      document.body.removeChild(el)
      document.body.classList.remove("hide-content")
    })
  }
}

/* Initializing animation and etc. */

$(document).ready(() => {

  /* Init nav menu animation */

  const anim_circle = document.querySelector(".animation__circle")
  const nav_menu = document.querySelector(".nav__menu")

  var AnimCircles = range(circle_count).map(index => {
    let circle = anim_circle.cloneNode(true);
    anim_circle.after(circle);
    return circle
  })

  $(".nav__burger").click(() => {
    $(nav_menu).toggleClass('nav__menu_hidden nav__menu_open');
    if ($(nav_menu).hasClass('nav__menu_open')) {
      AnimWaveCircles(AnimCircles)
    }
  })

  /* Init mobile content description show/hide up */

  const descriptions = document.querySelectorAll(".section__content-wrapper")

  descriptions.forEach((wrapper, index) => {
    let item = wrapper.querySelector(".section__content")
    let htmlBlock = document.createElement("span")
    htmlBlock.classList.add("content__sep")
    htmlBlock.innerText = "..."

    changeText(wrapper, item, htmlBlock)

    item.addEventListener("click", () => {
      $(wrapper).toggleClass("section__content-wrapper_open")

      changeText(wrapper, item, htmlBlock)
    })
  })

  /* Init select show/hide up */

  $('#phone').mask('(999) 999-99-99');
  const selectors = new Array(".form-phone__select-field", ".form-country__select-field")

  selectors.forEach((selector) => {
    let select_field = document.querySelector(selector)
    let select_input = select_field.querySelector(".form__select-option")

    select_field.querySelectorAll(".form__select-option").forEach((select_option) => {
      $(select_option).click((event) => {
        $(select_input).attr("value", $(event.target).attr("value"))
        $(select_input).text($(event.target).attr("value"))
      })
    })
  })

  /* Init info bar show/hide up */

  const info_bar_buttons = document.querySelectorAll(".info-bar__pointer")

  info_bar_buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let info_bar = $(button.parentElement)
      info_bar.toggleClass("info-bar_open")
    })
  })

  /* Init action link wrapping */

  const links = document.querySelectorAll(".action-point__link")

  links.forEach((link) => {
    setObserver(link)
  })

  /* Init wrapping action blocks */

  const form = document.querySelector(".form_flex")
  const form_wrapper = form.querySelector(".form__top-wrapper")

  const action_point = form.querySelector(".action-point")
  const action_point_list = form_wrapper.querySelector(".action-point__list")

  const resize_handler = new ResizeObserver(elements => {

    const rect = elements[0].contentRect;
    try {
      if (rect.width <= 800) {
        form_wrapper.replaceChild(action_point, action_point_list)
        form.appendChild(action_point_list)
      } else {
        form_wrapper.replaceChild(action_point_list, action_point)
        form.appendChild(action_point)
      }
    } catch (DOMException) {
      return
    }
  })

  resize_handler.observe(document.querySelector(".section__join-us"))

})
