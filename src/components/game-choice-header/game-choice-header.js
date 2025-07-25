const bgmToggleBtn = document.getElementById('bgmToggleBtn')
const bgmIcon = document.getElementById('bgmIcon')

// 배경음악 설정
const BGM_AUDIO = new Audio('/assets/audio/bgm/acidrain-DiscoHeart-Coyote Hearing.mp3')
BGM_AUDIO.loop = true
BGM_AUDIO.volume = 0.5
BGM_AUDIO.play()

let isBgmPlaying = true

bgmToggleBtn.addEventListener('click', () => {
  isBgmPlaying = !isBgmPlaying

  if (isBgmPlaying) {
    BGM_AUDIO.play()
    bgmIcon.src = '/assets/icons/sound-on.svg'
    bgmIcon.alt = '음악 켜짐'
  } else {
    BGM_AUDIO.pause()
    bgmIcon.src = '/assets/icons/sound-off.svg'
    bgmIcon.alt = '음악 꺼짐'
  }
})
