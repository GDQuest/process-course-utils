import { functionRegistry } from "./functionRegistery";

// Hydration function to attach event handlers and execute function children
export function hydrateDOM(rootElement: Element = document.body): void {
  // Hydrate event handlers
  Object.keys(functionRegistry.eventHandlers).forEach(elementId => {
      const element = rootElement.querySelector(`[data-hydrate-id="${elementId}"]`);
      if (element) {
          const handlers = functionRegistry.eventHandlers[elementId];
          Object.entries(handlers).forEach(([event, handler]) => {
              element.addEventListener(event, handler as EventListenerOrEventListenerObject);
          });
      }
  });

  // Hydrate bind functions
  rootElement.querySelectorAll('[data-bind-fn]').forEach(element => {
      const bindId = element.getAttribute('data-bind-fn');
      const bindKey = element.getAttribute('data-bind-key');
      if (bindId && bindKey && functionRegistry.bindFunctions[bindId]) {
          functionRegistry.bindFunctions[bindId](element, bindKey);
      }
  });

  // Hydrate function children
  rootElement.querySelectorAll('[data-fn-child]').forEach(element => {
      const fnId = element.getAttribute('data-fn-child');
      if (fnId && functionRegistry.functionChildren[fnId]) {
          const textNode = document.createTextNode('');
          functionRegistry.functionChildren[fnId](textNode, 'textContent');
          element.replaceWith(textNode);
      }
  });

  // Hydrate props
  rootElement.querySelectorAll('[data-prop-]').forEach(element => {
      const props: Record<string, string> = {};
      Array.from(element.attributes)
          .filter(attr => attr.name.startsWith('data-prop-'))
          .forEach(attr => {
              const propName = attr.name.substring(10); // Remove 'data-prop-'
              props[propName] = attr.value;
          });
      
      // Apply props to the element
      Object.entries(props).forEach(([prop, value]) => {
          // @ts-ignore
          element[prop] = value;
      });
  });
}