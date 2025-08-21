import { defaultStorageObject } from '../storage/default-object.js';
import { cleanObject, getStorageArea } from '../storage/utils.js';
import { debounce } from '../utils/debounce.js';
// Immediately clean storage area on module import
(async () => {
    const raw = await (async () => {
        // await getStorageArea().get() because get() returns a promise
        return cleanObject(await getStorageArea().get(), defaultStorageObject);
    })();

    await getStorageArea().clear();
    await getStorageArea().set(raw);
})();

export async function loadState() {
    return cleanObject(await getStorageArea().get(), defaultStorageObject);
}

// Debounced save to reduce frequent storage writes
export const saveState = debounce(
    async saveObject => {
        try {
            await getStorageArea().set(
                cleanObject(saveObject, defaultStorageObject)
            );
            console.log('Storage saved');
        } catch (err) {
            console.error('Failed to save to storage:', err);
        }
    },
    { delay: 500, maxWait: 1000 }
);
