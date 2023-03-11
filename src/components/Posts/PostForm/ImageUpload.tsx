import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import { ChangeEvent, useRef } from "react";
import { TabItemTitle } from "@/components/Posts/PostTabItem";

type ImageUploadType = {
  selectedFile: string | undefined;
  onSelectImage: (event: ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (tabItemTitle: TabItemTitle) => void;
  setSelectedFile: (value: string) => void;
};

export default function ImageUpload({
  selectedFile,
  onSelectImage,
  setSelectedTab,
  setSelectedFile,
}: ImageUploadType) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button variant="outline" height="28px" onClick={handleUploadClick}>
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
}
