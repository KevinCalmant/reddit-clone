import { IconType } from "react-icons";
import { MenuItem } from "@chakra-ui/menu";
import { Flex, Icon, Image } from "@chakra-ui/react";
import useDirectory from "@/hooks/useDirectory";

type MenuListItemProps = {
  label: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

export default function MenuListItem({
  label,
  link,
  icon,
  iconColor,
  imageURL,
}: MenuListItemProps) {
  const { onSelectMenuItem } = useDirectory();

  const handleMenuItemClick = async () => {
    onSelectMenuItem({
      label,
      link,
      icon,
      iconColor,
      imageURL,
    });
  };

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={handleMenuItemClick}
    >
      <Flex align="center">
        {imageURL ? (
          <Image src={imageURL} borderRadius="full" boxSize="24px" mr={2} />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {label}
      </Flex>
    </MenuItem>
  );
}
