import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/modal";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { CommunityType } from "@/types/CommunityType";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  Transaction,
} from "@firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { serverTimestamp } from "@firebase/database";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

export default function CreateCommunityModal({
  open,
  handleClose,
}: CreateCommunityModalProps) {
  const [user] = useAuthState(auth);

  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState<CommunityType>("public");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCommunityNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) {
      return;
    }
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleCommunityTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name as CommunityType);
  };

  const handleCreateCommunity = async () => {
    if (errorMessage) setErrorMessage("");
    const format = /[ `!@#$%^&*()+\-=[\]{};':"\\|,.<>/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setErrorMessage(
        "Community names must be between 3 and 21 characters, and can only contain letters, numbers, or underscores"
      );
      return;
    }
    setLoading(true);
    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      await runTransaction(firestore, async (transaction: Transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          setErrorMessage(`Sorry, r/${communityName} is taken. Try another.`);
        }

        await transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display="flex"
          flexDirection="column"
          fontSize={15}
          padding={3}
        >
          Create a community
        </ModalHeader>
        <Box pl={3} pr={3}>
          <Divider />
          <ModalCloseButton onClick={handleClose} />
          <ModalBody display="flex" flexDirection="column" padding="10px 0px">
            <Text fontWeight={600} fontSize={15}>
              Name
            </Text>
            <Text fontSize={11} color="gray.500">
              Community names including capitalization cannot be changed
            </Text>
            <Text
              position="relative"
              top="28px"
              left="10px"
              width="20px"
              color="gray.400"
            >
              r/
            </Text>
            <Input
              size="sm"
              pl="22px"
              position="relative"
              value={communityName}
              onChange={handleCommunityNameChange}
            />
            <Text
              fontSize={9}
              color={charsRemaining === 0 ? "red" : "gray.500"}
            >
              {charsRemaining} Characters remaining
            </Text>
            <Text fontSize={9} color="red" pt={1}>
              {errorMessage}
            </Text>
            <Box mt={4} mb={4}>
              <Text fontWeight={600} fontSize={15}>
                Community Type
              </Text>
              {/* <Checkbox /> */}
              <Stack spacing={2}>
                <Checkbox
                  name="public"
                  isChecked={communityType === "public"}
                  onChange={handleCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillPersonFill} mr={2} color="gray.500" />
                    <Text fontSize="10pt" mr={1}>
                      Public
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view, post, and comment to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="restricted"
                  isChecked={communityType === "restricted"}
                  onChange={handleCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillEyeFill} mr={2} color="gray.500" />
                    <Text fontSize="10pt" mr={1}>
                      Restricted
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view this community but only approved can post
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="private"
                  isChecked={communityType === "private"}
                  onChange={handleCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={HiLockClosed} mr={2} color="gray.500" />
                    <Text fontSize="10pt" mr={1}>
                      Private
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Only approved users can view and submit to this community
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>
        <ModalFooter bg="gray.100" borderRadius="0px 0px 0.375rem 0.375rem">
          <Button variant="outline" height="30px" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            height="30px"
            onClick={handleCreateCommunity}
            isLoading={loading}
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
