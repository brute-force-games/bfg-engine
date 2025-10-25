import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label?: string }>;
  valueLabelDisplay?: 'auto' | 'on' | 'off';
  valueLabelFormat?: (value: number) => string;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    marks = [],
    valueLabelDisplay = 'off',
    valueLabelFormat = (val) => val.toString(),
    color = 'primary',
    size = 'medium',
    disabled = false,
    onChange,
    className,
    ...props
  }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value);
      onChange?.(event, newValue);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    const sliderClassName = classNames(
      styles.slider,
      styles[color],
      styles[size],
      disabled && styles.disabled,
      className
    );

    return (
      <div className={styles.sliderContainer}>
        <div className={styles.sliderWrapper}>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className={sliderClassName}
            {...props}
          />
          
          {/* Value Label */}
          {valueLabelDisplay !== 'off' && (
            <div 
              className={styles.valueLabel}
              style={{ left: `${percentage}%` }}
            >
              {valueLabelFormat(value)}
            </div>
          )}
        </div>

        {/* Marks */}
        {marks.length > 0 && (
          <div className={styles.marks}>
            {marks.map((mark, index) => (
              <div
                key={index}
                className={styles.mark}
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
              >
                <div className={styles.markLine} />
                {mark.label && (
                  <div className={styles.markLabel}>{mark.label}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
