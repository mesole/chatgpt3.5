/* empty css                           */import { c as createAstro, a as createComponent$1, r as renderTemplate, b as addAttribute, d as renderComponent, e as renderHead, f as renderSlot, u as unescapeHTML, F as Fragment, m as maybeRenderHead, _ as __astro_tag_component__ } from '../astro.82d9e650.mjs';
import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import { useClipboard, useEventListener } from 'solidjs-use';
import _ from 'lodash';
import { createParser } from 'eventsource-parser';
import { sha256 } from 'js-sha256';
import { ProxyAgent, fetch as fetch$1 } from 'undici';

function createSignal(value, options) {
  return [() => value, v => {
    return value = typeof v === "function" ? v(value) : v;
  }];
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? {
    ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  } : undefined;
}
function createComponent(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function simpleMap(props, wrap) {
  const list = props.each || [],
    len = list.length,
    fn = props.children;
  if (len) {
    let mapped = Array(len);
    for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
    return mapped;
  }
  return props.fallback;
}
function Index(props) {
  return simpleMap(props, (fn, item, i) => fn(() => item, i));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
}

const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
/*#__PURE__*/new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);

const {
  hasOwnProperty
} = Object.prototype;
const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
const REF_START_CHARS_LEN = REF_START_CHARS.length;
const REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
const REF_CHARS_LEN = REF_CHARS.length;
const STACK = [];
const BUFFER = [""];
let ASSIGNMENTS = new Map();
let INDEX_OR_REF = new WeakMap();
let REF_COUNT = 0;
BUFFER.pop();
function stringify(root) {
  if (writeProp(root, "")) {
    let result = BUFFER[0];
    for (let i = 1, len = BUFFER.length; i < len; i++) {
      result += BUFFER[i];
    }
    if (REF_COUNT) {
      if (ASSIGNMENTS.size) {
        let ref = INDEX_OR_REF.get(root);
        if (typeof ref === "number") {
          ref = toRefParam(REF_COUNT++);
          result = ref + "=" + result;
        }
        for (const [assignmentRef, assignments] of ASSIGNMENTS) {
          result += ";" + assignments + assignmentRef;
        }
        result += ";return " + ref;
        ASSIGNMENTS = new Map();
      } else {
        result = "return " + result;
      }
      result = "(function(" + refParamsString() + "){" + result + "}())";
    } else if (root && root.constructor === Object) {
      result = "(" + result + ")";
    }
    BUFFER.length = 0;
    INDEX_OR_REF = new WeakMap();
    return result;
  }
  return "void 0";
}
function writeProp(cur, accessor) {
  switch (typeof cur) {
    case "string":
      BUFFER.push(quote(cur, 0));
      break;
    case "number":
      BUFFER.push(cur + "");
      break;
    case "boolean":
      BUFFER.push(cur ? "!0" : "!1");
      break;
    case "object":
      if (cur === null) {
        BUFFER.push("null");
      } else {
        const ref = getRef(cur, accessor);
        switch (ref) {
          case true:
            return false;
          case false:
            switch (cur.constructor) {
              case Object:
                writeObject(cur);
                break;
              case Array:
                writeArray(cur);
                break;
              case Date:
                BUFFER.push('new Date("' + cur.toISOString() + '")');
                break;
              case RegExp:
                BUFFER.push(cur + "");
                break;
              case Map:
                BUFFER.push("new Map(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case Set:
                BUFFER.push("new Set(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case undefined:
                BUFFER.push("Object.assign(Object.create(null),");
                writeObject(cur);
                BUFFER.push(")");
                break;
              default:
                return false;
            }
            break;
          default:
            BUFFER.push(ref);
            break;
        }
      }
      break;
    default:
      return false;
  }
  return true;
}
function writeObject(obj) {
  let sep = "{";
  STACK.push(obj);
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const escapedKey = toObjectKey(key);
      BUFFER.push(sep + escapedKey + ":");
      if (writeProp(val, escapedKey)) {
        sep = ",";
      } else {
        BUFFER.pop();
      }
    }
  }
  if (sep === "{") {
    BUFFER.push("{}");
  } else {
    BUFFER.push("}");
  }
  STACK.pop();
}
function writeArray(arr) {
  BUFFER.push("[");
  STACK.push(arr);
  writeProp(arr[0], 0);
  for (let i = 1, len = arr.length; i < len; i++) {
    BUFFER.push(",");
    writeProp(arr[i], i);
  }
  STACK.pop();
  BUFFER.push("]");
}
function getRef(cur, accessor) {
  let ref = INDEX_OR_REF.get(cur);
  if (ref === undefined) {
    INDEX_OR_REF.set(cur, BUFFER.length);
    return false;
  }
  if (typeof ref === "number") {
    ref = insertAndGetRef(cur, ref);
  }
  if (STACK.includes(cur)) {
    const parent = STACK[STACK.length - 1];
    let parentRef = INDEX_OR_REF.get(parent);
    if (typeof parentRef === "number") {
      parentRef = insertAndGetRef(parent, parentRef);
    }
    ASSIGNMENTS.set(ref, (ASSIGNMENTS.get(ref) || "") + toAssignment(parentRef, accessor) + "=");
    return true;
  }
  return ref;
}
function toObjectKey(name) {
  const invalidIdentifierPos = getInvalidIdentifierPos(name);
  return invalidIdentifierPos === -1 ? name : quote(name, invalidIdentifierPos);
}
function toAssignment(parent, key) {
  return parent + (typeof key === "number" || key[0] === '"' ? "[" + key + "]" : "." + key);
}
function getInvalidIdentifierPos(name) {
  let char = name[0];
  if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$" || char === "_")) {
    return 0;
  }
  for (let i = 1, len = name.length; i < len; i++) {
    char = name[i];
    if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char >= "0" && char <= "9" || char === "$" || char === "_")) {
      return i;
    }
  }
  return -1;
}
function quote(str, startPos) {
  let result = "";
  let lastPos = 0;
  for (let i = startPos, len = str.length; i < len; i++) {
    let replacement;
    switch (str[i]) {
      case '"':
        replacement = '\\"';
        break;
      case "\\":
        replacement = "\\\\";
        break;
      case "<":
        replacement = "\\x3C";
        break;
      case "\n":
        replacement = "\\n";
        break;
      case "\r":
        replacement = "\\r";
        break;
      case "\u2028":
        replacement = "\\u2028";
        break;
      case "\u2029":
        replacement = "\\u2029";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos === startPos) {
    result = str;
  } else {
    result += str.slice(lastPos);
  }
  return '"' + result + '"';
}
function insertAndGetRef(obj, pos) {
  const ref = toRefParam(REF_COUNT++);
  INDEX_OR_REF.set(obj, ref);
  if (pos) {
    BUFFER[pos - 1] += ref + "=";
  } else {
    BUFFER[pos] = ref + "=" + BUFFER[pos];
  }
  return ref;
}
function refParamsString() {
  let result = REF_START_CHARS[0];
  for (let i = 1; i < REF_COUNT; i++) {
    result += "," + toRefParam(i);
  }
  REF_COUNT = 0;
  return result;
}
function toRefParam(index) {
  let mod = index % REF_START_CHARS_LEN;
  let ref = REF_START_CHARS[mod];
  index = (index - mod) / REF_START_CHARS_LEN;
  while (index > 0) {
    mod = index % REF_CHARS_LEN;
    ref += REF_CHARS[mod];
    index = (index - mod) / REF_CHARS_LEN;
  }
  return ref;
}
function renderToString(code, options = {}) {
  let scripts = "";
  sharedConfig.context = {
    id: options.renderId || "",
    count: 0,
    suspense: {},
    lazy: {},
    assets: [],
    nonce: options.nonce,
    writeResource(id, p, error) {
      if (sharedConfig.context.noHydrate) return;
      if (error) return scripts += `_$HY.set("${id}", ${serializeError(p)});`;
      scripts += `_$HY.set("${id}", ${stringify(p)});`;
    }
  };
  let html = resolveSSRNode(escape(code()));
  sharedConfig.context.noHydrate = true;
  html = injectAssets(sharedConfig.context.assets, html);
  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
  return html;
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s(), attr);
    if (!attr && Array.isArray(s)) {
      let r = "";
      for (let i = 0; i < s.length; i++) r += resolveSSRNode(escape(s[i], attr));
      return {
        t: r
      };
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function serializeError(error) {
  if (error.message) {
    const fields = {};
    const keys = Object.getOwnPropertyNames(error);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = error[key];
      if (!value || key !== "message" && typeof value !== "function") {
        fields[key] = value;
      }
    }
    return `Object.assign(new Error(${stringify(error.message)}), ${stringify(fields)})`;
  }
  return stringify(error);
}

const $$Astro$5 = createAstro();
const $$Layout = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0,viewport-fit=cover">
		<link rel="icon" type="image/svg+xml" href="/favicon.svg">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>${title}</title>
		${({}).HEAD_SCRIPTS ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(({}).HEAD_SCRIPTS)}` })}` : null}
	${renderHead($$result)}</head>
	<body>
		${renderSlot($$result, $$slots["default"])}
	</body></html>`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/layouts/Layout.astro");

const $$Astro$4 = createAstro();
const $$Logo = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Logo;
  return renderTemplate`${maybeRenderHead($$result)}<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32"><g fill="none"><path fill="#F8312F" d="M5 3.5a1.5 1.5 0 0 1-1 1.415V12l2.16 5.487L4 23c-1.1 0-2-.9-2-1.998v-7.004a2 2 0 0 1 1-1.728V4.915A1.5 1.5 0 1 1 5 3.5Zm25.05.05c0 .681-.44 1.26-1.05 1.468V12.2c.597.347 1 .994 1 1.73v7.01c0 1.1-.9 2-2 2l-2.94-5.68L28 11.93V5.018a1.55 1.55 0 1 1 2.05-1.468Z"></path><path fill="#FFB02E" d="M11 4.5A1.5 1.5 0 0 1 12.5 3h7a1.5 1.5 0 0 1 .43 2.938c-.277.082-.57.104-.847.186l-3.053.904l-3.12-.908c-.272-.08-.56-.1-.832-.18A1.5 1.5 0 0 1 11 4.5Z"></path><path fill="#CDC4D6" d="M22.05 30H9.95C6.66 30 4 27.34 4 24.05V12.03C4 8.7 6.7 6 10.03 6h11.95C25.3 6 28 8.7 28 12.03v12.03c0 3.28-2.66 5.94-5.95 5.94Z"></path><path fill="#212121" d="M9.247 18.5h13.506c2.33 0 4.247-1.919 4.247-4.25A4.257 4.257 0 0 0 22.753 10H9.247A4.257 4.257 0 0 0 5 14.25a4.257 4.257 0 0 0 4.247 4.25Zm4.225 7.5h5.056C19.34 26 20 25.326 20 24.5s-.66-1.5-1.472-1.5h-5.056C12.66 23 12 23.674 12 24.5s.66 1.5 1.472 1.5Z"></path><path fill="#00A6ED" d="M10.25 12C9.56 12 9 12.56 9 13.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Zm11.5 0c-.69 0-1.25.56-1.25 1.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Z"></path></g></svg>`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/components/Logo.astro");

const $$Astro$3 = createAstro();
const $$Themetoggle = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Themetoggle;
  return renderTemplate`${maybeRenderHead($$result)}<button id="themeToggle" class="flex items-center justify-center w-10 h-10 rounded-md border transition-colors hover:bg-slate/10 astro-KXYEDVG6">
  <svg width="1.2rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="astro-KXYEDVG6">
    <path class="sun astro-KXYEDVG6" fill-rule="evenodd" d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"></path>
    <path class="moon astro-KXYEDVG6" fill-rule="evenodd" d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"></path>
  </svg>
</button>`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/components/Themetoggle.astro");

const $$Astro$2 = createAstro();
const $$Header = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header>
  <div class="flex justify-between">
    ${renderComponent($$result, "Logo", $$Logo, {})}
    ${renderComponent($$result, "Themetoggle", $$Themetoggle, {})}
  </div>
  <div class="flex items-center mt-2">
    <span class="text-2xl font-extrabold mr-1">ChatGPT</span>
    <span class="text-2xl text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">Demo</span>
  </div>
  <p mt-1 op-60>基于 OpenAI API (gpt-3.5-turbo)</p>
</header>`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/components/Header.astro");

const $$Astro$1 = createAstro();
const $$Footer = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer>
  <p mt-8 text-xs op-30>
    <span pr-1>问题反馈 WX:B4F3C4A7CDF5</span>
    <!-- <a
    border-b border-slate border-none hover:border-dashed
      href="https://ddiu.io" target="_blank"
    >
      Diu
    </a> -->
    <!-- <span px-1>|</span>
    <a
      border-b border-slate border-none hover:border-dashed
      href="https://github.com/ddiu8081/chatgpt-demo" target="_blank"
    >
      Source Code
    </a> -->
  </p>
</footer>`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/components/Footer.astro");

const _tmpl$$5 = ["<svg", " xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M8 20v-5h2v5h9v-7H5v7h3zm-4-9h16V8h-6V4h-4v4H4v3zM3 21v-8H2V7a1 1 0 0 1 1-1h5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3h5a1 1 0 0 1 1 1v6h-1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z\"></path></svg>"];
const _arrow_function$5 = () => {
  return ssr(_tmpl$$5, ssrHydrationKey());
};

__astro_tag_component__(_arrow_function$5, "@astrojs/solid-js");

const _tmpl$$4 = ["<svg", " xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 32 32\"><path d=\"M25.95 7.65l.005-.004c-.092-.11-.197-.206-.293-.312c-.184-.205-.367-.41-.563-.603c-.139-.136-.286-.262-.43-.391c-.183-.165-.366-.329-.558-.482c-.16-.128-.325-.247-.49-.367c-.192-.14-.385-.277-.585-.406a13.513 13.513 0 0 0-.533-.324q-.308-.179-.625-.341c-.184-.094-.37-.185-.56-.27c-.222-.1-.449-.191-.678-.28c-.19-.072-.378-.145-.571-.208c-.246-.082-.498-.15-.75-.217c-.186-.049-.368-.102-.556-.143c-.29-.063-.587-.107-.883-.15c-.16-.023-.315-.056-.476-.073A12.933 12.933 0 0 0 6 7.703V4H4v8h8v-2H6.811A10.961 10.961 0 0 1 16 5a11.111 11.111 0 0 1 1.189.067c.136.015.268.042.403.061c.25.037.501.075.746.128c.16.035.315.08.472.121c.213.057.425.114.633.183c.164.054.325.116.486.178c.193.074.384.15.57.235c.162.072.32.15.477.23q.268.136.526.286c.153.09.305.18.453.276c.168.11.33.224.492.342c.14.102.282.203.417.312c.162.13.316.268.47.406c.123.11.248.217.365.332c.167.164.323.338.479.512A10.993 10.993 0 1 1 5 16H3a13 13 0 1 0 22.95-8.35z\" fill=\"currentColor\"></path></svg>"];
const _arrow_function$4 = () => {
  return ssr(_tmpl$$4, ssrHydrationKey());
};

__astro_tag_component__(_arrow_function$4, "@astrojs/solid-js");

const _tmpl$$3 = ["<div", " class=\"py-2 -mx-4 px-4 transition-colors md:hover:bg-slate/3\"><div class=\"", "\"><div class=\"", "\"></div><div class=\"message prose break-words overflow-hidden\">", "</div></div><!--#-->", "<!--/--></div>"],
  _tmpl$2$2 = ["<div", " class=\"flex items-center justify-end px-3 mb-2\"><div class=\"flex items-center gap-1 px-2 py-0.5 op-70 border border-slate rounded-md text-sm cursor-pointer hover:bg-slate/10\"><!--#-->", "<!--/--><span>Regenerate</span></div></div>"];
const _arrow_function$3 = ({
  role,
  message,
  showRetry,
  onRetry
}) => {
  const roleClass = {
    system: "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300",
    user: "bg-gradient-to-r from-purple-400 to-yellow-400",
    assistant: "bg-gradient-to-r from-yellow-200 via-green-200 to-green-300"
  };
  const [source] = createSignal("");
  const {
    copy,
    copied
  } = useClipboard({
    source,
    copiedDuring: 1e3
  });
  useEventListener("click", e => {
    const el = e.target;
    let code = null;
    if (el.matches("div > div.copy-btn")) {
      code = decodeURIComponent(el.dataset.code);
      copy(code);
    }
    if (el.matches("div > div.copy-btn > svg")) {
      code = decodeURIComponent(el.parentElement?.dataset.code);
      copy(code);
    }
  });
  const htmlString = () => {
    const md = MarkdownIt({
      html: true
    }).use(mdKatex).use(mdHighlight);
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args;
      const token = tokens[idx];
      const rawCode = fence(...args);
      return `<div relative>
      <div data-code=${encodeURIComponent(token.content)} class="copy-btn absolute top-12px right-12px z-3 flex justify-center items-center border b-transparent w-8 h-8 p-2 bg-dark-300 op-90 transition-all group cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
            <div class="opacity-0 h-7 bg-black px-2.5 py-1 box-border text-xs c-white inline-flex justify-center items-center  rounded absolute z-1 transition duration-600 whitespace-nowrap -top-8" group-hover:opacity-100>
              ${copied() ? "Copied" : "Copy"}
            </div>
      </div>
      ${rawCode}
      </div>`;
    };
    if (typeof message === "function") {
      return md.render(message());
    } else if (typeof message === "string") {
      return md.render(message);
    }
    return "";
  };
  return ssr(_tmpl$$3, ssrHydrationKey(), `flex gap-3 rounded-lg ${role === "user" ? "op-75" : ""}`, `shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${escape(roleClass[role], true)}`, htmlString(), showRetry?.() && onRetry && ssr(_tmpl$2$2, ssrHydrationKey(), escape(createComponent(_arrow_function$4, {}))));
};

__astro_tag_component__(_arrow_function$3, "@astrojs/solid-js");

const _tmpl$$2 = ["<svg", " xmlns=\"http://www.w3.org/2000/svg\" width=\"1rem\" height=\"1rem\" viewBox=\"0 0 32 32\"><path fill=\"currentColor\" d=\"M30 15h-2.05A12.007 12.007 0 0 0 17 4.05V2h-2v2.05A12.007 12.007 0 0 0 4.05 15H2v2h2.05A12.007 12.007 0 0 0 15 27.95V30h2v-2.05A12.007 12.007 0 0 0 27.95 17H30ZM17 25.95V22h-2v3.95A10.017 10.017 0 0 1 6.05 17H10v-2H6.05A10.017 10.017 0 0 1 15 6.05V10h2V6.05A10.017 10.017 0 0 1 25.95 15H22v2h3.95A10.017 10.017 0 0 1 17 25.95Z\"></path></svg>"];
const _arrow_function$2 = () => {
  return ssr(_tmpl$$2, ssrHydrationKey());
};

__astro_tag_component__(_arrow_function$2, "@astrojs/solid-js");

const _tmpl$$1 = ["<div", "><div class=\"flex items-center gap-1 op-50 dark:op-60\"><!--#-->", "<!--/--><span>\u7CFB\u7EDF\u89D2\u8272:</span></div><div class=\"mt-1\">", "</div></div>"],
  _tmpl$2$1 = ["<span", " class=\"inline-flex items-center justify-center gap-1 text-sm bg-slate/20 px-2 py-1 rounded-md transition-colors cursor-pointer hover:bg-slate/50\"><!--#-->", "<!--/--><span>\u6DFB\u52A0\u89D2\u8272</span></span>"],
  _tmpl$3$1 = ["<div", "><div class=\"flex items-center gap-1 op-50 dark:op-60\"><!--#-->", "<!--/--><span>\u7CFB\u7EDF\u89D2\u8272:</span></div><p class=\"my-2 leading-normal text-sm op-50 dark:op-60\">\u8BBE\u7F6E\u52A9\u624B</p><div><textarea placeholder=\"system/user\" autocomplete=\"off\" autofocus rows=\"3\" w-full px-3 py-3 my-1 min-h-12 max-h-36 rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none placeholder:op-50 dark=\"placeholder:op-30\" overflow-hidden resize-none scroll-pa-8px></textarea></div><button h-12 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm>\u8BBE\u7F6E</button></div>"],
  _tmpl$4 = ["<div", " class=\"my-4\"><!--#-->", "<!--/--><!--#-->", "<!--/--></div>"];
const _arrow_function$1 = props => {
  return ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return !props.systemRoleEditing();
    },
    get children() {
      return [createComponent(Show, {
        get when() {
          return props.currentSystemRoleSettings();
        },
        get children() {
          return ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(_arrow_function$2, {})), escape(props.currentSystemRoleSettings()));
        }
      }), createComponent(Show, {
        get when() {
          return !props.currentSystemRoleSettings() && props.canEdit();
        },
        get children() {
          return ssr(_tmpl$2$1, ssrHydrationKey(), escape(createComponent(_arrow_function$2, {})));
        }
      })];
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.systemRoleEditing() && props.canEdit();
    },
    get children() {
      return ssr(_tmpl$3$1, ssrHydrationKey(), escape(createComponent(_arrow_function$2, {})));
    }
  })));
};

__astro_tag_component__(_arrow_function$1, "@astrojs/solid-js");

const _tmpl$ = ["<div", " class=\"", "\"><textarea", " placeholder=\"\u8BF7\u8F93\u5165\u95EE\u9898\" autocomplete=\"off\" autofocus rows=\"1\" w-full px-3 py-3 min-h-12 max-h-36 rounded-sm bg-slate bg-op-15 resize-none focus:bg-op-20 focus:ring-0 focus:outline-none placeholder:op-50 dark=\"placeholder:op-30\" scroll-pa-8px></textarea><button", " h-12 px-4 py-1 bg-slate bg-op-15 hover:bg-op-20 rounded-sm><p style=\"font-size: 13px;width:30px;\">\u53D1\u9001</p></button><button title=\"Clear\"", " h-12 px-4 py-2 bg-slate bg-op-15 hover:bg-op-20 rounded-sm>", "</button></div>"],
  _tmpl$2 = ["<div", " my-6><!--#-->", "<!--/--><!--#-->", "<!--/--><!--#-->", "<!--/--><!--#-->", "<!--/--></div>"],
  _tmpl$3 = ["<div", " class=\"h-12 my-4 flex gap-4 items-center justify-center bg-slate bg-op-15 rounded-sm\"><span>AI is thinking...</span><div class=\"px-2 py-0.5 border border-slate rounded-md text-sm op-70 cursor-pointer hover:bg-slate/10\">Stop</div></div>"];
const _arrow_function = () => {
  let inputRef;
  const [currentSystemRoleSettings, setCurrentSystemRoleSettings] = createSignal("");
  const [systemRoleEditing, setSystemRoleEditing] = createSignal(false);
  const [messageList, setMessageList] = createSignal([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [controller, setController] = createSignal(null);
  const throttle = _.throttle(function () {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }, 300, {
    leading: true,
    trailing: false
  });
  const requestWithLatestMessage = async () => {
    setLoading(true);
    setCurrentAssistantMessage("");
    try {
      const controller2 = new AbortController();
      setController(controller2);
      const requestMessageList = [...messageList()];
      if (currentSystemRoleSettings()) {
        requestMessageList.unshift({
          role: "system",
          content: currentSystemRoleSettings()
        });
      }
      const timestamp = Date.now();
      var me = [];
      me.push({
        "role": "user",
        "content": "\u4F60\u597D"
      });
      let datas = {
        content: requestMessageList
      };
      console.log(requestMessageList);
      const response = await fetch("http://52.78.38.136:8080/chat3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datas)
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = response.body;
      if (!data) {
        throw new Error("No data");
      }
      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      var rt = "";
      while (!done) {
        const {
          value,
          done: readerDone
        } = await reader.read();
        if (value) {
          let char = decoder.decode(value);
          if (char === "\n" && currentAssistantMessage().endsWith("\n")) {
            continue;
          }
          if (char) {
            const ft = char.split("data: ");
            if (ft.length >= 2) {
              for (let index = 0; index < ft.length; index++) {
                const ct = ft[index];
                if (ct.length > 10) {
                  const jsonObject = JSON.parse(ct);
                  const delta = jsonObject.choices[0].delta;
                  if (delta.hasOwnProperty("content")) {
                    rt = delta.content;
                  }
                }
              }
            }
            setCurrentAssistantMessage(currentAssistantMessage() + rt);
          }
          throttle();
        }
        done = readerDone;
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setController(null);
      return;
    }
    archiveCurrentMessage();
  };
  const archiveCurrentMessage = () => {
    if (currentAssistantMessage()) {
      setMessageList([...messageList(), {
        role: "assistant",
        content: currentAssistantMessage()
      }]);
      setCurrentAssistantMessage("");
      setLoading(false);
      setController(null);
      inputRef.focus();
    }
  };
  const retryLastFetch = () => {
    if (messageList().length > 0) {
      const lastMessage = messageList()[messageList().length - 1];
      console.log(lastMessage);
      if (lastMessage.role === "assistant") {
        setMessageList(messageList().slice(0, -1));
        requestWithLatestMessage();
      }
    }
  };
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(_arrow_function$1, {
    canEdit: () => messageList().length === 0,
    systemRoleEditing: systemRoleEditing,
    setSystemRoleEditing: setSystemRoleEditing,
    currentSystemRoleSettings: currentSystemRoleSettings,
    setCurrentSystemRoleSettings: setCurrentSystemRoleSettings
  })), escape(createComponent(Index, {
    get each() {
      return messageList();
    },
    children: (message, index) => createComponent(_arrow_function$3, {
      get role() {
        return message().role;
      },
      get message() {
        return message().content;
      },
      showRetry: () => message().role === "assistant" && index === messageList().length - 1,
      onRetry: retryLastFetch
    })
  })), currentAssistantMessage() && escape(createComponent(_arrow_function$3, {
    role: "assistant",
    message: currentAssistantMessage
  })), escape(createComponent(Show, {
    get when() {
      return !loading();
    },
    fallback: () => ssr(_tmpl$3, ssrHydrationKey()),
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), `my-4 flex items-center gap-2 transition-opacity ${systemRoleEditing() ? "op-50" : ""}`, ssrAttribute("disabled", systemRoleEditing(), true), ssrAttribute("disabled", systemRoleEditing(), true), ssrAttribute("disabled", systemRoleEditing(), true), escape(createComponent(_arrow_function$5, {})));
    }
  })));
};

__astro_tag_component__(_arrow_function, "@astrojs/solid-js");

const $$Astro = createAstro();
const $$Index = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "ChatGPT API Demo" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main>
    ${renderComponent($$result2, "Header", $$Header, {})}
    ${renderComponent($$result2, "Generator", _arrow_function, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/dawanli/VsCode/chatgpt-demo-main/src/components/Generator", "client:component-export": "default" })}
    ${renderComponent($$result2, "Footer", $$Footer, {})}
  </main>` })}`;
}, "/Users/dawanli/VsCode/chatgpt-demo-main/src/pages/index.astro");

const $$file = "/Users/dawanli/VsCode/chatgpt-demo-main/src/pages/index.astro";
const $$url = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const generatePayload = (apiKey, messages) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  },
  method: "POST",
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.6,
    stream: true
  })
});
const parseOpenAIStream = (rawResponse) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };
      const parser = createParser(streamParser);
      for await (const chunk of rawResponse.body) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });
  return stream;
};

async function digestMessage(message) {
  if (crypto && crypto.subtle && crypto.subtle.digest) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } else {
    return sha256(message).toString();
  }
}
const generateSignature = async (payload) => {
  const { t: timestamp, m: lastMessage } = payload;
  const secretKey = ({}).PUBLIC_SECRET_KEY;
  const signText = `${timestamp}:${lastMessage}:${secretKey}`;
  return await digestMessage(signText);
};
const verifySignature = async (payload, sign) => {
  const payloadSign = await generateSignature(payload);
  return payloadSign === sign;
};

const apiKey = ({}).OPENAI_API_KEY;
const httpsProxy = ({}).HTTPS_PROXY;
((({})).OPENAI_API_BASE_URL || "http://52.78.38.136:8080").trim().replace(/\/$/, "");
const post = async (context) => {
  const body = await context.request.json();
  const { sign, time, messages } = body;
  if (!messages) {
    return new Response("No input text");
  }
  if (!await verifySignature({ t: time, m: messages?.[messages.length - 1]?.content || "" }, sign)) {
    return new Response("Invalid signature");
  }
  const initOptions = generatePayload(apiKey, messages);
  if (httpsProxy) {
    initOptions["dispatcher"] = new ProxyAgent(httpsProxy);
  }
  const response = await fetch$1(`http://52.78.38.136:8080/chat3`, initOptions);
  return new Response(parseOpenAIStream(response));
};

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, createComponent as c, renderToString as r, ssr as s };
