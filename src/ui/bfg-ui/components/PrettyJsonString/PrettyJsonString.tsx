export interface PrettyJsonStringProps {
  children: string;
}

export const PrettyJsonString = ({ children }: PrettyJsonStringProps) => {
  
  return (
    <pre>
      {children}
    </pre>
  );
};

