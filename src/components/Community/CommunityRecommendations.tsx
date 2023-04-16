import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "@firebase/firestore";
import { Community } from "@/atoms/communitiesState";
import { firestore } from "@/firebase/clientApp";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import useCommunityData from "@/hooks/useCommunityData";
import Link from "next/link";
import { FaReddit } from "react-icons/fa";

export default function CommunityRecommendations() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

  const getCommunityRecommendations = async () => {
    try {
      setLoading(true);
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      setCommunities(
        communityDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Community[]
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeaveCommunity = async (
    event: MouseEvent,
    community: Community,
    isJoined: boolean
  ) => {
    event.stopPropagation();
    onJoinOrLeaveCommunity(community, isJoined);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        height="70px"
        borderRadius="4px 4px 0 0"
        fontWeight={700}
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)), url(/images/recCommsArt.png)"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((community, index) => {
              const isJoined = communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === community.id
              );
              return (
                <Link key={community.id} href={`/r/${community.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="10pt"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    p="10px 12px"
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="80%">
                        {community.imageUrl ? (
                          <Image
                            src={community.imageUrl}
                            boxSize="28px"
                            mr={2}
                            borderRadius="full"
                          />
                        ) : (
                          <Icon
                            as={FaReddit}
                            fontSize={30}
                            color="brand.100"
                            mr={2}
                          />
                        )}
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {`r/${community.id}`}
                        </span>
                      </Flex>
                    </Flex>
                    <Box position="absolute" right="10px">
                      <Button
                        height="22px"
                        fontSize="8pt"
                        variant={isJoined ? "outline" : "solid"}
                        onClick={(e) =>
                          handleJoinLeaveCommunity(e, community, isJoined)
                        }
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p="10px 20px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
}
