// DOM 요소 (camelCase로)
const soundToggleBtn = document.getElementById('soundToggleBtn')
const soundIcon = document.getElementById('soundIcon')

// 오디오 객체는 상수로 (대문자 + SNAKE_CASE)
const BGM = new Audio('/assets/audio/bgm/acidrain-DiscoHeart-Coyote Hearing.mp3')
BGM.loop = true
BGM.volume = 0.3
BGM.play()

let isSoundOn = true

soundToggleBtn.addEventListener('click', () => {
  isSoundOn = !isSoundOn

  if (isSoundOn) {
    BGM.play()
    soundIcon.src = '/assets/icons/sound-on.svg'
    soundIcon.alt = '사운드 켜짐'
    soundToggleBtn.setAttribute('aria-label', '사운드 끄기')
  } else {
    BGM.pause();
    soundIcon.src = '/assets/icons/sound-off.svg'
    soundIcon.alt = '사운드 꺼짐'
    soundToggleBtn.setAttribute('aria-label', '사운드 켜기')
  }
})
