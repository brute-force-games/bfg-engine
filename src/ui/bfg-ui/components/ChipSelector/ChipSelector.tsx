import React from 'react';
import { Chip } from '../Chip';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import './ChipSelector.css';


export interface ChipSelectorProps {
  /** Array of candidate values */
  candidates: string[];
  /** Currently selected value */
  selectedValue?: string;
  /** Function to format values for display */
  formatValue?: (value: string) => string;
  /** Callback when a value is selected */
  onValueSelect?: (value: string) => void;
  /** Callback when selection is cleared */
  onValueClear?: () => void;
  /** Label for the selector */
  label?: string;
  /** Helper text to display */
  helperText?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
}

export const ChipSelector = React.forwardRef<HTMLDivElement, ChipSelectorProps>(
  ({ 
    candidates,
    selectedValue,
    formatValue = (value) => value,
    onValueSelect,
    onValueClear,
    label = "Select Option",
    helperText,
    disabled = false,
    className,
    ...props 
  }, ref) => {
    const handleChipClick = (value: string) => {
      if (disabled) return;
      
      if (selectedValue === value) {
        // If clicking the currently selected value, clear the selection
        onValueClear?.();
      } else {
        // Select the new value
        onValueSelect?.(value);
      }
    };

    const handleClearAll = () => {
      if (disabled) return;
      onValueClear?.();
    };

    return (
      <div ref={ref} className={`container ${className || ''}`} {...props}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="secondary" className="label">
              {label}
            </Typography>
            {selectedValue && (
              <button
                type="button"
                className="clearButton"
                onClick={handleClearAll}
                disabled={disabled}
                title="Clear selection"
              >
                Clear
              </button>
            )}
          </Stack>
          
          <Stack direction="row" spacing={1} className="chipsContainer" useFlexGap>
            {candidates.length > 0 ? (
              candidates.map((value) => {
                const isSelected = selectedValue === value;
                const isAvailable = candidates.includes(value);
                
                return (
                  <Chip
                    key={value}
                    label={formatValue(value)}
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : isAvailable ? "default" : "default"}
                    clickable={!disabled && isAvailable}
                    onClick={() => handleChipClick(value)}
                    className={`chip ${isSelected ? 'selectedChip' : ''} ${disabled ? 'disabledChip' : ''}`}
                  />
                );
              })
            ) : (
              <Typography variant="body2" color="secondary" className="noCandidates">
                No options available
              </Typography>
            )}
          </Stack>
          
          {selectedValue && (
            <Typography variant="caption" color="primary" className="helperText">
              {formatValue(selectedValue)} is selected
            </Typography>
          )}
          
          {helperText && (
            <Typography variant="caption" color="secondary" className="helperText">
              {helperText}
            </Typography>
          )}
        </Stack>
      </div>
    );
  }
);

ChipSelector.displayName = 'ChipSelector';
