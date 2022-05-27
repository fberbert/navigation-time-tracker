// list of functions:
//
// removeDomain(domain) - remove a domain from list of tracked domains
// secondsFormat(seconds) - convert N seconds to 00:00:00 format
// sleep(ms) - sleep for N milisseconds
// addException(domain) - add a domain in the list os exceptions
// removeException(domain) - remove a domain from the list of exceptions
// addRestriction(domain) - add a domain in the list os restrictions
// removeRestriction(domain) - remove a domain from the list of restrictions
// timerReset() - reset timer (domains and startTimer)

const removeDomain = (domain) => {
  chrome.storage.local.get(['domains'], (r) => {
    const { domains } = r
    if (domain in domains) {
      delete domains[domain]
    }
    chrome.storage.local.set({ domains })
  })
}

// convert N seconds to 00:00:00 format
const secondsFormat = (seconds) => new Date(seconds * 1000).toISOString().slice(11, 19)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const addException = (domain) => {
  chrome.storage.local.get(['exceptions', 'domains'], (r) => {
    const { exceptions, domains } = r
    // const domain = inputException.value
    // console.log(exceptions)
    exceptions.push(domain)

    if (domain in domains) {
      delete domains[domain]
    }

    chrome.storage.local.set({ exceptions, domains })
  })
}

const removeException = (domain) => {
  chrome.storage.local.get(['exceptions'], (r) => {
    let { exceptions } = r

    if (exceptions.includes(domain)) {
      exceptions = exceptions.filter((d) => d !== domain)
    }

    chrome.storage.local.set({ exceptions })
  })
}

const addRestriction = (domain) => {
  chrome.storage.local.get(['restrictions'], (r) => {
    const { restrictions } = r
    restrictions.push(domain)
    chrome.storage.local.set({ restrictions })
  })
}

const removeRestriction = (domain) => {
  chrome.storage.local.get(['restrictions'], (r) => {
    let { restrictions } = r

    if (restrictions.includes(domain)) {
      restrictions = restrictions.filter((d) => d !== domain)
    }

    chrome.storage.local.set({ restrictions })
  })
}

const timerReset = () => {
  const domains = {}
  const startTimer = new Date().getTime()
  console.log(`timerReset grave ${startTimer}`)
  chrome.storage.local.set({ domains, startTimer })
}

export {
  removeDomain,
  secondsFormat,
  sleep,
  addException,
  removeException,
  addRestriction,
  removeRestriction,
  timerReset,
}
