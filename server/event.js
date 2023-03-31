class EventDispatcher {
  constructor() {
    this.listeners = {};
  }

  addEventListener(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  on(...args) {
    this.addEventListener(...args);
  }

  removeEventListener(eventType, callback) {
    const idx = this.listeners[eventType].indexOf(callback);
    this.listeners[eventType].splice(idx, 1);
  }

  clearEventListener(eventType) {
    this.listeners[eventType] = [];
  }

  fire(eventType, ...params) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((callback) => {
        callback(...params);
      });
    }
  }
}

module.exports = {
  EventDispatcher,
};
