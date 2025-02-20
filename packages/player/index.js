/** Система денежных средств */

require('./payment/index.js');






/**
 * Тестовый баланс
 * @param player {PlayerMp}
 */
mp.events.add('playerReady', (player) => {
    if (player.money) {
        return;
    }

    player.setVariable('inCasino', true);

    player.money = 50000;
    player.call('client::player.setMoney', [player.money]);
});