"use client"
import { Box, Editable, Flex, FormLabel, Input, Spacer } from "@chakra-ui/react"
import { Container, Sprite, Stage, Text } from "@pixi/react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import React, { useContext, useEffect, useMemo, useReducer, useState } from "react"
import Layout from "../../components/layout"
// import PixiApp from "../../components/PixiApp"

const PixiApp = dynamic(() => import("../../components/PixiApp"), { ssr: false })

export default function Page(props: any) {
  const [isloaded, setIsLoaded] = React.useState(false)

  const [name, setName] = React.useState("app")
  const [scale, setScale] = React.useState(0.5)
  const [directions, setDirections] = React.useState(["up", "down", "up", "down", "up", "down", "up", "down"])

  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    // Function to update the screen size
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Update screen size upon mount to capture the initial values
    updateScreenSize()

    // Add event listener for resize events
    window.addEventListener("resize", updateScreenSize)
    console.log("screenSize", screenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  function handleClick() {}

  const router = useRouter()
  const handleupdate = () => {
    setIsLoaded(!isloaded)
  }

  // console.log("Asdasdasd");
  function cal_screen_size() {}

  function convertStringToArray(rangeString: string) {
    var range: string[] = rangeString.split("-")

    return range
  }

  const dire = ["up", "right", "down", "right", "left"]

  const direstr = dire.join("-")
  return (
    <>
      <Box h={30} backgroundColor={"pink"}></Box>
      <Flex direction={"row-reverse"} alignItems="center">
        <Box flexBasis={0} flexGrow={1} alignContent={"right"}>
          <PixiApp
            n={name}
            scale={scale}
            width={screenSize.width / 2}
            height={screenSize.height - 30}
            directions={directions}
          />
        </Box>

        <Box flexBasis={0} flexGrow={1} scrollBehavior={"smooth"}>
          <div style={{ height: screenSize.height - 30, width: screenSize.width / 2, overflowY: "scroll" }}>
            <Input
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name}
              placeholder="name"
            />
            <button
              onClick={() => {
                setDirections(convertStringToArray(name))
              }}
            >
              change
            </button>
          </div>
        </Box>
      </Flex>
    </>
  )
}

/**This place should be used to get any information from the server side
 * example : we need to get the session token
 * or any thing related to the page  */

Page.getLayout = function getLayout(page: any) {
  return page
}
