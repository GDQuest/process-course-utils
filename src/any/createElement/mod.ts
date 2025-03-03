export * from './createElement.ts'
export * from './createElementDom.web.ts'
export * from './createElementString.ts'
export * from './createElementTemplate.ts'
export * from './elementsFactory.ts'
export * from './functionRegistery.ts'
export * from './h.ts'
export * from './hydrateDOM.ts'
export * from './types.ts'


/**
 * 
// Server-side code
import { createElement, functionRegistry, serializeFunctionRegistry, isServer } from './createElement';
import { hydrateDOM } from './createElement';

// Create your component with functions
function renderApp() {
  return createElement('div', { className: 'app' },
    createElement('button', { 
      onClick: (e) => console.log('Button clicked!'),
      className: 'btn'
    }, 'Click me'),
    createElement('div', null, (node) => {
      node.textContent = 'Dynamic content';
      return node;
    })
  );
}

// On the server
if (isServer) {
  const htmlString = renderApp();
  
  // Reset function registry for each request
  const functionsData = serializeFunctionRegistry();
  
  // Send to the client both the HTML and the functions data
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          window.__FUNCTION_REGISTRY__ = ${functionsData};
        </script>
      </head>
      <body>
        ${htmlString}
        <script src="/client.js"></script>
      </body>
    </html>
  `;
  
  // Send fullHtml as response
}

// When the client loads:
document.addEventListener('DOMContentLoaded', () => {
  // Reconstruct the function registry (in a real app, this would involve
  // transferring function references or code from server to client)
  
  // In a real implementation, you'd deserialize the function registry
  // and restore the actual function references
  
  // Then hydrate the DOM
  hydrateDOM();
});
 * 
 */