import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex justify-center bg-primary-800 p-4 text-primary-100">
      <Image width={250} height={250} className="block h-8 w-auto" src="/Isacon logo RGB_1.png" alt="Isacon" />
    </footer>
  )
}
