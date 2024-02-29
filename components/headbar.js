import { Box, Button, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react"
import { Icon } from "@radix-ui/react-select"
import React from "react"
import Logo from "./logo"

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        <Icon />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <NavBarContainer {...props} h={["10%", "100%", "10%", "100%"]}>
      <DrawerExample />
      <LogoItem />
      <Button
        size="sm"
        rounded="md"
        color={["primary.500", "primary.500", "white", "white"]}
        bg={["white", "white", "primary.500", "primary.500"]}
        _hover={{
          bg: ["primary.100", "primary.100", "primary.600", "primary.600"],
        }}
      >
        Create Account
      </Button>
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  )
}

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
)

const MenuIcon = () => (
  <svg width="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="white">
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
)

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  )
}

const LogoItem = () => {
  return (
    <Link href={"/home"}>
      <Logo w="100px" color={["white", "white", "primary.500", "primary.500"]}></Logo>
    </Link>
  )
}

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest} align={"center"} paddingTop={["15px", "15px", "10px", "10px"]}>
        {children}
      </Text>
    </Link>
  )
}

const MenuLinks = ({ isOpen }) => {
  return (
    <Box display={{ base: isOpen ? "block" : "none", md: "block" }} flexBasis={{ base: "100%", md: "auto" }}>
      <Stack
        spacing={[6, 8, 10]}
        align="center"
        justify={["flex-end", "flex-end", "center", "center"]}
        direction={["column", "column", "row", "row"]}
        pt={[0, 0, 0, 0]}
      >
        <MenuItem to="/home">Home</MenuItem>
        <MenuItem to="/how">How It works </MenuItem>
        <MenuItem to="/pricing">Pricing </MenuItem>
      </Stack>
    </Box>
  )
}

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={[4, 6, 6, 6]}
      top={0}
      position="sticky"
      zIndex={10}
      bgGradient="linear(to-b, green.200, green.100)"
      color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  )
}

export default NavBar
