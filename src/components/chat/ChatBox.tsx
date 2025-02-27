import { cn } from '@/lib/utils';
import { Reply, Send, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSidebar } from '../ui/sidebar';
import { APIMessage } from '@/lib/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Chat input box
export default function ChatBox({
  sendMessage,
  closeReply,
  replyMessage,
}: {
  sendMessage: (message: string, replyId?: string) => void;
  closeReply: () => void;
  replyMessage?: APIMessage;
}) {
  const { state } = useSidebar(); // Sidebar state
  const [message, setMessage] = useState('');

  return (
    <div
      className={cn(
        'bg-sidebar fixed right-0 bottom-0 z-10 p-3 transition-all duration-200 ease-linear',
        state === 'collapsed'
          ? 'left-0'
          : 'left-0 md:left-[var(--sidebar-width)]',
      )}
    >
      {replyMessage && (
        <Card className="relative mb-3 rounded-lg">
          <Reply className="absolute top-2 right-3 size-6" />
          <CardHeader className="p-3">
            <CardTitle className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                onClick={closeReply}
              >
                <X />
              </Button>
              <span className="text-foreground/75 font-normal">
                Replying to{' '}
              </span>
              {replyMessage.user.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-sm">
              {replyMessage.message.length > 50
                ? `${replyMessage.message.slice(0, 50)}...`
                : replyMessage.message}
            </p>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-end gap-2">
        <Input
          type="text"
          placeholder="Type a message"
          className="mr-12"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(message, replyMessage?.messageId);
              setMessage('');
            }
          }}
        />
        <Button
          type="submit"
          variant="secondary"
          size="icon"
          className="absolute"
          onClick={() => sendMessage(message, replyMessage?.messageId)}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
