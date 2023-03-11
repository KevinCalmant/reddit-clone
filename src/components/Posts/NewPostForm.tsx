import { Alert, AlertIcon, Flex, Text } from "@chakra-ui/react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import PostTabItem, {
  TabItem,
  TabItemTitle,
} from "@/components/Posts/PostTabItem";
import { ChangeEvent, useState } from "react";
import TextInputs from "@/components/Posts/PostForm/TextInputs";
import ImageUpload from "@/components/Posts/PostForm/ImageUpload";
import { Post } from "@/atoms/postState";
import { User } from "@firebase/auth";
import { serverTimestamp } from "@firebase/database";
import { addDoc, collection, Timestamp, updateDoc } from "@firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useRouter } from "next/router";

const formTabs: TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

type NewPostFormProps = {
  user: User;
};

export default function NewPostForm({ user }: NewPostFormProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabItemTitle>(
    formTabs[0].title
  );
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatepost = async () => {
    try {
      setLoading(true);
      const { communityId } = router.query;
      const post: Partial<Post> = {
        communityId: communityId as string,
        creatorId: user.uid,
        creatorDisplayName: user.email?.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
      };
      const postDocRef = await addDoc(collection(firestore, "posts"), post);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const imageUrl = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageUrl,
        });
      }
      router.back();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSelectedImage = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };

  const onTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((tab) => (
          <PostTabItem
            key={tab.title}
            item={tab}
            setSelectedTab={() => setSelectedTab(tab.title)}
            selected={tab.title === selectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatepost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            onSelectImage={onSelectedImage}
            selectedFile={selectedFile}
            setSelectedTab={(tabItemTitle: TabItemTitle) =>
              setSelectedTab(tabItemTitle)
            }
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {errorMessage && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
}
