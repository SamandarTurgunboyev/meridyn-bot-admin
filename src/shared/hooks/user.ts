import type { GetMeResData } from "@/shared/config/api/user/type";
import { create } from "zustand";

type State = {
  user: GetMeResData | null;
};

type Actions = {
  addUser: (user: GetMeResData) => void;
};

export const userStore = create<State & Actions>((set) => ({
  user: null,
  addUser: (user: GetMeResData | null) => set(() => ({ user })),
}));
