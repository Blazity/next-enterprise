import ImageFilter from "components/ImageFilter/ImageFilter"

export default function Portfolio() {
  return (
    <>
      <div className="mx-auto place-self-center text-center">
        <div className="mb-4 text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
          <h1 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent">
            Our Portfolio
          </h1>
        </div>
        <p className="pl-5 pr-5 text-2xl text-white">
          The showcase of our innovations. Dive in to explore our diverse range of projects and see how we’re driving
          digital transformation across industries.”
        </p>
      </div>
      <div>
        <ImageFilter />
      </div>
    </>
  )
}
