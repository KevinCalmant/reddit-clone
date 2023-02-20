import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalState";
import { useTranslation } from "react-i18next";

export default function AuthButtons() {
  const { t } = useTranslation();

  const setAuthModalState = useSetRecoilState(authModalState);

  const handleLogin = () => {
    setAuthModalState({
      open: true,
      view: "login",
    });
  };

  const handleSignup = () => {
    setAuthModalState({
      open: true,
      view: "signup",
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
        onClick={() => handleLogin()}
      >
        {t("auth.buttons.login")}
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => handleSignup()}
      >
        {t("auth.buttons.signup")}
      </Button>
    </>
  );
}
