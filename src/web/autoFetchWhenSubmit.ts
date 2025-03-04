import { toURLParams } from "../any/toURLParams.ts";
import { disableForm, enableForm } from "./enableOrDisableForm.ts";
import { SimpleSerializedForm, handleSimpleFormSubmit } from "./handleSimpleFormSubmit.ts";

const pickCorrectFetch = (
  type: "json" | "post",
  serialized: SimpleSerializedForm
) => {
  switch (type) {
    case "json": {
      const json = JSON.stringify(serialized.values);
      return fetch(serialized.action, {
        method: serialized.method,
        body: json,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    case "post": {
      if (serialized.enctype === "application/x-www-form-urlencoded") {
        const params = serialized.values ? toURLParams(serialized.values) : ""
        const url = `${serialized.action}${params ? "?" + params : ""}`;
        return fetch(url, {
          method: serialized.method,
          headers: {
            "Content-Type": serialized.enctype,
          },
        });
      }
      break;
    }
  }
  return fetch(serialized.action, {
    method: serialized.method,
    body: serialized.values,
    headers: {
      "Content-Type": serialized.enctype,
    },
  });
};


interface EnhanceFormConfig {
  type: "json" | "post";
  classBusy: string;
  doDisableForm: boolean;
  callback: (error: Error | null, response: Response | null) => void;
}

const defaultConfig: EnhanceFormConfig = {
  type: "post",
  classBusy: "busy",
  doDisableForm: true,
  callback: () => {}
};


/**
 * Automatically fetches the form data when the form is submitted.
 * Optionally disables the form and adds a class to it while fetching.
 * 
 * Reads the entire configuration for fetching from the form itself.
 * 
 * Needs an old-school callback function, with the error as the first argument.
 * @param callback 
 * @param config
 */
export const autoFetchWhenSubmit = (
  config: Partial<EnhanceFormConfig> = defaultConfig
) => {
  const { type, classBusy, doDisableForm, callback } = { ...config, ...defaultConfig}
  const useSerializedData = (serialized: SimpleSerializedForm, form: HTMLFormElement) => {
    const promise = pickCorrectFetch(type, serialized);
    if (doDisableForm) {
      disableForm(form);
    }
    if (classBusy != null && classBusy != "") {
      form.classList.add(classBusy);
    }
    promise
      .then((response) => {
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      })
      .finally(() => {
        if (doDisableForm) {
          enableForm(form);
        }
        if (classBusy != null && classBusy != "") {
          form.classList.remove(classBusy);
        }
      });
  };
  return handleSimpleFormSubmit(useSerializedData);
};
