const createEmitter = () => {
    const events = {};
    return {
        on(event, cb) {
            (events[event] || (events[event] = [])).push(cb);
            return () => {
                const arr = events[event];
                const idx = arr.indexOf(cb);
                if (idx !== -1) arr.splice(idx, 1);
            };
        },
        emit(event, ...args) {
            const arr = events[event];
            if (arr) {
                for (let i = 0, l = arr.length; i < l; i++) {
                    arr[i](...args);
                }
            }
        }
    };
};

module.exports = { createEmitter };