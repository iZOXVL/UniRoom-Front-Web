// src/ChakraProvider.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

const ChakraProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

export default ChakraProviderWrapper;
