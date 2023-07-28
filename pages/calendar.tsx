export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  const gamesResponse = await fetch("http://localhost:3000/api/games", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const allGames = await gamesResponse.json()

  const teamsResponse = await fetch("http://localhost:3000/api/teams", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const allTeams = await teamsResponse.json()

  return {
    props: { allGames, allTeams },
  }
}

export default function Dashboard({ allGames, allTeams }) {
  const findTeam = (id) => {
    return allTeams?.data.find((team) => team._id === id)
  }
  return (
    <>
      <section>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
              IsaCon
            </h1>
            <h2>Games</h2>
            {allGames.data.map((game) => (
              <div key={game.id}>
                {findTeam(game.homeTeam).name} - {findTeam(game.awayTeam).name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
