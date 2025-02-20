import { defineStore } from 'pinia';

export const DiceStore = defineStore('interface_dice', {
    state: () => ({
        showMenu: false,
        showNoty: false,
        showResult: false,

        targetName: 'Dorathy Stark',
        targetId: null,
        initiatorName: 'Dorathy Stark',

        result: 'lose',
        callBet: 0,
        betValue: 0,
    }),
    actions: {
        /**
         * @param menu {string}
         * @param value {string}
         * @param value2 {number | null}
         */
        open(menu, value, value2) {
            switch (menu) {
                case 'menu':
                    this.betValue = 0;
                    this.targetName = value;
                    this.targetId = value2;
                    this.showMenu = true;
                    break;
                case 'noty':
                    value = JSON.parse(value);

                    this.initiatorName = value.senderName;
                    this.callBet = value.amount;
                    this.showNoty = true;
                    break;
                case 'result':
                    this.showResult = true;
                    this.result = value;

                    setTimeout(() => {
                        this.showResult = false;
                    }, 2000);
                    break;
            }
        },
        placeBet() {
            if (typeof mp === 'undefined') {
                return;
            }

            this.showMenu = false;
            mp.trigger('client::dice.placeBet', this.targetId, this.betValue);
        },
        declineBtn() {
            if (typeof mp === 'undefined') {
                return;
            }

            this.showNoty = false;
            mp.trigger('client::dice.decline');
        },
        acceptBtn() {
            if (typeof mp === 'undefined') {
                return;
            }

            this.showNoty = false;
            mp.trigger('client::dice.accept');
        },

        /**
         * @returns {string}
         */
        getResultTitle() {
            if (this.result === 'win') {
                return 'Вы выиграли!';
            } else if (this.result === 'lose') {
                return 'Вы проиграли!';
            } else {
                return 'Ничья!';
            }
        },

        getResultColor() {
            if (this.result === 'win') {
                return '#00ff00';
            } else if (this.result === 'lose') {
                return '#ff0000';
            } else {
                return '#ffdd00';
            }
        }
    }
});
