import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Post, postState, PostVote } from "@/atoms/postState";
import { deleteObject, ref } from "@firebase/storage";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { communityState } from "@/atoms/communitiesState";
import { authModalState } from "@/atoms/authModalState";
import { useRouter } from "next/router";

const usePosts = () => {
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const { currentCommunity } = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    try {
      if (!user?.uid) {
        setAuthModalState({ open: true, view: "login" });
        return;
      }

      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (postVote) => postVote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatePostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        };
        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatePostVotes = [...updatePostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote;
          updatePostVotes = updatePostVotes.filter(
            (postVote) => postVote.id !== existingVote.id
          );
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIndex = postStateValue.postVotes.findIndex(
            (postVote) => postVote.id === existingVote.id
          );
          if (voteIndex !== -1) {
            updatePostVotes[voteIndex] = {
              ...existingVote,
              voteValue: vote,
            };
          }
          batch.update(postVoteRef, { voteValue: vote });
          voteChange = 2 * vote;
        }
      }

      const postIndex = postStateValue.posts.findIndex((p) => p.id === post.id);
      updatedPosts[postIndex] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatePostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectPost = async (post: Post) => {
    setPostStateValue({
      ...postStateValue,
      selectedPost: post,
    });
    await router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== post.id),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVotesDocs = await getDocs(postVotesQuery);
    const postVotes = postVotesDocs.docs.map((postVoteDoc) => ({
      id: postVoteDoc.id,
      ...postVoteDoc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!currentCommunity?.id || !user?.uid) return;
    getCommunityPostVotes(currentCommunity.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
