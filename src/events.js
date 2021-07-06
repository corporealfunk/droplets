/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */

const Events = {
  // Event system
  _initEvents: function () {
    this._events = this._events ? this._events : {};
  },

  on: function (eventName, cb) {
    this._initEvents();
    const eventArray = this._events[eventName] || [];
    eventArray.push(cb);
    this._events[eventName] = eventArray;
  },

  // TODO: this clears all the listeners by that name, maybe not good
  off: function (eventName) {
    this._initEvents();
    delete this._events[eventName];
  },

  offAll: function () {
    this._initEvents();
    this._events = {};
  },

  trigger: function (eventName) {
    this._initEvents();
    const eventArray = this._events[eventName] || [];

    eventArray.forEach((cb) => cb());
  },
};

export default Events;
