import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database, 
  Server, 
  Key, 
  Bell,
  Palette,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface PlatformSettings {
  // Branding
  branding: {
    platformName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
    customCSS: string;
  };
  
  // Email Configuration
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    useSSL: boolean;
  };
  
  // Security
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    require2FA: boolean;
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    allowedDomains: string[];
    ipWhitelist: string[];
  };
  
  // System
  system: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    maxFileUploadSize: number;
    supportedFileTypes: string[];
    dataRetentionDays: number;
    backupFrequency: string;
  };
  
  // API
  api: {
    rateLimitPerMinute: number;
    apiKeyExpirationDays: number;
    webhookTimeout: number;
    maxWebhookRetries: number;
    enableGraphQL: boolean;
  };
  
  // Notifications
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    slackWebhook: string;
    discordWebhook: string;
    adminAlerts: boolean;
  };
}

const PlatformSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    branding: {
      platformName: 'ChatFlow AI',
      logo: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      favicon: '',
      customCSS: ''
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@chatflow.ai',
      fromName: 'ChatFlow AI',
      useSSL: true
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      require2FA: false,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      allowedDomains: [],
      ipWhitelist: []
    },
    system: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
      maxFileUploadSize: 10,
      supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      dataRetentionDays: 365,
      backupFrequency: 'daily'
    },
    api: {
      rateLimitPerMinute: 100,
      apiKeyExpirationDays: 365,
      webhookTimeout: 30,
      maxWebhookRetries: 3,
      enableGraphQL: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      slackWebhook: '',
      discordWebhook: '',
      adminAlerts: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      // const response = await api.get('/admin/platform-settings');
      // setSettings(response.data);
    } catch (error) {
      console.error('Error loading platform settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // Mock save - replace with actual API call
      // await api.post('/admin/platform-settings', settings);
      console.log('Settings saved:', settings);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: keyof PlatformSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof PlatformSettings, field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(section, field, array);
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
    { id: 'api', label: 'API', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
            <p className="text-gray-600 mt-2">Configure global platform settings and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-bold text-gray-900">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${settings.system.maintenanceMode ? 'bg-yellow-100' : 'bg-green-100'}`}>
                  {settings.system.maintenanceMode ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-lg font-bold text-gray-900">
                    {settings.system.maintenanceMode ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">2FA Required</p>
                  <p className="text-lg font-bold text-gray-900">
                    {settings.security.require2FA ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-lg font-bold text-gray-900">
                    {settings.notifications.emailNotifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Card>
          <CardHeader>
            <div className="flex space-x-1 border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Branding Settings */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <Input
                      value={settings.branding.platformName}
                      onChange={(e) => handleInputChange('branding', 'platformName', e.target.value)}
                      placeholder="Enter platform name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <Input
                      type="color"
                      value={settings.branding.primaryColor}
                      onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <Input
                      type="color"
                      value={settings.branding.secondaryColor}
                      onChange={(e) => handleInputChange('branding', 'secondaryColor', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Upload
                    </label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="file"
                        accept="image/*"
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom CSS
                  </label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.branding.customCSS}
                    onChange={(e) => handleInputChange('branding', 'customCSS', e.target.value)}
                    placeholder="Enter custom CSS..."
                  />
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <Input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <Input
                      value={settings.email.fromEmail}
                      onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                      placeholder="noreply@yourdomain.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <Input
                      value={settings.email.fromName}
                      onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                      placeholder="Your Platform Name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (hours)
                    </label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      placeholder="24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Min Length
                    </label>
                    <Input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                      placeholder="8"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.require2FA}
                        onChange={(e) => handleInputChange('security', 'require2FA', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Require 2FA</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordRequireSpecialChars}
                        onChange={(e) => handleInputChange('security', 'passwordRequireSpecialChars', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Special Characters</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Domains (comma-separated)
                  </label>
                  <Input
                    value={settings.security.allowedDomains.join(', ')}
                    onChange={(e) => handleArrayChange('security', 'allowedDomains', e.target.value)}
                    placeholder="yourdomain.com, company.com"
                  />
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => handleInputChange('system', 'maintenanceMode', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.system.maintenanceMessage}
                    onChange={(e) => handleInputChange('system', 'maintenanceMessage', e.target.value)}
                    placeholder="We are currently performing maintenance..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Upload Size (MB)
                    </label>
                    <Input
                      type="number"
                      value={settings.system.maxFileUploadSize}
                      onChange={(e) => handleInputChange('system', 'maxFileUploadSize', parseInt(e.target.value))}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.system.dataRetentionDays}
                      onChange={(e) => handleInputChange('system', 'dataRetentionDays', parseInt(e.target.value))}
                      placeholder="365"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supported File Types (comma-separated)
                  </label>
                  <Input
                    value={settings.system.supportedFileTypes.join(', ')}
                    onChange={(e) => handleArrayChange('system', 'supportedFileTypes', e.target.value)}
                    placeholder="jpg, png, pdf, doc"
                  />
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Limit (requests/minute)
                    </label>
                    <Input
                      type="number"
                      value={settings.api.rateLimitPerMinute}
                      onChange={(e) => handleInputChange('api', 'rateLimitPerMinute', parseInt(e.target.value))}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key Expiration (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.api.apiKeyExpirationDays}
                      onChange={(e) => handleInputChange('api', 'apiKeyExpirationDays', parseInt(e.target.value))}
                      placeholder="365"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook Timeout (seconds)
                    </label>
                    <Input
                      type="number"
                      value={settings.api.webhookTimeout}
                      onChange={(e) => handleInputChange('api', 'webhookTimeout', parseInt(e.target.value))}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Webhook Retries
                    </label>
                    <Input
                      type="number"
                      value={settings.api.maxWebhookRetries}
                      onChange={(e) => handleInputChange('api', 'maxWebhookRetries', parseInt(e.target.value))}
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.api.enableGraphQL}
                      onChange={(e) => handleInputChange('api', 'enableGraphQL', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable GraphQL</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slack Webhook URL
                    </label>
                    <Input
                      value={settings.notifications.slackWebhook}
                      onChange={(e) => handleInputChange('notifications', 'slackWebhook', e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discord Webhook URL
                    </label>
                    <Input
                      value={settings.notifications.discordWebhook}
                      onChange={(e) => handleInputChange('notifications', 'discordWebhook', e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.adminAlerts}
                      onChange={(e) => handleInputChange('notifications', 'adminAlerts', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Admin Alerts</span>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving} size="lg">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PlatformSettings;
