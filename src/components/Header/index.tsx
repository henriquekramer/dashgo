import { Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";

import { Logo } from "./Logo";
import { NotificationsNav } from "./NotificationsNav";
import { Profile } from "./Profile";
import { SearchBox } from "./SearchBox";

export function Header(){
  const { onOpen } = useSidebarDrawer()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

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
      { !isWideVersion && (
        <IconButton
          aria-label="Open navigation" //para acessibilidade
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          display="flex"
          justifyContent="center"
          mr="2"
        >
        </IconButton>

      )}
      <Logo />

      { isWideVersion && <SearchBox /> }

      <Flex
        align="center"
        ml="auto" //irá jogar o conteúdo la pra direita
      >
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}