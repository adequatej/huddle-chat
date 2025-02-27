import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSidebar } from '../ui/sidebar';

// Chat input box
export default function ChatBox({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) {
  const { state } = useSidebar(); // Sidebar state
  const [message, setMessage] = useState('');

  return (
    <div
      className={cn(
        'bg-sidebar fixed right-0 bottom-0 z-10 flex items-center justify-end gap-2 p-3 transition-all duration-200 ease-linear',
        state === 'collapsed'
          ? 'left-0'
          : 'left-0 md:left-[var(--sidebar-width)]',
      )}
    >
      <Input
        type="text"
        placeholder="Type a message"
        className="mr-12"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(message);
          }
        }}
      />
      <Button
        type="submit"
        variant="secondary"
        size="icon"
        className="absolute"
        onClick={() => sendMessage(message)}
      >
        <Send />
      </Button>
    </div>
  );
}
