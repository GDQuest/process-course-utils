import { Signal } from "./Signal.ts";

/**
 * Reactive collection. Builds on {@see Signal}
 */
export const Collection = <T>(value: T[] = []) => {
	const signal = Signal<T[]>(value);
    
	const append = (value: T) => signal.set([...signal.get(), value]);
	const at = (index: number) => signal.get()[index];
	const removeAt = (index: number) => {
		const newArr = signal.get().slice();
		newArr.splice(index, 1);
		return signal.set(newArr);
	};
	const map = <R>(fctor: (value: T) => R) => signal.get().map(fctor);
	return { ...signal, append, at, removeAt, map };
};
