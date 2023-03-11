import { Flex, Icon, Text } from "@chakra-ui/react";

export type TabItemTitle = "Post" | "Images & Video" | "Link" | "Poll" | "Talk";

export type TabItem = {
  title: TabItemTitle;
  icon: typeof Icon.arguments;
};

type TabItemProps = {
  item: TabItem;
  setSelectedTab: () => void;
  selected: boolean;
};

export default function PostTabItem({
  item,
  setSelectedTab,
  selected,
}: TabItemProps) {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      color={selected ? "blue.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      onClick={setSelectedTab}
      _hover={{ bg: "gray.50" }}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
}
