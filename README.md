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
The full API, with typed signatures and behavioural notes, is listed in the [type declarations](https://github.com/eolthar/events/blob/main/types.d.ts).

```js
const { Emitter } = require("@eolthar/events");

// Create an emitter
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

## License
MIT