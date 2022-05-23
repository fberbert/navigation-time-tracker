chrome.storage.local.get(['domains', 'startTimer'], (r) => {
  renderReport(r.domains, r.startTimer)
})

const reportContainer = document.getElementById('report-container')
const timerCaption = document.getElementById('timer-caption')
const btnReset = document.getElementById('btn-reset')
btnReset.addEventListener('click', () => {
  if (window.confirm('This action will reset all website\'s data. Are you sure?')) {
    timerReset()
  }
})

let cycle = 0

function timerReset() {
  const domains = {}
  const startTimer = new Date().getTime()
  chrome.storage.local.set({ domains, startTimer })
  reportContainer.innerHTML = ''
  timerCaption.innerText = ''
  renderReport(domains, startTimer)
}

function removeDomain(domain) {
  chrome.storage.local.get(['domains', 'startTimer'], (r) => {
    const domains = r.domains
    if (domain in domains) {
      delete domains[domain]
    }

    chrome.storage.local.set({ domains })
    reportContainer.innerHTML = ''
    renderReport(domains, r.startTimer)
  })
}

function renderReport(domains, startTimer) {
  // step 1 - convert dict to list
  const domainsList = Object.keys(domains).map((key) => [key, domains[key]])
  // step 2 - sort list by the key value (time), reverse sort
  domainsList.sort((a, b) => b[1] - a[1])
  // step 3 - obtain the list of keys sorted by the most visited domain
  domainsList.slice(0, 10).forEach((e, i) => {
    const reportRow = document.createElement('div')
    reportRow.className = 'row'
    if (i % 2 !== 0) {
      reportRow.className = 'row even-row'
    }

    const reportCol0 = document.createElement('div')
    reportCol0.className = 'col my-auto'
    const text0 = document.createTextNode(i + 1)
    reportCol0.appendChild(text0)
    reportRow.appendChild(reportCol0)

    const reportCol1 = document.createElement('div')
    reportCol1.className = 'col-7 my-auto'
    const text1 = document.createTextNode(e[0])
    reportCol1.appendChild(text1)
    reportRow.appendChild(reportCol1)

    const reportCol2 = document.createElement('td')
    reportCol2.className = 'col-3 text-center my-auto'
    const text2 = document.createTextNode(secondsFormat(e[1]))
    reportCol2.appendChild(text2)
    reportRow.appendChild(reportCol2)

    const reportCol3 = document.createElement('td')
    reportCol3.className = 'col my-auto'
    const btn3 = document.createElement('button')
    btn3.innerHTML = '<i class="bi bi-x-square-fill"></i>'
    btn3.className = 'btn btn-link btn-sm text-white m-1 p-1'
    reportCol3.appendChild(btn3)
    reportRow.appendChild(reportCol3)

    btn3.addEventListener('click', () => {
      if (window.confirm(`Remover ${e[0]}`)) {
        removeDomain(e[0])
      }
    })

    reportContainer.appendChild(reportRow)
  })

  chrome.storage.local.get(['cycle'], (r) => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    console.log(`cycle is ${r.cycle}`)
    const aaa = new Date(startTimer + r.cycle * 1000)
    const endTimer = `${weekday[aaa.getDay()]} at ${aaa.getHours().toString().padStart(2, 0)}:${aaa.getMinutes().toString().padStart(2, 0)}:${aaa.getSeconds().toString().padStart(2, 0)}`
    timerCaption.innerText = `Timer will reset ${endTimer}`
  })
}

function secondsFormat(seconds) {
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}
