const createEmitter = () => {
    const e = {};
    return {
        on(event, listener) {
            (e[event] || (e[event] = [])).push(listener);
            return () => {
                const a = e[event];
                const i = a.indexOf(listener);
                if (i !== -1) a.splice(i, 1);
            };
        },
        emit(event, ...args) {
            const a = e[event];
            if (a) for (let i = 0, l = a.length; i < l; i++) a[i](...args);
        }
    };
};

module.exports = { createEmitter };