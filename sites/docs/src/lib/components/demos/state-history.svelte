<script>
	import {StateHistory} from "runed"

	// I'm doing everything here cause I can't rename files for some reason
	let states = $state([])
	const history = new StateHistory(() => states, (s) => states = s)

	class Undoable {
		#idx

		constructor(initial) {
			states.push(initial)
			this.#idx = states.length - 1

			$effect(() => {
				console.log(states[this.#idx])
				states = states
			})


			$effect(() => {
				return () => {
					states.splice(this.#idx, 1)
				}
			})
		}

		get current() {
			return states[this.#idx]
		}

		set current(val) {
			states[this.#idx] = val
		}
	}

	// App logic starts here
	let count1 = new Undoable(0)

</script>

<button onclick={() => count1.current++}>
	clicks: {count1.current}
</button>

<br />

<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
