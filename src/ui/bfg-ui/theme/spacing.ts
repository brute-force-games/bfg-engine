// Base spacing unit (8px)
const SPACING_UNIT = 8;

/**
 * Generate spacing value based on multiplier
 * @param multiplier - Number of spacing units
 * @returns CSS spacing value in pixels
 */
export const spacing = (multiplier: number = 1): string => {
  return `${SPACING_UNIT * multiplier}px`;
};

// Common spacing values
export const spacingValues = {
  xs: spacing(0.5),  // 4px
  sm: spacing(1),    // 8px
  md: spacing(2),    // 16px
  lg: spacing(3),    // 24px
  xl: spacing(4),    // 32px
  xxl: spacing(6),   // 48px
};

