import './browserTypes.d.ts'
import { type Signal} from "../any/Signal.ts";
import { type Json } from "../types/jsonType.ts";

/**
 * Creates a localstorage adapter around the provided signal and returns the signal.
 * It:
 *  - sets the initial value of the signal to the value stored in localstorage. 
 *     If you have any listeners attached to the signal, they will be called 
 *     with this value. Therefore, it is intended that this adapter is used 
 *     before any listeners are attached to the signal.
 *     If any value was assigned to the signal, it will be _replaced_.
 *   - stores the value of the signal in localstorage any time the signal is updated.
 * @param signal any signal-compliant object
 * @param localStorageKey a unique string to identify the value in localstorage
 * @returns the signal passed.
 */
export const LocalStorageSignalAdapter = <S extends Signal<Json, any>>(
    signal: S,
    localStorageKey: string,
) => {
    const value = JSON.parse(
        localStorage.getItem(localStorageKey) || JSON.stringify(signal.get()),
    );
    signal.set(value);
    signal.on((value) => localStorage.setItem(localStorageKey, JSON.stringify(value)));

    return signal;
};