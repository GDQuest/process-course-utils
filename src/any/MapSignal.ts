import { noOp, Signal, type SignalOptions } from "./Signal.ts";

/**
 * Reactive hashmap. Builds on {@see Signal}
 */
export const MapSignal = <T extends Record<string, unknown>>(
    value: T,
    { transform = noOp }: SignalOptions<T, T> = {},
) => {
    type Listener = (
        key: keyof T,
        value: T[keyof T],
        oldValue?: T[keyof T],
    ) => void;
    type ListenerRemovalOrAdditions = (
        key: keyof T,
        value: T[keyof T],
    ) => void;

    const signal = Signal<T>(value, { transform });

    const listenersForAdditions = new Set<ListenerRemovalOrAdditions>();
    const listenersForRemovals = new Set<ListenerRemovalOrAdditions>();
    const listenersForChange = new Set<Listener>();

    const setItem = (key: keyof T, value: T[keyof T]) => {
        const oldData = signal.get();
        const newData = {...oldData, [key]: value};
        signal.set(newData);
        if (!(key in oldData)) {
            listenersForAdditions.forEach((fn) => fn(key, value));
        } else if (oldData[key] === value) {
            return;
        } else {
            listenersForChange.forEach((fn) => fn(key, value, oldData[key]));
        }
    };

    const getItem = (key: keyof T) => signal.get()[key];

    const hasItem = (key: keyof T) => key in signal.get();

    const removeItem = (key: keyof T) => {
        const oldData = signal.get();
        if (!(key in oldData)) {
            return;
        }
        const {[key]:_delete, ...newData} = oldData
        listenersForRemovals.forEach((fn) => fn(key, oldData[key] as T[keyof T]));
        signal.set(newData as T);
    };

    const onKeyAdded = (fn: ListenerRemovalOrAdditions) =>
        listenersForAdditions.add(fn);
    const offKeyAdded = (fn: ListenerRemovalOrAdditions) =>
        listenersForAdditions.delete(fn);

    const onKeyRemoved = (fn: ListenerRemovalOrAdditions) =>
        listenersForRemovals.add(fn);
    const offKeyRemoved = (fn: ListenerRemovalOrAdditions) =>
        listenersForRemovals.delete(fn);

    const onKeyChanged = (fn: Listener) => listenersForChange.add(fn);
    const offKeyChanged = (fn: Listener) => listenersForChange.delete(fn);

    return {
        ...signal,
        setItem,
        getItem,
        hasItem,
        removeItem,
        onKeyAdded,
        offKeyAdded,
        onKeyRemoved,
        offKeyRemoved,
        onKeyChanged,
        offKeyChanged,
    };
};
