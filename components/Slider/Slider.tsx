import {
  FigmaLogoIcon,
  FramerLogoIcon,
  SketchLogoIcon,
  TwitterLogoIcon,
  GitHubLogoIcon,
  VercelLogoIcon,
  NotionLogoIcon,
  DiscordLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons"

const LOGOS = [
  "/images/Amazon_Web_Services-Logo.wine.svg",
  "/images/Cisco_Systems-Logo.wine.svg",
  "/images/Oracle_Database-Logo.wine.svg",
  "/images/ids.svg",
  "/images/yanolja-icon.svg",
]

export const InfiniteSlider = () => {
  return (
    // bg-gradient-to-r from-black to-transparent
    //   <div className="relative m-auto w-full overflow-hidden bg-transparent before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,homeBg_0%,homeBg_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,homeBg_0%,transparent)] after:content-['']">
    <div className="before:opacity relative m-auto w-full overflow-hidden bg-homeBg bg-blend-screen before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,#0f172a,transparent)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,#0f172a,transparent)] after:content-['']">
      <div className="flex w-[calc(250px*10)] animate-infinite-slider">
        {LOGOS.map((logo, index) => (
          <div className="slide px-4 flex w-[125px] items-center justify-center" key={index}>
            <img src={logo} />
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div className="slide flex px-4 w-[125px] items-center justify-center" key={index}>
            <img src={logo} />
          </div>
        ))}
      </div>
    </div>
  )
}
