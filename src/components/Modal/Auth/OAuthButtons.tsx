import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import FIREBASE_ERRORS from "@/firebase/errors";
import { User } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { useEffect } from "react";

export default function OAuthButtons() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, user);
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(JSON.parse(JSON.stringify(userCred.user)));
    }
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        onClick={() => signInWithGoogle()}
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
