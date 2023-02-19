import React from "react";
import { Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalState";
import Login from "@/components/Modal/Auth/Login";
import SignUp from "@/components/Modal/Auth/SignUp";

export default function AuthInputs() {
  const modalState = useRecoilValue(authModalState);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <SignUp />}
    </Flex>
  );
}
