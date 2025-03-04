import { getInputValue, type HTMLInputValue } from "./getInputValue.ts";


export type SerializedFormValues = { [key: string]: SerializedFormValue };


export type SerializedFormValue =
  | HTMLInputValue
  | SerializedFormValues
  | (HTMLInputValue | SerializedFormValues)[];


export interface SerializedForm {
  name: string;
  action: string;
  method: string;
  values: SerializedFormValues | null;
  enctype: string;
  target: string;
}


export const getFormControls = (form: HTMLFormElement | HTMLFieldSetElement) =>
  form.elements;


/**
 * Extracts all the fields from an html form, gets all their values,
 * and returns the results.
 * Some magic that happens:
 *  - files inputs will return an array of files (rather than a `FileList`)
 *  - if a file input does not have the `multiple` property, it will return a single file
 *  - checkboxes will return booleans
 *  - number and range inputs will return floats (i.e., numbers)
 *  - any field with an undefined value, or without a name will be skipped and not serialized
 *  - any button will be skipped
 *  - data will be nested, mirroring fieldsets in your form, *if* the fieldsets are named
 *  - fields ending with brackets (`field[]`) will be set on arrays. Indexes can be specified `field[0]`
 */
export const serializeComplicatedForm = (form: HTMLFormElement): SerializedForm => {
  const action = form.getAttribute("action") || "";
  const formName = form.getAttribute("name") || "";
  const enctype = form.getAttribute("enctype") || "";
  const method = form.getAttribute("method") || "";
  const target = form.getAttribute("target") || "";
  const values = serializeInputsCollection(getFormControls(form));
  const ret = { name: formName, action, method, values, enctype, target };
  return ret;
};


export const serializeFormCollection = (
  forms: NodeListOf<HTMLFormElement | HTMLFieldSetElement>
): SerializedFormValues | null => {
  const result: SerializedFormValues = {};
  const { length } = forms;
  let found = false;
  let i = 0;
  while (i < length) {
    const form = forms[i++];
    const name = form.getAttribute("name") || "";
    const elements = getFormControls(form);
    const values = serializeInputsCollection(elements);
    if (values) {
      found = true;
      setInData(name, values, result);
    }
  }
  if (!found) {
    return null;
  }
  return result;
};


const isArrayInput = (name: string) => {
  const match = name.match(/(.*?)\[(\d*)\]/);
  if (!match) {
    return { name, index: 0, isArrayElement: false };
  }
  const [, _name, _index] = match;
  return { name: _name, index: parseInt(_index), isArrayElement: true };
};


const setInData = (
  inputName: string,
  value: unknown,
  data: Record<string, unknown>
) => {
  const { name, index, isArrayElement } = isArrayInput(inputName);
  if (isArrayElement) {
    data[name] =
      data[name] && Array.isArray(data[name])
        ? (data[name] as unknown[])
        : name in data
        ? [data[name]]
        : [];
    if (isNaN(index)) {
      (data[name] as unknown[]).push(value);
    } else {
      (data[name] as unknown[])[index] = value;
    }
  } else {
    data[name] = value;
  }
};


/**
 * Serializes a collection of inputs (obtained with `form.elements` or `fieldset.elements`)
 * Returns data as a tree with keys named from the fieldset's names (if a fieldset is not named, it will not be considered)
 * @param fields A list of inputs
 * @param [nested] If false, data will be returned flat
 */
export const serializeInputsCollection = (
  fields: HTMLFormControlsCollection,
  nested: boolean = true
): SerializedFormValues | null => {
  /** @type {SerializedFormValues} */
  const data: SerializedFormValues = {};
  const { length } = fields;
  let i = 0;
  let empty = true;
  const fieldSets: HTMLFieldSetElement[] = [];
  const not_fieldSets: HTMLInputElement[] = [];

  while (i < length) {
    const input = fields[i] as HTMLInputElement | HTMLFieldSetElement;
    i++;
    const { name } = input;
    if (!name) {
      continue;
    }
    if (input.nodeName === "FIELDSET") {
      fieldSets.push(input as HTMLFieldSetElement);
    } else {
      not_fieldSets.push(input as HTMLInputElement);
    }
  }
  const inputs = nested
    ? not_fieldSets.filter(
        (input) => !fieldSets.some((fieldset) => fieldset.contains(input))
      )
    : not_fieldSets;
  const parents_fieldSets = nested
    ? fieldSets.filter(
        (child) =>
          !fieldSets.some(
            (fieldset) => fieldset !== child && fieldset.contains(child)
          )
      )
    : [];
  if (nested) {
    parents_fieldSets.forEach((fieldSet) => {
      const controls = getFormControls(fieldSet);
      const result = serializeInputsCollection(controls);
      if (result) {
        setInData(fieldSet.name, result, data);
        empty = false;
      }
    });
  }
  inputs.forEach((input) => {
    const value = getInputValue(input);
    if (value !== null && value !== "") {
      setInData(input.name, value, data);
      empty = false;
    }
  });
  if (empty) {
    return null;
  }
  return data;
};
