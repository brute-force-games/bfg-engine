import React from 'react';

export interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const ContentCopy: React.FC<IconProps> = ({ style, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

