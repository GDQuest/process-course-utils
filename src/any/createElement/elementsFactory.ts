import { createElementTemplate } from './createElementTemplate.ts';


export const elementsFactory = <
  K extends keyof HTMLElementTagNameMap,
  Ks extends readonly K[],
>(
  ...names: Ks
) => {
  type Values = {
    [K in Ks[number]]: ReturnType<typeof createElementTemplate<K>>;
  };
  return names.reduce((v, k) => {
    v[k] = createElementTemplate(k);
    return v;
  }, {} as Values);
};
