import { APIMessage } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { Reply } from 'lucide-react';
import { User } from 'next-auth';
import { ReactionBadge } from '../ReactionBadge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';

// Individual chat bubbles
export default function ChatMessage({
  user,
  message,
  replyMessage,
}: {
  user: User;
  message: APIMessage;
  replyMessage?: APIMessage;
}) {
  const messageOwner = user.id === message.user.id; // This will not work until this branch is merged with feature/register

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        messageOwner ? 'justify-end' : 'justify-start',
      )}
    >
      {/* Left Avatar */}
      {!messageOwner && (
        <Avatar className="size-10 border md:block">
          <AvatarImage src={message.user?.image || ''} />
          <AvatarFallback className="bg-accent">
            {message.user?.name?.[0] || 'N/A'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message */}
      <div className="flex flex-col gap-1">
        {/* Reply */}
        {message.replyId && (
          <Card className="bg-background relative rounded-lg border p-2 text-xs">
            {/* Push <Reply /> to the end of the parent */}
            <Reply className="absolute right-2 size-5" />
            {replyMessage && (
              <>
                <p className="font-bold">{replyMessage.user.name}</p>
                <p>
                  {replyMessage.message.length > message.message.length
                    ? `${replyMessage.message.slice(
                        0,
                        message.message.length,
                      )}...`
                    : replyMessage.message}
                </p>
              </>
            )}
          </Card>
        )}
        <div
          className={cn(
            'bg-accent max-w-lg rounded-md p-2 break-words',
            messageOwner ? 'text-right' : 'text-left',
          )}
        >
          <p className="text-md font-bold">{message.user.name}</p>
          <p>{message.message}</p>

          {/* This might be something for a <ContextMenu /> */}
          {/* <div className="font-foreground text-xs opacity-75">
            {new Date(message.timestamp).toLocaleString()}
          </div> */}
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-1">
          {Object.keys(message.reactions).length > 0 && (
            <ReactionBadge reactions={message.reactions} />
          )}
        </div>
      </div>

      {/* Right Avatar */}
      {messageOwner && (
        <Avatar className="size-10 border md:block">
          <AvatarImage src={message.user?.image || ''} />
          <AvatarFallback className="bg-accent">
            {message.user?.name?.[0] || 'N/A'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
