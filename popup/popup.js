import {
  timerReset,
  removeDomain,
  secondsFormat,
  addException,
  addRestriction,
  removeRestriction,
} from '../common-functions.js'

const reportContainer = document.getElementById('report-container')
const timerCaption = document.getElementById('timer-caption')
const btnReset = document.getElementById('btn-reset')
btnReset.addEventListener('click', () => {
  if (window.confirm('This action will reset all website\'s data. Are you sure?')) {
    timerReset()
  }
})

const renderReport = () => {
  chrome.storage.local.get(['domains', 'startTimer', 'cycle', 'restrictions'], (r) => {
    const { domains, startTimer, cycle, restrictions } = r

    reportContainer.innerHTML = ''

    // step 1 - convert dict to list
    const domainsList = Object.keys(domains).map((key) => [key, domains[key]])
    // step 2 - sort list by the key value (time), reverse sort
    domainsList.sort((a, b) => b[1] - a[1])
    // step 3 - obtain the list of keys sorted by the most visited domain
    domainsList.slice(0, 10).forEach((e, i) => {
      const restrictedSite = restrictions.includes(e[0])
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
      reportCol1.className = (!restrictedSite) ? 'col-5 my-auto' : 'col-5 my-auto text-decoration-line-through'
      const text1 = document.createTextNode(e[0])
      reportCol1.appendChild(text1)
      reportRow.appendChild(reportCol1)

      const reportCol2 = document.createElement('td')
      reportCol2.className = 'col-3 text-center my-auto'
      const text2 = document.createTextNode(secondsFormat(e[1]))
      reportCol2.appendChild(text2)
      reportRow.appendChild(reportCol2)

      const reportCol3 = document.createElement('td')
      reportCol3.className = 'col-3 my-auto d-flex'

      // add exception button
      const btnException = document.createElement('button')
      btnException.innerHTML = '<i class="bi bi-shield-slash"></i>'
      btnException.className = 'btn btn-link btn-sm text-white m-1 p-1'
      btnException.title = 'Do not track this site'
      reportCol3.appendChild(btnException)

      btnException.addEventListener('click', () => {
        if (window.confirm(`Add ${e[0]} as exception?`)) {
          addException(e[0])
        }
      })
      // -----------------------

      // add restriction button
      const btnRestriction = document.createElement('button')
      if (restrictedSite) {
        btnRestriction.innerHTML = '<i class="bi bi-eraser"></i>'
        btnRestriction.title = 'Remove restriction'
      } else {
        btnRestriction.innerHTML = '<i class="bi bi-clock-history"></i>'
        btnRestriction.title = 'Restrict this site'
      }
      btnRestriction.className = 'btn btn-link btn-sm text-white m-1 p-1'
      reportCol3.appendChild(btnRestriction)

      btnRestriction.addEventListener('click', () => {
        if (restrictedSite) {
          removeRestriction(e[0])
        } else {
          addRestriction(e[0])
        }
      })
      // -----------------------

      // remove item button
      const btnRemove = document.createElement('button')
      btnRemove.innerHTML = '<i class="bi bi-x-square"></i>'
      btnRemove.className = 'btn btn-link btn-sm text-white m-1 p-1'
      btnRemove.title = 'Remove this timer'
      reportCol3.appendChild(btnRemove)

      btnRemove.addEventListener('click', () => {
        if (window.confirm(`Remover ${e[0]}`)) {
          removeDomain(e[0])
        }
      })
      // -----------------------

      reportRow.appendChild(reportCol3)
      reportContainer.appendChild(reportRow)
    })

    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    console.log(`cycle is ${cycle}`)
    const aaa = new Date(startTimer + cycle * 1000)
    const endTimer = `${weekday[aaa.getDay()]} at ${aaa.getHours().toString().padStart(2, 0)}:${aaa.getMinutes().toString().padStart(2, 0)}:${aaa.getSeconds().toString().padStart(2, 0)}`
    timerCaption.innerText = `Timer will reset ${endTimer}`
  })
}

chrome.storage.local.get(['domains', 'startTimer'], (r) => {
  renderReport(r.domains, r.startTimer)
})

chrome.storage.onChanged.addListener(() => {
  renderReport()
})
