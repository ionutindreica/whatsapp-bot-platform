import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

export default function AdminPageLayout({ 
  title, 
  description, 
  children, 
  backTo = "/dashboard/superadmin",
  backLabel = "Back to SuperAdmin Dashboard"
}: AdminPageLayoutProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={backTo}>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{backLabel}</span>
                </Button>
              </Link>
              <div className="h-8 w-px bg-border"></div>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-purple-600" />
                  {title}
                </h1>
                {description && (
                  <p className="text-muted-foreground mt-2">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
    </div>
  );
}
