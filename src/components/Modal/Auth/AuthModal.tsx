import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Flex, ModalCloseButton, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalState";
import AuthInputs from "@/components/Modal/Auth/AuthInputs";
import OAuthButtons from "@/components/Modal/Auth/OAuthButtons";

export default function AuthModal() {
  const [modalState, setModalState] = useRecoilState(authModalState);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Modal isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {modalState.view === "login" && "Login"}
          {modalState.view === "signup" && "Sign Up"}
          {modalState.view === "resetPassword" && "Reset Password"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={6}
        >
          <Flex direction="column" align="center" justify="center" width="70%">
            <OAuthButtons />
            <Text color="gray.500" fontWeight={700}>
              OR
            </Text>
            <AuthInputs />
            {/* <ResetPassword /> */}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
