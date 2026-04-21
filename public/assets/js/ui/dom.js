import { applyLinkHref } from "./html.js";

function appendChild(parent, child) {
  if (child === null || child === undefined || child === false) {
    return;
  }

  if (Array.isArray(child)) {
    child.forEach((entry) => appendChild(parent, entry));
    return;
  }

  if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }

  parent.appendChild(child);
}

export function appendChildren(parent, ...children) {
  children.forEach((child) => appendChild(parent, child));
  return parent;
}

export function createElement(tagName, options = {}, ...children) {
  const node = document.createElement(tagName);
  const { attrs, className, dataset, id, text } = options;

  if (className) {
    node.className = className;
  }

  if (id) {
    node.id = id;
  }

  if (dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        node.dataset[key] = String(value);
      }
    });
  }

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) => {
      if (value === null || value === undefined || value === false) {
        return;
      }

      if (value === true) {
        node.setAttribute(name, "");
        return;
      }

      node.setAttribute(name, String(value));
    });
  }

  if (text !== null && text !== undefined) {
    node.textContent = String(text);
  }

  appendChildren(node, ...children);
  return node;
}

export function createLink(options = {}, ...children) {
  const { href, ...elementOptions } = options;
  const anchor = createElement("a", elementOptions, ...children);
  applyLinkHref(anchor, href);
  return anchor;
}

export function replaceNodeChildren(target, ...children) {
  const fragment = document.createDocumentFragment();
  appendChildren(fragment, ...children);
  target.replaceChildren(fragment);
  return target;
}
