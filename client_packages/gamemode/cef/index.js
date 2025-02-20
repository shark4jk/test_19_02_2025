/** UI module */

class UI {
    /**
     * @param url {string}
     */
    constructor(url) {
        this.url = url;
        this.browser = null;
        this.cursorState = false;
        mp.events.add('browserDomReady', this.browserReady.bind(this));
        mp.keys.bind(0x71, true, this.cursor.bind(this));

        this.init();
    }

    init() {
        this.browser = mp.browsers.new(this.url);
    }

    cursor() {
        this.cursorState = !this.cursorState;
        mp.gui.cursor.show(this.cursorState, this.cursorState);
    }

    /**
     * @param browser {BrowserMp}
     */
    browserReady(browser) {
        if (browser !== this.browser) {
            return;
        }

        mp.events.call('client::ui.ready');
    }
}
const ui = new UI('package://ui/index.html');

global.cef = ui.browser;