import React, { useState, useRef, useEffect } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
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
  showSpeechBubble?: boolean;
  speechBubbleTimeout?: number;
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
    showSpeechBubble = false,
    speechBubbleTimeout = 2000,
    onChange,
    className,
    ...props
  }, ref) => {
    // State for speech bubble visibility
    const [showBubble, setShowBubble] = useState(false);
    const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (bubbleTimeoutRef.current) {
          clearTimeout(bubbleTimeoutRef.current);
        }
      };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value);
      onChange?.(event, newValue);

      // Handle speech bubble visibility
      if (showSpeechBubble) {
        setShowBubble(true);
        
        // Clear existing timeout
        if (bubbleTimeoutRef.current) {
          clearTimeout(bubbleTimeoutRef.current);
        }
        
        // Hide bubble after timeout
        bubbleTimeoutRef.current = setTimeout(() => {
          setShowBubble(false);
        }, speechBubbleTimeout);
      }
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
          {/* Speech Bubble */}
          {showSpeechBubble && showBubble && (
            <div
              style={{
                position: 'absolute',
                top: '-35px',
                left: `${percentage}%`,
                transform: 'translateX(calc(-50% + 10px))', // Offset by half thumb width (20px)
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 1,
                pointerEvents: 'none',
                transition: 'left 0.1s ease-out, opacity 0.2s ease-in-out',
                opacity: showBubble ? 1 : 0,
              }}
            >
              {valueLabelFormat(value)}
              {/* Speech bubble notch pointing down */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #1976d2',
                }}
              />
            </div>
          )}

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
