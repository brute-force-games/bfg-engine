import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const PlayArrow: React.FC<IconProps> = ({ style, width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);

