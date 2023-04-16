import { GetServerSidePropsContext } from "next";
import { doc, getDoc } from "@firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { Community, communityState } from "@/atoms/communitiesState";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "@/components/Community/CommunityNotFound";
import CommunityHeader from "@/components/Community/CommunityHeader";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Posts from "@/components/Posts/Posts";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import CommunityAbout from "@/components/Community/CommunityAbout";

type CommunityPageProps = {
  communityData: Community;
};

export default function CommunityPage({ communityData }: CommunityPageProps) {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue({
      ...communityStateValue,
      currentCommunity: communityData,
    });
  }, [communityData]);

  if (!communityData) {
    return <CommunityNotFound />;
  }
  return (
    <>
      <CommunityHeader communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <CommunityAbout communityData={communityData} />
      </PageContent>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              })
            )
          : "",
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
