chrome.storage.local.get(['domains'], (r) => {
  renderReport(r.domains)
})

function renderReport(domains) {
  const reportContainer = document.getElementById('report-container')

  // step 1 - convert dict to list
  const domainsList = Object.keys(domains).map((key) => [key, domains[key]])
  // step 2 - sort list by the key value (time), reverse sort
  domainsList.sort((a, b) => b[1] - a[1])
  // step 3 - obtain the list of keys sorted by the most visited domain
  domainsList.slice(0, 10).forEach((e) => {
    const reportRow = document.createElement('div')
    reportRow.className = 'row'

    const reportCol1 = document.createElement('div')
    reportCol1.className = 'col-8'
    const text1 = document.createTextNode(e[0])
    reportCol1.appendChild(text1)
    reportRow.appendChild(reportCol1)

    const reportCol2 = document.createElement('td')
    reportCol2.className = 'col'
    const text2 = document.createTextNode(secondsFormat(e[1]))
    reportCol2.appendChild(text2)
    reportRow.appendChild(reportCol2)

    reportContainer.appendChild(reportRow)
  })
}

function secondsFormat(seconds) {
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}
