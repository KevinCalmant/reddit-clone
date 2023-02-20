import "@/styles/globals.css";
import type { AppProps } from "next/app";
import theme from "@/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@/components/Layout/Layout";
import { RecoilRoot } from "recoil";
import "./i18n";

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
