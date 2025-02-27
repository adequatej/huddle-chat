'use client';

import {
  Code2,
  FileCode,
  Palette,
  Boxes,
  Database,
  Shield,
  Train,
  ChartNoAxesGantt,
  GitCommitHorizontal,
  ListCheck,
  ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Badge } from './ui/badge';

const technologies = [
  {
    category: 'Frontend',
    color: 'primary',
    items: [
      {
        name: 'Next.js',
        description: 'Frontend Framework',
        icon: <Code2 className="size-4" />,
        url: 'https://nextjs.org',
      },
      {
        name: 'TailwindCSS',
        description: 'Styling',
        icon: <Palette className="size-4" />,
        url: 'https://tailwindcss.com',
      },
      {
        name: 'Shadcn/ui',
        description: 'UI Components',
        icon: <Boxes className="size-4" />,
        url: 'https://ui.shadcn.com/docs',
      },
      {
        name: 'Lucide',
        description: 'Icon Library',
        icon: <ImageIcon className="size-4" />,
        url: 'https://lucide.dev',
      },
    ],
  },
  {
    category: 'Backend',
    color: 'secondary',
    items: [
      {
        name: 'TypeScript',
        description: 'Language',
        icon: <FileCode className="size-4" />,
        url: 'https://typescriptlang.org',
      },
      {
        name: 'MongoDB',
        description: 'Database',
        icon: <Database className="size-4" />,
        url: 'https://mongodb.com',
      },
      {
        name: 'Auth.js',
        description: 'Authentication',
        icon: <Shield className="size-4" />,
        url: 'https://authjs.dev/',
      },
      {
        name: 'MBTA API',
        description: 'Transit Data',
        icon: <Train className="size-4" />,
        url: 'https://www.mbta.com/developers/v3-api',
      },
    ],
  },
  {
    category: 'Tools',
    color: 'accent',
    items: [
      {
        name: 'ESLint',
        description: 'Code Quality',
        icon: <ListCheck className="size-4" />,
        url: 'https://eslint.org',
      },
      {
        name: 'Prettier',
        description: 'Code Formatting',
        icon: <ChartNoAxesGantt className="size-4" />,
        url: 'https://prettier.io',
      },
      {
        name: 'Husky',
        description: 'Git Hooks',
        icon: <GitCommitHorizontal className="size-4" />,
        url: 'https://typicode.github.io/husky',
      },
    ],
  },
];

export function TechnologiesSection() {
  const [activeCategory, setActiveCategory] = useState('Frontend');

  const selectedCategory = useMemo(
    () => technologies.find((tech) => tech.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="w-full">
      {/* Category Selector */}
      <div className="flex gap-2 overflow-x-auto p-2">
        {technologies.map((tech) => (
          <Badge
            key={tech.category}
            onClick={() => setActiveCategory(tech.category)}
            variant={activeCategory === tech.category ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer rounded-full px-3 py-1 text-sm hover:scale-105 motion-safe:transition-transform',
              activeCategory === tech.category &&
                `bg-${tech.color} text-${tech.color}-foreground`,
            )}
          >
            {tech.category}
          </Badge>
        ))}
      </div>

      {/* Technology carousel */}
      <Carousel className="mx-8">
        <CarouselContent className="flex gap-3 p-5">
          {technologies
            .find((tech) => tech.category === activeCategory)
            ?.items.map((tool) => (
              <CarouselItem
                key={tool.name}
                className="flex max-w-40 cursor-pointer flex-col items-center gap-3 rounded-lg border px-2 py-4 hover:scale-105 motion-safe:transition-transform"
                onClick={() => window.open(tool.url, '_blank')}
              >
                <div
                  className={cn(
                    'rounded-full p-3',
                    `bg-${selectedCategory?.color} text-${selectedCategory?.color}-foreground`,
                  )}
                >
                  {tool.icon}
                </div>
                <h3 className="text-md font-medium">{tool.name}</h3>
                <p className="text-foreground/75 text-xs">{tool.description}</p>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
