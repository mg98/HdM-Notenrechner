const utils = {};

// create a new store
utils.createStore = function() {
    return {
        semester: 0,
        studies: null,
        alleModule: [],
        leistungen: {},
        loggedIn: false,
        showAddContent: false,
        subscribers: [],
        subscribe: function(s) {
            this.subscribers.push(s);
        },
        notify: function() {
            for (let i = 0; i < this.subscribers.length; i++) {
                this.subscribers[i](this);
            }
        },
    };
};

export default utils;
