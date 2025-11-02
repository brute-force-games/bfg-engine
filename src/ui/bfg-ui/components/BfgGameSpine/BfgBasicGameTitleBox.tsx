import { BfgSupportedGameTitle, Box, Typography } from "~/index";
import { HrefLink } from "../HrefLink";


export interface BfgBasicGameTitleBoxProps {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl?: string;
}

export const BfgBasicGameTitleBox = (props: BfgBasicGameTitleBoxProps) => {
  const { gameTitle, gameSourceUrl } = props;

  if (!gameSourceUrl) {
    return (
      <Box style={{ width: '300px' }}>
        <Typography variant="h5">
          You are playing {gameTitle}
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={{ width: '300px' }}>
      <Typography variant="h5">
        You are playing <HrefLink href={gameSourceUrl}>{gameTitle}</HrefLink>
      </Typography>
    </Box>
  );
};