import _fetch from "isomorphic-unfetch"

export function fetch(url: string, options: RequestInit = {}): Promise<Response> {
  return _fetch(url, { ...options })
}
