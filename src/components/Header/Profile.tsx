import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Henrique Kramer</Text>
        <Text color="gray.300" fontSize="small">
          henriquemkramer@gmail.com
        </Text>
      </Box>
      <Avatar size="md" name="Henrique Kramer" 
        src="https://github.com/henriquekramer.png"/>
    </Flex>
  );
}