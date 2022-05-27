import { sleep, addException, removeException, addRestriction, removeRestriction } from '../common-functions.js'

const inputCycle = document.getElementById('input-cycle')
const btnCycle = document.getElementById('btn-cycle')
const inputLimit = document.getElementById('input-limit')
const btnLimit = document.getElementById('btn-limit')
const divExceptions = document.getElementById('exceptions-container')
const inputException = document.getElementById('input-exception')
const btnException = document.getElementById('btn-exception')

const divRestrictions = document.getElementById('restrictions-container')
const inputRestriction = document.getElementById('input-restriction')
const btnRestriction = document.getElementById('btn-restriction')

// --------------------------------------
// MODAL
// --------------------------------------

const pageModal = new bootstrap.Modal(document.getElementById('pageModal'), {})
const modalTitle = document.getElementById('modalTitle')
const modalBody = document.getElementById('modalBody')
const modalConfirm = document.getElementById('modalConfirm')

// pageModal.toggle()

const showModal = (title, body, type, domain) => {
  modalTitle.innerText = title
  modalBody.innerText = body

  if (type === 'removeException') {
    modalConfirm.addEventListener('click', () => {
      removeException(domain)
      pageModal.hide()
    })
  } else if (type === 'removeRestriction') {
    modalConfirm.addEventListener('click', () => {
      removeRestriction(domain)
      pageModal.hide()
    })
  }
  pageModal.show()
}

// ------------------------------------
// STATUS MESSAGE SECTION
const statusMessageDiv = document.getElementById('status-message')

const statusMessage = (message, type) => {
  const wrapper = document.createElement('div')
  const timestamp = new Date().getTime()
  const wrapperId = `alert ${timestamp.toString()}`
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${wrapperId}">`,
    `  <div>${message}</div>`,
    '</div>',
  ].join('')

  // '<button type="button" class="btn-close" data-bs-dismiss="alert"
  // aria-label="Close"></button>',
  statusMessageDiv.appendChild(wrapper)
  sleep(2000).then(() => document.getElementById(wrapperId).remove())
}
// ------------------------------------

let prevValue = ''

// -----------------------------------------------------
// INPUT CYCLE SECTION
// // --------------------------------------------------
inputCycle.addEventListener('keydown', (e) => {
  prevValue = e.target.value
  // prevent unwanted keys
  if (!e.key.match(/[0-9:]|Backspace|Delete|Arrow*|Home|End/)) {
    e.preventDefault()
  }
})

inputCycle.addEventListener('keyup', (e) => {
  // recalculate timer valid format
  // avoid to delete or insert ':'
  const dotsArr = e.target.value.match(/:/g) || []
  if (dotsArr.length !== 2) {
    e.target.value = prevValue
  }

  if (e.target.value.length === 8 && e.target.value.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
    let [hours, minutes, seconds] = e.target.value.split(':').map((v) => parseInt(v, 10))

    if (seconds > 59) {
      minutes += Math.floor(seconds / 60)
      seconds -= 60
    }

    if (minutes > 59) {
      hours += Math.floor(minutes / 60)
      minutes -= 60
      console.log(`entrei m: ${hours}:${minutes}:${seconds}`)
    }

    if (hours > 23) {
      hours = 23
      minutes = 59
      seconds = 59
    }

    const totalSeconds = (hours * 60 * 60) + (minutes * 60) + parseInt(seconds, 10)
    const cycle = new Date(parseInt(totalSeconds, 10) * 1000).toISOString().substring(11, 19)
    inputCycle.value = cycle
  }
})

btnCycle.addEventListener('click', () => {
  const [hours, minutes, seconds] = inputCycle.value.split(':').map((v) => parseInt(v, 10))
  const totalSeconds = (hours * 60 * 60) + (minutes * 60) + parseInt(seconds, 10)
  chrome.storage.local.set({
    cycle: totalSeconds,
  })
  statusMessage('Timer cycle saved successfully!', 'primary')
})

// -----------------------------------------------------
// INPUT LIMIT SECTION
// // --------------------------------------------------
inputLimit.addEventListener('keydown', (e) => {
  prevValue = e.target.value
  // prevent unwanted keys
  if (!e.key.match(/[0-9:]|Backspace|Delete|Arrow*|Home|End/)) {
    e.preventDefault()
  }
})

inputLimit.addEventListener('keyup', (e) => {
  // recalculate timer valid format
  // avoid to delete or insert ':'
  const dotsArr = e.target.value.match(/:/g) || []
  if (dotsArr.length !== 2) {
    e.target.value = prevValue
  }

  if (e.target.value.length === 8 && e.target.value.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
    let [hours, minutes, seconds] = e.target.value.split(':').map((v) => parseInt(v, 10))

    if (seconds > 59) {
      minutes += Math.floor(seconds / 60)
      seconds -= 60
    }

    if (minutes > 59) {
      hours += Math.floor(minutes / 60)
      minutes -= 60
      console.log(`entrei m: ${hours}:${minutes}:${seconds}`)
    }

    if (hours > 23) {
      hours = 23
      minutes = 59
      seconds = 59
    }

    const totalSeconds = (hours * 60 * 60) + (minutes * 60) + parseInt(seconds, 10)
    const limit = new Date(parseInt(totalSeconds, 10) * 1000).toISOString().substring(11, 19)
    inputLimit.value = limit
  }
})

btnLimit.addEventListener('click', () => {
  const [hours, minutes, seconds] = inputLimit.value.split(':').map((v) => parseInt(v, 10))
  const totalSeconds = (hours * 60 * 60) + (minutes * 60) + parseInt(seconds, 10)
  chrome.storage.local.set({
    limit: totalSeconds,
  })
  statusMessage('Time limit saved successfully!', 'primary')
})

// -------------------------------------------
// EXCEPTION SECTION
// -------------------------------------------
inputException.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnException.click()
  }
})

btnException.addEventListener('click', () => {
  addException(inputException.value)
  inputException.value = ''
})

// -------------------------------------------
// RESTRICTION SECTION
// -------------------------------------------
inputRestriction.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnRestriction.click()
  }
})

btnRestriction.addEventListener('click', () => {
  addRestriction(inputRestriction.value)
  inputRestriction.value = ''
})

chrome.storage.local.get(['cycle', 'exceptions', 'restrictions', 'limit'], (r) => {
  // initialize timer cycle input
  const cycle = new Date(parseInt(r.cycle, 10) * 1000).toISOString().substring(11, 19)
  inputCycle.value = cycle

  // initialize limit input
  const limit = new Date(parseInt(r.limit, 10) * 1000).toISOString().substring(11, 19)
  inputLimit.value = limit
})

const renderReport = () => {
  chrome.storage.local.get(['exceptions', 'restrictions'], (r) => {
    const { exceptions, restrictions } = r

    // ------------------------------------------
    // show exceptions domains
    divExceptions.innerHTML = ''

    exceptions.forEach((e, i) => {
      const divException = document.createElement('div')
      divException.className = 'd-flex justify-content-between align-items-center p-2'
      if (i % 2 === 0) {
        divException.classList.add('bg-light')
      } else {
        divException.classList.add('bg-white')
        divException.classList.add('bg-opacity-25')
      }

      const btnRemove = document.createElement('button')
      btnRemove.innerHTML = '<i class="bi bi-x-square-fill"></i>'
      btnRemove.className = 'btn btn-link btn-sm m-1 p-1'
      btnRemove.style = 'color: var(--bs-gray-600);'

      btnRemove.addEventListener('click', () => {
        showModal('Remove Exception', `Do you want to remove "${e}" from exceptions?`, 'removeException', e)
      })

      const domain = document.createTextNode(e)
      divException.appendChild(domain)
      divException.appendChild(btnRemove)
      divExceptions.appendChild(divException)
    })
    // ------------------------------------------
    // show restrictions domains
    divRestrictions.innerHTML = ''

    restrictions.forEach((e, i) => {
      const divRestriction = document.createElement('div')
      divRestriction.className = 'd-flex justify-content-between align-items-center p-2'
      if (i % 2 === 0) {
        divRestriction.classList.add('bg-light')
      } else {
        divRestriction.classList.add('bg-white')
        divRestriction.classList.add('bg-opacity-25')
      }

      const btnRemove = document.createElement('button')
      btnRemove.innerHTML = '<i class="bi bi-x-square-fill"></i>'
      btnRemove.className = 'btn btn-link btn-sm m-1 p-1'
      btnRemove.style = 'color: var(--bs-gray-600);'

      btnRemove.addEventListener('click', () => {
        showModal('Remove Exception', `Do you want to remove "${e}" from restrictions?`, 'removeRestriction', e)
      })

      const domain = document.createTextNode(e)
      divRestriction.appendChild(domain)
      divRestriction.appendChild(btnRemove)
      divRestrictions.appendChild(divRestriction)
    })
  })
}

chrome.storage.onChanged.addListener(() => renderReport())
renderReport()
