import { ReactElement } from 'react';
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
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  features,
  className,
}: FeatureCardProps) {
  return (
    <div className={className}>
      <Card className="group relative mt-8 w-full rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="relative pt-12 text-center">
          <div className="bg-accent group-hover:bg-secondary absolute -top-6 left-1/2 -translate-x-1/2 rounded-xl p-3 transition-all duration-300">
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
                className="ml-2 flex items-start gap-3 transition-all duration-300 group-hover:translate-x-1"
              >
                <div className="bg-accent group-hover:bg-secondary mt-1.5 size-1.5 rounded-full transition-all duration-300" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
