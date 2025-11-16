import { BfgBasicGameTitleBoxProps } from "./types";
import { BfgBasicGameTitleBoxVertical } from "./BfgBasicGameTitleBoxVertical";
import { BfgBasicGameTitleBoxHorizontal } from "./BfgBasicGameTitleBoxHorizontal";


export const BfgBasicGameTitleBox = (props: BfgBasicGameTitleBoxProps) => {
  const { orientation } = props;

  if (orientation === 'horizontal') {
    return (
      <BfgBasicGameTitleBoxHorizontal
        {...props}
      />
    );
  }

  return (
    <BfgBasicGameTitleBoxVertical
      {...props}
    />
  );
};
