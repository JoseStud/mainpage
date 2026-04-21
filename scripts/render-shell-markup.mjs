import {
  renderFooter,
  renderHeader,
  renderSidebar,
  renderTweaks,
} from "../public/assets/js/ui/shell-sections.js";

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

// Build-only DOM subset for running the browser shell renderer without adding
// a package manager or runtime dependency to this static site.
function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}

function toDataAttributeName(key) {
  return `data-${String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

class BuildNode {
  constructor(nodeType, ownerDocument) {
    this.nodeType = nodeType;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  appendChild(child) {
    if (child.nodeType === 11) {
      while (child.firstChild) {
        this.appendChild(child.firstChild);
      }
      return child;
    }

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index === -1) {
      throw new Error("Cannot remove a child that is not attached to this node");
    }

    this.childNodes.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  replaceChildren(...children) {
    this.childNodes.forEach((child) => {
      child.parentNode = null;
    });
    this.childNodes = [];
    children.forEach((child) => this.appendChild(child));
  }

  serializeChildren() {
    return this.childNodes.map((child) => child.toString()).join("");
  }
}

class BuildText extends BuildNode {
  constructor(text, ownerDocument) {
    super(3, ownerDocument);
    this.data = String(text ?? "");
  }

  get textContent() {
    return this.data;
  }

  set textContent(value) {
    this.data = String(value ?? "");
  }

  toString() {
    return escapeText(this.data);
  }
}

class BuildDocumentFragment extends BuildNode {
  constructor(ownerDocument) {
    super(11, ownerDocument);
  }

  toString() {
    return this.serializeChildren();
  }
}

class BuildElement extends BuildNode {
  constructor(tagName, ownerDocument) {
    super(1, ownerDocument);
    this.tagName = String(tagName).toLowerCase();
    this.attributes = [];
    this.dataset = new Proxy(
      {},
      {
        set: (_target, key, value) => {
          this.setAttribute(toDataAttributeName(key), String(value));
          return true;
        },
      },
    );
  }

  get className() {
    return this.getAttribute("class") || "";
  }

  set className(value) {
    if (value) {
      this.setAttribute("class", value);
    } else {
      this.removeAttribute("class");
    }
  }

  get id() {
    return this.getAttribute("id") || "";
  }

  set id(value) {
    if (value) {
      this.setAttribute("id", value);
    } else {
      this.removeAttribute("id");
    }
  }

  get textContent() {
    return this.childNodes.map((child) => child.textContent || "").join("");
  }

  set textContent(value) {
    this.replaceChildren(new BuildText(value, this.ownerDocument));
  }

  get innerHTML() {
    return this.serializeChildren();
  }

  get outerHTML() {
    const attrs = this.attributes
      .map(({ name, value }) => `${name}="${escapeAttribute(value)}"`)
      .join(" ");
    const openTag = attrs ? `<${this.tagName} ${attrs}>` : `<${this.tagName}>`;

    if (VOID_ELEMENTS.has(this.tagName)) {
      return openTag;
    }

    return `${openTag}${this.innerHTML}</${this.tagName}>`;
  }

  getAttribute(name) {
    const attr = this.attributes.find((entry) => entry.name === name);
    return attr ? attr.value : null;
  }

  setAttribute(name, value) {
    const attrName = String(name);
    const attrValue = String(value ?? "");
    const existing = this.attributes.find((entry) => entry.name === attrName);

    if (existing) {
      existing.value = attrValue;
      return;
    }

    this.attributes.push({ name: attrName, value: attrValue });
  }

  removeAttribute(name) {
    this.attributes = this.attributes.filter((entry) => entry.name !== name);
  }

  toString() {
    return this.outerHTML;
  }
}

class ShellDocument {
  constructor() {
    this.baseURI = "https://example.invalid/";
    this.targets = new Map();

    this.header = this.registerShellTarget("header", "header");
    this.sidebar = this.registerShellTarget("sidebar", "aside");
    this.footer = this.registerShellTarget("footer", "footer");
    this.tweaks = this.registerShellTarget("tweaks", "div");
  }

  createElement(tagName) {
    return new BuildElement(tagName, this);
  }

  createTextNode(text) {
    return new BuildText(text, this);
  }

  createDocumentFragment() {
    return new BuildDocumentFragment(this);
  }

  querySelector(selector) {
    return this.targets.get(selector) || null;
  }

  registerShellTarget(name, tagName) {
    const target = this.createElement(tagName);
    target.setAttribute("data-shell", name);
    this.targets.set(`[data-shell="${name}"]`, target);
    return target;
  }
}

function withBuildDocument(callback) {
  const previousDocument = globalThis.document;
  const hadDocument = Object.prototype.hasOwnProperty.call(globalThis, "document");
  const document = new ShellDocument();

  globalThis.document = document;

  try {
    return callback(document);
  } finally {
    if (hadDocument) {
      globalThis.document = previousDocument;
    } else {
      delete globalThis.document;
    }
  }
}

export function renderShellMarkup(pageId, pageShell) {
  return withBuildDocument((document) => {
    renderHeader(pageShell.header);
    renderSidebar(pageId, pageShell);
    renderFooter(pageShell.footerText);
    renderTweaks();

    return {
      header: document.header.innerHTML,
      sidebar: document.sidebar.innerHTML,
      footer: document.footer.innerHTML,
      tweaks: document.tweaks.innerHTML,
    };
  });
}
