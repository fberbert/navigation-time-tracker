const timeOption = document.getElementById('time-option')
const saveBtn = document.getElementById('save-btn')
const myAudio = new Audio(chrome.runtime.getURL('../death1.wav'))

timeOption.addEventListener('change', (e) => {
  const val = e.target.value
  if (val < 1 || val > 60) {
    timeOption.value = 25
  }
})

saveBtn.addEventListener('click', () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
    timeOption: timeOption.value,
  })
  myAudio.play()
})

chrome.storage.local.get(['timeOption'], (r) => {
  timeOption.value = r.timeOption
})
