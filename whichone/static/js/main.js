const user = {
  top_artists: null,
  top_tracks: null,
  audio_features: null,
  expire: 0,
  high_score: 0,
  scores: []
}

const idList = []
const featuresList = []

const option1 = null
const option2 = null
const currentMode = 'popularity'

const maxLives = 3
const lives = maxLives
const userCurrentScore = 0
const stopped = false
const paused = false
const cheaterMode = false
let countdownNumberEl = null
const countdown = 10
const refreshIntervalId = null
const ps = 0

$(document).ready(function () {
  $('.choice').on('click', function (event) {
    event.stopPropagation()
    event.stopImmediatePropagation()
    if (!stopped) {
      makeGuess($(this).data('choice'))
    }
  })

  $('#sign-out').on('click', function (event) {
    localStorage.clear()
  })

  $('#play-again').on('click', function (event) {
    event.stopPropagation()
    event.stopImmediatePropagation()
    if (stopped) {
      startGame()
    }
  })

  initOptions()
  document.getElementById('mode_text').style.color = '#FFC789'
  countdownNumberEl = document.getElementById('countdown-number')
  countdownNumberEl.textContent = countdown

  // if their spotify data exists in the browser
  // use that instead of requesting new data
  if (localDataFound()) {
    // start with a random mode
    randomMode()
    startCounter()
  } else {
    getSpotifyData()
    startCounter()
  }
})

function initOptions () {
  const danceBox = document.getElementById('danceBox')
  const valenceBox = document.getElementById('valenceBox')
  const durationBox = document.getElementById('durationBox')

  danceBox.checked = true
  valenceBox.checked = true
  durationBox.checked = true
}
