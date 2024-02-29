import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react"
import React, { useEffect } from "react"

function App() {
  const [isloaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    if (!isloaded) {
      console.log("isloaded called")

      setIsLoaded(true)
    }
  })

  return (
    <Center bg="gray.200" height="100vh">
      <Box textAlign="center">
        <Heading size="4xl" color={"blue.500"}>
          Coming Soon
        </Heading>
        <Text fontSize="2xl" mt="4">
          ⚠ We are working on it! ⚠
        </Text>
        <Flex justifyContent="center" mt="8"></Flex>
      </Box>
    </Center>
  )
}

export default App
