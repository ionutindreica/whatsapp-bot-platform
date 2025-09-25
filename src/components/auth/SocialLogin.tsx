import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Chrome, Apple, Mail } from 'lucide-react';

interface SocialLoginProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  mode?: 'login' | 'register';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError, mode = 'login' }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: string) => {
    setLoading(provider);
    
    try {
      // Create OAuth URL
      const oauthUrl = `http://localhost:5000/api/auth/oauth/${provider}`;
      
      // Open popup window for OAuth
      const popup = window.open(
        oauthUrl,
        `${provider}Auth`,
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoading(null);
        }
      }, 1000);

      // Listen for message from popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'OAUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          setLoading(null);
          
          // Store token and user data
          localStorage.setItem('authToken', event.data.token);
          localStorage.setItem('user', JSON.stringify(event.data.user));
          
          onSuccess(event.data.user);
        } else if (event.data.type === 'OAUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          setLoading(null);
          onError(event.data.error || 'Authentication failed');
        }
      };

      window.addEventListener('message', messageListener);

    } catch (error) {
      setLoading(null);
      onError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleGoogleAuth = () => handleSocialAuth('google');
  const handleMicrosoftAuth = () => handleSocialAuth('microsoft');
  const handleAppleAuth = () => handleSocialAuth('apple');
  const handleGitHubAuth = () => handleSocialAuth('github');

  return (
    <div className="space-y-4">
      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={loading === 'google'}
          className="w-full"
        >
          <Chrome className="w-4 h-4 mr-2" />
          {loading === 'google' ? 'Connecting...' : 'Google'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleMicrosoftAuth}
          disabled={loading === 'microsoft'}
          className="w-full"
        >
          <Mail className="w-4 h-4 mr-2" />
          {loading === 'microsoft' ? 'Connecting...' : 'Microsoft'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleAppleAuth}
          disabled={loading === 'apple'}
          className="w-full"
        >
          <Apple className="w-4 h-4 mr-2" />
          {loading === 'apple' ? 'Connecting...' : 'Apple'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleGitHubAuth}
          disabled={loading === 'github'}
          className="w-full"
        >
          <Github className="w-4 h-4 mr-2" />
          {loading === 'github' ? 'Connecting...' : 'GitHub'}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
