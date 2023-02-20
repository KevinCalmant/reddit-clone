import { Flex } from "@chakra-ui/react";
import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { User } from "@firebase/auth";
import Icons from "@/components/Navbar/RightContent/Icons";
import UserMenu from "@/components/Navbar/RightContent/UserMenu";

type RightContentProps = {
  user: User | null | undefined;
};

function RightContent({ user }: RightContentProps) {
  return (
    <>
      <AuthModal />
      <Flex justify="content" align="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
}

export default RightContent;
