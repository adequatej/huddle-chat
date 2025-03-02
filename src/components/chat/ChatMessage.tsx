import { APIMessage } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { Reply, SmilePlus } from 'lucide-react';
import { User } from 'next-auth';
import { ReactionBadge } from '../ReactionBadge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../ui/context-menu';
import SwipeableElement from './SwipeableElement';

// Individual chat bubbles
export default function ChatMessage({
  user,
  message,
  replyToMessage,
  replyMessage,
}: {
  user: User;
  message: APIMessage;
  replyToMessage: () => void;
  replyMessage?: APIMessage;
}) {
  const messageOwner = user.id === message.user.id; // This will not work until this branch is merged with feature/register

  // React to a message
  const reactToMessage = (reaction: string) => {
    throw new Error(`Not implemented: Reacting to a message with ${reaction}`);
  };

  return (
    <SwipeableElement
      onSwipe={replyToMessage}
      direction={messageOwner ? 'left' : 'right'}
    >
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

          {/* Main message bubble */}
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={cn(
                  'bg-accent max-w-lg rounded-md p-2 break-words',
                  messageOwner ? 'text-right' : 'text-left',
                )}
              >
                <p className="text-md font-bold">{message.user.name}</p>
                <p>{message.message}</p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent
              className="text-popover-foreground"
              onSelect={console.log}
            >
              <ContextMenuLabel className="text-inherit">
                {new Date(message.timestamp).toLocaleString()}
              </ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem
                className="text-popover-foreground hover:text-accent-foreground"
                onClick={replyToMessage}
              >
                <Reply className="mr-2 text-inherit" />
                Reply
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <SmilePlus className="mr-2" />
                  React
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('👍')}
                  >
                    👍 <span className="text-base">- Like</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('❤️')}
                  >
                    ❤️ <span className="text-base">- Love</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('😂')}
                  >
                    😂 <span className="text-base">- Funny</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('😮')}
                  >
                    😮 <span className="text-base">- Woah</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('😢')}
                  >
                    😢 <span className="text-base">- Sad</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-xl"
                    onClick={() => reactToMessage('😡')}
                  >
                    😡 <span className="text-base">- Angry</span>
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Report</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

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
    </SwipeableElement>
  );
}
