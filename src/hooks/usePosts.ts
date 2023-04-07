import { useRecoilState } from "recoil";
import { Post, postState } from "@/atoms/postState";
import { deleteObject, ref } from "@firebase/storage";
import { firestore, storage } from "@/firebase/clientApp";
import { deleteDoc, doc } from "@firebase/firestore";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};

  const onSelectPost = async () => {};

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

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
