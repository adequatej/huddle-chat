'use client';

import { ReactElement, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  features: string[];
}

export function FeatureCard({
  icon,
  title,
  description,
  features,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative mt-8 w-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 10px 20px rgba(0,0,0,0.1)'
          : '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <CardHeader className="relative pt-12 text-center">
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-xl p-3 transition-all duration-300"
          style={{
            backgroundColor: isHovered
              ? 'var(--secondary)'
              : 'var(--secondary-foreground)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 transition-all duration-300"
              style={{
                opacity: isHovered ? 1 : 0.8,
                transform: `translateX(${isHovered ? '4px' : '0px'})`,
              }}
            >
              <div
                className="mt-1.5 size-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isHovered
                    ? 'var(--secondary)'
                    : 'var(--secondary-foreground)',
                }}
              />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
