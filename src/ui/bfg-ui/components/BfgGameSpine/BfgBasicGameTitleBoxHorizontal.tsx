import { Box, Typography } from "@bfg-engine/index";
import { HrefLink } from "../HrefLink";
import { BfgBasicGameTitleBoxProps } from "./types";


export const BfgBasicGameTitleBoxHorizontal = (props: BfgBasicGameTitleBoxProps) => {
  const { gameTitle, gameSourceUrl } = props;

  const boxStyle = {
    width: '300px',
    overflowWrap: 'break-word' as const,
    wordBreak: 'break-word' as const,
  };

  if (!gameSourceUrl) {
    return (
      <Box style={boxStyle}>
        <Typography variant="h5">
          You are playing {gameTitle}
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={boxStyle}>
      <Typography variant="h5">
        You are playing <HrefLink href={gameSourceUrl}>{gameTitle}</HrefLink>
      </Typography>
    </Box>
  );
};