"use client"
import { Container, Sprite, Stage, Text, useTick } from "@pixi/react"
import { Application } from "pixi.js"
import React, { useEffect, useState } from "react"

const RotatingBunny = (props: any) => {
  const [rotation, setRotation] = useState(0)

  useTick((delta) => delta && setRotation(rotation + 0.0 * delta))

  useEffect(() => {
    // Clean up event listener
    return () => {}
  }, [])

  return (
    <Sprite
      image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      x={props.x}
      y={props.y}
      anchor={0.5}
      scale={props.scale}
      rotation={rotation}
    />
  )
}

const PixiApp = (props: any) => {
  // Initialize position state
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const move = (direction: string | undefined) => {
    switch (direction) {
      case "left":
        // Move left
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x - 50,
        }))
        break
      case "right":
        // Move right
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + 50,
        }))
        break
      case "up":
        // Move left
        setPosition((prevPosition) => ({
          ...prevPosition,
          y: prevPosition.y - 50,
        }))
        break
      case "down":
        // Move right
        setPosition((prevPosition) => ({
          ...prevPosition,
          y: prevPosition.y + 50,
        }))
        break
      default:
        break
    }
  }

  const [apptext, setext] = useState("hello")

  useEffect(() => {
    // Start moving the circle according to the directions array

    console.log("rerun")

    let index = 0
    function processDirections() {
      // To keep track of the current direction

      if (index < props.directions.length) {
        move(props.directions[index])
        index++
        setTimeout(processDirections, 500) // Adjust delay as needed
      }
    }
    processDirections()

    // Clean up event listener
    return () => {}
  }, [props.directions])

  //reset
  const originalPosition = { x: props.width / 2, y: props.height - 30 }

  // State to hold the current position of the sprite
  const [spritePosition, setSpritePosition] = useState(originalPosition)

  // Function to reset the position of the sprite to the original position
  const resetSpritePosition = () => {
    setSpritePosition(originalPosition)
  }

  return (
    <>
      <Stage width={props.width} height={props.height} options={{ backgroundColor: "purple" }}>
        <Container position={[spritePosition.x, spritePosition.y]}>
          <RotatingBunny scale={1.5} x={position.x} y={position.y} />
        </Container>
      </Stage>
    </>
  )
}

export default PixiApp
