import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  className,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({
  className,
  activeTab,
  setActiveTab,
  children,
}) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          setActiveTab,
        });
      }
      return child;
    })}
  </div>
);

interface TabsTriggerProps {
  value: string;
  className?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  activeTab,
  setActiveTab,
  children,
}) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "hover:bg-background/50",
      className
    )}
    onClick={() => setActiveTab?.(value)}>
    {children}
  </button>
);

interface TabsContentProps {
  value: string;
  className?: string;
  activeTab?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  activeTab,
  children,
}) => {
  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}>
      {children}
    </div>
  );
};
