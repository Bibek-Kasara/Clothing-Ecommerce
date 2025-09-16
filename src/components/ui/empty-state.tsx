import { PackageX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  icon: Icon = PackageX, 
  message, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{message}</h3>
      {description && (
        <p className="text-slate-600 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}