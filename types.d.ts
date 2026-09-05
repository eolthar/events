/** Argument tuple a listener is called with. */
export type EventArgs = readonly any[];

/**
 * Constraint for an event map: event name -> argument tuple.
 * Written as `Record<keyof T, EventArgs>` so plain interfaces are accepted
 * without an index signature.
 */
export type EventMap<T = any> = Record<keyof T, EventArgs>;

/** Default map: any event name, any arguments. */
export type DefaultEventMap = Record<string | symbol, any[]>;

/** Listener taking the arguments of tuple `A`. Return value is ignored. */
export type Listener<A extends EventArgs = any[]> = (...args: A) => void;

/** Event names absent from `Events`. Used by the untyped fallback overloads. */
export type UnknownEvent<Events, S extends string | symbol> =
    Exclude<S, keyof Events>;

/**
 * Internal event record. Not part of the public contract.
 * @internal
 */
export interface EventEntry {
    /** The listener itself when there is one, otherwise the compiled dispatcher. */
    exec: Listener;
    /** Highest `length` among the event's listeners. */
    arity: number;
    /** `null` while a single listener is registered, an array beyond that. */
    pool: Listener[] | null;
}

/**
 * Event emitter with a dispatcher compiled for the current listener set.
 *
 * Differs from Node's `EventEmitter`: no chaining (methods return `undefined`),
 * `off` does not preserve listener order, arguments beyond the event's arity
 * are dropped, no listener limit, no `newListener` / `removeListener`, and a
 * throwing listener aborts the remainder of the `emit`.
 *
 * @typeParam Events - event map. Omit it to leave the emitter untyped.
 */
export declare class Emitter<Events extends EventMap<Events> = DefaultEventMap> {
    /**
     * Internal event storage. Not part of the public contract.
     * @internal
     */
    readonly events: Map<keyof Events | (string & {}) | symbol, EventEntry>;

    constructor();

    /**
     * Registers a listener. Registering the same function twice makes it fire
     * twice, and each `off` removes one registration.
     *
     * Arity is taken from `listener.length`, so a listener declared with rest
     * or default parameters reports a lower arity than it accepts and may cause
     * arguments to be dropped for the whole event.
     *
     * @param event - event name.
     * @param listener - function invoked on emit.
     */
    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void;
    /**
     * Fallback overload for events outside the map; arguments are untyped.
     * @param event - event name absent from `Events`.
     * @param listener - function invoked on emit.
     */
    on<S extends string | symbol>(
        event: UnknownEvent<Events, S>,
        listener: Listener<any[]>
    ): void;

    /**
     * Registers a listener that fires once and removes itself. Removal happens
     * before the listener runs.
     *
     * @param event - event name.
     * @param listener - function invoked on the first emit.
     * @returns The wrapper actually registered; pass it to `off` to cancel
     * early, as the original listener will not be found.
     */
    once<K extends keyof Events>(
        event: K,
        listener: Listener<Events[K]>
    ): Listener<Events[K]>;
    /**
     * Fallback overload for events outside the map; arguments are untyped.
     * @param event - event name absent from `Events`.
     * @param listener - function invoked on the first emit.
     * @returns The wrapper actually registered.
     */
    once<S extends string | symbol>(
        event: UnknownEvent<Events, S>,
        listener: Listener<any[]>
    ): Listener<any[]>;

    /**
     * Removes one registration of a listener. Does nothing if the event or the
     * listener is not present. Remaining listeners are not kept in order: the
     * last one is moved into the freed slot.
     *
     * @param event - event name.
     * @param listener - previously registered function; for `once`, the wrapper
     * it returned.
     */
    off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void;
    /**
     * Fallback overload for events outside the map.
     * @param event - event name absent from `Events`.
     * @param listener - previously registered function.
     */
    off<S extends string | symbol>(
        event: UnknownEvent<Events, S>,
        listener: Listener<any[]>
    ): void;

    /**
     * Removes every listener of one event.
     * @param event - event name.
     */
    clear<K extends keyof Events>(event: K): void;
    /**
     * Fallback overload for events outside the map.
     * @param event - event name absent from `Events`.
     */
    clear<S extends string | symbol>(event: UnknownEvent<Events, S>): void;
    /** Removes every listener of every event. */
    clear(): void;

    /**
     * Invokes the event's listeners synchronously, in storage order. Does
     * nothing if the event has no listeners. Arguments beyond the event's arity
     * are dropped, and a throwing listener aborts the rest of the call.
     *
     * @param event - event name.
     * @param args - arguments passed to the listeners.
     */
    emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
    /**
     * Fallback overload for events outside the map.
     * @param event - event name absent from `Events`.
     * @param args - arguments passed to the listeners.
     */
    emit<S extends string | symbol>(
        event: UnknownEvent<Events, S>,
        ...args: any[]
    ): void;
}
