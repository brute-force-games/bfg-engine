import { 
  Alert, 
  Box, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton, 
  InputAdornment, 
  Paper, 
  Stack, 
  TextField, 
  Typography,
  CheckCircle,
  ContentCopy,
  Link as LinkIcon,
  OpenInNew,
  QrCode as QrCodeIcon
} from "../bfg-ui"
import { useState, useEffect, useRef } from "react";
import QRCode from 'qrcode';


interface IBfgShareableLinkComponentProps {
  linkLabel: string;
  linkUrl: string;
  variant?: 'gradient' | 'standard';
  showQrCode?: boolean;
}

export const BfgShareableLinkComponent = ({ 
  linkLabel,
  linkUrl,
  variant = 'gradient',
  showQrCode = false,
}: IBfgShareableLinkComponentProps) => {

  const [copySuccess, setCopySuccess] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = linkUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const openInNewWindow = () => {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  const openQrDialog = () => {
    setQrDialogOpen(true);
  };

  const closeQrDialog = () => {
    setQrDialogOpen(false);
  };

  useEffect(() => {
    if (qrDialogOpen && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, linkUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch((err) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [qrDialogOpen, linkUrl]);

  if (variant === 'standard') {
    return (
      <>
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            {linkLabel}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={openInNewWindow}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
              title="Open in new window"
            >
              <OpenInNew />
            </IconButton>
            <IconButton
              onClick={copyToClipboard}
              style={{
                backgroundColor: copySuccess ? '#2e7d32' : 'rgba(0, 0, 0, 0.04)',
                color: copySuccess ? 'white' : 'inherit',
              }}
              title="Copy to clipboard"
            >
              {copySuccess ? <CheckCircle /> : <ContentCopy />}
            </IconButton>
            {showQrCode && (
              <IconButton
                onClick={openQrDialog}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }}
                title="Show QR code"
              >
                <QrCodeIcon />
              </IconButton>
            )}
            <TextField
              value={linkUrl}
              size="small"
              fullWidth
              readOnly
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
              style={{ fontFamily: 'monospace' }}
            />
          </Stack>
          {copySuccess && (
            <Alert severity="success" style={{ marginTop: '8px' }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
        <Dialog open={qrDialogOpen} onClose={closeQrDialog}>
          <DialogTitle>Scan QR Code for {linkLabel}</DialogTitle>
          <DialogContent>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <canvas ref={qrCanvasRef} />
              <Typography variant="body2" style={{ textAlign: 'center', wordBreak: 'break-all', maxWidth: '300px' }}>
                {linkUrl}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeQrDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Paper elevation={2} style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={openInNewWindow}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
              title="Open in new window"
            >
              <OpenInNew />
            </IconButton>
            <IconButton
              onClick={copyToClipboard}
              style={{
                backgroundColor: copySuccess ? '#2e7d32' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
              title="Copy to clipboard"
            >
              {copySuccess ? <CheckCircle /> : <ContentCopy />}
            </IconButton>
            {showQrCode && (
              <IconButton
                onClick={openQrDialog}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                }}
                title="Show QR code"
              >
                <QrCodeIcon />
              </IconButton>
            )}
            <TextField
              value={linkUrl}
              size="small"
              fullWidth
              readOnly
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'monospace',
              }}
            />
          </Stack>
          {copySuccess && (
            <Alert severity="success" style={{ marginTop: '8px', backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
      </Paper>
      <Dialog open={qrDialogOpen} onClose={closeQrDialog}>
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <canvas ref={qrCanvasRef} />
            <Typography variant="body2" style={{ textAlign: 'center', wordBreak: 'break-all', maxWidth: '300px' }}>
              {linkUrl}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQrDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}