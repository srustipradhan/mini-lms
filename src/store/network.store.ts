import { create } from 'zustand';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

function isOnline(state: NetInfoState): boolean {
  return Boolean(state.isConnected && state.isInternetReachable !== false);
}

interface NetworkState {
  isOnline: boolean;
  initialize: () => () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: true,

  initialize: () => {
    void NetInfo.fetch().then((state) => set({ isOnline: isOnline(state) }));

    const unsubscribe = NetInfo.addEventListener((state) => {
      set({ isOnline: isOnline(state) });
    });

    return unsubscribe;
  },
}));
