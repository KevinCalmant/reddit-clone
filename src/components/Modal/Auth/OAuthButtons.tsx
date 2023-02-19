import { Button, Flex, Image } from "@chakra-ui/react";

export default function OAuthButtons() {
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2}>
        <Image mr={4} src="/images/googlelogo.png" height="20px" />
        Continue with Google
      </Button>
    </Flex>
  );
}
