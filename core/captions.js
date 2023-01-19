// const fs = require('fs');
// const path = require('path');
// Caption Listener

async function captionListener(Meet) {
  let textMessage = null;
  let intervalTextData = [];
  let isNewInterval = true;

  async function getRecentCaption(chat) {
    const resultedText = await Meet.page.evaluate(async (prevText) => {
        return await new Promise((resolve) => {
            if (!chat) { 
              chat = document.querySelector('.a4cQT .K6EKFb');
            }
            
            if (chat) {
              const captionElement = chat.firstChild;
      
              if (captionElement) {
                const innerText = captionElement.lastChild?.firstChild?.lastChild?.innerText;
                console.log("🚀 ~ file: captions.js:23 ~ returnawaitnewPromise ~ prevText", prevText)
                console.log("🚀 ~ file: captions.js:24 ~ returnawaitnewPromise ~ innerText", innerText)
                if (innerText && innerText !== prevText) {
                  resolve(innerText)
                }
              }
            }
      })
    }, textMessage)

    if (resultedText && textMessage?.toLowerCase() !== resultedText.toLowerCase()) {
      if (intervalTextData.length && textMessage && resultedText.toLowerCase().startsWith(textMessage?.toLowerCase().slice(0, -1))) {
        intervalTextData[intervalTextData.length - 1] = resultedText
      } else {
        intervalTextData.push(resultedText)
      }
      console.log("🚀 ~ file: captions.js:38 ~ getRecentCaption ~ intervalTextData", intervalTextData.join(' '))
      textMessage = resultedText;
    }
  } 

  // await Meet.page.waitForSelector('.GDhqjd', { timeout: 0 }); getRecentCaption();

  await Meet.page.exposeFunction('getRecentCaption', getRecentCaption);

  const resultedTextData = [];
  const interval = setInterval(async () => {
    // if (!Meet.isCaptionEnabled) {
    //   clearInterval(interval)
    // }
    if (intervalTextData) {
      resultedTextData.push(intervalTextData.join(', '));
      intervalTextData.length = 0
      textMessage === null
    }
    isNewInterval = true
    
    
    
  }, 60000);

  // let resultedText = '';
  // let minutesCount = 1;
  // const resultPath = path.resolve(__dirname, `../../result-text`);

  // if (!fs.existsSync(resultPath)) {
  //   fs.mkdirSync(resultPath);
  // }
  // if (resultedText) {
  //   try {
  //     const pathToFile = path.join(resultPath, `text_#${minutesCount}-${new Date().toISOString()}.txt`)
  //     const fw = createWriteStream(pathToFile);
  //     fw.write(`${resultedText}\n`);
  //     fw.end();
  //     minutesCount++;
  //     resultedText = '';
  //   } catch (error) {
  //     console.log('File is created successfully.', error);
  //   }
  // }

  await Meet.page.evaluate(() => {
    // https://stackoverflow.com/questions/47903954/how-to-inject-mutationobserver-to-puppeteer
    // https://stackoverflow.com/questions/54109078/puppeteer-wait-for-page-dom-updates-respond-to-new-items-that-are-added-after/54110446#54110446
    chat = document.querySelector('.a4cQT .K6EKFb');
    const captionChat = document.querySelector('.a4cQT .K6EKFb');
    if (captionChat) {
      const captionObserver = new MutationObserver(() => getRecentCaption());
      captionObserver.observe(captionChat, { subtree: true, childList: true });
    }
  });
}

module.exports = {
  captionListener: captionListener
};
