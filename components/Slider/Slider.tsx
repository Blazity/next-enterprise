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
  <FigmaLogoIcon width={50} height={50} className="text-slate-400" />,
  <FramerLogoIcon width={50} height={50} className="text-slate-400" />,
  <SketchLogoIcon width={50} height={50} className=" text-slate-400" />,
  <TwitterLogoIcon width={50} height={50} className="text-slate-400" />,
  <GitHubLogoIcon width={50} height={50} className="text-slate-400" />,
  <VercelLogoIcon width={50} height={50} className="text-slate-400" />,
  <NotionLogoIcon width={50} height={50} className="text-slate-400" />,
  <DiscordLogoIcon width={50} height={50} className="text-slate-400" />,
  <InstagramLogoIcon width={50} height={50} className="text-slate-400" />,
  <LinkedInLogoIcon width={50} height={50} className="text-slate-400" />,
]

export const InfiniteSlider = () => {
  return (
    // bg-gradient-to-r from-black to-transparent
    //   <div className="relative m-auto w-full overflow-hidden bg-transparent before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,homeBg_0%,homeBg_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,homeBg_0%,transparent)] after:content-['']">
    <div className="before:opacity relative m-auto w-full overflow-hidden bg-homeBg bg-blend-screen before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] relative before:bg-gradient-to-r from-homeBg to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-gradient-to-r from-homeBg to-transparent after:content-['']">
      <div className="flex w-[calc(250px*10)] animate-infinite-slider">
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center" key={index}>
            {logo}
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div className="slide flex w-[125px] items-center justify-center" key={index}>
            {logo}
          </div>
        ))}
      </div>
    </div>
  )
}
