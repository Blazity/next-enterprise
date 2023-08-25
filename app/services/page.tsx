import { BuildingStorefrontIcon, CloudArrowUpIcon, LightBulbIcon, PaintBrushIcon } from "@heroicons/react/24/solid"

const features = [
  {
    name: "Web & E-commerce",
    description:
      "Elevating businesses online with tailored solutions from basic websites to full custom E-commerce stores and expert Shopify development.",
    icon: BuildingStorefrontIcon,
  },
  {
    name: "Branding & design",
    description: "Crafting captivating identities through design, our services breathe life into brands.",
    icon: PaintBrushIcon,
  },
  {
    name: "Cloud based setup",
    description: "Taking software to new heights by placing it all on the cloud's limitless expanse.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Your idea here",
    description:
      "Experience a warm welcome at our place, savor a cup of coffee, and share your vision – together, we'll uncover the perfect solution for you",
    icon: LightBulbIcon,
  },
]

export default async function Projects() {
  return (
    <section>
      <div className="mx-auto grid max-w-screen-xl p-4 text-center">
        <div className="mx-auto place-self-center">
          <div className="pb-4 pt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <p className="mt-2 text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">
                  Everything to build your online presence
                </p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative flex flex-col">
                      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <dt className="text-base font-semibold leading-7 text-primary-800">{feature.name}</dt>
                      <dd className="mt-2 text-base leading-7 text-primary-800">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
