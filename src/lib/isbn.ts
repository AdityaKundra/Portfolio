export const normalizeIsbn = (value: string) => {
  const clean = value.replace(/[\s-]/g, '').toUpperCase()
  return /^(\d{9}[\dX]|\d{13})$/.test(clean) ? clean : null
}
