type ImageOwnProps<T extends React.ElementType> = {
  className: string
  image: string
  alt: string
  objectCover?: string
  as?: T
}

type ImageProps<T extends React.ElementType> = ImageOwnProps<T> & Omit<React.ComponentProps<T>, keyof ImageOwnProps<T>>

export const Image = <T extends React.ElementType = "div">({
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
      <img src={image} alt={alt} className={`h-full w-full ${objectCover}`} />
    </Component>
  )
}
