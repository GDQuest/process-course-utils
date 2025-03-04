import { SerializedForm } from "./serializeComplicatedForm.ts";

export type SimpleSerializedForm = Omit<SerializedForm, "values"> & {
  values: FormData;
};

type FormHandler = (
  serialized: SimpleSerializedForm,
  form: HTMLFormElement
) => void;

export const handleSimpleFormSubmit =
  (callback: FormHandler) => (event: SubmitEvent | Event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target as HTMLFormElement;
    const action = form.getAttribute("action") || "";
    const formName = form.getAttribute("name") || "";
    const enctype = form.getAttribute("enctype") || "";
    const method = form.getAttribute("method") || "";
    const target = form.getAttribute("target") || "";
    const values = new FormData(form);

    const serialized: SimpleSerializedForm = {
      name: formName,
      action,
      method,
      values,
      enctype,
      target,
    };

    callback(serialized, form);
  };

