import React from 'react';
import { FlaskConical, Zap, Leaf, type LucideProps } from 'lucide-react';

export interface SubjectIconProps extends LucideProps {
  subject: 'chem' | 'physics' | 'bio' | string;
}

/** One consistent line icon per subject (replaces the old emoji icons). */
export const SubjectIcon: React.FC<SubjectIconProps> = ({ subject, className = 'w-4 h-4', ...props }) => {
  const Icon = subject === 'physics' ? Zap : subject === 'bio' ? Leaf : FlaskConical;
  return <Icon className={className} aria-hidden {...props} />;
};
