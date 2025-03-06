import { Badge } from '@/components/ui/badge';
import { Reactions } from '@/lib/types/chat';

export function ReactionBadge({ reactions }: { reactions: Reactions }) {
  return (
    <Badge variant="outline">
      {Object.entries(reactions).map(([reaction, count]) => (
        <span key={reaction}>
          {reaction} {count}
        </span>
      ))}
    </Badge>
  );
}
