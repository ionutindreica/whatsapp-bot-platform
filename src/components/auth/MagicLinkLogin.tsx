import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface MagicLinkLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

const MagicLinkLogin: React.FC<MagicLinkLoginProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setResendCooldown(60); // 1 minute cooldown
        
        // Start countdown timer
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Poll for successful login
        pollForLogin();
      } else {
        setError(data.error || 'Failed to send magic link. Please try again.');
      }
    } catch (error) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollForLogin = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/magic-link/status', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            clearInterval(pollInterval);
            onSuccess();
          }
        }
      } catch (error) {
        // Ignore polling errors
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setResendCooldown(60);
        
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to resend magic link. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a magic link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="w-4 h-4" />
            <AlertDescription>
              Click the link in your email to sign in. The link will expire in 15 minutes.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Link expires in 15 minutes</span>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
                className="flex-1"
              >
                {loading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Link'}
              </Button>
              
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Didn't receive the email? Check your spam folder or try a different email address.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Magic Link Login
        </CardTitle>
        <CardDescription>
          Enter your email and we'll send you a secure link to sign in
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !email} className="w-full">
            {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </Button>
        </form>

        <div className="pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Magic links are secure and don't require a password. They expire automatically for your security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagicLinkLogin;
