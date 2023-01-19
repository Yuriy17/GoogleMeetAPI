// Main initializing function

// Only logs in, however we can skip this by just waiting for the chat button or the leave meeting button. Then signing in can be done manually with headless mode disabled, and the package just automates the other stuff
async function auth({ meetingLink, email, pw }) {

    if (!meetingLink.startsWith("https://meet.google.com/")) {throw("Meeting Link isn't valid. Make sure it looks like 'https://meet.google.com/xyz-wxyz-xyz'!");}
    const forwardUrl = async () => {
        this.meetingLink = meetingLink; 
        this.browser = await this.puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
        this.ctx = await this.browser.defaultBrowserContext(); await this.ctx.overridePermissions('https://meet.google.com', ['microphone', 'camera', 'notifications']);
        await this.page.goto(meetingLink); 
    }
    let buttonClass = 'VfPpkd-RLmnJb'
    if (email && pw) {
        if (!email.endsWith("@gmail.com")) { throw ("Email isn't a Google Account"); }
        
        await forwardUrl();

        this.email = email;
        // Authenticating with credentials
        console.log("Logging in...")
        try {
            await this.page.waitForTimeout(500);
            var signInButton = await this.page.waitForSelector('.NPEfkd', { visible: true, timeout: 10000 }); await signInButton.focus(); await signInButton.click();
        } catch (e) {
            console.log(e)
            // Sign In button is not visible, so we assume the page has already redirected, and is not accepting anonymous meeting members - Support for anonymous joining may be implemented in the future
        }
        
        var input = await this.page.waitForSelector('input[type=email]', { visible: true, timeout: 0 }); await input.focus();
        await this.page.keyboard.type(email);
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
        var input = await this.page.waitForSelector('input[type=password]', { visible: true, timeout: 0 }); await input.focus();
        await this.page.keyboard.type(pw);
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Enter');
        console.log("Authenticated successfully!");
        await this.screenshot('logged-in.png'); // Double check that the meet is about to be joined to. Quickest way to make sure that there aren't any prompts (Like Google's "confirm recovery email" prompt), that can leave the browser hanging.
        // Although you can edit the package's code to fit your scenario, the easiest way to fix anything that leaves this program hanging, is to just run the package without headless mode. That way you can continue on any prompts or see issues fast.
        // Join Google Meet
    } else {
        await forwardUrl();
        // VfPpkd-fmcmS-wGMbrd 
        var input = await this.page.waitForSelector('input[type=text].VfPpkd-fmcmS-wGMbrd ', { visible: true, timeout: 0 }); await input.focus();
        await this.page.keyboard.type('test');
        buttonClass = 'VfPpkd-LgbsSe-OWXEXe-k8QpJ'
    }


    await this.page.waitForTimeout(1500);
    await this.page.waitForSelector('div[role=button]');
    
    var join = await this.page.waitForSelector(`.${buttonClass}`, { visible: true, timeout: 0 });
    for (var i = 3; i > 0; i--) {
        await this.toggleMic(this.page);
        await this.toggleVideo(this.page);
    } // toggle mic and video 3 times because Google Meet glitches and leaves mic on if it's toggled as soon as page loads

    await this.page.waitForTimeout(1500);
    await this.page.click(`.${buttonClass}`);
    // await join.click();

    // Beyond, is code separate from logging in. You could log in manually and just wait for the chat button to show up to start the bot, for example.

    await this.page.waitForXPath('/html/body/div[1]/c-wiz/div[1]/div/div[13]/div[3]/div[11]/div[3]/div[3]/div/div/div[3]/div/span/button', { visible: true, timeout: 0 }); // wait for chat button

    await this.toggleMemberList(); await this.toggleChat();
    // this.member.memberListener(this); // Start listeners
    this.message.messageListener(this);
    this.isChatEnabled = this.chatEnabled;
    this.Audio = new this.audio(this.page);
    console.log("Meeting joined, and listeners are listening!");
    this.emit('ready');

    await this.toggleCaption();
    this.caption.captionListener(this);

}

module.exports = {
    auth: auth
}
