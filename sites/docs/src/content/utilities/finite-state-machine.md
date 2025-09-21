---
title: FiniteStateMachine
description: Defines a strongly-typed finite state machine.
category: State
---

<script>
	import Demo from '$lib/components/demos/finite-state-machine.svelte';
</script>

## Demo

<Demo />

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "disabled" | "idle" | "running";
type MyEvents = "toggleEnabled" | "start" | "stop";

const f = new FiniteStateMachine<MyStates, MyEvents>("disabled", {
	disabled: {
		toggleEnabled: "idle"
	},
	idle: {
		toggleEnabled: "disabled",
		start: "running"
	},
	running: {
		_enter: () => {
			f.debounce(2000, "stop");
		},
		stop: "idle",
		toggleEnabled: "disabled"
	}
});
```

## Usage

Finite state machines (often abbreviated as "FSMs") are useful for tracking and manipulating
something that could be in one of many different states. It centralizes the definition of every
possible _state_ and the _events_ that might trigger a transition from one state to another. Here is
a state machine describing a simple toggle switch:

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off";
type MyEvents = "toggle";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on"
	},
	on: {
		toggle: "off"
	}
});
```

The first argument to the `FiniteStateMachine` constructor is the initial state. The second argument
is an object with one key for each state. Each state then describes which events are valid for that
state, and which state that event should lead to.

In the above example of a simple switch, there are two states (`on` and `off`). The `toggle` event
in either state leads to the other state.

You send events to the FSM using `f.send`. To send the `toggle` event, invoke `f.send('toggle')`.

### Actions

Maybe you want fancier logic for an event handler, or you want to conditionally transition into
another state. Instead of strings, you can use _actions_.

An action is a function that returns a state. An action can receive parameters, and it can use those
parameters to dynamically choose which state should come next. It can also prevent a state
transition by returning nothing.

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off" | "cooldown";
type MyEvents = "toggle";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => {
			if (isTuesday) {
				// Switch can only turn on during Tuesdays
				return "on";
			}
			// All other days, nothing is returned and state is unchanged.
		}
	},
	on: {
		toggle: (heldMillis: number) => {
			// You can also dynamically return the next state!
			// Only turn off if switch is depressed for 3 seconds
			if (heldMillis > 3000) {
				return "off";
			}
		}
	}
});
```

### Lifecycle methods

You can define special handlers that are invoked whenever a state is entered or exited:

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off";
type MyEvents = "toggle";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on",
		_enter: (meta) => {
			console.log("switch is off");
		},
		_exit: (meta) => {
			console.log("switch is no longer off");
		}
	},
	on: {
		toggle: "off",
		_enter: (meta) => {
			console.log("switch is on");
		},
		_exit: (meta) => {
			console.log("switch is no longer on");
		}
	}
});
```

The lifecycle methods are invoked with a metadata object containing some useful information:

- `from`: the name of the event that is being exited
- `to`: the name of the event that is being entered
- `event`: the name of the event which has triggered the transition
- `args`: (optional) you may pass additional metadata when invoking an action with
  `f.send('theAction', additional, params, as, args)`

The `_enter` handler for the initial state is called upon creation of the FSM. It is invoked with
both the `from` and `event` fields set to `null`.

### Wildcard handlers

There is one special state used as a fallback: `*`. If you have the fallback state, and you attempt
to `send()` an event that is not handled by the current state, then it will try to find a handler
for that event on the `*` state before discarding the event:

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off";
type MyEvents = "toggle" | "emergency";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on"
	},
	on: {
		toggle: "off"
	},
	"*": {
		emergency: "off"
	}
});

// will always result in the switch turning off.
f.send("emergency");
```

### Debouncing

Frequently, you want to transition to another state after some time has elapsed. To do this, use the
`debounce` method:

```ts
f.send("toggle"); // turn on immediately
f.debounce(5000, "toggle"); // turn off in 5000 milliseconds
```

If you re-invoke debounce with the same event, it will cancel the existing timer and start the
countdown over:

```ts
// schedule a toggle in five seconds
f.debounce(5000, "toggle");
// ... less than 5000ms elapses ...
f.debounce(5000, "toggle");
// The second call cancels the original timer, and starts a new one
```

You can also use `debounce` in both actions and lifecycle methods. In both of the following
examples, the lightswitch will turn itself off five seconds after it was turned on:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => {
			f.debounce(5000, "toggle");
			return "on";
		}
	},
	on: {
		toggle: "off"
	}
});
```

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on"
	},
	on: {
		toggle: "off",
		_enter: () => {
			f.debounce(5000, "toggle");
		}
	}
});
```

## Notes

`FiniteStateMachine` is a loving rewrite of
[kenkunz/svelte-fsm](https://github.com/kenkunz/svelte-fsm).

FSMs are ideal for representing many different kinds of systems and interaction patterns.
`FiniteStateMachine` is an intentionally minimalistic implementation. If you're looking for a more
powerful FSM library, [statelyai/xstate](https://github.com/statelyai/xstate) is an excellent
library with more features&thinsp;—&thinsp;and a steeper learning curve.
