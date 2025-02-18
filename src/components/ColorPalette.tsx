const colors = [
  { name: 'background', cssVar: '--background' },
  { name: 'foreground', cssVar: '--foreground' },
  { name: 'card', cssVar: '--card' },
  { name: 'card-foreground', cssVar: '--card-foreground' },
  { name: 'popover', cssVar: '--popover' },
  { name: 'popover-foreground', cssVar: '--popover-foreground' },
  { name: 'primary', cssVar: '--primary' },
  { name: 'primary-foreground', cssVar: '--primary-foreground' },
  { name: 'secondary', cssVar: '--secondary' },
  { name: 'secondary-foreground', cssVar: '--secondary-foreground' },
  { name: 'muted', cssVar: '--muted' },
  { name: 'muted-foreground', cssVar: '--muted-foreground' },
  { name: 'accent', cssVar: '--accent' },
  { name: 'accent-foreground', cssVar: '--accent-foreground' },
  { name: 'destructive', cssVar: '--destructive' },
  { name: 'destructive-foreground', cssVar: '--destructive-foreground' },
  { name: 'border', cssVar: '--border' },
  { name: 'input', cssVar: '--input' },
  { name: 'ring', cssVar: '--ring' },
];

export default function ColorPalette() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {colors.map((color) => (
        <div key={color.name} className="flex flex-col items-center">
          {/* The border is added so that white colors are visible */}
          <div
            className="size-24 rounded-md border"
            style={{ backgroundColor: `var(${color.cssVar})` }}
          />
          <span className="mt-2 text-sm">{color.name}</span>
        </div>
      ))}
    </div>
  );
}
