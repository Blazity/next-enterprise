const LOGOS = [
  "/images/Amazon_Web_Services-Logo.wine.svg",
  "/images/Cisco_Systems-Logo.wine.svg",
  "/images/Oracle_Database-Logo.wine.svg",
  "/images/ids.svg",
  "/images/yanolja-icon.svg",
]

export const InfiniteSlider = () => {
  return (
    <div className="before:opacity relative m-auto w-full overflow-hidden bg-homeBg bg-blend-screen before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,#0f172a,transparent)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,#0f172a,transparent)] after:content-['']">
      <div className="flex w-[calc(250px*10)] animate-infinite-slider">
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center px-4" key={index}>
            <img src={logo} />
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center px-4" key={index}>
            <img src={logo} />
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center px-4" key={index}>
            <img src={logo} />
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center px-4" key={index}>
            <img src={logo} />
          </div>
        ))}
      </div>
    </div>
  )
}
