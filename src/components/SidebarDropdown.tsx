import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

interface SidebarDropdownProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  isActive: (path: string) => boolean;
  getNavCls: ({ isActive }: { isActive: boolean }) => string;
  collapsed: boolean;
}

export default function SidebarDropdown({
  title,
  icon: Icon,
  items,
  isActive,
  getNavCls,
  collapsed
}: SidebarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveItem = items.some(item => isActive(item.url));

  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Button
              key={item.title}
              variant="ghost"
              className={`w-full justify-start ${getNavCls({ isActive: isActive(item.url) })}`}
              asChild
            >
              <a href={item.url}>
                <ItemIcon className="h-5 w-5" />
              </a>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between ${hasActiveItem ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
        >
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-3" />
            <span className="font-medium">{title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-8">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Button
              key={item.title}
              variant="ghost"
              className={`w-full justify-start ${getNavCls({ isActive: isActive(item.url) })}`}
              asChild
            >
              <a href={item.url}>
                <ItemIcon className="h-4 w-4 mr-3" />
                <span className="text-sm">{item.title}</span>
              </a>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
