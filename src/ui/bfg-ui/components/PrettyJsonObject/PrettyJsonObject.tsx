import { PrettyJsonString } from "../PrettyJsonString/PrettyJsonString";


export interface PrettyJsonObjectProps {
  children: object | null;
}

export const PrettyJsonObject = ({ children }: PrettyJsonObjectProps) => {

  const prettyJsonObjectString = children ? JSON.stringify(children, null, 2) : '';
  
  return (
    <PrettyJsonString>
      {prettyJsonObjectString}
    </PrettyJsonString>  
  );
};

