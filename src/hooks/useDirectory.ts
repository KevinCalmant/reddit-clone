import { useRecoilState, useRecoilValue } from "recoil";
import {
  DirectoryMenuItem,
  directoryMenuState,
} from "@/atoms/directoryMenuState";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { communityState } from "@/atoms/communitiesState";
import { FaReddit } from "react-icons/fa";

const useDirectory = () => {
  const router = useRouter();
  const [directoryMenuStateValue, setDirectoryMenuState] =
    useRecoilState(directoryMenuState);
  const { currentCommunity } = useRecoilValue(communityState);

  const toggleMenu = () => {
    setDirectoryMenuState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryMenuState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (directoryMenuStateValue.isOpen) {
      toggleMenu();
    }
  };

  useEffect(() => {
    if (currentCommunity) {
      setDirectoryMenuState((prev) => ({
        ...prev,
        selectedMenuItem: {
          label: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity?.imageUrl,
        },
      }));
    }
  }, [currentCommunity]);

  return {
    directoryMenuStateValue,
    setDirectoryMenuState,
    toggleMenu,
    onSelectMenuItem,
  };
};

export default useDirectory;
