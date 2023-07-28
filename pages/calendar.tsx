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
            <h2 className="mb-2 font-bold">Games</h2>
            {allGames.data.map((game) => (
              <div key={game.id}>
                <div className="mb-2 flex max-w-sm flex-wrap overflow-hidden rounded bg-white shadow-lg">
                  <div className="grid w-1/2 content-center p-2">
                    {findTeam(game.homeTeam).logo?._meta.url ? (
                      <img src={findTeam(game.homeTeam).logo?._meta.url} alt="Sunset in the mountains" />
                    ) : (
                      findTeam(game.homeTeam).name
                    )}
                  </div>
                  <div className="grid w-1/2 content-center p-2">
                    {findTeam(game.awayTeam).logo?._meta.url ? (
                      <img src={findTeam(game.awayTeam).logo?._meta.url} alt="Sunset in the mountains" />
                    ) : (
                      findTeam(game.awayTeam).name
                    )}
                  </div>
                  <div className="flex w-full justify-around p-2">
                    <span>{game.homeScore}</span>
                    <span>-</span>
                    <span>{game.awayScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
