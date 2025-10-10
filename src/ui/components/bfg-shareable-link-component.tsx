import { Alert, Box, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "bfg-ui-components"
import { useState } from "react";

// Icon components
const CheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const ContentCopy = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
);

const OpenInNew = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);


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
            InputProps={{
              readOnly: true,
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
            InputProps={{
              readOnly: true,
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