import { Button } from "@chakra-ui/react"

export default function MyButton(props) {
  return (
    <Button href="/about" color="green.500" _hover={{ color: "blue.500" }} align="center">
      About
    </Button>
  )
}
