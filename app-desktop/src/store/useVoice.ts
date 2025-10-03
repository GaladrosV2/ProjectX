import { create } from "zustand";

type VoiceState = {
  joined: boolean;
  muted: boolean;
  deafened: boolean;
  join: (serverId: string, channelId: string) => Promise<void>;
  leave: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
};

export const useVoice = create<VoiceState>((set, get) => ({
  joined: false,
  muted: false,
  deafened: false,
  join: async () => set({ joined: true }),
  leave: () => set({ joined: false }),
  toggleMute: () => set({ muted: !get().muted }),
  toggleDeafen: () => set({ deafened: !get().deafened }),
}));
