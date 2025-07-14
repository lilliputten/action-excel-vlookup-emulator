export function getCellNodeForEventTarget(target?: EventTarget | HTMLElement | null) {
  if (!target) {
    throw new Error('No target node specified');
  }
  let node: HTMLDivElement | null = target as HTMLDivElement;
  if (!node.dataset.cellName) {
    node = node.closest('div[data-cell-name]');
  }
  if (!node) {
    const error = new Error('Can not find parent cell');
    // eslint-disable-next-line no-console
    console.warn('[getCellNodeForEventTarget]', error);
    return null;
  }
  if (!node.dataset.cellName) {
    const error = new Error('Can not find valid cell');
    // eslint-disable-next-line no-console
    console.warn('[getCellNodeForEventTarget]', error);
    return null;
  }
  return node;
}
