mp.events.addCommand({
    /**
     * @param player {PlayerMp}
     */
    'tpcasino': (player) => {
        player.position = new mp.Vector3(1090.11, 208.14, -49);
        player.rotation = new mp.Vector3(0, 0,335.65);

        player.setVariable('inCasino', true);

        player.outputChatBox('Телепортирован в казино.');
    }
})