import { 
  Alert, 
  Box, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Stack, 
  TextField, 
  Typography,
  CheckCircle,
  ContentCopy,
  Link as LinkIcon,
  OpenInNew
} from "../bfg-ui"
import { useState } from "react";


interface IBfgShareableLinkComponentProps {
  linkLabel: string;
  linkUrl: string;
  variant?: 'gradient' | 'standard';
}

export const BfgShareableLinkComponent = ({ linkLabel, linkUrl, variant = 'gradient' }: IBfgShareableLinkComponentProps) => {

  const [copySuccess, setCopySuccess] = useState(false);

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

  if (variant === 'standard') {
    return (
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
    );
  }

  return (
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
  )
}