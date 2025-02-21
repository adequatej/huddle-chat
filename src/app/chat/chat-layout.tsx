import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat-sidebar';

export default function Chat() {
  return (
    <>
      <SidebarProvider>
        <ChatSidebar />
      </SidebarProvider>
    </>
  );
}
