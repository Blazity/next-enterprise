import { BuildingStorefrontIcon, CloudArrowUpIcon, LightBulbIcon, PaintBrushIcon } from "@heroicons/react/24/solid"

const features = [
  {
    name: "Web & E-commerce",
    description:
      "Elevating businesses online with tailored solutions ranging from basic websites to fully customized E-commerce stores and expert Shopify development.",
    icon: BuildingStorefrontIcon,
  },
  {
    name: "Branding & design",
    description: "With a focus on thoughtful design, our services bring vitality to our clients' brands. We specialize in creating distinctive identities that leave a lasting impression, reflecting the essence of each story.",
    icon: PaintBrushIcon,
  },
  {
    name: "Cloud based setup",
    description: "Empower your software with our cloud-based services, bringing it to new heights within the boundless expanse of the cloud. We seamlessly integrate cutting-edge technologies, ensuring scalability, security, and unrivaled performance for your digital solutions.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Your vision quantified",
    description:
      "Experience a warm welcome at our office, savor a cup of coffee, and share your views on your online presence. Together, we'll uncover the perfect solution for you or your enterprise",
    icon: LightBulbIcon,
  },
]

export default async function Projects() {
  return (
    <section>
      <div className="mx-auto grid max-w-screen-xl p-4 text-center">
        <div className="mx-auto place-self-center">
          <div className="pb-4 pt-9">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <p className="mt-2 text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">
                  Everything to build your online presence
                </p>
              </div>
              <div className="mx-auto mt-8 max-w-2xl sm:mt-20 lg:mt-14 lg:max-w-5xl">
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
