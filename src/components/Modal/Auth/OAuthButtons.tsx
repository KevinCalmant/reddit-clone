import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import FIREBASE_ERRORS from "@/firebase/errors";

export default function OAuthButtons() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const handleContinueWithGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        onClick={handleContinueWithGoogle}
        isLoading={loading}
      >
        <Image mr={4} src="/images/googlelogo.png" height="20px" />
        Continue with Google
      </Button>
      {error && (
        <Text>
          {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
    </Flex>
  );
}
