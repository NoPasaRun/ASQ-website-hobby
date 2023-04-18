// const audios = getAudios()
$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
  }, 1000);
});

async function getAudios() {
  // let request = new XMLHttpRequest()
  // request.open("GET", "/static/audio")
  // request.send()
  // console.log(request.response)
}

function LaunchRandomAudio() {
  // let random_number = getRandomIndex(0, audio_paths.length-1)

  // audio_player.src = audio_paths[random_number]
  // $(audio_player_button).on("click", () => {
  //   audio_player.volume = 0.2
  //   audio_player.play()
  // })

  // $(audio_player_button).trigger('click');

  // audio_player.addEventListener("ended", () => {
  //   LaunchRandomAudio()
  // });
}

function getRandomIndex(min, max) {
  let seed = Math.random()
  let random_number = min + Math.round((max-min)*seed)
  return random_number
}

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
