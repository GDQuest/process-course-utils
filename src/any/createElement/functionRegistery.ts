import { HTMLFactory } from "./types.ts";

declare module "./types.ts" {
  namespace HTMLFactory {
    export type FunctionRegistry = {
      eventHandlers: Record<string, Record<string, Function>>;
      bindFunctions: Record<string, Function>;
      functionChildren: Record<string, Function>;
    };
  }
}

export const functionRegistry: HTMLFactory.FunctionRegistry = {
  eventHandlers: {},
  bindFunctions: {},
  functionChildren: {},
};


export function serializeFunctionRegistry(): string {
  // In a real implementation, you'd create a more sophisticated
  // serialization mechanism, possibly using Function.toString()
  // or storing function references in a global registry
  
  // This is just a placeholder to indicate what needs to be serialized
  const serialized = {
      eventHandlersCount: Object.keys(functionRegistry.eventHandlers).length,
      bindFunctionsCount: Object.keys(functionRegistry.bindFunctions).length,
      functionChildrenCount: Object.keys(functionRegistry.functionChildren).length
  };
  
  return JSON.stringify(serialized);
}