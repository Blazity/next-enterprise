export const stripHTMLTags = (htmlString: string): string => {
  // also replaces <br> tags with new lines
  return htmlString.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "")
}

/**
 * @param data
 * @param htmlString
 *  @return The updated HTML string
 */
export const replaceMergeTags = (data: Record<string, any>, htmlString: string): string => {
  Object.keys(data)?.forEach((key: string) => {
    if (htmlString.includes(`{{ ${key} }}`)) {
      let val: any = data[key]

      // check if value is an array
      if (val instanceof Array) {
        const listElements: string[] = val.map((item: any) => {
          return `<li>${item}</li>`
        })

        // create an unordered list in HTML
        val = `<ul>${listElements.join("")}</ul>`
      }

      const regexPattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g")
      htmlString = htmlString.replace(regexPattern, val)
    }
  })

  return htmlString
}
