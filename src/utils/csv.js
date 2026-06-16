/**
 * Convert an array of objects to a CSV string and trigger a download.
 * @param {object[]} rows
 * @param {string[]} headers  - column keys to include
 * @param {Record<string, string>} labels - maps key → display header label
 * @param {string} filename
 */
export function downloadCsv(rows, headers, labels = {}, filename = 'export.csv') {
  const headerRow = headers.map((h) => labels[h] ?? h).join(',')

  const dataRows = rows.map((row) =>
    headers
      .map((h) => {
        const val = row[h] ?? ''
        const str = String(val)
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      })
      .join(','),
  )

  const csv = [headerRow, ...dataRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
