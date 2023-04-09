import { User } from "@firebase/auth";
import { Post } from "@/atoms/postState";
import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import PostCommentInput from "@/components/Posts/PostComments/PostCommentInput";
import { collection, doc, Timestamp, writeBatch } from "@firebase/firestore";
import { firestore } from "@/firebase/clientApp";

type PostCommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

export default function PostComments({
  user,
  selectedPost,
  communityId,
}: PostCommentsProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleOnCreateComment = async () => {
    try {
      setCreateLoading(true);

      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email?.split("@")[0] || user.uid,
        communityId,
        postId: selectedPost.id,
        postTitle: selectedPost.title,
        text: comment,
        createdAt: Timestamp.now(),
      };
      batch.set(commentDocRef, newComment);

      const postDocRef = doc(firestore, "posts", selectedPost.id);
      batch.update(postDocRef, {
        numComments: selectedPost.numberOfComments + 1,
      });
      await batch.commit();

      setComment("");
      setComments((prev) => [newComment, ...prev]);

      setCreateLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    }
  };

  const handleOnDeleteComment = async (comment: Comment) => {};

  const fetchPostComments = async () => {};

  useEffect(() => {
    fetchPostComments();
  }, []);

  return (
    <Box bg="white" borderRadius="0 0 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <PostCommentInput
          comment={comment}
          user={user}
          loading={createLoading}
          setComment={setComment}
          onCreateComment={handleOnCreateComment}
        />
      </Flex>
      Here are comments
    </Box>
  );
}
