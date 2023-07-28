export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  const eventsResponse = await fetch("http://localhost:3000/api/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const allEvents = await eventsResponse.json()

  return {
    props: { allEvents },
  }
}

export default function Dashboard({ allEvents }) {
  return (
    <>
      <section>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
              IsaCon
            </h1>
            <h2>Events</h2>
            {allEvents.data.map((event) => (
              <div key={event.id}>{event.name}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
