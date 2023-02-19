import { Flex } from "@chakra-ui/react";
import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import AuthModal from "@/components/Modal/Auth/AuthModal";
/*
type RightContentProps = {
  user: User;
};
*/

function RightContent() {
  return (
    <>
      <AuthModal />
      <Flex justify="content" align="center">
        <AuthButtons />
      </Flex>
    </>
  );
}

export default RightContent;
