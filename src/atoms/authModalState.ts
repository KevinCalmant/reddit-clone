import { atom } from "recoil";

export type AuthModalView = "login" | "signup" | "resetPassword";

export type AuthModalState = {
  open: boolean;
  view: AuthModalView;
};

const defaultAuthModalState: AuthModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultAuthModalState,
});
