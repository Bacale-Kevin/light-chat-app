import { create } from "zustand";

interface ActiveLisStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const useActiveList = create<ActiveLisStore>((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
  set: (ids) => set({ members: ids }),
}));

export default useActiveList;
