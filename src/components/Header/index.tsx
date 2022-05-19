import { Flex } from "@chakra-ui/react";

import { Logo } from "./Logo";
import { NotificationsNav } from "./NotificationsNav";
import { Profile } from "./Profile";
import { SearchBox } from "./SearchBox";

export function Header(){
  return (
    <Flex 
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto" //margem em X
      mt="4" //margin-top
      px="6" //paddin em X
      align="center"
    >
      <Logo />
      <SearchBox />

      <Flex
        align="center"
        ml="auto" //irá jogar o conteúdo la pra direita
      >
        <NotificationsNav />
        <Profile />
      </Flex>
    </Flex>
  );
}