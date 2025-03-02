/**
 * Return this from a transform function to skip rerendering
 */
export const SKIP = Symbol("SKIP");
export type SKIP = typeof SKIP;

export interface SignalTransform<T, R = T> {
	(newValue: T, oldValue: T, skip: SKIP): T | SKIP;
	(newValue: R, oldValue: T, skip: SKIP): T | SKIP;
}

export interface SignalOptions<T, R> {
	/**
	 * A function to transform the value as it comes in. can return SKIP to skip rerendering
	 * @param newValue
	 * @param oldValue
	 * @param skip the SKIP value. Return it to skip rerendering
	 * @returns
	 */
	transform?: SignalTransform<T, R>;
}

export const noOp = <T>(v: T) => v as unknown as T;

/**
 * A reactive value.
 * @param value initial value
 * @param options
 * @returns
 */
export const Signal = <
	T,
	R = T,
	Listener extends (v: T, o: T) => void = (v: T, o: T) => void
>(
	value: T,
	{ transform = noOp }: SignalOptions<T, R> = {}
) => {
	const listeners = new Set<Listener>();

	/**
	 * Listen when a new value is set
	 */
	const on = (fn: Listener) => {
		listeners.add(fn);
		return signal;
	};

	/**
	 * Removes a listener
	 */
	const off = (fn: Listener) => {
		listeners.delete(fn);
		return signal;
	};

	/**
	 * Set a new value
	 */
	const set = (newValue: R) => {
		const derivedValue = transform(newValue, value, SKIP);
		if (derivedValue === SKIP || derivedValue === value) {
			return signal;
		}
		const oldValue = value;
		value = derivedValue;
		listeners.forEach((fn) => fn(value, oldValue));
		return signal;
	};

	/**
	 * Read the current value
	 */
	const get = () => value;

	const signal = { on, off, set, get };
	return signal;
};

export type Signal<T, R> = ReturnType<typeof Signal<T, R>>;
