// @ts-check

/**
 * Safe DOM element builder. All children are inserted as Text nodes when given as strings,
 * so user-supplied content cannot be interpreted as HTML — eliminates XSS via innerHTML.
 *
 * Props handling:
 *   - 'class' → className
 *   - 'on*'   → addEventListener (e.g. 'onclick')
 *   - 'style' → object of CSS properties assigned to element.style
 *   - 'dataset' → object of data-* attributes
 *   - everything else → setAttribute
 *
 * @param {string} tag
 * @param {Record<string, any>} [props]
 * @param {(string | Node | null | undefined) | Array<string | Node | null | undefined>} [children]
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') {
      node.className = String(value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(node.style, value);
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [dk, dv] of Object.entries(value)) {
        node.dataset[dk] = String(dv);
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, String(value));
    }
  }

  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }

  return node;
}

/**
 * Replace all children of a container with the given nodes.
 * @param {HTMLElement} container
 * @param {Array<Node>} nodes
 */
export function replaceChildren(container, nodes) {
  container.replaceChildren(...nodes);
}

/**
 * Set a container's textual content safely (no HTML interpretation).
 * @param {HTMLElement} container
 * @param {string} text
 */
export function setText(container, text) {
  container.textContent = text;
}
