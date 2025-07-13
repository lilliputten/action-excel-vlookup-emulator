export function getCellNodeForEventTarget(target?: EventTarget | HTMLElement | null) {
  if (!target) {
    throw new Error('No target node specified');
  }
  let node: HTMLDivElement | null = target as HTMLDivElement;
  if (!node.dataset.cellName) {
    node = node.closest('div[data-cell-name]');
  }
  if (!node) {
    throw new Error('Can not find parent cell');
  }
  if (!node.dataset.cellName) {
    throw new Error('Can not find valid cell');
  }
  return node;
}
