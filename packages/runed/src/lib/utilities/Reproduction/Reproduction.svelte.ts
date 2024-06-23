export class Reproduction {
	constructor(getter: () => unknown) {
		const received = $derived(getter());
		$inspect({ receivedInClass: received });
	}
}
