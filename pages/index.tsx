export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  const response = await fetch("http://localhost:3000/api/players", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const allPlayers = await response.json()

  return {
    props: { allPlayers },
  }
}

export default function Web({ allPlayers }) {
  return (
    <>
      <section>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
              IsaCon
            </h1>
            {allPlayers.data.map((player) => (
              <div key={player.id}>{player.name}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
