import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState, AuthModalView } from "@/atoms/authModalState";

export default function AuthButtons() {
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleClick = (view: string) => {
    setAuthModalState({
      open: true,
      view: view as AuthModalView,
    });
  };

  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => handleClick("login")}
      >
        Log In
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => handleClick("signup")}
      >
        Sign Up
      </Button>
    </>
  );
}
