import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { Flex, Icon, Image, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Communities from "@/components/Navbar/Directory/Communities";
import useDirectory from "@/hooks/useDirectory";

export default function DirectoryMenu() {
  const { directoryMenuStateValue, toggleMenu } = useDirectory();

  return (
    <Menu isOpen={directoryMenuStateValue.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenu}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "150px" }}
        >
          <Flex align="center">
            {directoryMenuStateValue.selectedMenuItem.imageURL ? (
              <Image
                src={directoryMenuStateValue.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <Icon
                as={directoryMenuStateValue.selectedMenuItem.icon}
                color={directoryMenuStateValue.selectedMenuItem.iconColor}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
              />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryMenuStateValue.selectedMenuItem.label}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
}
