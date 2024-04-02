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
  } from "@radix-ui/react-icons";

  const LOGOS = [
    <FigmaLogoIcon width={50} height={50} className="text-white" />,
    <FramerLogoIcon width={50} height={50} className="text-white" />,
    <SketchLogoIcon width={50} height={50} className=" text-white" />,
    <TwitterLogoIcon width={50} height={50} className="text-white" />,
    <GitHubLogoIcon width={50} height={50} className="text-white" />,
    <VercelLogoIcon width={50} height={50} className="text-white" />,
    <NotionLogoIcon width={50} height={50} className="text-white" />,
    <DiscordLogoIcon width={50} height={50} className="text-white" />,
    <InstagramLogoIcon width={50} height={50} className="text-white" />,
    <LinkedInLogoIcon width={50} height={50} className="text-white" />,
  ];

  export const InfiniteSlider = () => {
    return (
      <div className="relative m-auto w-full overflow-hidden bg-transparent before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,homeBg_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,homeBg_0%,rgba(0,0,0,120)_100%)] after:content-['']">
        <div className="animate-infinite-slider flex w-[calc(250px*10)]">
          {LOGOS.map((logo, index) => (
            <div
              className="slide flex w-[125px] items-center justify-center"
              key={index}
            >
              {logo}
            </div>
          ))}
          {LOGOS.map((logo, index) => (
            <div
              className="slide flex w-[125px] items-center justify-center"
              key={index}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    );
  };
