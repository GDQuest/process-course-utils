import { serializeComplicatedForm , type SerializedForm} from './serializeComplicatedForm.ts'


type FormHandler = (serialized: SerializedForm, form: HTMLFormElement) => void


/**
 * Creates a function that handles submit events.
 * The function:
 * - stops the event from propagating
 * - serializes the form inputs (@see {serializeComplicatedForm})
 * - runs the provided callback with the serialized form
 * 
 * This function does a lot; normalizes inputs, handles repeating fields, and so on.
 * If your form doesn't need this, use @see {handleSimpleFormSubmit}
 */
export const handleComplicatedFormSubmit =
  (callback: FormHandler) => (event: SubmitEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.target as HTMLFormElement
    callback(serializeComplicatedForm(form), form)
  }
