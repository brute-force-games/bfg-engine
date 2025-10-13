import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const Clear: React.FC<IconProps> = ({ style, width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

