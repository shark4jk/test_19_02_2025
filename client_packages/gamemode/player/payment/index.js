class Money {
    constructor() {
        this.events();
    }

    events() {
        mp.events.add('client::player.setMoney', this.set.bind(this));

        mp.events.add('render', this.render.bind(this));
    }

    render() {
        if (!this.money) {
            return;
        }

        mp.game.graphics.drawText(`$${this.money}`, [0.8, 0.87], {
            font: 0,
            color: [255, 255, 255, 200],
            scale: [0.37, 0.37],
            outline: true
        });
    }

    /**
     * @param amount {number}
     */
    set(amount) {
        this.money = amount;
    }
}

const money = new Money();