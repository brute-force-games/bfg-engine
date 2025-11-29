
// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


// Type guard for checking if all values are set (provides type narrowing)
// Use this when you need TypeScript to narrow types after checking
// Takes an array/tuple of values and narrows all of them at once
export function areAllSet<T extends readonly (unknown | null | undefined)[]>(
  values: T
): values is { readonly [K in keyof T]: NonNullable<T[K]> } {
  return !values.some((value) => value === null || value === undefined);
}

// Type guard for checking if all values are not set (provides type narrowing)
// Use this when you need TypeScript to narrow types after checking
// Takes an array/tuple of values and narrows all of them to null | undefined
export function areAllNotSet<T extends readonly (unknown | null | undefined)[]>(
  values: T
): values is { readonly [K in keyof T]: Extract<T[K], null | undefined> } {
  return values.every((value) => value === null || value === undefined);
}

// Check if any values are not set (null or undefined)
// Expressed in terms of areAllSet for consistency
export const areAnyNotSet = (values: readonly (unknown | null | undefined)[]): boolean => {
  return !areAllSet(values);
};


export const ensureAllValuesAgree = <T>(message: string, ...values: readonly (T | null | undefined)[]): T => {
  if (values.length === 0) {
    throw new Error(message);
  }

  const expectedValue = values[0];
  if (expectedValue === null || expectedValue === undefined) {
    throw new Error(message);
  }

  if (values.some((value) => value !== expectedValue || value === undefined || value === null)) {
    throw new Error(message);
  }

  return expectedValue;
};
