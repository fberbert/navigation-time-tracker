let blockModalActive = false

// wait for the entire load of site
window.addEventListener('load', () => {
  // background.js will send a message to block the site
  // if conditions is reached
  chrome.runtime.onMessage.addListener((r, s, sendResponse) => {
    if (r.action === 'block') {
      // blockModalActive will prevent the criation of
      // multiple modals
      if (!blockModalActive) {
        const blockModal = document.createElement('div')
        blockModal.style.cssText = `
          position: absolute;
          top: 0px; right: 0px; left: 0px; bottom: 0px;
          height: 100vh;
          opacity: 1;
          z-index: -1000;
          background: rgb(111, 66, 193);
          text-align: center;
          color: #fff`
        const divModal = document.createElement('div')
        divModal.style.cssText = `
          text-align: justify;
          margin-top: 20%;
          margin-left: 30%;
          margin-right: 30%;
          font-size: 1.2rem;
        `
        const h1 = document.createElement('h1')
        h1.innerText = 'Navigation Timer'
        divModal.appendChild(h1)

        const p = document.createElement('p')
        p.innerHTML = '<br/>According to your settings, you reached the timer limit in this site. Please check your <strong>Navigation Timer Extension</strong> options and yes, avoid procrastination.<br/><br/>If you removed this site restriction, please reaload the page.'
        divModal.appendChild(p)

        blockModal.appendChild(divModal)

        document.body.innerHTML = ''
        document.body.appendChild(blockModal)
        blockModalActive = true
      }
    }
    sendResponse({ status: true })
    return true
  })
})
