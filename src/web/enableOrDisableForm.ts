export type HTMLFormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement | HTMLFieldSetElement | HTMLOutputElement | HTMLObjectElement;

export const disableForm = (form: HTMLFormElement) => {
  let length = form.elements.length;
  while(length--) {
    const control = form.elements[length] as HTMLFormControlElement;
    if('disabled' in control) {
      control.disabled = true;
    }
  }
}

export const enableForm = (form: HTMLFormElement) => {
  let length = form.elements.length;
  while(length--) {
    const control = form.elements[length] as HTMLFormControlElement;
    if('disabled' in control) {
      control.disabled = false;
    }
  }
}