// type PrimitiveType = string | number | boolean | undefined | null | symbol | bigint;
type ReferenceType = object | ((...args: unknown[]) => unknown);

type JsonReplacer = 
  ((key: string, value: unknown) => unknown) |
  (number | string)[]

type JsonCircularReplacer = (key: string, value: ReferenceType) => unknown


interface ToJsonSafeSerializedOptions{
  circularReplacer: JsonCircularReplacer;
  throwsMessage: (err: unknown) => string;
  replacer?: null | JsonReplacer;
}

const defaultArrayReplacer = (arr: (string|number)[]) => (key: string, value: unknown) => {
  if(arr.includes(key)){
    return value;
  }
}

const defaultOptions: ToJsonSafeSerializedOptions = {
  circularReplacer: (_key, value) => `[ Circular: ${typeof value} ]`,
  replacer: null,
  throwsMessage: (err) => '[ Throws: ' + (err instanceof Error ? err.message : '?') + ' ]'
};

const serializerSafe = (opts?: Partial<ToJsonSafeSerializedOptions>) =>{

  const { circularReplacer, throwsMessage, replacer: _replacer } = { ...defaultOptions, ...opts };
  const seen = new WeakSet();

  const replacer = (_replacer == null ? null:
    typeof _replacer === 'function' ? _replacer: defaultArrayReplacer(_replacer));

  const visit = (key: string, value: unknown): unknown => {
    
    const type = typeof value;
    
    if( value == null || type === 'undefined' || type === 'bigint' || type === 'symbol' || type === 'string' || type === 'number' || type === 'boolean'){
      return replacer ? replacer(key, value) : value;
    }

    const refValue = value as ReferenceType

    if(typeof refValue === 'function'){
      return circularReplacer(key, refValue);
    }

    if (seen.has(refValue)) {
      return circularReplacer(key, value);
    }

    if ('toJSON' in refValue && typeof refValue.toJSON === 'function') {
			try {
				const fResult = visit(key, refValue.toJSON());
				return fResult;
			} catch(err) {
				return throwsMessage(err);
			}
		}

    seen.add(value);

    return value;
  };
  return visit
}


interface ToJsonSafeOptions extends ToJsonSafeSerializedOptions{
  spaces?: string | number;
}

export const toJsonStringNoCicularReferences = (value: unknown, { spaces, ...opts }: Partial<ToJsonSafeOptions> = {}): string => {
  return JSON.stringify(value, serializerSafe(opts), spaces) as string
}