import PageContent from "@/components/Layout/PageContent";
import { Box, Text } from "@chakra-ui/react";
import NewPostForm from "@/components/Posts/NewPostForm";
import CommunityAbout from "@/components/Community/CommunityAbout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { communityState } from "@/atoms/communitiesState";
import { useRecoilValue } from "recoil";

export default function SubmitCommunityPostPage() {
  const [user] = useAuthState(auth);
  const { currentCommunity } = useRecoilValue(communityState);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>
        {currentCommunity && (
          <CommunityAbout communityData={currentCommunity} />
        )}
      </>
    </PageContent>
  );
}
