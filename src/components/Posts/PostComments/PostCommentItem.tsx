import { Comment } from "@/types/CommentType";
import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import moment from "moment";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";

type PostCommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loading: boolean;
  userId: string;
};

export default function PostCommentItem({
  comment,
  onDeleteComment,
  loading,
  userId,
}: PostCommentItemProps) {
  const handleOnDeleteCommentClick = () => {
    onDeleteComment(comment);
  };

  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontWeight={700}>{comment.creatorDisplayText}</Text>
          <Text color="gray.600">
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loading && <Spinner size="small" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue;500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue;500" }}
                onClick={handleOnDeleteCommentClick}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
}
