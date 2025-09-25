import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Mail, ArrowLeft } from 'lucide-react';

interface TwoFactorLoginProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  onUseBackupCode: () => void;
}

const TwoFactorLogin: React.FC<TwoFactorLoginProps> = ({ 
  email, 
  onSuccess, 
  onBack, 
  onUseBackupCode 
}) => {
  const [method, setMethod] = useState<'totp' | 'sms' | 'email' | 'backup'>('totp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          method
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        onSuccess();
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          method
        })
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
        setError('Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'totp':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'sms':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-purple-600" />;
      default:
        return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  const getMethodTitle = () => {
    switch (method) {
      case 'totp':
        return 'Authenticator App';
      case 'sms':
        return 'SMS Code';
      case 'email':
        return 'Email Code';
      case 'backup':
        return 'Backup Code';
      default:
        return 'Two-Factor Authentication';
    }
  };

  const getMethodDescription = () => {
    switch (method) {
      case 'totp':
        return 'Enter the 6-digit code from your authenticator app';
      case 'sms':
        return 'Enter the 6-digit code sent to your phone';
      case 'email':
        return `Enter the 6-digit code sent to ${email}`;
      case 'backup':
        return 'Enter one of your backup codes';
      default:
        return 'Enter your verification code';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getMethodIcon()}
          {getMethodTitle()}
        </CardTitle>
        <CardDescription>
          {getMethodDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder={method === 'backup' ? 'Enter backup code' : '000000'}
              value={code}
              onChange={(e) => {
                if (method === 'backup') {
                  setCode(e.target.value);
                } else {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                }
              }}
              maxLength={method === 'backup' ? 12 : 6}
              className="text-center text-lg tracking-widest"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || !code || (method !== 'backup' && code.length !== 6)} 
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </Button>
        </form>

        {/* Method Selection */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Or use a different method:</p>
          <div className="grid grid-cols-2 gap-2">
            {method !== 'totp' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMethod('totp')}
                className="text-xs"
              >
                <Shield className="w-3 h-3 mr-1" />
                App
              </Button>
            )}
            {method !== 'sms' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMethod('sms')}
                className="text-xs"
              >
                <Smartphone className="w-3 h-3 mr-1" />
                SMS
              </Button>
            )}
            {method !== 'email' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMethod('email')}
                className="text-xs"
              >
                <Mail className="w-3 h-3 mr-1" />
                Email
              </Button>
            )}
            {method !== 'backup' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMethod('backup')}
                className="text-xs"
              >
                Backup Code
              </Button>
            )}
          </div>
        </div>

        {/* Resend Code */}
        {method !== 'backup' && (
          <div className="text-center">
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleResendCode}
              disabled={loading || resendCooldown > 0}
              className="text-sm"
            >
              {resendCooldown > 0 
                ? `Resend code in ${resendCooldown}s` 
                : 'Resend code'
              }
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <div className="pt-4 border-t">
          <Button variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorLogin;
