import { useState } from 'react';
import { 
  PrivatePlayerProfile,
  // signMessageWithProfile,
  // verifyMessageWithProfile,
  privateToPublicProfile
} from '../../../models/player-profile/private-player-profile';


interface CryptoTestDialogProps {
  open: boolean;
  onClose: () => void;
  profile: PrivatePlayerProfile;
}

export const CryptoTestDialog = ({ open, onClose, profile }: CryptoTestDialogProps) => {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [signedMessageData, setSignedMessageData] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    setIsSigning(true);
    setError(null);
    setVerificationResult(null);

    try {
      const messageData = {
        message: message.trim(),
        profileId: profile.id,
        handle: profile.handle,
        timestamp: new Date().toISOString(),
      };

      // Use Web Crypto API signing
      const messageString = JSON.stringify(messageData);
      const sig = await signMessageWithProfile(profile, messageString);
      setSignature(sig);
      setSignedMessageData(messageData); // Store the exact data that was signed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsSigning(false);
    }
  };

  const handleVerifyMessage = async () => {
    if (!signature || !signedMessageData) {
      setError('No signature to verify');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Use Web Crypto API verification
      const publicProfile = privateToPublicProfile(profile);
      const messageString = JSON.stringify(signedMessageData);
      const isValid = await verifyMessageWithProfile(publicProfile, messageString, signature);
      setVerificationResult(isValid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify signature');
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setSignature(null);
    setSignedMessageData(null);
    setVerificationResult(null);
    setError(null);
  };

  const handleClose = () => {
    if (!isSigning && !isVerifying) {
      handleReset();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>
          🔐 Crypto Test - {profile.handle}
        </h2>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <strong>Profile:</strong> {profile.handle}<br/>
          <strong>ID:</strong> {profile.id}<br/>
          <strong>Created:</strong> {new Date(profile.createdAt).toLocaleDateString()}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            border: '1px solid #f5c6cb'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Message to Sign:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSigning || isVerifying}
            placeholder="Enter a message to test signing and verification..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={handleSignMessage}
            disabled={!message.trim() || isSigning || isVerifying}
            style={{
              padding: '10px 20px',
              backgroundColor: !message.trim() || isSigning || isVerifying ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !message.trim() || isSigning || isVerifying ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isSigning ? 'Signing...' : '🔏 Sign Message'}
          </button>

          <button
            onClick={handleVerifyMessage}
            disabled={!signature || isSigning || isVerifying}
            style={{
              padding: '10px 20px',
              backgroundColor: !signature || isSigning || isVerifying ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !signature || isSigning || isVerifying ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isVerifying ? 'Verifying...' : '🔍 Verify Signature'}
          </button>

          <button
            onClick={handleReset}
            disabled={isSigning || isVerifying}
            style={{
              padding: '10px 20px',
              backgroundColor: isSigning || isVerifying ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSigning || isVerifying ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset
          </button>
        </div>

        {signature && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>✅ Signature Generated:</h4>
            <div style={{
              backgroundColor: '#e7f3ff',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #b3d9ff',
              fontSize: '12px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              maxHeight: '100px',
              overflow: 'auto'
            }}>
              {signature}
            </div>
            
            {signedMessageData && (
              <div style={{ marginTop: '12px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#6c757d', fontSize: '14px' }}>Signed Data:</h5>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  maxHeight: '80px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(signedMessageData, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}

        {verificationResult !== null && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              color: verificationResult ? '#28a745' : '#dc3545' 
            }}>
              {verificationResult ? '✅ Verification Successful' : '❌ Verification Failed'}
            </h4>
            <div style={{
              backgroundColor: verificationResult ? '#d4edda' : '#f8d7da',
              color: verificationResult ? '#155724' : '#721c24',
              padding: '12px',
              borderRadius: '4px',
              border: `1px solid ${verificationResult ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {verificationResult 
                ? 'The signature is valid! The message was signed by this profile\'s private key and verified with the public key.'
                : 'The signature verification failed. The message may have been tampered with or signed with a different key.'
              }
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #bee5eb',
          fontSize: '14px'
        }}>
          <strong>How it works:</strong><br/>
          1. Enter a message and click "Sign Message" to create a digital signature using the profile's private key<br/>
          2. Click "Verify Signature" to verify the signature using the profile's public key<br/>
          3. This demonstrates the cryptographic security of the player profile system
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            disabled={isSigning || isVerifying}
            style={{
              padding: '10px 20px',
              backgroundColor: isSigning || isVerifying ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSigning || isVerifying ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
