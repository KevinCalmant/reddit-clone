import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { Community } from "@/atoms/communitiesState";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "@/hooks/useCommunityData";

type CommunityHeaderProps = {
  communityData: Community;
};

export default function CommunityHeader({
  communityData,
}: CommunityHeaderProps) {
  const { communityStateValue, loading, onJoinOrLeaveCommunity } =
    useCommunityData();
  const isJoined = communityStateValue.mySnippets.some(
    (snippet) => snippet.communityId === communityData.id
  );

  const handleJoin = async () => {
    await onJoinOrLeaveCommunity(communityData, isJoined);
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageUrl ? (
            <Image
              src={communityStateValue.currentCommunity.imageUrl}
              borderRadius="full"
              boxSize="66px"
              alt="Community Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={handleJoin}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
