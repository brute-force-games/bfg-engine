import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const MenuIcon: React.FC<IconProps> = ({ style, width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

