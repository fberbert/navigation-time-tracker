const inputCycle = document.getElementById('input-cycle')
const divExceptions = document.getElementById('exceptions-container')
const inputException = document.getElementById('input-exception')
const btnException = document.getElementById('btn-exception')

const divRestrictions = document.getElementById('restrictions-container')
const inputRestriction = document.getElementById('input-restriction')
const btnRestriction = document.getElementById('btn-restriction')

chrome.storage.local.get(['cycle', 'exceptions', 'restrictions'], (r) => {
  // initialize timer cycle input
  const cycle = new Date(parseInt(r.cycle, 10) * 1000).toISOString().substring(11, 19)
  inputCycle.value = cycle
  renderExceptions(r.exceptions)
  renderRestrictions(r.restrictions)
})

function renderExceptions(exceptions) {
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
      if (window.confirm(`Remover ${e}`)) {
        // removeDomain(e[0])
      }
    })

    const domain = document.createTextNode(e)
    divException.appendChild(domain)
    divException.appendChild(btnRemove)
    divExceptions.appendChild(divException)
  })
}

function renderRestrictions(restrictions) {
  // show exceptions domains
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
      if (window.confirm(`Remover ${e}`)) {
        // removeDomain(e[0])
      }
    })

    const domain = document.createTextNode(e)
    divRestriction.appendChild(domain)
    divRestriction.appendChild(btnRemove)
    divRestrictions.appendChild(divRestriction)
  })
}

let prevValue = ''

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
    chrome.storage.local.set({
      cycle: totalSeconds,
    })
  }
})

inputException.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnException.click()
  }
})

btnException.addEventListener('click', () => {
  chrome.storage.local.get(['exceptions', 'domains'], (r) => {
    const { exceptions, domains } = r
    const domain = inputException.value
    // console.log(exceptions)
    exceptions.push(domain)

    if (domain in domains) {
      delete domains[domain]
    }

    chrome.storage.local.set({ exceptions, domains })
    renderExceptions(exceptions)
    inputException.value = ''
  })
})

inputRestriction.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnRestriction.click()
  }
})

btnRestriction.addEventListener('click', () => {
  chrome.storage.local.get(['restrictions'], (r) => {
    const { restrictions } = r
    // console.log(restrictions)
    restrictions.push(inputRestriction.value)
    chrome.storage.local.set({ restrictions })
    renderRestrictions(restrictions)
    inputRestriction.value = ''
  })
})

// const btnCycle = document.getElementById('btn-cycle')
