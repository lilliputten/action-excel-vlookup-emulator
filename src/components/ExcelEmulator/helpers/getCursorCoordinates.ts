export function getCursorCoordinates(input?: HTMLInputElement) {
  if (!input) {
    return null;
  }

  const parent = input.parentNode;
  if (!parent) {
    return null;
  }

  const cursorIndex = input.selectionStart; // ?? input.value.length;
  if (!cursorIndex) {
    return null;
  }

  const div = document.createElement('div');
  // Copy computed styles from the input to the div
  const computedStyles = getComputedStyle(input);
  for (const prop of computedStyles) {
    // @ts-expect-error: Ok
    div.style[prop] = computedStyles[prop];
  }
  div.style.visibility = 'hidden'; // Hide it from view
  div.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and allow wrapping
  div.style.position = 'absolute';
  div.style.left = '0';
  div.style.top = '0';
  parent.appendChild(div);

  const textBeforeCursor = input.value.substring(0, cursorIndex);
  const textAfterCursor = input.value.substring(cursorIndex);

  const preTextNode = document.createTextNode(textBeforeCursor);
  const caretMarker = document.createElement('span');
  caretMarker.innerHTML = '&nbsp;'; // Use a non-breaking space for visibility
  const postTextNode = document.createTextNode(textAfterCursor);

  div.innerHTML = ''; // Clear previous content
  div.append(preTextNode, caretMarker, postTextNode);

  const caretRect = caretMarker.getBoundingClientRect();
  const x = caretRect.left;
  const y = caretRect.top;

  parent.removeChild(div);

  return { x, y };
}
