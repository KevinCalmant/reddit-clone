import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { MenuItem } from "@chakra-ui/menu";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesState";
import MenuListItem from "@/components/Navbar/Directory/MenuListItem";
import { FaReddit } from "react-icons/fa";

export default function Communities() {
  const [open, setOpen] = useState(false);
  const { mySnippets } = useRecoilValue(communityState);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODARATING
        </Text>
      </Box>
      {mySnippets
        .filter((snippet) => snippet.isModerator)
        .map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            label={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor="brand.100"
            imageURL={snippet.imageUrl}
          />
        ))}

      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
      </Box>

      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: "gray.100" }}
        onClick={() => setOpen(true)}
      >
        <Flex align="center">
          <Icon as={GrAdd} fontSize={20} mr={2} />
          Create Community
        </Flex>
      </MenuItem>
      {mySnippets.map((snippet) => (
        <MenuListItem
          key={snippet.communityId}
          label={`r/${snippet.communityId}`}
          link={`/r/${snippet.communityId}`}
          icon={FaReddit}
          iconColor="brand.100"
          imageURL={snippet.imageUrl}
        />
      ))}
    </>
  );
}
