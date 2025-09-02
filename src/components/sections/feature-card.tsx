import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div className="bg-card rounded-lg p-8 transition-all duration-300 hover:bg-card-hover">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        {description}
      </p>
    </div>
  );
};

export { FeatureCard };
