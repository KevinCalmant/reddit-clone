import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import usePosts from "@/hooks/usePosts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { Post } from "@/atoms/postState";
import CommunityAbout from "@/components/Community/CommunityAbout";
import useCommunityData from "@/hooks/useCommunityData";
import PostComments from "@/components/Posts/PostComments/PostComments";

export default function PostPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDoc = await getDoc(doc(firestore, "posts", postId));
      const post = postDoc.data() as Post;
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: post,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    const { postId } = router.query;
    if (postId && !postStateValue.selectedPost) {
      fetchPost(postId as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            userIsCreator={postStateValue.selectedPost?.creatorId === user?.uid}
            userVoteValue={
              postStateValue.postVotes.find(
                (postVote) =>
                  postVote.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            onVote={onVote}
            onDeletePost={onDeletePost}
          />
        )}
        {user &&
          postStateValue.selectedPost &&
          communityStateValue.currentCommunity?.id && (
            <PostComments
              user={user}
              selectedPost={postStateValue.selectedPost}
              communityId={communityStateValue.currentCommunity?.id}
            />
          )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <CommunityAbout
            communityData={communityStateValue.currentCommunity}
          />
        )}
      </>
    </PageContent>
  );
}
