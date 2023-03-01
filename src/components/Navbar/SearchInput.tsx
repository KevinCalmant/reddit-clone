import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "@firebase/auth";
import { memo } from "react";

type SearchInputProps = {
  user: User | null | undefined;
};

const SearchInput = memo(({ user }: SearchInputProps) => (
  <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.500" mb={1} />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search Reddit"
        height="34px"
        fontSize="10pt"
        backgroundColor="gray.50"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
    </InputGroup>
  </Flex>
));

export default SearchInput;
