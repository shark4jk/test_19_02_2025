
class Dice {
    constructor() {
        this.inGame = false;

        this.browser = global.cef;

        this.events();
    }

    events() {
        try {
            mp.events.add('client::dice.showNoty', this.showNoty.bind(this));

            mp.events.add('client::dice.showMenu', this.showMenu.bind(this));

            mp.events.add('client::dice.placeBet', this.placeBet.bind(this));

            mp.events.add('client::dice.decline', this.decline.bind(this));

            mp.events.add('client::dice.accept', this.accept.bind(this));

            mp.keys.bind(0x45, true, this.keyE.bind(this));
        } catch (e) {
            mp.events.callRemote('try_catch', 'dice', 'events', e);
        }
    }

    decline() {
        mp.events.callRemote('server::dice.game.decline');
    }

    accept() {
        mp.events.callRemote('server::dice.game.accept');
    }
    /**
     * @param data {string}
     */
    showNoty(data) {
        try {
            this.browser.call('cef::dice.show', 'noty', data);
        } catch (e) {
            mp.events.callRemote('try_catch', 'dice', 'showNoty', e);
        }
    }

    /**
     * @param targetName {string}
     * @param targetId {number}
     */
    showMenu(targetName, targetId) {
        try {
            this.inMenu = true;
            mp.console.logInfo('XX ' + targetName + ' ' + targetId);
            this.browser.call('cef::dice.show', 'menu', targetName, targetId);
        } catch (e) {
            mp.events.callRemote('try_catch', 'dice', 'events', e);
        }
    }
    
    keyE() {
        try {
            if (this.inGame || this.inMenu) {
                return;
            }

            const pos = mp.players.local.position;

            let closestPlayer = null,
                minDistance = 2.3;

            mp.players.forEachInStreamRange(current => {
                if (current === mp.players.local || current.type !== 'player') {
                    return;
                }

                const targetPos = current.position;

                const distance = mp.game.gameplay.getDistanceBetweenCoords(
                    pos.x, pos.y, pos.z,
                    targetPos.x, targetPos.y, targetPos.z,
                    true
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPlayer = current;
                }
            });

            if (closestPlayer && minDistance <= 3.0) {
                mp.events.callRemote('server::dice.offerGame', closestPlayer.remoteId);
            }
        } catch (e) {
            mp.events.callRemote('try_catch', 'dice', 'keyE', e);
        }
    }

    /**
     * @param targetId {number}
     * @param betValue {number}
     */
    placeBet(targetId, betValue) {
        try {
            this.inMenu = false;
            mp.gui.cursor.show(false, false);

            const target = mp.players.atRemoteId(targetId);
            if (!target || !mp.players.exists(target)) {
                return;
            }

            mp.events.callRemote('server::dice.placeBet', targetId, betValue);
        } catch (e) {
            mp.events.callRemote('try_catch', 'dice', 'placeBet', e);
        }
    }
}

const dice = new Dice();