const forge = new Map();
const sigs = new Map([
    [0, ""],
    [1, "a0"]
]);

function compile(pool, argc) {
    const len = pool.length;
    const stamp = len + "-" + argc;
    const mold = forge.get(stamp);
    if (mold !== undefined) return mold(pool);
    let args = sigs.get(argc);
    if (args === undefined) {
        args = "a0";
        for (let i = 1; i < argc; i++) args += ",a" + i;
        sigs.set(argc, args);
    }
    let pins = "",
        fire = "";
    for (let i = 0; i < len; i++) {
        pins += "var f" + i + "=c[" + i + "];";
        fire += "f" + i + "(" + args + ");";
    }
    const nep = eval("(function(c){" + pins + "return function(" + args + "){" + fire + "}})");
    forge.set(stamp, nep);
    return nep(pool);
}

class Emitter {
    constructor() {
        this.events = new Map();
    }

    on(event, listener) {
        let e = this.events.get(event);
        if (!e) {
            this.events.set(event, { exec: listener, arity: listener.length, pool: null });
            return;
        }
        if (e.pool === null) {
            e.pool = [e.exec, listener];
        } else {
            e.pool.push(listener);
        }
        if (listener.length > e.arity) e.arity = listener.length;
        e.exec = compile(e.pool, e.arity);
    }

    off(event, listener) {
        const e = this.events.get(event);
        if (!e) return;
        if (e.pool === null) {
            if (e.exec === listener) this.events.delete(event);
            return;
        }
        const pool = e.pool;
        const idx = pool.indexOf(listener);
        if (idx === -1) return;
        const last = pool[pool.length - 1];
        if (last !== listener) pool[idx] = last;
        pool.pop();
        if (pool.length === 1) {
            const single = pool[0];
            e.exec = single;
            e.arity = single.length;
            e.pool = null;
        } else {
            if (listener.length >= e.arity) {
                let max = 0;
                for (let i = 0; i < pool.length; i++) {
                    if (pool[i].length > max) max = pool[i].length;
                }
                e.arity = max;
            }
            e.exec = compile(e.pool, e.arity);
        }
    }

    clear(event) {
        if (event === undefined) {
            this.events.clear();
        } else {
            this.events.delete(event);
        }
    }

    once(event, listener) {
        const self = this;
        let called = false;
        const wrapper = function () {
            if (called) return;
            called = true;
            self.off(event, wrapper);
            listener.apply(undefined, arguments);
        };
        Object.defineProperty(wrapper, "length", { value: listener.length });
        this.on(event, wrapper);
        return wrapper;
    }

    emit(event, a, b, c, d, f) {
        const e = this.events.get(event);
        if (!e) return;
        const l = e.arity;
        if (l < 6) {
            e.exec(a, b, c, d, f);
        } else {
            const r = new Array(l);
            for (let i = 0; i < l; i++) r[i] = arguments[i + 1];
            e.exec.apply(undefined, r);
        }
    }
}

module.exports = { Emitter };
