# @eolthar/events
A lightweight, high-performance event system for fast and scalable projects.

```
npm i @eolthar/events
```

## Usage
```js
const { createEmitter } = require("@eolthar/events");

const emitter = createEmitter();

// Subscribe to an event
const off = emitter.on("hello", (name) => {
    console.log(`Hello, ${name}!`);
});

// Emit an event
emitter.emit("hello", "Alice"); // Hello, Alice!

// Unsubscribe from the event
off();

// Emitting again won't call the listener
emitter.emit("hello", "Bob"); // nothing happens
```

## API
### `createEmitter()`
Creates a new event emitter instance.

#### Methods
- **`on(event, callback)`** - Subscribes to a named event. Returns a function that can be called to unsubscribe.
- **`emit(event, ...args)`** - Emits the specified event with any number of arguments. Calls all registered listeners in the order they were added.