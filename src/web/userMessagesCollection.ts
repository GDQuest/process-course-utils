import { MapSignal } from "../any/MapSignal.ts";
import { LocalStorageSignalAdapter } from "./LocalStorageSignalAdapter.ts";

export const TYPE_SUCCESS = "success";
export const TYPE_ERROR = "error";
export const TYPE_INFO = "info";
export const TYPE_WARNING = "warning";

export type UserMessageType =
    | typeof TYPE_SUCCESS
    | typeof TYPE_ERROR
    | typeof TYPE_INFO
    | typeof TYPE_WARNING;

type MessageRepository = Record<
    string,
    { message: string; type: UserMessageType }
>;

/**
 * A collection of messages that are displayed to the user.
 * Each message gets recorded to localstorage, so it continues to show between refreshes.
 * This library doesn't handle the display of the messages, only the storage and retrieval.
 */
export const userMessagesCollection = (() => {
    const signal = LocalStorageSignalAdapter(
        MapSignal<MessageRepository>({}),
        "__userMessages",
    );

    const add = (type: UserMessageType, message: string, id?: string) => {
        id = id || `usermessage-` + type + "-" + Math.random().toString(36).slice(2);
        signal.setItem(id, { message, type });
        return id;
    };

    const addSuccess = (message: string) => add(TYPE_SUCCESS, message);
    const addError = (message: string) => add(TYPE_ERROR, message);
    const addInfo = (message: string) => add(TYPE_INFO, message);
    const addWarning = (message: string) => add(TYPE_WARNING, message);

    const remove = (id: string) => signal.removeItem(id);

    const get = (id: string) => signal.getItem(id);
    const entries = () => Object.entries(signal.get());

    return {
        add,
        addSuccess,
        addError,
        addInfo,
        addWarning,
        remove,
        get,
        entries,
        onMessageAdded: signal.onKeyAdded,
        onMessageRemoved: signal.onKeyRemoved,
    };
})();

// for debug purposes/testing

declare global {
    interface Window {
        addMessage: typeof userMessagesCollection.add;
        addSuccess: typeof userMessagesCollection.addSuccess;
        addError: typeof userMessagesCollection.addError;
        addInfo: typeof userMessagesCollection.addInfo;
        addWarning: typeof userMessagesCollection.addWarning;
    }
}


window.addMessage = userMessagesCollection.add;
window.addSuccess = userMessagesCollection.addSuccess;
window.addError = userMessagesCollection.addError;
window.addInfo = userMessagesCollection.addInfo;
window.addWarning = userMessagesCollection.addWarning;

/* * /
window.addSuccess("Hello, world!");
window.addError("Hello, world!");
window.addInfo("Hello, world!");
window.addWarning("Hello, world! There are a few different ways that you can do it. One of them is using calc-size(), which has some extra things you could do with it, but rig!");
/* */