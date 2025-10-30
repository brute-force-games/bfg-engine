import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const ArrowLeft: React.FC<IconProps> = ({ style, width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    preserveAspectRatio="none"
    style={style}
  >
    <polygon points="24,0 0,12 24,24" />
  </svg>
);


