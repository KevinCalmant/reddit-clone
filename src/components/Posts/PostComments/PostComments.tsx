import { User } from "@firebase/auth";
import { Post, postState } from "@/atoms/postState";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import PostCommentInput from "@/components/Posts/PostComments/PostCommentInput";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
} from "@firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { Comment } from "@/types/CommentType";
import PostCommentItem from "@/components/Posts/PostComments/PostCommentItem";

type PostCommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

export default function PostComments({
  user,
  selectedPost,
  communityId,
}: PostCommentsProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const setPostState = useSetRecoilState(postState);

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
        numberOfComments: selectedPost.numberOfComments + 1,
      });
      await batch.commit();

      setComment("");
      setComments((prev) => [newComment, ...prev]);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost!.numberOfComments + 1,
        } as Post,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOnDeleteComment = async (comment: Comment) => {
    try {
      await deleteDoc(doc(firestore, "comments", comment.id));
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    }
  };

  const fetchPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      setComments(
        commentDocs.docs.map(
          (commentDoc) =>
            ({
              id: commentDoc.id,
              ...commentDoc.data(),
            } as Comment)
        )
      );
      setFetchLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error.message);
    }
  };

  useEffect(() => {
    if (!selectedPost) return;
    fetchPostComments();
  }, [selectedPost]);

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
        {!fetchLoading && (
          <PostCommentInput
            comment={comment}
            user={user}
            loading={createLoading}
            setComment={setComment}
            onCreateComment={handleOnCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((skeleton) => (
              <Box key={skeleton} padding={6} bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((c) => (
                  <PostCommentItem
                    key={c.id}
                    comment={c}
                    onDeleteComment={handleOnDeleteComment}
                    loading={false}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
