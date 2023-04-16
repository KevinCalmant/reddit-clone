import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export type DirectoryMenuItem = {
  label: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

export interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
  label: "home",
  link: "/",
  icon: TiHome,
  iconColor: "black",
};

export const defaultDirectoryMenuState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const directoryMenuState = atom<DirectoryMenuState>({
  key: "directoryMenuState",
  default: defaultDirectoryMenuState,
});
