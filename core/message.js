// Message Listener

async function messageListener(Meet) {

    async function getRecentMessage() {
        var message = await Meet.page.evaluate(() => {
            var chat = document.querySelector('.z38b6');

            if (chat) {
                messageElement = chat.lastChild
                if (messageElement) {
                    const { firstChild, lastChild } = messageElement
                    
                    alert(`firstChild.firstChild?.innerText - ${firstChild.firstChild?.innerText}, firstChild.lastChild?.innerText - ${firstChild.lastChild?.innerText}, lastChild.lastChild?.innerText - ${lastChild.lastChild?.innerText}`)
                    if (firstChild && lastChild) {
                        return {
                            author: firstChild.firstChild?.innerText,
                            time: firstChild.lastChild?.innerText,
                            content: lastChild.lastChild?.innerText
                        }; // See div.html
                    }
                }
            }
        })
        if (message.author !== "You") {
            await Meet.emit('message', message);
            Meet.recentMessage = message;
            return message;
        }
    }

    await Meet.page.waitForSelector('.GDhqjd', { timeout: 0 }); getRecentMessage();

    await Meet.page.exposeFunction('getRecentMessage', getRecentMessage)

    await Meet.page.evaluate(() => {
        // https://stackoverflow.com/questions/47903954/how-to-inject-mutationobserver-to-puppeteer
        // https://stackoverflow.com/questions/54109078/puppeteer-wait-for-page-dom-updates-respond-to-new-items-that-are-added-after/54110446#54110446
        var chat = document.querySelector('.z38b6');
        if (chat) {
            messageObserver = new MutationObserver(() => {getRecentMessage();});
            messageObserver.observe(chat, { subtree: true, childList: true });
        }
    });

}

module.exports = {
    messageListener: messageListener
}
