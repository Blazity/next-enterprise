type ImageOwnProps<T extends React.ElementType> = {
  className: string
  image: string
  alt: string
  objectCover?: string
  as?: T
}

type ImageProps<T extends React.ElementType> = ImageOwnProps<T> & Omit<React.ComponentProps<T>, keyof ImageOwnProps<T>>
import Image from "next/image"

export const ImageCard = <T extends React.ElementType = "div">({
  className,
  image,
  alt,
  objectCover,
  as,
  ...rest
}: ImageProps<T>) => {
  const Component = as || "div"
  return (
    <Component className={className} {...rest}>
      <Image src={image} width={400} height={400} alt={alt} className={`h-full w-full ${objectCover}`} />
    </Component>
  )
}
