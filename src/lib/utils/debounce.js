/**
 * Creates a debounced version of an async function that delays invoking it until
 * after a specified wait time has elapsed since the last call. Optionally supports:
 * - Leading calls (immediate execution on first call in a burst)
 * - Max wait time (guaranteeing execution at least every `maxWait` ms)
 *
 * Useful for reducing frequent async operations such as saving to storage.
 *
 * @param {(...args: any[]) => Promise<any>} fn - The async function to debounce
 * @param {object} [options] - Configuration options
 * @param {boolean} [options.immediate=false] - If true, trigger on the leading call
 * @param {number} [options.delay=1000] - Delay in milliseconds before invoking after last call
 * @param {number} [options.maxWait] - Maximum time in ms before a call is forced to execute
 * @returns {(...args: any[]) => void} - Debounced function (fire-and-forget)
 *
 * @example
 * // Save state after user stops typing for 100ms, but at least every 2s
 * const saveState = debounce(async () => {
 *     await browser.storage.local.set({ key: value });
 * }, { delay: 100, maxWait: 2000 });
 *
 * // Leading call + trailing call
 * const onScroll = debounce(async () => { ... }, { delay: 200, immediate: true });
 */
export function debounce(fn, { immediate = false, delay = 1000, maxWait } = {}) {
    let timeout = null;

    let maxTimeout = null;

    let lastInvokeTime = 0;
    let firstCallTime = 0;
    let pendingArgs = null;

    const invoke = () => {
        if (!pendingArgs) return;
        fn(...pendingArgs);
        lastInvokeTime = Date.now();
        firstCallTime = 0;
        pendingArgs = null;
    };

    const startMaxWaitTimer = () => {
        if (maxTimeout) return; // Already running
        if (maxWait === undefined) return;

        const timeSinceFirstCall = Date.now() - firstCallTime;
        const timeLeft = maxWait - timeSinceFirstCall;

        maxTimeout = setTimeout(() => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            invoke();
            maxTimeout = null;
        }, timeLeft);
    };

    return (...args) => {
        pendingArgs = args;

        const now = Date.now();

        if (firstCallTime === 0) {
            firstCallTime = now;
        }

        if (immediate && lastInvokeTime === 0) {
            invoke();
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            if (!immediate) {
                invoke();
            }
            if (maxTimeout) {
                clearTimeout(maxTimeout);
                maxTimeout = null;
            }
            timeout = null;
        }, delay);

        startMaxWaitTimer();
    };
}
