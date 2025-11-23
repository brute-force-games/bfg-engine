import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from '../../bfg-ui/index';
import { BfgShareableLinkComponent } from '../bfg-shareable-link-component';
import { useSiteHosting } from '../../../hooks/site-hosting';
import { BfgGameInstanceId } from '../../../models/types/bfg-branded-uuids';

interface ObserverLinksDialogProps {
  open: boolean;
  onClose: () => void;
  gameInstanceId: BfgGameInstanceId;
}

export const ObserverLinksDialog = ({ open, onClose, gameInstanceId }: ObserverLinksDialogProps) => {
  const siteHosting = useSiteHosting();
  
  const observerLink = siteHosting.createObserverGameUrl(gameInstanceId);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Observer Links</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body1" color="secondary">
            Share these links to allow others to observe the game:
          </Typography>
          <BfgShareableLinkComponent
            variant="standard"
            linkLabel="Observer Game Link"
            linkUrl={observerLink}
            showQrCode={true}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

