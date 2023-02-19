import { Button, Flex } from "@chakra-ui/react";
import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { signOut, User } from "@firebase/auth";
import { auth } from "@/firebase/clientApp";

type RightContentProps = {
  user: User | null | undefined;
};

function RightContent({ user }: RightContentProps) {
  return (
    <>
      <AuthModal />
      <Flex justify="content" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
}

export default RightContent;
