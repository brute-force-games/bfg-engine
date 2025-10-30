import { BfgSupportedGameTitle, Box, Typography } from "~/index";
import { HrefLink } from "../HrefLink";


export interface BfgGameTitleBoxProps {
  gameTitle: BfgSupportedGameTitle;
  gameSourceUrl: string;
}

export const BfgGameTitleBox = (props: BfgGameTitleBoxProps) => {
  const { gameTitle, gameSourceUrl } = props;

  return (
    <Box style={{ width: '300px' }}>
      <Typography variant="h5">
        You are playing <HrefLink href={gameSourceUrl}>{gameTitle}</HrefLink>
      </Typography>
    </Box>
  );
};