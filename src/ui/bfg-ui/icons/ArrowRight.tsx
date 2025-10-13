import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const ArrowRight: React.FC<IconProps> = ({ style, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M10 17l5-5-5-5v10z"/>
  </svg>
);

