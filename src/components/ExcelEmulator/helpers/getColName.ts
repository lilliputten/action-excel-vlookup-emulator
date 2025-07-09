export function getColName(colIndex: number) {
  return colIndex ? String.fromCharCode('A'.charCodeAt(0) + colIndex - 1) : '0';
}
