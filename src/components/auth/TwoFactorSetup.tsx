import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { QrCode, Shield, Smartphone, Mail, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'choose' | 'totp' | 'sms' | 'email' | 'backup'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // TOTP State
  const [totpSecret, setTotpSecret] = useState('');
  const [totpQrCode, setTotpQrCode] = useState('');
  const [totpVerificationCode, setTotpVerificationCode] = useState('');
  
  // SMS State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  
  // Email State
  const [emailCode, setEmailCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Backup codes
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleTOTPSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate TOTP setup API call
      const response = await fetch('http://localhost:5000/api/auth/2fa/totp/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      const data = await response.json();
      setTotpSecret(data.secret);
      setTotpQrCode(data.qrCode);
      setStep('totp');
    } catch (error) {
      setError('Failed to setup TOTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTOTPVerification = async () => {
    if (!totpVerificationCode || totpVerificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/totp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          code: totpVerificationCode,
          secret: totpSecret 
        })
      });
      
      if (response.ok) {
        setStep('backup');
        generateBackupCodes();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSMSSetup = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/sms/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ phoneNumber })
      });
      
      if (response.ok) {
        setSmsSent(true);
        setStep('sms');
      } else {
        setError('Failed to send SMS. Please try again.');
      }
    } catch (error) {
      setError('Failed to setup SMS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSMSVerification = async () => {
    if (!smsCode || smsCode.length !== 6) {
      setError('Please enter a valid 6-digit SMS code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          code: smsCode,
          phoneNumber 
        })
      });
      
      if (response.ok) {
        setStep('backup');
        generateBackupCodes();
      } else {
        setError('Invalid SMS code. Please try again.');
      }
    } catch (error) {
      setError('SMS verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/email/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      if (response.ok) {
        setEmailSent(true);
        setStep('email');
      } else {
        setError('Failed to send email. Please try again.');
      }
    } catch (error) {
      setError('Failed to setup email verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!emailCode || emailCode.length !== 6) {
      setError('Please enter a valid 6-digit email code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ code: emailCode })
      });
      
      if (response.ok) {
        setStep('backup');
        generateBackupCodes();
      } else {
        setError('Invalid email code. Please try again.');
      }
    } catch (error) {
      setError('Email verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateBackupCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      const data = await response.json();
      setBackupCodes(data.codes);
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setSuccess('Backup codes copied to clipboard');
  };

  const complete2FASetup = () => {
    onComplete();
  };

  if (step === 'choose') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={handleTOTPSetup}>
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Google Authenticator, Authy, etc.</p>
                </div>
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => setStep('sms')}>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">SMS Text Message</p>
                  <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={handleEmailSetup}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">Receive codes via email</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onSkip} className="w-full">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'totp') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Setup Authenticator App</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border inline-block">
              <img src={totpQrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Can't scan? Enter this code manually:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">{totpSecret}</code>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totp-code">Enter verification code</Label>
            <Input
              id="totp-code"
              type="text"
              placeholder="000000"
              value={totpVerificationCode}
              onChange={(e) => setTotpVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button onClick={handleTOTPVerification} disabled={loading || totpVerificationCode.length !== 6} className="w-full">
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </Button>

          <Button variant="outline" onClick={() => setStep('choose')} className="w-full">
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'sms') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Setup SMS Authentication</CardTitle>
          <CardDescription>
            {smsSent ? 'Enter the code sent to your phone' : 'Enter your phone number'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!smsSent ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <Button onClick={handleSMSSetup} disabled={loading || !phoneNumber} className="w-full">
                {loading ? 'Sending...' : 'Send SMS Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="sms-code">Enter SMS code</Label>
                <Input
                  id="sms-code"
                  type="text"
                  placeholder="000000"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button onClick={handleSMSVerification} disabled={loading || smsCode.length !== 6} className="w-full">
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>

              <Button variant="outline" onClick={() => setSmsSent(false)} className="w-full">
                Change Phone Number
              </Button>
            </>
          )}

          <Button variant="outline" onClick={() => setStep('choose')} className="w-full">
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'email') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Setup Email Authentication</CardTitle>
          <CardDescription>
            Enter the code sent to {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email-code">Enter email code</Label>
            <Input
              id="email-code"
              type="text"
              placeholder="000000"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button onClick={handleEmailVerification} disabled={loading || emailCode.length !== 6} className="w-full">
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </Button>

          <Button variant="outline" onClick={handleEmailSetup} className="w-full">
            Resend Code
          </Button>

          <Button variant="outline" onClick={() => setStep('choose')} className="w-full">
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Save Your Backup Codes</CardTitle>
          <CardDescription>
            Store these codes in a safe place. You can use them to access your account if you lose your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <Check className="w-4 h-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-background rounded border">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyBackupCodes} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Codes
            </Button>
            <Button onClick={complete2FASetup} className="flex-1">
              I've Saved These Codes
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Each backup code can only be used once. Store them securely and don't share them with anyone.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TwoFactorSetup;
