export default class Objective {
    constructor (game) {
        // config data
        this.config = this.config || {};

        this._game = game;
    }

    isComplete () {
        return true;
    }
};
