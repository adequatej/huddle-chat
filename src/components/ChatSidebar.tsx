import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Input } from './ui/input';
import { History, MapPin } from 'lucide-react';
import { Chat } from '@/lib/types/chat';
import ChatList from './chat/ChatList';
import { MBTAVehicle } from '@/lib/types/mbta';
import { getLocation, useLocation } from '@/lib/getLocation';
import LocationCard from './LocationCard';
/*
const chatsDummy: Chat[] = [
  {
    chatId: 'Chat 1',
    chatType: 'vehicle',
    messages: [
      {
        messageId: '1',
        message: "Hey how's it going?",
        reactions: {},
        timestamp: Date.now(),
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
      {
        messageId: '2',
        message: 'Good, how about you?',
        replyId: '1',
        reactions: {},
        timestamp: Date.now(),
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
      {
        messageId: '3',
        message: "I'm doing well, thanks for asking!",
        reactions: {
          '❤️': 1,
        },
        timestamp: Date.now(),
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/',
        },
      },
    ],
  },
  {
    chatId: 'Chat 2',
    chatType: 'stop',
    messages: [
      {
        messageId: '1',
        message:
          "Hey, how are you? This is a really long message that I don't know how to handle in the UI",
        reactions: {},
        timestamp: 1735212761000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '2',
        message: 'I am doing well, thank you!',
        replyId: '1',
        reactions: {
          '❤️': 4,
          '👍': 2,
          '😂': 1,
        },
        timestamp: 1735212762000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '3',
        message: "Hi everyone! I'm new here.",
        reactions: {},
        timestamp: 1735212763000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '4',
        message: 'Welcome, Alice! Nice to meet you.',
        replyId: '3',
        reactions: {
          '👍': 3,
        },
        timestamp: 1735212764000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '4.5',
        message: 'Hey Alice!',
        replyId: '3',
        reactions: {
          '😊': 1,
        },
        timestamp: 1735212764000,
        user: {
          id: '67be4da06911c1b78d81a327',
          name: 'Daniel Stoiber',
          image: 'https://avatars.githubusercontent.com/u/20031472?v=4',
        },
      },
      {
        messageId: '5',
        message: 'Hello Alice! Welcome aboard.',
        replyId: '3',
        reactions: {
          '❤️': 2,
        },
        timestamp: 1735212765000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '6',
        message: "Thank you all! I'm excited to be here.",
        replyId: '4',
        reactions: {
          '😊': 4,
        },
        timestamp: 1735212766000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '7',
        message: "Hey team, don't forget about the meeting tomorrow at 10 AM.",
        reactions: {},
        timestamp: 1735212767000,
        user: {
          id: '4',
          name: 'Bob Johnson',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
      },
      {
        messageId: '8',
        message: 'Thanks for the reminder, Bob.',
        replyId: '7',
        reactions: {
          '👍': 2,
        },
        timestamp: 1735212768000,
        user: {
          id: '1',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
      },
      {
        messageId: '9',
        message: "I'll be there!",
        replyId: '7',
        reactions: {
          '👍': 1,
        },
        timestamp: 1735212769000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '10',
        message: 'Looking forward to it.',
        replyId: '7',
        reactions: {
          '😊': 2,
        },
        timestamp: 1735212770000,
        user: {
          id: '3',
          name: 'Alice Smith',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
      },
      {
        messageId: '11',
        message: 'Does anyone have the agenda for the meeting?',
        reactions: {},
        timestamp: 1735212771000,
        user: {
          id: '2',
          name: 'Jane Doe',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
      {
        messageId: '12',
        message: 'I can send it over to you, Jane.',
        replyId: '11',
        reactions: {
          '👍': 1,
        },
        timestamp: 1735212772000,
        user: {
          id: '4',
          name: 'Bob Johnson',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
      },
    ],
  },
];
*/

export function ChatSidebar({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyChatIDs, setNearbyChatIDs] = useState<string[]>([]);

  const { location /* error, loading,*/ } = useLocation();

  const distanceThreshold = 40000; // 4 km

  useEffect(() => {
    const getChatRooms = async () => {
      try {
        const location = await getLocation();
        const stopsResponse = await fetch(
          `/api/mbta/nearest-stops?lat=${location.lat}&lon=${location.lon}&acc=${location.acc}`,
        );
        const vehicleResponse = await fetch(
          `/api/mbta/nearest-vehicles?lat=${location.lat}&lon=${location.lon}&acc=${location.acc}`,
        );
        const chats: string[] = [];
        const vehicles = await vehicleResponse.json();
        const stops = await stopsResponse.json();
        vehicles.forEach((vehicle: MBTAVehicle) => {
          if (
            vehicle.distance &&
            vehicle.distance < distanceThreshold + location.acc * 1.5
          )
            chats.push(vehicle.id);
        });
        stops.forEach((stop: MBTAVehicle) => {
          console.log(`${stop.attributes.label}  ${stop.distance}`);
          if (
            stop.distance &&
            stop.distance < distanceThreshold + location.acc * 1.5
          )
            chats.push(stop.id);
        });
        setNearbyChatIDs(chats);
        console.log(chats);
      } catch {
        console.log('Error fetching location');
      }
    };

    getChatRooms();
  }, []);

  return (
    <Sidebar className="bg-sidebar-accent">
      <SidebarHeader className="items-center">
        <Input
          type="text"
          placeholder="Search..."
          className="bg-background text-foreground w-full rounded-lg p-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground flex gap-1 text-lg">
            <MapPin />
            Current Locations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {location && <LocationCard />}

            <ChatList
              chatIDs={nearbyChatIDs}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground flex gap-1 text-lg">
            <History />
            Past Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatList
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
