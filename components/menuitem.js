import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react"

import { Heading, Image, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"

export default function MenuItem(props) {
  //define states here
  const [isloaded, setIsLoaded] = React.useState(false)

  //router
  const router = useRouter()

  useEffect(() => {
    if (!isloaded) {
      console.log("isloaded called")

      setIsLoaded(true)
    }
  })

  //function when clicked

  const handleOnClick = (e) => {
    router.push(`/learningpath/${props.id}`)
  }

  return (
    <Card onClick={handleOnClick}>
      <CardBody>
        <Image src={props.image_url} alt={props.image_desc} borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{props.title}</Heading>
          <Text>{props.summary}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
