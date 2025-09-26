import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Bot, 
  Phone, 
  MessageSquare, 
  Users, 
  Globe, 
  Settings,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  url: string;
  estimatedTime: string;
  category: 'setup' | 'configuration' | 'optimization';
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Define onboarding steps based on user role
  const getOnboardingSteps = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to ChatFlow',
        description: 'Let\'s get you started with your AI assistant platform',
        icon: Bot,
        completed: false,
        url: '/dashboard',
        estimatedTime: '1 min',
        category: 'setup'
      },
      {
        id: 'connect-channel',
        title: 'Connect Your First Channel',
        description: 'Link WhatsApp, Instagram, or your website to start receiving messages',
        icon: Phone,
        completed: false,
        url: '/dashboard/channels',
        estimatedTime: '3 min',
        category: 'setup'
      },
      {
        id: 'create-bot',
        title: 'Create Your First Bot',
        description: 'Build an AI assistant that can handle customer inquiries automatically',
        icon: Bot,
        completed: false,
        url: '/dashboard/flows',
        estimatedTime: '5 min',
        category: 'setup'
      },
      {
        id: 'test-bot',
        title: 'Test Your Bot',
        description: 'Send a test message to make sure everything works perfectly',
        icon: MessageSquare,
        completed: false,
        url: '/dashboard/conversations',
        estimatedTime: '2 min',
        category: 'configuration'
      }
    ];

    // Add role-specific steps
    if (user?.role === 'MANAGER' || user?.role === 'SUPER_ADMIN' || user?.role === 'ROOT_OWNER') {
      baseSteps.push({
        id: 'invite-team',
        title: 'Invite Your Team',
        description: 'Add team members and assign roles for better collaboration',
        icon: Users,
        completed: false,
        url: '/dashboard/team',
        estimatedTime: '3 min',
        category: 'configuration'
      });
    }

    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ROOT_OWNER') {
      baseSteps.push({
        id: 'configure-settings',
        title: 'Configure Platform Settings',
        description: 'Set up security, permissions, and system preferences',
        icon: Settings,
        completed: false,
        url: '/dashboard/settings',
        estimatedTime: '5 min',
        category: 'configuration'
      });
    }

    // Add optimization steps for all users
    baseSteps.push(
      {
        id: 'setup-automation',
        title: 'Set Up Automation',
        description: 'Create automated workflows to handle common customer requests',
        icon: Zap,
        completed: false,
        url: '/dashboard/automation',
        estimatedTime: '10 min',
        category: 'optimization'
      },
      {
        id: 'view-analytics',
        title: 'Explore Analytics',
        description: 'Learn how to track performance and optimize your AI assistant',
        icon: BarChart3,
        completed: false,
        url: '/dashboard/analytics',
        estimatedTime: '3 min',
        category: 'optimization'
      }
    );

    return baseSteps;
  };

  const steps = getOnboardingSteps();
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'configuration':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'optimization':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup':
        return <Target className="w-3 h-3" />;
      case 'configuration':
        return <Settings className="w-3 h-3" />;
      case 'optimization':
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <p className="text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Current Step */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {steps[currentStep].title}
                    <Badge variant="outline" className={getCategoryColor(steps[currentStep].category)}>
                      {getCategoryIcon(steps[currentStep].category)}
                      {steps[currentStep].category}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Estimated time: {steps[currentStep].estimatedTime}</span>
                  </div>
                  <Button size="sm" asChild>
                    <a href={steps[currentStep].url} target="_blank" rel="noopener noreferrer">
                      Start Step
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStepComplete(steps[currentStep].id)}
                    disabled={completedSteps.includes(steps[currentStep].id)}
                  >
                    {completedSteps.includes(steps[currentStep].id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Steps Overview */}
          <Card>
            <CardHeader>
              <CardTitle>All Steps</CardTitle>
              <CardDescription>Track your progress through the setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      index === currentStep ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSteps.includes(step.id) 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getCategoryColor(step.category)}>
                        {getCategoryIcon(step.category)}
                        {step.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <Button onClick={handleFinish}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Finish Setup
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
