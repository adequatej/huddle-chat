import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { History, MapPin } from 'lucide-react';
import { Chat } from '@/lib/types/chat';
import ChatList from './ChatList';
import { MBTAVehicle } from '@/lib/types/mbta';
import { getLocation, useLocation } from '@/lib/getLocation';
import LocationCard from '../LocationCard';

export function ChatSidebar({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}) {
  // const [searchQuery, setSearchQuery] = useState('');
  const [nearbyChats, setNearbyChats] = useState<Chat[]>([]);

  const { location, loading, fetch: fetchLocation } = useLocation();

  const distanceThreshold = 1500; // 1.5 km

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
        const chats: Chat[] = [];
        const vehicles = await vehicleResponse.json();
        const stops = await stopsResponse.json();
        vehicles.forEach((vehicle: MBTAVehicle) => {
          if (
            vehicle.distance &&
            vehicle.distance < distanceThreshold + location.acc * 1.5
          )
            chats.push({
              chatId: vehicle.id,
              chatType: 'vehicle',
              messages: [],
            });
        });
        stops.forEach(
          (stop: MBTAVehicle & { attributes: { name: string } }) => {
            if (
              stop.distance &&
              stop.distance < distanceThreshold + location.acc * 1.5
            )
              chats.push({
                chatId: stop.attributes.name,
                chatType: 'stop',
                messages: [],
              });
          },
        );

        setNearbyChats((prev) => {
          // Check if the chats are the same
          if (
            prev.length === chats.length &&
            prev.every((chat, index) => chat.chatId === chats[index].chatId)
          ) {
            return prev;
          }
          return chats;
        });
      } catch {
        console.log('Error fetching location');
      }
    };

    if (location) {
      getChatRooms();
    }
  }, [location]);

  // Get location every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLocation();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchLocation]);

  return (
    <Sidebar className="bg-sidebar-accent">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground flex gap-1 text-lg">
            <MapPin />
            Current Locations
          </SidebarGroupLabel>
          <SidebarSeparator className="-ml-0.5" />
          <SidebarGroupContent>
            {(!location || loading) && <LocationCard />}
            <ChatList
              chats={nearbyChats}
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
          <SidebarSeparator className="-ml-0.5" />
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
