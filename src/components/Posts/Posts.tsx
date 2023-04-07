import { Community } from "@/atoms/communitiesState";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Post } from "@/atoms/postState";
import PostItem from "@/components/Posts/PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "@/components/Posts/PostLoader";

type PostsProps = {
  communityData: Community;
};

export default function Posts({ communityData }: PostsProps) {
  const [loading, setLoading] = useState(true);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();
  const [user] = useAuthState(auth);

  const getPosts = async () => {
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
      setLoading(false);
    } catch (error) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
    return <PostLoader />;
  }
  return (
    <Stack>
      {postStateValue.posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          userIsCreator={user?.uid === post.creatorId}
          onVote={onVote}
          onDeletePost={onDeletePost}
          onSelectPost={onSelectPost}
        />
      ))}
    </Stack>
  );
}
