import './browserTypes.d.ts'
import { type Signal } from "../any/Signal.ts";
import { type WritableKeysOf } from '../types/TypeFest.ts';

export type Attribute = WritableKeysOf<Element>;
export type BindedFunction = ReturnType<typeof makeNodeSignalBinder>;

export const makeNodeSignalBinder = <T, R>(
	signal: Signal<T, R>,
	attributeValue: (val: T) => string
) => {
	function bindSignal(node: Text, attributeName?: "textContent"): void;
	function bindSignal(node: HTMLElement, attributeName?: Attribute): void;
	function bindSignal(
		node: Text | HTMLElement,
		attributeName: Attribute = "textContent"
	) {
		if (node instanceof Text) {
			node.textContent = attributeValue(signal.get());
			signal.on((v) => {
				node.textContent = attributeValue(v);
			});
			return node;
		}
		if (!(attributeName in node)) {
			throw new Error(`${attributeName} does not exist on Node`);
		}
		// @ts-expect-error can't type all attributes
		node[attributeName] = attributeValue(signal.get());
		signal.on((v) => {
			// @ts-expect-error can't type all attributes
			node[attributeName] = attributeValue(v);
		});
		return node;
	}
	return Object.assign(bindSignal, { __bind: true });
};
