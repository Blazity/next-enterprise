import { ChartAreaInteractive } from "@components/chart-area-interactive"
import { DataTable } from "@components/data-table"
import { SectionCards } from "@components/section-cards"
import { SiteHeader } from "@components/site-header"
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
