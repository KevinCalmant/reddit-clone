import { Community, communityState } from "@/atoms/communitiesState";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { LegacyRef, useRef, useState } from "react";
import useSelectFile from "@/hooks/useSelectFile";
import { FaReddit } from "react-icons/fa";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { doc, updateDoc } from "@firebase/firestore";
import { useSetRecoilState } from "recoil";

type CommunityAboutProps = {
  communityData: Community;
};

export default function CommunityAbout({ communityData }: CommunityAboutProps) {
  const [user] = useAuthState(auth);
  const { selectedFile, onSelectedImage } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const selectedFileRef: LegacyRef<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const handleUpdateImage = async () => {
    try {
      if (!selectedFile) return;
      setUploadingImage(true);
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const imageUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageUrl,
      });
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageUrl,
        } as Community,
      }));
      setUploadingImage(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImageClick = () => {
    selectedFileRef.current!.click();
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0 0"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mr={3} height="30px" width="100%">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={handleChangeImageClick}
                  >
                    Change Image
                  </Text>
                  {communityData.imageUrl || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageUrl}
                      boxSize="40px"
                      alt="Community Image"
                      borderRadius="full"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Flex cursor="pointer" onClick={handleUpdateImage}>
                      Save Changes
                    </Flex>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectedImage}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
