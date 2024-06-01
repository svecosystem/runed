/**
 * Safely cleanup when inside an effect
 */
export function safelyCleanup(cleanup: VoidFunction) {
	if (!$effect.active()) return;
	$effect(() => {
		cleanup();
	});
}
