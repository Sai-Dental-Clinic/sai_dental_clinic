export function plainTextToMarkdown(text: string): string {
  const lines = text.split("\n")
  const result: string[] = []

  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (trimmed === "") {
      result.push("")
      i++
      continue
    }

    if (/^#{1,6}\s/.test(trimmed)) { result.push(lines[i]); i++; continue }
    if (/^[-*]\s/.test(trimmed)) { result.push(lines[i]); i++; continue }
    if (/^\d+[.)]\s/.test(trimmed)) { result.push(lines[i]); i++; continue }
    if (/^>/.test(trimmed)) { result.push(lines[i]); i++; continue }
    if (/^```/.test(trimmed)) { result.push(lines[i]); i++; continue }
    if (/^\[/.test(trimmed)) { result.push(lines[i]); i++; continue }

    const nextIdx = i + 1
    const hasNext = nextIdx < lines.length
    const nextTrimmed = hasNext ? lines[nextIdx].trim() : ""
    const isFollowedByBlank = !hasNext || nextTrimmed === ""

    const wordCount = trimmed.split(/\s+/).length
    const noEndPunct = !/[.!?:;，。？！：；]$/.test(trimmed)
    const likelyHeading = wordCount < 12 && trimmed.length < 80 && noEndPunct && isFollowedByBlank

    if (likelyHeading) {
      result.push(`## ${trimmed}`)
      i++
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length) {
      const l = lines[i].trim()
      if (l === "") break

      if (/^#{1,6}\s/.test(l)) break
      if (/^[-*]\s/.test(l)) break
      if (/^\d+[.)]\s/.test(l)) break
      if (/^>/.test(l)) break
      if (/^```/.test(l)) break

      paraLines.push(l)
      i++
    }

    if (paraLines.length > 0) {
      result.push(paraLines.join(" "))
    }
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n").trim()
}
