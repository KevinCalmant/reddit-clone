import { ChangeEvent, useState } from "react";

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const onSelectedImage = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };
  return {
    selectedFile,
    setSelectedFile,
    onSelectedImage,
  };
};

export default useSelectFile;
