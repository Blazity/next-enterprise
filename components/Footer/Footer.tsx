import Image from "next/image"

export default function Footer() {
  return (
    <footer className="flex flex-col bg-primary-800 p-4 text-primary-100">
      <div className="grid mx-auto text-center gap-1">
        <Image width={250} height={250} className="block mx-auto h-8 w-auto" src="/Isacon logo RGB_1.png" alt="Isacon" />
        <div>+32496799751</div>
        <div>Kammenstraat 57, 2000 Antwerpen</div>
      </div>
    </footer>
  )
}
