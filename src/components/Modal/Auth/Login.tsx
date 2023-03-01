import { FormEvent, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalState";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import FIREBASE_ERRORS from "@/firebase/errors";

export default function Login() {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) {
      await signInWithEmailAndPassword(email, password);
    }
  };

  const handleSignUp = () => {
    setAuthModalState((prev) => ({
      ...prev,
      view: "signup",
    }));
  };

  const handleReset = () => {
    setAuthModalState((prev) => ({
      ...prev,
      view: "resetPassword",
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          boderColor: "blue.500",
        }}
        _focus={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          boderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={handleReset}
        >
          Reset
        </Text>
      </Flex>
      <Text textAlign="center" color="red" fontSize="10pt">
        {error &&
          FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={handleSignUp}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
}
