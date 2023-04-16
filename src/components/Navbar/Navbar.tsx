import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "@/components/Navbar/SearchInput";
import RightContent from "@/components/Navbar/RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import DirectoryMenu from "@/components/Navbar/Directory/DirectoryMenu";
import { memo } from "react";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/atoms/directoryMenuState";
import useCommunityData from "@/hooks/useCommunityData";

const Navbar = memo(() => {
  const [user] = useAuthState(auth);
  useCommunityData();
  const { onSelectMenuItem } = useDirectory();

  const handleLogoClick = () => {
    onSelectMenuItem(defaultMenuItem);
  };

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={handleLogoClick}
      >
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src="/images/redditText.svg"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <DirectoryMenu />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
});

export default Navbar;
