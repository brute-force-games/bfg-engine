import React from 'react';

export interface PrettyJsonStringProps {
  jsonString: string;
}

export const PrettyJsonString: React.FC<PrettyJsonStringProps> = ({ jsonString }) => {
  return (
    <pre>
      {jsonString}
    </pre>
  );
};

