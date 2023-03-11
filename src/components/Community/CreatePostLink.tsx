import { Flex, Icon, Input } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalState";
import { useRouter } from "next/router";

export default function CreatePostLink() {
  const user = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const handleClick = async () => {
    if (!user) {
      setAuthModalState({
        open: true,
        view: "login",
      });
      return;
    }
    const { communityId } = router.query;
    await router.push(`/r/${communityId}/submit`);
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create post"
        fontSize="10pt"
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _placeholder={{ color: "gray.500" }}
        onClick={handleClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon
        as={BsLink45Deg}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
    </Flex>
  );
}
