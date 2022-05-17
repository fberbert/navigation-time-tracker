const exceptions = [
  'extensions' // opera://extensions tab
]

chrome.runtime.onInstalled.addListener(() => {
  // initialize an empty domains array on INSTALL
  const domains = {}
  chrome.storage.local.set({ domains })
})

chrome.alarms.create('navigationTimer', {
  // navigationTimer will execute each second
  periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'navigationTimer') {
    chrome.windows.getCurrent(null, (w) => {
      if (w.focused == true) {
        // run only if chrome windows is focused
        chrome.tabs.query({active: true, lastFocusedWindow: true}, (t) => {
          try {
            if ( typeof t != 'undefined' ) {
              // tab must be defined
              // console.log(t[0].url)
              timerIncrement(t[0].url)
            }
          } catch {
            // console.log('nooo')
          }
        })
      }
    })
  }
})

function timerIncrement(url) {
  // increment by 1 second the timer in the active hostname
  //
  // retrieve only the hostname in the current tab url
  const { hostname } = new URL(url)

  chrome.storage.local.get(['domains'], (r) => {
    const domains = r.domains
    if (hostname in domains) {
      domains[hostname] = parseInt(domains[hostname], 10) + 1
      console.log(`existe ${hostname} = ${domains[hostname]}`)
    } else {
      console.log(`não existe ${hostname}`)
      // save only if hostname is not in exceptions array
      if (!exceptions.includes(hostname))
        domains[hostname] = 0
    }
    chrome.storage.local.set({ domains })
  })
}

    // console.log(myPromise)

    // chrome.storage.local.get(['timer', 'isRunning', 'timeOption'], (res) => {
      // if (res.isRunning) {
        // let timer = res.timer + 1
        // let isRunning = true
        // if (res.timer === 60 * res.timeOption) {
          // this.registration.showNotification('Pomodoro Timer', {
            // body: `${res.timeOption} minutes has passed!`,
            // icon: 'icon.png',
          // })
          // timer = 0
          // isRunning = false
        // }
        // chrome.storage.local.set({ timer, isRunning })
      // }
    // })

// chrome.storage.local.get(['timer', 'isRunning', 'timeOption'], (res) => {
  // chrome.storage.local.set({
    // timer: 'timer' in res ? res.timer : 0,
    // isRunning: 'isRunning' in res ? res.isRunning : false,
    // timeOption: 'timeOption' in res ? res.timeOption : 25,
  // })
// })


// console.log(chrome.windows)
