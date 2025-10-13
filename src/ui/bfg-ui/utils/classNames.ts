/**
 * Utility function to conditionally join class names
 * @param classes - Array of class names or conditional class names
 * @returns Combined class name string
 */
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

