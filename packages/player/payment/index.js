module.exports = {
    /**
     * @param target {PlayerMp}
     * @param amount {number}
     * @returns {boolean}
     */
    canPay(target, amount) {
        try {
            if (!target || !mp.players.exists(target)) {
                return false;
            }

            if (target.money < amount) {
                target.outputChatBox('У вас недостаточно денег!');
                return false;
            }

            return true;
        } catch (e) {
            console.log('canPayError: ' + e);
            return false;
        }
    },

    /**
     * @param target {PlayerMp}
     * @param type {string}
     * @param value {number}
     * @returns {boolean}
     */
    pay(target, type, value) {
        try {
            if (!target || !mp.players.exists(target)) {
                return false;
            }

            switch (type) {
                case 'remove':
                    if (target.money < value) {
                        target.outputChatBox('Произошла ошибка транзакции!');
                        return false;
                    }

                    target.money -= value;
                    target.call('client::player.setMoney',[target.money]);
                    return true;
                case 'add':
                    target.money += value;
                    target.call('client::player.setMoney',[target.money]);
                    return true;
            }
        } catch (e) {
            console.log('payError: ' + e);
            return false;
        }
    },

    /**
     * @param target
     * @returns {number}
     */
    get(target) {
        try {
            return target.money;
        } catch (e) {
            console.log('getError: ' + e);
            return 0;
        }
    }
}