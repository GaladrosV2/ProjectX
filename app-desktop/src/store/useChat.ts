import { create } from "zustand";
import { api } from "/src/lib/api";

type Server = { id: string; name: string };
type Channel = { id: string; name: string; server_id: string };
type Message = {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

type ChatState = {
  serversById: Record<string, Server>;
  channelsById: Record<string, Channel>;
  messagesByChannel: Record<string, Message[]>;

  fetchServers: () => Promise<void>;
  fetchChannels: (serverId: string) => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
};

export const useChat = create<ChatState>((set, get) => ({
  // IMPORTANT: initialize as empty objects (never undefined)
  serversById: {},
  channelsById: {},
  messagesByChannel: {},

  fetchServers: async () => {
    const { servers } = await api<{ servers: Server[] }>("/servers");
    const serversById: Record<string, Server> = {};
    servers.forEach((s) => (serversById[s.id] = s));
    set({ serversById });
  },

  fetchChannels: async (serverId) => {
    const { channels } = await api<{ channels: Channel[] }>(
      `/servers/${serverId}/channels`
    );
    const next = { ...get().channelsById };
    channels.forEach((c) => (next[c.id] = c));
    set({ channelsById: next });
  },

  fetchMessages: async (channelId) => {
    const { messages } = await api<{ messages: Message[] }>(
      `/channels/${channelId}/messages`
    );
    set({
      messagesByChannel: { ...get().messagesByChannel, [channelId]: messages },
    });
  },
}));
