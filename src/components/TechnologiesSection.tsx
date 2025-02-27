'use client';

import {
  Code2,
  FileCode,
  Palette,
  Boxes,
  Database,
  Shield,
  Train,
  Wrench,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

export function TechnologiesSection() {
  const technologies = [
    {
      category: 'Frontend',
      color: 'primary',
      items: [
        {
          name: 'Next.js',
          description: 'Frontend Framework',
          icon: <Code2 className="size-4" />,
        },
        {
          name: 'TailwindCSS',
          description: 'Styling',
          icon: <Palette className="size-4" />,
        },
        {
          name: 'Shadcn/ui',
          description: 'UI Components',
          icon: <Boxes className="size-4" />,
        },
        {
          name: 'Lucide',
          description: 'Icon Library',
          icon: <Sparkles className="size-4" />,
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
        },
        {
          name: 'MongoDB',
          description: 'Database',
          icon: <Database className="size-4" />,
        },
        {
          name: 'Auth.js',
          description: 'Authentication',
          icon: <Shield className="size-4" />,
        },
        {
          name: 'MBTA API',
          description: 'Transit Data',
          icon: <Train className="size-4" />,
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
          icon: <Wrench className="size-4" />,
        },
        {
          name: 'Prettier',
          description: 'Code Formatting',
          icon: <Wrench className="size-4" />,
        },
        {
          name: 'Husky',
          description: 'Git Hooks',
          icon: <Wrench className="size-4" />,
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState('Frontend');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full">
      {/* Category Selector */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {technologies.map((tech) => (
          <button
            key={tech.category}
            onClick={() => setActiveCategory(tech.category)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all',
              'hover:opacity-80',
              activeCategory === tech.category
                ? tech.color === 'primary'
                  ? 'bg-primary text-primary-foreground'
                  : tech.color === 'secondary'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-accent text-accent-foreground'
                : 'bg-background/5',
            )}
          >
            {tech.category}
          </button>
        ))}
      </div>

      {/* Technologies Container but added fixed height to help algin */}
      <div className="relative h-[180px]">
        {technologies.map((category) => (
          <div
            key={category.category}
            className={cn(
              'absolute inset-0 transition-all duration-300',
              activeCategory !== category.category
                ? 'pointer-events-none translate-y-4 opacity-0'
                : 'translate-y-0 opacity-100',
            )}
          >
            {/* Scroll Buttons to help indicate the scrollable container */}
            <button
              onClick={() => scroll('left')}
              className="bg-background/80 hover:bg-background/90 absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full p-1 shadow-md backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-background/80 hover:bg-background/90 absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full p-1 shadow-md backdrop-blur-sm transition-all"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Made each a scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="no-scrollbar flex h-full gap-4 overflow-x-auto scroll-smooth px-8 py-4"
            >
              {category.items.map((tech, index) => (
                <div
                  key={tech.name}
                  className={cn(
                    'flex min-w-[140px] flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200',
                    'hover:scale-105 hover:shadow-lg',
                    category.color === 'primary'
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : category.color === 'secondary'
                        ? 'bg-secondary/5 hover:bg-secondary/10'
                        : 'bg-accent/5 hover:bg-accent/10',
                  )}
                >
                  <div
                    className={cn(
                      'animate-float rounded-full p-3',
                      category.color === 'primary'
                        ? 'bg-primary/10 text-primary'
                        : category.color === 'secondary'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-accent/10 text-accent',
                    )}
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    {tech.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
