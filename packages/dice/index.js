const money = require('../player/payment/index.js');
const cfg = require('./config.js');

mp.events.add({
    /**
     *
     * @param initiator {PlayerMp}
     * @param targetId {number}
     * @param betValue {number}
     */
    'server::dice.placeBet': (initiator, targetId, betValue) => {
        dice.betRequest(initiator, targetId, betValue);
    },

    /**
     * @param initiator {PlayerMp}
     * @param targetId {number}
     */
    'server::dice.offerGame': (initiator, targetId) => {
        dice.handleRequest(initiator, targetId);
    },

    /**
     * @param player {PlayerMp}
     */
    'server::dice.game.accept': (player) => {
        dice.handleAccept(player);
    },

    /**
     * @param player {PlayerMp}
     */
    'server::dice.game.decline': (player) => {
        dice.handleDecline(player);
    },

    /**
     * @param player {PlayerMp}
     */
    'playerQuit': (player) => {
        if (player.diceOfferTimeout) {
            clearTimeout(player.diceOfferTimeout);
        }
    }
});

const dice = {
    /**
     * @param initiator {PlayerMp}
     * @param targetId {number}
     * @param betValue {number}
     */
    betRequest(initiator, targetId, betValue) {
        const target = mp.players.at(targetId);
        if (!target || !mp.players.exists(target)) {
            initiator.outputChatBox('Игрок не найден!');
            return;
        }

        if (betValue < cfg.minBet || betValue > cfg.maxBet) {
            initiator.outputChatBox('Некорректная сумма ставки!');
            return;
        }

        if (money.get(initiator) < betValue) {
            initiator.outputChatBox('У вас недостаточно денег на минимальную ставку!');
            return;
        }

        if (money.get(target) < betValue) {
            initiator.outputChatBox('У игрока недостаточно денег на минимальную ставку!');
            return;
        }

        initiator.outputChatBox('Вы предложили игру в кости.');

        initiator.hasActiveDiceOffer = true;
        initiator.diceOfferTimeout = setTimeout(() => {
            initiator.hasActiveDiceOffer = false;
        }, 10000);


        target.diceOffer = {
            senderId: initiator.id,
            senderName: initiator.name,
            amount: betValue
        }

        target.call('client::dice.showNoty', [JSON.stringify(target.diceOffer)]);
    },

    /**
     * @param initiator {PlayerMp}
     * @param targetId {number}
     */
    handleRequest(initiator, targetId) {
        const target = mp.players.at(targetId);
        if (!target || !mp.players.exists(target)) {
            return;
        }

        if (!initiator.getVariable('inCasino')) {
            initiator.outputChatBox('Вы не находитесь в казино!');
            return;
        }

        if (!target.getVariable('inCasino')) {
            initiator.outputChatBox('Игрок не находится в казино!');
            return;
        }

        if (initiator.getVariable('inDiceGame')) {
            return;
        }

        if (initiator.hasActiveDiceOffer) {
            initiator.outputChatBox(`Вы уже отправили предложение`);
            return
        }

        if (target.hasActiveDiceOffer) {
            initiator.outputChatBox(`Игрок отправил предложение`);
            return;
        }

        if (initiator === target) {
            initiator.outputChatBox('Нельзя играть в кости с самим собой!');
            return;
        }

        if (initiator.diceOffer) {
            initiator.outputChatBox('Вам уже отправили предложение!');
            return;
        }

        if (target.getVariable('inDiceGame')) {
            initiator.outputChatBox('Игрок уже играет в кости!');
            return;
        }

        if (money.get(initiator) < cfg.minBet) {
            initiator.outputChatBox('У вас недостаточно денег на минимальную ставку!');
            return;
        }

        if (money.get(target) < cfg.minBet) {
            initiator.outputChatBox('У игрока недостаточно денег на минимальную ставку!');
            return;
        }

        if (target.diceOffer) {
            initiator.outputChatBox('Игроку уже отправили предложение!');
            return;
        }

        initiator.call('client::dice.showMenu', [target.name, target.id]);
    },

    /**
     * @param player {PlayerMp}
     */
    handleDecline(player) {
        try {
            let target = player;

            if (!target.diceOffer) {
                return;
            }

            let offer = target.diceOffer;
            let initiator = mp.players.at(offer.senderId);
            if (!initiator || !mp.players.exists(initiator)) {
                target.outputChatBox('Игрок отключился.');
                return;
            }

            clearTimeout(initiator.diceOfferTimeout);

            initiator.outputChatBox('Игрок отказался от игры в кости');
            target.outputChatBox('Вы отказались от игры в кости');

            initiator.hasActiveDiceOffer = false;
            delete target.diceOffer;
        } catch (e) {
            console.log('Dice handleDecline e: ' + e);
        }
    },

    /**
     * @param player {PlayerMp}
     */
    handleAccept(player) {
        try {
            let target = player;

            if (!target.diceOffer) {
                return;
            }

            let offer = player.diceOffer;
            let initiator = mp.players.at(offer.senderId);
            if (!initiator || !mp.players.exists(initiator)) {
                player.outputChatBox('Игрок отключился.');
                return;
            }

            clearTimeout(initiator.diceOfferTimeout);

            let winner, loser, isDraw;
            const targetCount = this.randomInteger(1, 6);
            const senderCount = this.randomInteger(1, 6);

            if (senderCount > targetCount) {
                winner = initiator;
                loser = target;
            } else if (targetCount > senderCount) {
                winner = target;
                loser = initiator;
            } else {
                target.outputChatBox(`Вы сыграли в ничью`);
                initiator.outputChatBox(`Вы сыграли в ничью`);
                isDraw = true;
            }

            if (!isDraw) {
                money.pay(loser, 'remove', offer.amount);
                money.pay(winner, 'add', offer.amount);

                winner.outputChatBox(`Поздравляем, вы выиграли!`);
                loser.outputChatBox(`К сожалению, вы проиграли!`);
            }

            const data = {
                senderName: initiator.name,
                senderId: initiator.id,
                senderCount: senderCount,
                targetName: target.name,
                targetId: target.id,
                targetCount: targetCount
            }

            winner.call('client::dice.showResult', ['win']);
            loser.call('client::dice.shoResult', ['lose']);

            initiator.hasActiveDiceOffer = false;
            delete target.diceOffer;
        } catch (e) {
            console.log('Dice handleAccept e: ' + e);
        }
    },

    randomInteger(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }
}