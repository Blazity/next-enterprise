import Image from "next/image"

export default function Footer() {
  return (
    <footer className="flex flex-col bg-primary-800 p-2 text-primary-100">
      <div className="mx-auto grid gap-1 text-center">
        <Image
          width={250}
          height={250}
          className="mx-auto block h-16 mb-2 w-auto"
          src="/Isacon logo RGB_1.png"
          alt="Isacon"
        />
        <div>
          <a className="hover:text-white" href="tel:+32496799751">
            +32496799751
          </a>
        </div>
        <div>Kammenstraat 57, 2000 Antwerpen</div>
      </div>
    </footer>
  )
}
