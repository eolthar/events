# @eolthar/events

A lightweight, high-performance event emitter for fast and scalable projects.

```
npm i @eolthar/events
```

## Benchmark

| Category                          | @eolthar/events |     tseep | EventEmitter3 |    NanoEvents |      mitt |
| :-------------------------------- | --------------: | --------: | ------------: | ------------: | --------: |
| **1. Mass subscription and emit** |   **4 151 932** | 3 875 026 |     3 225 172 |     3 774 587 | 3 276 026 |
| **2. Unsubscribe**                |       6 198 889 | 6 286 916 |     4 384 381 | **7 885 637** | 5 295 300 |
| **3. on → emit → off**            |       2 348 937 | 2 727 954 |     2 509 048 | **3 543 034** | 2 744 207 |
| **4. emit (0 arguments)**         |  **10 397 673** | 8 126 418 |     6 837 431 |     8 565 591 | 6 764 343 |
| **5. emit (5 arguments)**         |   **9 915 638** | 8 080 340 |     6 901 530 |     7 531 209 | 6 454 089 |
| **6. emit (10 arguments)**        |   **9 183 703** | 7 561 947 |     4 503 834 |     6 767 050 | 6 023 215 |

## Usage

```js
const { Emitter } = require("@eolthar/events");

const emitter = new Emitter();

function handler(name) {
    console.log(`Hello, ${name}!`);
}

// Subscribe to an event
emitter.on("hello", handler);

// Emit an event
emitter.emit("hello", "Alice"); // Hello, Alice!

// Unsubscribe from the event
emitter.off("hello", handler);

// Emitting again won't call the listener
emitter.emit("hello", "Bob"); // nothing happens
```

## API

### `new Emitter()`

Creates a new event emitter instance.

### `emitter.on(event, listener)`

Subscribes a listener to a named event.

```js
emitter.on("data", (value) => console.log(value));
```

### `emitter.off(event, listener)`

Removes a specific listener from an event.

```js
function handler(value) {
    console.log(value);
}

emitter.on("data", handler);
emitter.off("data", handler);
```

### `emitter.once(event, listener)`

Subscribes a listener that is automatically removed after the first call. Returns the internal wrapper function, which can be passed to `off` to manually remove the listener before it fires.

```js
emitter.once("connect", () => console.log("connected!"));
emitter.emit("connect"); // connected!
emitter.emit("connect"); // nothing happens
```

### `emitter.emit(event, ...args)`

Emits the specified event, calling all registered listeners in the order they were added.

```js
emitter.emit("data", 1, 2, 3);
```

### `emitter.clear(event?)`

Removes all listeners for a specific event. If no event is provided, clears all events.

```js
emitter.clear("data"); // removes all listeners for "data"
emitter.clear(); // removes everything
```

## License

MIT
