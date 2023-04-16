import { fetch } from "./fetch"

describe("myFetch()", () => {
  it("should return data from the server", async () => {
    const response = await fetch("https://example.com")
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
    const data = await response.text()
    expect(data).toMatch("Example Domain")
  })
})
