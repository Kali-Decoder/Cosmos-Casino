import {
  Box,
  Button,
  Icon,
  Link,
  Text,
  useColorModeValue,
  useTheme,
} from "@interchain-ui/react";
import { dependencies } from "@/config";

const stacks = ["Cosmos Kit", "Next.js"];

const stargazejs = dependencies[0];

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      

      
    </>
  );
}
