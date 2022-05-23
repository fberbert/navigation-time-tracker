chrome.runtime.onInstalled.addListener(() => {
  // initialize an empty domains dict on INSTALL
  // { 'domainname': counterValue }
  const domains = {}

  // initialize an empty exceptions domains array on INSTALL
  const exceptions = []

  // initialize an empty restrictions domains array on INSTALL
  const restrictions = []

  // timestamp of the begining of timer
  const startTimer = new Date().getTime()
  const cycle = 86399 // 24 hours
  chrome.storage.local.set({
    domains, startTimer, cycle, exceptions, restrictions,
  })
})

chrome.alarms.create('navigationTimer', {
  // navigationTimer will execute each second
  periodInMinutes: 1 / 60,
})

// global variables

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'navigationTimer') {
    chrome.storage.local.get(['startTimer', 'domains', 'cycle', 'exceptions', 'restrictions'], (r) => {
      const {
        startTimer, domains, cycle, exceptions, restrictions,
      } = r
      const currentTimer = parseInt(((new Date().getTime()) - startTimer) / 1000, 10)

      // reset timer after configured period
      // 86400 = 24 hours
      // console.log(currentTimer)
      if (currentTimer >= cycle) {
        console.log(`ENTREI - cycle: ${cycle}`)
        timerReset()
      } else {
        chrome.windows.getCurrent(null, (w) => {
          if (w.focused === true) {
            // run only if chrome windows is focused
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (t) => {
              try {
                if (typeof t !== 'undefined') {
                  // tab must be defined
                  timerIncrement(t[0].url, domains, exceptions)
                }
              } catch (err) {
                console.log(err)
              }
            })
          }
        })
      }
    })
  }
})

function timerIncrement(url, domains, exceptions) {
  // increment by 1 second the timer in the active hostname
  //
  try {
    // retrieve only the hostname in the current tab url
    const { hostname } = new URL(url)

    // check restrictions here
    //

    // const domains = domains
    if (hostname in domains) {
      domains[hostname] = parseInt(domains[hostname], 10) + 1
      // console.log(`existe ${hostname} = ${domains[hostname]}`)
    } else if (!JSON.stringify(exceptions).match(hostname)) {
      // save only if hostname is not in exceptions array
      domains[hostname] = 1
    }

    chrome.storage.local.set({ domains })
    // console.log(`salvei domains: ${currentTimer}`)
    // console.log(domains)
  } catch (err) {
    console.log(`error trying to update navigationTimer: ${err}`)
  }
}

function timerReset() {
  const domains = {}
  const startTimer = new Date().getTime()
  console.log(`timerReset grave ${startTimer}`)
  chrome.storage.local.set({ domains, startTimer })
}
