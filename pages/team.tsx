export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  const playersResponse = await fetch("http://localhost:3000/api/players", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const allPlayers = await playersResponse.json()

  return {
    props: { allPlayers },
  }
}

export default function Dashboard({ allPlayers }) {
  return (
    <>
      <section>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
              IsaCon
            </h1>
            <h2>Players</h2>
            <div className="flex flex-wrap items-center justify-center">
              {allPlayers.data.map((player) => (
                <div className="p-2" key={player.id}>
                  {player.avatar?._meta.url ? (
                    <img className="max-w-sm" src={player.avatar?._meta.url} alt="Sunset in the mountains" />
                  ) : (
                    player.name
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
