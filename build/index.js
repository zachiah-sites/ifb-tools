var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = (x) => {
  if (typeof require !== "undefined")
    return require(x);
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/@sveltejs/adapter-node/files/shims.js
import { createRequire } from "module";
import { Headers, Request, Response, fetch } from "@sveltejs/kit/install-fetch";
Object.defineProperty(globalThis, "require", {
  enumerable: true,
  value: createRequire(import.meta.url)
});

// node_modules/svelte/internal/index.mjs
function noop() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var tasks = new Set();
function custom_event(type, detail) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, false, false, detail);
  return e;
}
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(fn) {
  get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// .svelte-kit/output/server/app.js
import { cwd } from "process";
import { join } from "path";
import { promisify } from "util";
import { readFile } from "fs";

// node_modules/svelte/store/index.mjs
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s3 = subscribers[i];
          s3[1]();
          subscriber_queue.push(s3, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}

// .svelte-kit/output/server/app.js
import { createClient } from "@supabase/supabase-js";
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop2() {
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue2 = [];
function writable2(value, start = noop2) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s22 = subscribers[i];
          s22[1]();
          subscriber_queue2.push(s22, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  branch,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (branch) {
    branch.forEach(({ node: node2, loaded, fetched, uses_credentials }) => {
      if (node2.css)
        node2.css.forEach((url) => css2.add(url));
      if (node2.js)
        node2.js.forEach((url) => js.add(url));
      if (node2.styles)
        node2.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable2($session);
    const props = {
      stores: {
        page: writable2(null),
        navigating: writable2(null),
        session
      },
      page: page2,
      components: branch.map(({ node: node2 }) => node2.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${branch.map(({ node: node2 }) => `import(${s$1(node2.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2.path)},
						query: new URLSearchParams(${s$1(page2.query.toString())}),
						params: ${s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack, frame, loc } = error2;
    serialized = try_serialize({ name, message, stack, frame, loc });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node: node2,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node2;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module.load) {
    const load_input = {
      page: page2,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          const request2 = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, request2);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d22) => d22.file === filename || d22.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page2.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = __spreadValues({}, opts.headers);
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape2(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: __spreadValues({}, context)
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node: node2,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape2(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (error3) {
    options2.handle_error(error3);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node2 = nodes[i];
        let loaded;
        if (node2) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node: node2,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error2 = e;
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page: page2,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = __spreadValues(__spreadValues({}, context), loaded.loaded.context);
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error2,
      branch: branch && branch.filter(Boolean),
      page: page2
    });
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone = {};
  for (const key in obj) {
    clone[key.toLowerCase()] = obj[key];
  }
  return clone;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler(__spreadProps(__spreadValues({}, request), { params }));
    if (response) {
      if (typeof response !== "object") {
        return error$1(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers = {} } = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error$1(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error$1(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json" || type === "application/json; charset=utf-8")) {
        headers = __spreadProps(__spreadValues({}, headers), { "content-type": "application/json; charset=utf-8" });
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers };
    }
  }
}
function read_only_form_data() {
  const map2 = new Map();
  return {
    append(key, value) {
      if (map2.has(key)) {
        map2.get(key).push(value);
      } else {
        map2.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map2)
  };
}
var ReadOnlyFormData = class {
  constructor(map2) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map2);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data, append: append2 } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append2(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append: append2 } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append2(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: __spreadProps(__spreadValues({}, incoming), {
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: null,
        locals: {}
      }),
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
var css$u = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$u);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1pdgbjn"}">${navigated ? `${escape(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths2) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-9f668185.js",
      css: ["/./_app/assets/start-0826e215.css", "/./_app/assets/vendor-fc956fa2.css"],
      js: ["/./_app/start-9f668185.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/preload-helper-9f12a5fd.js", "/./_app/chunks/singletons-bb9012b7.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2) => {
      if (error2.frame) {
        console.error(error2.frame);
      }
      console.error(error2.stack);
      error2.stack = options.get_stack(error2);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/latest-routes\/([^/]+?)\/?$/,
      params: (m2) => ({ path: d(m2[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/latest-routes/[path].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/sermons\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/sermons/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/sermons\/([^/]+?)\/?$/,
      params: (m2) => ({ id: d(m2[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/sermons/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bible\/([^/]+?)\/([^/]+?)\/?$/,
      params: (m2) => ({ book: d(m2[1]), chapter: d(m2[2]) }),
      a: ["src/routes/__layout.svelte", "src/routes/bible/[book]/[chapter].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/sign-in\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/sign-in.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/auth\/sign-up\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/auth/sign-up.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/bible\/([^/]+?)\/([^/]+?)\.json$/,
      params: (m2) => ({ book: d(m2[1]), chapter: d(m2[2]) }),
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve22 }) => resolve22(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/latest-routes/[path].svelte": () => Promise.resolve().then(function() {
    return _path_;
  }),
  "src/routes/sermons/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/sermons/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  }),
  "src/routes/bible/[book]/[chapter].svelte": () => Promise.resolve().then(function() {
    return _chapter_;
  }),
  "src/routes/auth/sign-in.svelte": () => Promise.resolve().then(function() {
    return signIn;
  }),
  "src/routes/auth/sign-up.svelte": () => Promise.resolve().then(function() {
    return signUp;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-87bac0dd.js", "css": ["/./_app/assets/pages/__layout.svelte-1995c72b.css", "/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/pages/__layout.svelte-87bac0dd.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/Nav-48dc42f9.js", "/./_app/chunks/db-5a0eba16.js", "/./_app/chunks/supabase-8fb510b0.js", "/./_app/chunks/stores-f5434914.js", "/./_app/chunks/navigation-20968cc5.js", "/./_app/chunks/singletons-bb9012b7.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-5a87aa49.js", "css": ["/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/error.svelte-5a87aa49.js", "/./_app/chunks/vendor-d54525a3.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-79a45a8b.js", "css": ["/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/pages/index.svelte-79a45a8b.js", "/./_app/chunks/vendor-d54525a3.js"], "styles": null }, "src/routes/latest-routes/[path].svelte": { "entry": "/./_app/pages/latest-routes/[path].svelte-ed786732.js", "css": ["/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/pages/latest-routes/[path].svelte-ed786732.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/navigation-20968cc5.js", "/./_app/chunks/singletons-bb9012b7.js"], "styles": null }, "src/routes/sermons/index.svelte": { "entry": "/./_app/pages/sermons/index.svelte-722480d5.js", "css": ["/./_app/assets/vendor-fc956fa2.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/sermons/index.svelte-722480d5.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/navigation-20968cc5.js", "/./_app/chunks/singletons-bb9012b7.js", "/./_app/chunks/FormField-cc6e7d8b.js", "/./_app/chunks/Nav-48dc42f9.js", "/./_app/chunks/Loader-c40bd019.js", "/./_app/chunks/Modal-1f889953.js", "/./_app/chunks/db-5a0eba16.js", "/./_app/chunks/supabase-8fb510b0.js"], "styles": null }, "src/routes/sermons/[id].svelte": { "entry": "/./_app/pages/sermons/[id].svelte-147679a3.js", "css": ["/./_app/assets/pages/sermons/[id].svelte-912a1a5f.css", "/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/pages/sermons/[id].svelte-147679a3.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/Nav-48dc42f9.js", "/./_app/chunks/NavButton-1643242b.js", "/./_app/chunks/Loader-c40bd019.js", "/./_app/chunks/stores-f5434914.js", "/./_app/chunks/supabase-8fb510b0.js", "/./_app/chunks/preload-helper-9f12a5fd.js"], "styles": null }, "src/routes/bible/[book]/[chapter].svelte": { "entry": "/./_app/pages/bible/[book]/[chapter].svelte-4c35cdc6.js", "css": ["/./_app/assets/vendor-fc956fa2.css"], "js": ["/./_app/pages/bible/[book]/[chapter].svelte-4c35cdc6.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/Nav-48dc42f9.js", "/./_app/chunks/NavButton-1643242b.js", "/./_app/chunks/supabase-8fb510b0.js", "/./_app/chunks/db-5a0eba16.js", "/./_app/chunks/Modal-1f889953.js"], "styles": null }, "src/routes/auth/sign-in.svelte": { "entry": "/./_app/pages/auth/sign-in.svelte-da6f9899.js", "css": ["/./_app/assets/vendor-fc956fa2.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/auth/sign-in.svelte-da6f9899.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/navigation-20968cc5.js", "/./_app/chunks/singletons-bb9012b7.js", "/./_app/chunks/db-5a0eba16.js", "/./_app/chunks/supabase-8fb510b0.js", "/./_app/chunks/FormField-cc6e7d8b.js"], "styles": null }, "src/routes/auth/sign-up.svelte": { "entry": "/./_app/pages/auth/sign-up.svelte-78e1148e.js", "css": ["/./_app/assets/vendor-fc956fa2.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/auth/sign-up.svelte-78e1148e.js", "/./_app/chunks/vendor-d54525a3.js", "/./_app/chunks/navigation-20968cc5.js", "/./_app/chunks/singletons-bb9012b7.js", "/./_app/chunks/db-5a0eba16.js", "/./_app/chunks/supabase-8fb510b0.js", "/./_app/chunks/FormField-cc6e7d8b.js"], "styles": null } };
async function load_component(file) {
  return __spreadValues({
    module: await module_lookup[file]()
  }, metadata_lookup[file]);
}
function render(request, {
  prerender
} = {}) {
  const host2 = request.headers["host"];
  return respond(__spreadProps(__spreadValues({}, request), { host: host2 }), options, { prerender });
}
var bookNames = [
  "genesis",
  "exodus",
  "leviticus",
  "numbers",
  "deuteronomy",
  "joshua",
  "judges",
  "ruth",
  "1samuel",
  "2samuel",
  "1kings",
  "2kings",
  "1chronicles",
  "2chronicles",
  "ezra",
  "nehemiah",
  "esther",
  "job",
  "psalms",
  "proverbs",
  "ecclesiastes",
  "songofsolomon",
  "isaiah",
  "jeremiah",
  "lamentations",
  "ezekiel",
  "daniel",
  "hosea",
  "joel",
  "amos",
  "obadiah",
  "jonah",
  "micah",
  "nahum",
  "habakkuk",
  "zephaniah",
  "haggai",
  "zechariah",
  "malachi",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1corinthians",
  "2corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1thessalonians",
  "2thessalonians",
  "1timothy",
  "2timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1peter",
  "2peter",
  "1john",
  "2john",
  "3john",
  "jude",
  "revelation"
];
var highestChapters = {
  genesis: 50,
  exodus: 40,
  leviticus: 27,
  numbers: 36,
  deuteronomy: 34,
  joshua: 24,
  judges: 21,
  ruth: 4,
  "1samuel": 31,
  "2samuel": 24,
  "1kings": 22,
  "2kings": 25,
  "1chronicles": 29,
  "2chronicles": 36,
  ezra: 10,
  nehemiah: 13,
  esther: 10,
  job: 42,
  psalms: 150,
  proverbs: 31,
  ecclesiastes: 12,
  songofsolomon: 8,
  isaiah: 66,
  jeremiah: 52,
  lamentations: 5,
  ezekiel: 48,
  daniel: 12,
  hosea: 14,
  joel: 3,
  amos: 9,
  obadiah: 1,
  jonah: 4,
  micah: 7,
  nahum: 3,
  habakkuk: 3,
  zephaniah: 3,
  haggai: 2,
  zechariah: 14,
  malachi: 4,
  matthew: 28,
  mark: 16,
  luke: 24,
  john: 21,
  acts: 28,
  romans: 16,
  "1corinthians": 16,
  "2corinthians": 13,
  galatians: 6,
  ephesians: 6,
  philippians: 4,
  colossians: 4,
  "1thessalonians": 4,
  "2thessalonians": 3,
  "1timothy": 6,
  "2timothy": 4,
  titus: 3,
  philemon: 1,
  hebrews: 13,
  james: 5,
  "1peter": 5,
  "2peter": 3,
  "1john": 5,
  "2john": 1,
  "3john": 1,
  jude: 1,
  revelation: 22
};
var getChapterNumbers = (bookName) => new Array(highestChapters[bookName]).fill(0).map((z, i) => i + 1);
var readFilePromise = promisify(readFile);
async function getBookJSON(book) {
  if (!bookNames.includes(book)) {
    throw new Error(`getBookJSON("${book}") is invalid because ${book} is not a valid Bible book name`);
  }
  try {
    const bookJSON = JSON.parse(await readFilePromise(join(cwd(), "src/data/bible-raw/", `${book}.json`), "utf8"));
    return __spreadProps(__spreadValues({}, bookJSON), {
      book,
      chapters: bookJSON.chapters.map((chapter) => __spreadProps(__spreadValues({}, chapter), {
        book,
        chapter: +chapter.chapter,
        verses: chapter.verses.map((verse) => __spreadProps(__spreadValues({}, verse), {
          verse: +verse.verse,
          chapter: +chapter.chapter,
          book
        }))
      }))
    });
  } catch (e) {
    throw new Error("Invalid Book Name");
  }
}
var last = (arr) => arr[arr.length - 1];
async function getChapterJSON(bookJSON, chapter) {
  if (typeof bookJSON === "string") {
    bookJSON = await getBookJSON(bookJSON);
  }
  const bookName = bookJSON.book;
  const chapterJSON = bookJSON.chapters[chapter - 1];
  let nextChapterJSON;
  let previousChapterJSON;
  console.log(bookName, chapter);
  if (chapter === 1 && bookName === "genesis") {
    previousChapterJSON = (await getBookJSON("revelation")).chapters[21];
  } else if (chapter === 1) {
    previousChapterJSON = last(await (await getBookJSON(bookNames[bookNames.indexOf(bookName) - 1])).chapters);
  } else {
    previousChapterJSON = bookJSON.chapters[chapter - 2];
  }
  if (chapter === 22 && bookName == "revelation") {
    nextChapterJSON = await (await getBookJSON("genesis")).chapters[0];
  } else if (!bookJSON.chapters[chapter]) {
    nextChapterJSON = (await getBookJSON(bookNames[bookNames.indexOf(bookName) + 1])).chapters[0];
  } else {
    nextChapterJSON = bookJSON.chapters[chapter];
  }
  nextChapterJSON = { chapter: nextChapterJSON.chapter, book: nextChapterJSON.book };
  previousChapterJSON = { chapter: previousChapterJSON.chapter, book: previousChapterJSON.book };
  if (chapterJSON) {
    return __spreadProps(__spreadValues({}, chapterJSON), { next: nextChapterJSON, previous: previousChapterJSON });
  } else {
    throw new Error(`getChapterJSON('... {${bookJSON.book}}', ${chapter}) is invalid because ${bookJSON.book} doesn't have ${chapter} chapters`);
  }
}
async function get({ params }) {
  const { book, chapter } = params;
  console.log(`/api/bible/${book}/${chapter}`);
  try {
    return { body: await getChapterJSON(book, +chapter) };
  } catch (e) {
    return;
  }
}
var index_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posClasses = "" } = $$props;
  let { class: clazz = "justify-evenly flex bg-blue-800 text-white h-16 fixed w-full items-center" } = $$props;
  if ($$props.posClasses === void 0 && $$bindings.posClasses && posClasses !== void 0)
    $$bindings.posClasses(posClasses);
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<nav class="${escape(clazz) + " " + escape(posClasses)}">${slots.default ? slots.default({}) : ``}</nav>`;
});
var supabaseUrl = "https://wmyoxynhsoadkiflpshe.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTE0NzA4MCwiZXhwIjoxOTQwNzIzMDgwfQ.1_nlrnWP5YMpUDXqM5Emp4nL4L_so6f_I41q-fXlk3M";
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function createAuthStore() {
  const { subscribe: subscribe2, set, update: update2 } = writable(supabase.auth.user());
  return {
    subscribe: subscribe2,
    set,
    update: update2,
    async signIn({ email, password }) {
      const { user, session, error: error2 } = await supabase.auth.signIn({
        email,
        password
      });
      if (error2)
        throw error2;
      let { error: error22 } = await supabase.from("profiles").upsert({ username: email, id: user.id }, {
        returning: "minimal"
      });
      if (error22)
        throw error22;
      set(user);
    },
    async signOut() {
      const { error: error2 } = await supabase.auth.signOut();
      if (error2)
        throw error2;
      set(await supabase.auth.user());
    },
    async signUp({ email, password }) {
      const { user, session, error: error2 } = await supabase.auth.signUp({
        email,
        password
      });
      if (error2)
        throw error2;
      let { error: error22 } = await supabase.from("profiles").upsert({ username: email, id: user.id }, {
        returning: "minimal"
      });
      if (error22)
        throw error22;
      set(user);
    }
  };
}
var authStore = createAuthStore();
derived(authStore, async (user) => {
  if (!user) {
    return null;
  }
  let { data, error: error2, status } = await supabase.from("profiles").select(`username`).eq("id", user.id).single();
  if (error2)
    throw error2;
  return data;
});
var Pencil = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg${add_attribute("class", clazz, 0)} aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"pencil-alt"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}"><path fill="${"currentColor"}" d="${"M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"}"></path></svg>`;
});
var Book = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg${add_attribute("class", clazz, 0)} aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"book"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}"><path fill="${"currentColor"}" d="${"M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"}"></path></svg>`;
});
var MapMarker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"map-marker-alt"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 384 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"}"></path></svg>`;
});
var Brain = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"brain"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 576 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z"}"></path></svg>`;
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var NavLinks = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { links } = $$props;
  let { itemClasses = "p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200" } = $$props;
  if ($$props.links === void 0 && $$bindings.links && links !== void 0)
    $$bindings.links(links);
  if ($$props.itemClasses === void 0 && $$bindings.itemClasses && itemClasses !== void 0)
    $$bindings.itemClasses(itemClasses);
  return `${each(links, (link) => `${link === "" ? `<span class="${"flex-grow"}"></span>` : `${link["onClick"] ? `<button${add_attribute("class", itemClasses, 0)}>${link["text"] ? `${escape(link["text"])}` : `${validate_component(link["icon"] || missing_component, "svelte:component").$$render($$result, { class: "h-8" }, {}, {})}`}
		</button>` : `<a${add_attribute("class", itemClasses, 0)}${add_attribute("href", link["href"], 0)}>${link["text"] ? `${escape(link["text"])}` : `${validate_component(link["icon"] || missing_component, "svelte:component").$$render($$result, { class: "h-8" }, {}, {})}`}
		</a>`}`}`)}`;
});
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
var goto = guard("goto");
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $authStore, $$unsubscribe_authStore;
  let $page, $$unsubscribe_page;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let links;
  const { page: page2 } = getStores();
  $$unsubscribe_page = subscribe(page2, (value) => $page = value);
  let client = false;
  onMount(() => {
    client = true;
  });
  const requiresAuth = (path) => {
    const r = [/^\/sermons/, /^\/sermons\/.*/];
    for (let r1 of r) {
      if (path.match(r1)) {
        return true;
      }
    }
    return false;
  };
  links = $authStore ? [
    { href: "/", text: "home" },
    "",
    {
      onClick() {
        return __awaiter2(this, void 0, void 0, function* () {
          yield authStore.signOut();
        });
      },
      text: "sign out"
    }
  ] : [
    { href: "/", text: "home" },
    "",
    { href: "/auth/sign-in", text: "sign in" },
    { href: "/auth/sign-up", text: "sign up" }
  ];
  {
    {
      if (client) {
        const key = `latest-path-${$page.path.split("/")[1]}`;
        const value = $page.path;
        console.log({ key, value });
        localStorage[key] = value;
      }
    }
  }
  {
    {
      if (client) {
        if (requiresAuth($page.path) && !$authStore) {
          localStorage["goto-after-sign-in"] = $page.path;
          goto("/auth/sign-in");
        } else if ($page.path !== "/auth/sign-in") {
          localStorage["goto-after-sign-in"] = "";
        }
      }
    }
  }
  $$unsubscribe_authStore();
  $$unsubscribe_page();
  return `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
    default: () => `${validate_component(NavLinks, "NavLinks").$$render($$result, { links }, {}, {})}`
  })}

<main class="${"pt-16 pb-16 h-[100vh] flex flex-col"}">${slots.default ? slots.default({}) : ``}</main>

${validate_component(Nav, "Nav").$$render($$result, { posClasses: "bottom-0" }, {}, {
    default: () => `${validate_component(NavLinks, "NavLinks").$$render($$result, {
      links: [
        {
          href: "/latest-routes/sermons",
          icon: Pencil
        },
        { href: "/latest-routes/bible", icon: Book },
        {
          href: "/latest-routes/soulwinning",
          icon: MapMarker
        },
        {
          href: "/latest-routes/memory",
          icon: Brain
        }
      ]
    }, {}, {})}`
  })}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load$2({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$2
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="${"https://kit.svelte.dev"}">kit.svelte.dev</a> to read the documentation</p>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$1({ page: page2, fetch: fetch2, session, context }) {
  return __awaiter$1(this, void 0, void 0, function* () {
    if (["bible", "sermons", "memory", "soulwinning"].includes(page2.params.path)) {
      return { props: { path: page2.params.path } };
    } else {
      return;
    }
  });
}
var U5Bpathu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  let client = false;
  onMount(() => {
    client = true;
  });
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  {
    {
      if (client) {
        const latestPath = localStorage["latest-path-" + path] || `/${path}`;
        goto(latestPath, { replaceState: true });
      }
    }
  }
  return ``;
});
var _path_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bpathu5D,
  load: load$1
});
var Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = null } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<button class="${"rounded-lg shadow-lg w-full bg-blue-800 text-white p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"}"${add_attribute("type", type, 0)}>${slots.default ? slots.default({}) : ``}</button>`;
});
var Jumbotron = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  return `<section class="${"self-center m-auto shadow-lg p-8 bg-gray-200"}"><h1 class="${"text-2xl mb-6"}">${escape(title)}</h1>
	${slots.default ? slots.default({}) : ``}</section>`;
});
var ExlamationCircle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"exclamation-circle"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"}"></path></svg>`;
});
var Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = void 0 } = $$props;
  let { error: error2 = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<form class="${"shadow-2xl rounded-2xl max-w-full w-96 m-auto bg-gray-200 p-4"}">${title ? `<h2 class="${"bg-gray-500 text-white shadow-lg rounded-lg p-4 text-3xl text-center text"}">${escape(title)}</h2>` : ``}

	${error2 ? `<p class="${"flex bg-red-800 text-white p-4 mt-6 rounded-lg"}">${validate_component(ExlamationCircle, "ExlamationCircle").$$render($$result, { class: "w-6 mr-4" }, {}, {})}
			<span>${escape(error2)}</span></p>` : ``}

	${slots.default ? slots.default({}) : ``}</form>`;
});
var Asterisk = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg${add_attribute("class", clazz, 0)} aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"asterisk"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}"><path fill="${"currentColor"}" d="${"M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"}"></path></svg>`;
});
var css$t = {
  code: ".not-empty.svelte-pimtdx label.svelte-pimtdx,input.svelte-pimtdx:focus+label.svelte-pimtdx{--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity));border-bottom-width:0;color:rgba(255,255,255,var(--tw-text-opacity));height:2.5rem}.not-empty.svelte-pimtdx input.svelte-pimtdx,input.svelte-pimtdx.svelte-pimtdx:focus{height:2.5rem;opacity:1;top:2.5rem}.not-empty.svelte-pimtdx .required.svelte-pimtdx,input.svelte-pimtdx:focus~.required.svelte-pimtdx{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}",
  map: `{"version":3,"file":"FormField.svelte","sources":["FormField.svelte"],"sourcesContent":["<script context=\\"module\\" lang=\\"ts\\">let _id = 0;\\r\\n<\/script>\\r\\n\\r\\n<script lang=\\"ts\\">import Asterisk from './icons/Asterisk.svelte';\\r\\nconst id = \`form-field-\${_id++}\`;\\r\\nexport let type;\\r\\nexport let value;\\r\\nexport let label;\\r\\nexport let required = false;\\r\\nconst handleInput = (e) => (value = e.target.value);\\r\\nlet hadFocus = false;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"rounded-lg shadow-lg flex flex-col my-6 {'' + value !== '' ? 'not-empty' : ''}\\">\\r\\n\\t<div class=\\"relative h-20\\">\\r\\n\\t\\t<input\\r\\n\\t\\t\\t{required}\\r\\n\\t\\t\\tclass=\\"rounded-b-lg duration-200 w-full h-20 p-2 focus-visible:bg-gray-200 relative opacity-0\\"\\r\\n\\t\\t\\t{value}\\r\\n\\t\\t\\t{id}\\r\\n\\t\\t\\t{type}\\r\\n\\t\\t\\ton:input={handleInput}\\r\\n\\t\\t\\ton:focus={() => (hadFocus = true)}\\r\\n\\t\\t/>\\r\\n\\t\\t<label\\r\\n\\t\\t\\tclass=\\"rounded-t-lg text-gray-500 bg-white border-b-4 border-blue-400 top-0 duration-200 flex p-2 h-20 absolute w-full content-center\\"\\r\\n\\t\\t\\tfor={id}><span class=\\"mr-auto my-auto ml-2\\">{label}</span></label\\r\\n\\t\\t>\\r\\n\\r\\n\\t\\t{#if required}\\r\\n\\t\\t\\t<div class=\\"required flex items-center absolute top-2 right-4 text-red-800 duration-200\\">\\r\\n\\t\\t\\t\\t<Asterisk class=\\"w-4 h-4 mr-2\\" /> Required\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t{/if}\\r\\n\\t</div>\\r\\n</div>\\r\\n\\r\\n<style type=\\"postcss\\">.not-empty label,input:focus+label{--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(107,114,128,var(--tw-bg-opacity));border-bottom-width:0;color:rgba(255,255,255,var(--tw-text-opacity));height:2.5rem}.not-empty input,input:focus{height:2.5rem;opacity:1;top:2.5rem}.not-empty .required,input:focus~.required{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}</style>\\r\\n"],"names":[],"mappings":"AAqCsB,wBAAU,CAAC,mBAAK,CAAC,mBAAK,MAAM,CAAC,mBAAK,CAAC,gBAAgB,CAAC,CAAC,kBAAkB,CAAC,CAAC,iBAAiB,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,eAAe,CAAC,CAAC,CAAC,oBAAoB,CAAC,CAAC,MAAM,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,wBAAU,CAAC,mBAAK,CAAC,iCAAK,MAAM,CAAC,OAAO,MAAM,CAAC,QAAQ,CAAC,CAAC,IAAI,MAAM,CAAC,wBAAU,CAAC,uBAAS,CAAC,mBAAK,MAAM,CAAC,uBAAS,CAAC,kBAAkB,CAAC,CAAC,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAAC"}`
};
var _id = 0;
var FormField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const id = `form-field-${_id++}`;
  let { type } = $$props;
  let { value } = $$props;
  let { label } = $$props;
  let { required = false } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  $$result.css.add(css$t);
  return `<div class="${"rounded-lg shadow-lg flex flex-col my-6 " + escape("" + value !== "" ? "not-empty" : "") + " svelte-pimtdx"}"><div class="${"relative h-20"}"><input ${required ? "required" : ""} class="${"rounded-b-lg duration-200 w-full h-20 p-2 focus-visible:bg-gray-200 relative opacity-0 svelte-pimtdx"}"${add_attribute("value", value, 0)}${add_attribute("id", id, 0)}${add_attribute("type", type, 0)}>
		<label class="${"rounded-t-lg text-gray-500 bg-white border-b-4 border-blue-400 top-0 duration-200 flex p-2 h-20 absolute w-full content-center svelte-pimtdx"}"${add_attribute("for", id, 0)}><span class="${"mr-auto my-auto ml-2"}">${escape(label)}</span></label>

		${required ? `<div class="${"required flex items-center absolute top-2 right-4 text-red-800 duration-200 svelte-pimtdx"}">${validate_component(Asterisk, "Asterisk").$$render($$result, { class: "w-4 h-4 mr-2" }, {}, {})} Required
			</div>` : ``}</div>
</div>`;
});
var Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  return `${$$result.head += `${open ? `<style data-svelte="svelte-dvz18w">body{overflow:hidden!important}</style>` : ``}`, ""}

${open ? `<div class="${"fixed h-[100vh] w-[100vw] bg-opacity-80 bg-gray-800 flex flex-col top-0 z-50"}"><section class="${"m-auto w-full p-6 max-h-[100vh] overflow-auto"}">${slots.default ? slots.default({}) : ``}</section></div>` : ``}`;
});
var Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"plus"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"}"></path></svg>`;
});
var css$s = {
  code: ".circle.svelte-1s8gy0q{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-1s8gy0q-rotate;animation:var(--duration) linear 0s infinite normal none running svelte-1s8gy0q-rotate;border:calc(var(--size)/15) solid var(--color);-o-border-image:initial;border-image:initial;border-radius:50%;border-right:calc(var(--size)/15) solid transparent;height:var(--size);width:var(--size)}@-webkit-keyframes svelte-1s8gy0q-rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes svelte-1s8gy0q-rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Circle.svelte","sources":["Circle.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"0.75s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.circle{-webkit-animation:var(--duration) linear 0s infinite normal none running rotate;animation:var(--duration) linear 0s infinite normal none running rotate;border:calc(var(--size)/15) solid var(--color);-o-border-image:initial;border-image:initial;border-radius:50%;border-right:calc(var(--size)/15) solid transparent;height:var(--size);width:var(--size)}@-webkit-keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}</style>\\n\\n<div\\n  class=\\"circle\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\" />\\n"],"names":[],"mappings":"AAOO,sBAAO,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAM,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAM,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,gBAAgB,OAAO,CAAC,aAAa,OAAO,CAAC,cAAc,GAAG,CAAC,aAAa,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,CAAC,WAAW,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,qBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var Circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "0.75s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$s);
  return `<div class="${"circle svelte-1s8gy0q"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}"></div>`;
});
var css$r = {
  code: '.circle.svelte-ojx2e9{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationOuter) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationOuter) linear infinite;border:3px solid transparent;border-radius:50%;border-top:3px solid var(--colorOuter);box-sizing:border-box;height:var(--size);position:relative;width:var(--size)}.circle.svelte-ojx2e9:after,.circle.svelte-ojx2e9:before{border:3px solid transparent;border-radius:50%;box-sizing:border-box;content:"";position:absolute}.circle.svelte-ojx2e9:after{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationInner) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationInner) linear infinite;border-top-color:var(--colorInner);bottom:9px;left:9px;right:9px;top:9px}.circle.svelte-ojx2e9:before{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationCenter) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationCenter) linear infinite;border-top-color:var(--colorCenter);bottom:3px;left:3px;right:3px;top:3px}@-webkit-keyframes svelte-ojx2e9-circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes svelte-ojx2e9-circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}',
  map: '{"version":3,"file":"Circle2.svelte","sources":["Circle2.svelte"],"sourcesContent":["<script>export let size = \\"60\\";\\nexport let unit = \\"px\\";\\nexport let colorOuter = \\"#FF3E00\\";\\nexport let colorCenter = \\"#40B3FF\\";\\nexport let colorInner = \\"#676778\\";\\nexport let durationMultiplier = 1;\\nexport let durationOuter = `${durationMultiplier * 2}s`;\\nexport let durationInner = `${durationMultiplier * 1.5}s`;\\nexport let durationCenter = `${durationMultiplier * 3}s`;\\n<\/script>\\n\\n<style>.circle{-webkit-animation:circleSpin var(--durationOuter) linear infinite;animation:circleSpin var(--durationOuter) linear infinite;border:3px solid transparent;border-radius:50%;border-top:3px solid var(--colorOuter);box-sizing:border-box;height:var(--size);position:relative;width:var(--size)}.circle:after,.circle:before{border:3px solid transparent;border-radius:50%;box-sizing:border-box;content:\\"\\";position:absolute}.circle:after{-webkit-animation:circleSpin var(--durationInner) linear infinite;animation:circleSpin var(--durationInner) linear infinite;border-top-color:var(--colorInner);bottom:9px;left:9px;right:9px;top:9px}.circle:before{-webkit-animation:circleSpin var(--durationCenter) linear infinite;animation:circleSpin var(--durationCenter) linear infinite;border-top-color:var(--colorCenter);bottom:3px;left:3px;right:3px;top:3px}@-webkit-keyframes circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\n\\n<div\\n  class=\\"circle\\"\\n  style=\\"--size: {size}{unit}; --colorInner: {colorInner}; --colorCenter: {colorCenter}; --colorOuter: {colorOuter}; --durationInner: {durationInner}; --durationCenter: {durationCenter}; --durationOuter: {durationOuter};\\" />\\n"],"names":[],"mappings":"AAWO,qBAAO,CAAC,kBAAkB,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,WAAW,CAAC,cAAc,GAAG,CAAC,WAAW,GAAG,CAAC,KAAK,CAAC,IAAI,YAAY,CAAC,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,MAAM,CAAC,qBAAO,OAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,WAAW,CAAC,cAAc,GAAG,CAAC,WAAW,UAAU,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,qBAAO,MAAM,CAAC,kBAAkB,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,YAAY,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,GAAG,CAAC,MAAM,GAAG,CAAC,IAAI,GAAG,CAAC,qBAAO,OAAO,CAAC,kBAAkB,wBAAU,CAAC,IAAI,gBAAgB,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,gBAAgB,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,aAAa,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,GAAG,CAAC,MAAM,GAAG,CAAC,IAAI,GAAG,CAAC,mBAAmB,wBAAU,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,wBAAU,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var Circle2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "60" } = $$props;
  let { unit = "px" } = $$props;
  let { colorOuter = "#FF3E00" } = $$props;
  let { colorCenter = "#40B3FF" } = $$props;
  let { colorInner = "#676778" } = $$props;
  let { durationMultiplier = 1 } = $$props;
  let { durationOuter = `${durationMultiplier * 2}s` } = $$props;
  let { durationInner = `${durationMultiplier * 1.5}s` } = $$props;
  let { durationCenter = `${durationMultiplier * 3}s` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.colorOuter === void 0 && $$bindings.colorOuter && colorOuter !== void 0)
    $$bindings.colorOuter(colorOuter);
  if ($$props.colorCenter === void 0 && $$bindings.colorCenter && colorCenter !== void 0)
    $$bindings.colorCenter(colorCenter);
  if ($$props.colorInner === void 0 && $$bindings.colorInner && colorInner !== void 0)
    $$bindings.colorInner(colorInner);
  if ($$props.durationMultiplier === void 0 && $$bindings.durationMultiplier && durationMultiplier !== void 0)
    $$bindings.durationMultiplier(durationMultiplier);
  if ($$props.durationOuter === void 0 && $$bindings.durationOuter && durationOuter !== void 0)
    $$bindings.durationOuter(durationOuter);
  if ($$props.durationInner === void 0 && $$bindings.durationInner && durationInner !== void 0)
    $$bindings.durationInner(durationInner);
  if ($$props.durationCenter === void 0 && $$bindings.durationCenter && durationCenter !== void 0)
    $$bindings.durationCenter(durationCenter);
  $$result.css.add(css$r);
  return `<div class="${"circle svelte-ojx2e9"}" style="${"--size: " + escape(size) + escape(unit) + "; --colorInner: " + escape(colorInner) + "; --colorCenter: " + escape(colorCenter) + "; --colorOuter: " + escape(colorOuter) + "; --durationInner: " + escape(durationInner) + "; --durationCenter: " + escape(durationCenter) + "; --durationOuter: " + escape(durationOuter) + ";"}"></div>`;
});
var css$q = {
  code: ".wrapper.svelte-daksnk{align-items:center;box-sizing:border-box;display:flex;height:var(--size);justify-content:center;line-height:0;width:var(--size)}.inner.svelte-daksnk{transform:scale(calc(var(--floatSize)/52))}.ball-container.svelte-daksnk{-webkit-animation:svelte-daksnk-ballTwo var(--duration) infinite;animation:svelte-daksnk-ballTwo var(--duration) infinite;flex-shrink:0;height:44px;position:relative;width:44px}.single-ball.svelte-daksnk{height:44px;position:absolute;width:44px}.ball.svelte-daksnk{-webkit-animation:svelte-daksnk-ballOne var(--duration) infinite ease;animation:svelte-daksnk-ballOne var(--duration) infinite ease;border-radius:50%;height:20px;position:absolute;width:20px}.ball-top-left.svelte-daksnk{background-color:var(--ballTopLeftColor);left:0;top:0}.ball-top-right.svelte-daksnk{background-color:var(--ballTopRightColor);left:24px;top:0}.ball-bottom-left.svelte-daksnk{background-color:var(--ballBottomLeftColor);left:0;top:24px}.ball-bottom-right.svelte-daksnk{background-color:var(--ballBottomRightColor);left:24px;top:24px}@-webkit-keyframes svelte-daksnk-ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@keyframes svelte-daksnk-ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@-webkit-keyframes svelte-daksnk-ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}@keyframes svelte-daksnk-ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}",
  map: '{"version":3,"file":"Circle3.svelte","sources":["Circle3.svelte"],"sourcesContent":["<script>export let size = \\"60\\";\\nexport let unit = \\"px\\";\\nexport let ballTopLeft = \\"#FF3E00\\";\\nexport let ballTopRight = \\"#F8B334\\";\\nexport let ballBottomLeft = \\"#40B3FF\\";\\nexport let ballBottomRight = \\"#676778\\";\\nexport let duration = \\"1.5s\\";\\n<\/script>\\n\\n<style>.wrapper{align-items:center;box-sizing:border-box;display:flex;height:var(--size);justify-content:center;line-height:0;width:var(--size)}.inner{transform:scale(calc(var(--floatSize)/52))}.ball-container{-webkit-animation:ballTwo var(--duration) infinite;animation:ballTwo var(--duration) infinite;flex-shrink:0;height:44px;position:relative;width:44px}.single-ball{height:44px;position:absolute;width:44px}.ball{-webkit-animation:ballOne var(--duration) infinite ease;animation:ballOne var(--duration) infinite ease;border-radius:50%;height:20px;position:absolute;width:20px}.ball-top-left{background-color:var(--ballTopLeftColor);left:0;top:0}.ball-top-right{background-color:var(--ballTopRightColor);left:24px;top:0}.ball-bottom-left{background-color:var(--ballBottomLeftColor);left:0;top:24px}.ball-bottom-right{background-color:var(--ballBottomRightColor);left:24px;top:24px}@-webkit-keyframes ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@keyframes ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@-webkit-keyframes ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}@keyframes ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --floatSize: {size}; --ballTopLeftColor: {ballTopLeft}; --ballTopRightColor: {ballTopRight}; --ballBottomLeftColor: {ballBottomLeft}; --ballBottomRightColor: {ballBottomRight}; --duration: {duration};\\">\\n  <div class=\\"inner\\">\\n    <div class=\\"ball-container\\">\\n      <div class=\\"single-ball\\">\\n        <div class=\\"ball ball-top-left\\">&nbsp;</div>\\n      </div>\\n      <div class=\\"contener_mixte\\">\\n        <div class=\\"ball ball-top-right\\">&nbsp;</div>\\n      </div>\\n      <div class=\\"contener_mixte\\">\\n        <div class=\\"ball ball-bottom-left\\">&nbsp;</div>\\n      </div>\\n      <div class=\\"contener_mixte\\">\\n        <div class=\\"ball ball-bottom-right\\">&nbsp;</div>\\n      </div>\\n    </div>\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AASO,sBAAQ,CAAC,YAAY,MAAM,CAAC,WAAW,UAAU,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,YAAY,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,oBAAM,CAAC,UAAU,MAAM,KAAK,IAAI,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,6BAAe,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,0BAAY,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,mBAAK,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,cAAc,GAAG,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,4BAAc,CAAC,iBAAiB,IAAI,kBAAkB,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,6BAAe,CAAC,iBAAiB,IAAI,mBAAmB,CAAC,CAAC,KAAK,IAAI,CAAC,IAAI,CAAC,CAAC,+BAAiB,CAAC,iBAAiB,IAAI,qBAAqB,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,IAAI,CAAC,gCAAkB,CAAC,iBAAiB,IAAI,sBAAsB,CAAC,CAAC,KAAK,IAAI,CAAC,IAAI,IAAI,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
var Circle3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "60" } = $$props;
  let { unit = "px" } = $$props;
  let { ballTopLeft = "#FF3E00" } = $$props;
  let { ballTopRight = "#F8B334" } = $$props;
  let { ballBottomLeft = "#40B3FF" } = $$props;
  let { ballBottomRight = "#676778" } = $$props;
  let { duration = "1.5s" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.ballTopLeft === void 0 && $$bindings.ballTopLeft && ballTopLeft !== void 0)
    $$bindings.ballTopLeft(ballTopLeft);
  if ($$props.ballTopRight === void 0 && $$bindings.ballTopRight && ballTopRight !== void 0)
    $$bindings.ballTopRight(ballTopRight);
  if ($$props.ballBottomLeft === void 0 && $$bindings.ballBottomLeft && ballBottomLeft !== void 0)
    $$bindings.ballBottomLeft(ballBottomLeft);
  if ($$props.ballBottomRight === void 0 && $$bindings.ballBottomRight && ballBottomRight !== void 0)
    $$bindings.ballBottomRight(ballBottomRight);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  $$result.css.add(css$q);
  return `<div class="${"wrapper svelte-daksnk"}" style="${"--size: " + escape(size) + escape(unit) + "; --floatSize: " + escape(size) + "; --ballTopLeftColor: " + escape(ballTopLeft) + "; --ballTopRightColor: " + escape(ballTopRight) + "; --ballBottomLeftColor: " + escape(ballBottomLeft) + "; --ballBottomRightColor: " + escape(ballBottomRight) + "; --duration: " + escape(duration) + ";"}"><div class="${"inner svelte-daksnk"}"><div class="${"ball-container svelte-daksnk"}"><div class="${"single-ball svelte-daksnk"}"><div class="${"ball ball-top-left svelte-daksnk"}">\xA0</div></div>
      <div class="${"contener_mixte"}"><div class="${"ball ball-top-right svelte-daksnk"}">\xA0</div></div>
      <div class="${"contener_mixte"}"><div class="${"ball ball-bottom-left svelte-daksnk"}">\xA0</div></div>
      <div class="${"contener_mixte"}"><div class="${"ball ball-bottom-right svelte-daksnk"}">\xA0</div></div></div></div></div>`;
});
var durationUnitRegex = /[a-zA-Z]/;
var calculateRgba = (color, opacity) => {
  if (color[0] === "#") {
    color = color.slice(1);
  }
  if (color.length === 3) {
    let res = "";
    color.split("").forEach((c) => {
      res += c;
      res += c;
    });
    color = res;
  }
  const rgbValues = (color.match(/.{2}/g) || []).map((hex) => parseInt(hex, 16)).join(", ");
  return `rgba(${rgbValues}, ${opacity})`;
};
var range = (size, startAt = 0) => [...Array(size).keys()].map((i) => i + startAt);
var css$p = {
  code: ".wrapper.svelte-s0hd3y{position:relative}.circle.svelte-s0hd3y,.wrapper.svelte-s0hd3y{height:var(--size);width:var(--size)}.circle.svelte-s0hd3y{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:svelte-s0hd3y-bounce!important;animation-name:svelte-s0hd3y-bounce!important;background-color:var(--color);border-radius:100%;left:0;opacity:.6;position:absolute;top:0}@-webkit-keyframes svelte-s0hd3y-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes svelte-s0hd3y-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}",
  map: '{"version":3,"file":"DoubleBounce.svelte","sources":["DoubleBounce.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"2.1s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{position:relative}.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:bounce!important;animation-name:bounce!important;background-color:var(--color);border-radius:100%;left:0;opacity:.6;position:absolute;top:0}@-webkit-keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}</style>\\n\\n<div class=\\"wrapper\\" style=\\"--size: {size}{unit}; --color: {color}\\">\\n  {#each range(2, 1) as version}\\n    <div\\n      class=\\"circle\\"\\n      style=\\"animation: {duration} {version === 1 ? `${(durationNum - 0.1) / 2}${durationUnit}` : `0s`} infinite ease-in-out\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,SAAS,QAAQ,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,uBAAuB,oBAAM,UAAU,CAAC,eAAe,oBAAM,UAAU,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,KAAK,CAAC,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
var DoubleBounce = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2.1s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$p);
  return `<div class="${"wrapper svelte-s0hd3y"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color)}">${each(range(2, 1), (version) => `<div class="${"circle svelte-s0hd3y"}" style="${"animation: " + escape(duration) + " " + escape(version === 1 ? `${(durationNum - 0.1) / 2}${durationUnit}` : `0s`) + " infinite ease-in-out"}"></div>`)}</div>`;
});
var css$o = {
  code: '.svelte-3cp9zg{-webkit-animation:svelte-3cp9zg-plus-loader-background var(--duration) infinite ease-in-out;animation:svelte-3cp9zg-plus-loader-background var(--duration) infinite ease-in-out;background:#f86;border-radius:50%;display:inline-block;overflow:hidden;position:relative;text-indent:-9999px;transform:rotate(90deg);transform-origin:50% 50%}.svelte-3cp9zg:after{-webkit-animation:svelte-3cp9zg-plus-loader-top var(--duration) infinite linear;animation:svelte-3cp9zg-plus-loader-top var(--duration) infinite linear;background:#f86}.svelte-3cp9zg:after,.svelte-3cp9zg:before{border-radius:50% 0 0 50%;content:"";height:100%;position:absolute;right:50%;top:0;transform-origin:100% 50%;width:50%}.svelte-3cp9zg:before{-webkit-animation:svelte-3cp9zg-plus-loader-bottom var(--duration) infinite linear;animation:svelte-3cp9zg-plus-loader-bottom var(--duration) infinite linear;background:#fc6}@-webkit-keyframes svelte-3cp9zg-plus-loader-top{2.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#f86;transform:rotateY(0deg)}13.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ff430d;transform:rotateY(90deg)}13.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#ffae0d;transform:rotateY(90deg)}25%{background:#fc6;transform:rotateY(180deg)}27.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#fc6;transform:rotateY(180deg)}41.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ffae0d;transform:rotateY(90deg)}41.26%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#2cc642;transform:rotateY(90deg)}50%{background:#6d7;transform:rotateY(0deg)}52.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#6d7;transform:rotateY(0deg)}63.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#2cc642;transform:rotateY(90deg)}63.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#1386d2;transform:rotateY(90deg)}75%{background:#4ae;transform:rotateY(180deg)}77.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#4ae;transform:rotateY(180deg)}91.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#1386d2;transform:rotateY(90deg)}91.26%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#ff430d;transform:rotateY(90deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotateY(0deg)}}@keyframes svelte-3cp9zg-plus-loader-top{2.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#f86;transform:rotateY(0deg)}13.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ff430d;transform:rotateY(90deg)}13.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#ffae0d;transform:rotateY(90deg)}25%{background:#fc6;transform:rotateY(180deg)}27.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#fc6;transform:rotateY(180deg)}41.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ffae0d;transform:rotateY(90deg)}41.26%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#2cc642;transform:rotateY(90deg)}50%{background:#6d7;transform:rotateY(0deg)}52.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#6d7;transform:rotateY(0deg)}63.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#2cc642;transform:rotateY(90deg)}63.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#1386d2;transform:rotateY(90deg)}75%{background:#4ae;transform:rotateY(180deg)}77.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#4ae;transform:rotateY(180deg)}91.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#1386d2;transform:rotateY(90deg)}91.26%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#ff430d;transform:rotateY(90deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotateY(0deg)}}@-webkit-keyframes svelte-3cp9zg-plus-loader-bottom{0%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}}@keyframes svelte-3cp9zg-plus-loader-bottom{0%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}}@-webkit-keyframes svelte-3cp9zg-plus-loader-background{0%{background:#f86;transform:rotate(180deg)}25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(180deg)}27.5%{background:#6d7;transform:rotate(90deg)}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(90deg)}52.5%{background:#6d7;transform:rotate(0deg)}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(0deg)}77.5%{background:#f86;transform:rotate(270deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(270deg)}}@keyframes svelte-3cp9zg-plus-loader-background{0%{background:#f86;transform:rotate(180deg)}25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(180deg)}27.5%{background:#6d7;transform:rotate(90deg)}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(90deg)}52.5%{background:#6d7;transform:rotate(0deg)}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(0deg)}77.5%{background:#f86;transform:rotate(270deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(270deg)}}',
  map: '{"version":3,"file":"GoogleSpin.svelte","sources":["GoogleSpin.svelte"],"sourcesContent":["<script>\\n  export let size = \\"40px\\";\\n  export let duration = \\"3s\\";\\n  $: styles = [`width: ${size}`, `height: ${size}`].join(\\";\\");\\n<\/script>\\n\\n<div class=\\"spinner spinner--google\\" style=\\"--duration: {duration}; {styles}\\"></div>\\n\\n<style>*{-webkit-animation:plus-loader-background var(--duration) infinite ease-in-out;animation:plus-loader-background var(--duration) infinite ease-in-out;background:#f86;border-radius:50%;display:inline-block;overflow:hidden;position:relative;text-indent:-9999px;transform:rotate(90deg);transform-origin:50% 50%}:after{-webkit-animation:plus-loader-top var(--duration) infinite linear;animation:plus-loader-top var(--duration) infinite linear;background:#f86}:after,:before{border-radius:50% 0 0 50%;content:\\"\\";height:100%;position:absolute;right:50%;top:0;transform-origin:100% 50%;width:50%}:before{-webkit-animation:plus-loader-bottom var(--duration) infinite linear;animation:plus-loader-bottom var(--duration) infinite linear;background:#fc6}@-webkit-keyframes plus-loader-top{2.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#f86;transform:rotateY(0deg)}13.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ff430d;transform:rotateY(90deg)}13.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#ffae0d;transform:rotateY(90deg)}25%{background:#fc6;transform:rotateY(180deg)}27.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#fc6;transform:rotateY(180deg)}41.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ffae0d;transform:rotateY(90deg)}41.26%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#2cc642;transform:rotateY(90deg)}50%{background:#6d7;transform:rotateY(0deg)}52.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#6d7;transform:rotateY(0deg)}63.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#2cc642;transform:rotateY(90deg)}63.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#1386d2;transform:rotateY(90deg)}75%{background:#4ae;transform:rotateY(180deg)}77.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#4ae;transform:rotateY(180deg)}91.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#1386d2;transform:rotateY(90deg)}91.26%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#ff430d;transform:rotateY(90deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotateY(0deg)}}@keyframes plus-loader-top{2.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#f86;transform:rotateY(0deg)}13.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ff430d;transform:rotateY(90deg)}13.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#ffae0d;transform:rotateY(90deg)}25%{background:#fc6;transform:rotateY(180deg)}27.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#fc6;transform:rotateY(180deg)}41.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#ffae0d;transform:rotateY(90deg)}41.26%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#2cc642;transform:rotateY(90deg)}50%{background:#6d7;transform:rotateY(0deg)}52.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#6d7;transform:rotateY(0deg)}63.75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#2cc642;transform:rotateY(90deg)}63.76%{-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;background:#1386d2;transform:rotateY(90deg)}75%{background:#4ae;transform:rotateY(180deg)}77.5%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#4ae;transform:rotateY(180deg)}91.25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#1386d2;transform:rotateY(90deg)}91.26%{-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;background:#ff430d;transform:rotateY(90deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotateY(0deg)}}@-webkit-keyframes plus-loader-bottom{0%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}}@keyframes plus-loader-bottom{0%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#fc6}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#4ae}}@-webkit-keyframes plus-loader-background{0%{background:#f86;transform:rotate(180deg)}25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(180deg)}27.5%{background:#6d7;transform:rotate(90deg)}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(90deg)}52.5%{background:#6d7;transform:rotate(0deg)}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(0deg)}77.5%{background:#f86;transform:rotate(270deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(270deg)}}@keyframes plus-loader-background{0%{background:#f86;transform:rotate(180deg)}25%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(180deg)}27.5%{background:#6d7;transform:rotate(90deg)}50%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(90deg)}52.5%{background:#6d7;transform:rotate(0deg)}75%{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#6d7;transform:rotate(0deg)}77.5%{background:#f86;transform:rotate(270deg)}to{-webkit-animation-timing-function:step-start;animation-timing-function:step-start;background:#f86;transform:rotate(270deg)}}</style>\\n"],"names":[],"mappings":"AAQO,cAAC,CAAC,kBAAkB,oCAAsB,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,UAAU,oCAAsB,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,WAAW,IAAI,CAAC,cAAc,GAAG,CAAC,QAAQ,YAAY,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,YAAY,OAAO,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,iBAAiB,GAAG,CAAC,GAAG,eAAC,MAAM,CAAC,kBAAkB,6BAAe,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,6BAAe,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,WAAW,IAAI,eAAC,MAAM,eAAC,OAAO,CAAC,cAAc,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,QAAQ,EAAE,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,GAAG,CAAC,IAAI,CAAC,CAAC,iBAAiB,IAAI,CAAC,GAAG,CAAC,MAAM,GAAG,eAAC,OAAO,CAAC,kBAAkB,gCAAkB,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,gCAAkB,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,WAAW,IAAI,CAAC,mBAAmB,6BAAe,CAAC,IAAI,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,CAAC,WAAW,6BAAe,CAAC,IAAI,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,KAAK,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,MAAM,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,MAAM,CAAC,kCAAkC,OAAO,CAAC,0BAA0B,OAAO,CAAC,WAAW,OAAO,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,CAAC,mBAAmB,gCAAkB,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,CAAC,WAAW,gCAAkB,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,CAAC,mBAAmB,oCAAsB,CAAC,EAAE,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,CAAC,WAAW,oCAAsB,CAAC,EAAE,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,KAAK,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,EAAE,CAAC,kCAAkC,UAAU,CAAC,0BAA0B,UAAU,CAAC,WAAW,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,CAAC"}'
};
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let styles;
  let { size = "40px" } = $$props;
  let { duration = "3s" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  $$result.css.add(css$o);
  styles = [`width: ${size}`, `height: ${size}`].join(";");
  return `<div class="${"spinner spinner--google svelte-3cp9zg"}" style="${"--duration: " + escape(duration) + "; " + escape(styles)}"></div>`;
});
var css$n = {
  code: ".circle.svelte-wwomu7,.wrapper.svelte-wwomu7{height:var(--size);width:var(--size)}.circle.svelte-wwomu7{-webkit-animation-duration:var(--duration);animation-duration:var(--duration);-webkit-animation:svelte-wwomu7-scaleOut var(--duration) ease-in-out infinite;animation:svelte-wwomu7-scaleOut var(--duration) ease-in-out infinite;background-color:var(--color);border-radius:100%;display:inline-block}@-webkit-keyframes svelte-wwomu7-scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}@keyframes svelte-wwomu7-scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"ScaleOut.svelte","sources":["ScaleOut.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-duration:var(--duration);animation-duration:var(--duration);-webkit-animation:scaleOut var(--duration) ease-in-out infinite;animation:scaleOut var(--duration) ease-in-out infinite;background-color:var(--color);border-radius:100%;display:inline-block}@-webkit-keyframes scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}@keyframes scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}; --duration: {duration};\\">\\n  <div class=\\"circle\\" />\\n</div>\\n"],"names":[],"mappings":"AAOO,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,2BAA2B,IAAI,UAAU,CAAC,CAAC,mBAAmB,IAAI,UAAU,CAAC,CAAC,kBAAkB,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,mBAAmB,sBAAQ,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,sBAAQ,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
var ScaleOut = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$n);
  return `<div class="${"wrapper svelte-wwomu7"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + "; --duration: " + escape(duration) + ";"}"><div class="${"circle svelte-wwomu7"}"></div></div>`;
});
var css$m = {
  code: ".wrapper.svelte-yshbro{align-items:center;display:flex;justify-content:center;transform:scale(calc(var(--floatSize)/75))}.line.svelte-yshbro,.wrapper.svelte-yshbro{height:var(--stroke);width:var(--size)}.line.svelte-yshbro{-webkit-animation:svelte-yshbro-spineLine var(--duration) ease infinite;animation:svelte-yshbro-spineLine var(--duration) ease infinite;background:var(--color);border-radius:var(--stroke);transform-origin:center center}@-webkit-keyframes svelte-yshbro-spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}@keyframes svelte-yshbro-spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}",
  map: '{"version":3,"file":"SpinLine.svelte","sources":["SpinLine.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"4s\\";\\nexport let size = \\"60\\";\\nexport let stroke = +size / 12 + unit;\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;justify-content:center;transform:scale(calc(var(--floatSize)/75))}.line,.wrapper{height:var(--stroke);width:var(--size)}.line{-webkit-animation:spineLine var(--duration) ease infinite;animation:spineLine var(--duration) ease infinite;background:var(--color);border-radius:var(--stroke);transform-origin:center center}@-webkit-keyframes spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}@keyframes spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --stroke: {stroke}; --floatSize: {size}; --duration: {duration}\\">\\n  <div class=\\"line\\" />\\n</div>\\n"],"names":[],"mappings":"AAQO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,UAAU,MAAM,KAAK,IAAI,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,OAAO,IAAI,QAAQ,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,kBAAkB,uBAAS,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,UAAU,uBAAS,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,WAAW,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,QAAQ,CAAC,CAAC,iBAAiB,MAAM,CAAC,MAAM,CAAC,mBAAmB,uBAAS,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,CAAC,WAAW,uBAAS,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,CAAC"}'
};
var SpinLine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "4s" } = $$props;
  let { size = "60" } = $$props;
  let { stroke = +size / 12 + unit } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.stroke === void 0 && $$bindings.stroke && stroke !== void 0)
    $$bindings.stroke(stroke);
  $$result.css.add(css$m);
  return `<div class="${"wrapper svelte-yshbro"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --stroke: " + escape(stroke) + "; --floatSize: " + escape(size) + "; --duration: " + escape(duration)}"><div class="${"line svelte-yshbro"}"></div></div>`;
});
var css$l = {
  code: ".wrapper.svelte-4sy8wc{font-size:10px;height:var(--size);text-align:center;width:var(--size)}.rect.svelte-4sy8wc,.wrapper.svelte-4sy8wc{display:inline-block}.rect.svelte-4sy8wc{-webkit-animation:svelte-4sy8wc-stretch var(--duration) ease-in-out infinite;animation:svelte-4sy8wc-stretch var(--duration) ease-in-out infinite;background-color:var(--color);height:100%;margin-right:4px;width:10%}@-webkit-keyframes svelte-4sy8wc-stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}@keyframes svelte-4sy8wc-stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}",
  map: '{"version":3,"file":"Stretch.svelte","sources":["Stretch.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.2s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{font-size:10px;height:var(--size);text-align:center;width:var(--size)}.rect,.wrapper{display:inline-block}.rect{-webkit-animation:stretch var(--duration) ease-in-out infinite;animation:stretch var(--duration) ease-in-out infinite;background-color:var(--color);height:100%;margin-right:4px;width:10%}@-webkit-keyframes stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}@keyframes stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\">\\n  {#each range(5, 1) as version}\\n    <div\\n      class=\\"rect\\"\\n      style=\\"animation-delay: {(version - 1) * (+durationNum / 12)}{durationUnit}\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,QAAQ,YAAY,CAAC,mBAAK,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,IAAI,CAAC,aAAa,GAAG,CAAC,MAAM,GAAG,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC"}'
};
var Stretch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.2s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$l);
  return `<div class="${"wrapper svelte-4sy8wc"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}">${each(range(5, 1), (version) => `<div class="${"rect svelte-4sy8wc"}" style="${"animation-delay: " + escape((version - 1) * (+durationNum / 12)) + escape(durationUnit)}"></div>`)}</div>`;
});
var css$k = {
  code: ".wrapper.svelte-ohnl0k{background-clip:padding-box;background-color:var(--rgba);overflow:hidden;position:relative;width:calc(var(--size)*2)}.lines.svelte-ohnl0k,.wrapper.svelte-ohnl0k{height:calc(var(--size)/15)}.lines.svelte-ohnl0k{background-color:var(--color)}.small-lines.svelte-ohnl0k{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;background-clip:padding-box;border-radius:2px;display:block;overflow:hidden;position:absolute;will-change:left,right}.small-lines.\\31.svelte-ohnl0k{-webkit-animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running svelte-ohnl0k-long;animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running svelte-ohnl0k-long}.small-lines.\\32.svelte-ohnl0k{-webkit-animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running svelte-ohnl0k-short;animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running svelte-ohnl0k-short}@-webkit-keyframes svelte-ohnl0k-long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes svelte-ohnl0k-long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@-webkit-keyframes svelte-ohnl0k-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes svelte-ohnl0k-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}",
  map: '{"version":3,"file":"BarLoader.svelte","sources":["BarLoader.svelte"],"sourcesContent":["<script>;\\nimport { calculateRgba, range } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"2.1s\\";\\nexport let size = \\"60\\";\\nlet rgba;\\n$: rgba = calculateRgba(color, 0.2);\\n<\/script>\\n\\n<style>.wrapper{background-clip:padding-box;background-color:var(--rgba);overflow:hidden;position:relative;width:calc(var(--size)*2)}.lines,.wrapper{height:calc(var(--size)/15)}.lines{background-color:var(--color)}.small-lines{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;background-clip:padding-box;border-radius:2px;display:block;overflow:hidden;position:absolute;will-change:left,right}.small-lines.\\\\31{-webkit-animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running long;animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running long}.small-lines.\\\\32{-webkit-animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running short;animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running short}@-webkit-keyframes long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@-webkit-keyframes short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}</style>\\n\\n<div class=\\"wrapper\\" style=\\"--size: {size}{unit}; --rgba:{rgba}\\">\\n  {#each range(2, 1) as version}\\n    <div\\n      class=\\"lines small-lines {version}\\"\\n      style=\\"--color: {color}; --duration: {duration};\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,gBAAgB,WAAW,CAAC,iBAAiB,IAAI,MAAM,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,oBAAM,CAAC,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,oBAAM,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,0BAAY,CAAC,4BAA4B,QAAQ,CAAC,oBAAoB,QAAQ,CAAC,gBAAgB,WAAW,CAAC,cAAc,GAAG,CAAC,QAAQ,KAAK,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,YAAY,IAAI,CAAC,KAAK,CAAC,YAAY,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,aAAa,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,kBAAI,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,aAAa,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,kBAAI,CAAC,YAAY,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,mBAAK,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,mBAAK,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,mBAAmB,mBAAK,CAAC,EAAE,CAAC,KAAK,KAAK,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,CAAC,WAAW,mBAAK,CAAC,EAAE,CAAC,KAAK,KAAK,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,CAAC"}'
};
var BarLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2.1s" } = $$props;
  let { size = "60" } = $$props;
  let rgba;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$k);
  rgba = calculateRgba(color, 0.2);
  return `<div class="${"wrapper svelte-ohnl0k"}" style="${"--size: " + escape(size) + escape(unit) + "; --rgba:" + escape(rgba)}">${each(range(2, 1), (version) => `<div class="${"lines small-lines " + escape(version) + " svelte-ohnl0k"}" style="${"--color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"></div>`)}</div>`;
});
var css$j = {
  code: ".circle.svelte-f3v7i,.wrapper.svelte-f3v7i{height:var(--size);width:var(--size)}.circle.svelte-f3v7i{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:svelte-f3v7i-bounce var(--duration) linear infinite;animation:svelte-f3v7i-bounce var(--duration) linear infinite;background-color:var(--color);border-radius:100%;opacity:0;position:absolute}@-webkit-keyframes svelte-f3v7i-bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}@keyframes svelte-f3v7i-bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"Jumper.svelte","sources":["Jumper.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:bounce var(--duration) linear infinite;animation:bounce var(--duration) linear infinite;background-color:var(--color);border-radius:100%;opacity:0;position:absolute}@-webkit-keyframes bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}@keyframes bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  {#each range(3, 1) as version}\\n    <div\\n      class=\\"circle\\"\\n      style=\\"animation-delay: {(durationNum / 3) * (version - 1) + durationUnit};\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,oBAAO,CAAC,qBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,oBAAO,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,kBAAkB,mBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,mBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,CAAC,CAAC,SAAS,QAAQ,CAAC,mBAAmB,mBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
var Jumper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$j);
  return `<div class="${"wrapper svelte-f3v7i"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(3, 1), (version) => `<div class="${"circle svelte-f3v7i"}" style="${"animation-delay: " + escape(durationNum / 3 * (version - 1) + durationUnit) + ";"}"></div>`)}</div>`;
});
var css$i = {
  code: ".wrapper.svelte-y1k2d4{position:relative}.border.svelte-y1k2d4,.wrapper.svelte-y1k2d4{height:var(--size);width:var(--size)}.border.svelte-y1k2d4{border:6px solid var(--color);-o-border-image:initial;border-image:initial;border-radius:100%;left:0;opacity:.4;perspective:800px;position:absolute;top:0}.border.\\31.svelte-y1k2d4{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringOne;animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringOne}.border.\\32.svelte-y1k2d4{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringTwo;animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringTwo}@-webkit-keyframes svelte-y1k2d4-ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@keyframes svelte-y1k2d4-ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@-webkit-keyframes svelte-y1k2d4-ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}@keyframes svelte-y1k2d4-ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}",
  map: '{"version":3,"file":"RingLoader.svelte","sources":["RingLoader.svelte"],"sourcesContent":["<script>;\\nimport { range } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"2s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.wrapper{position:relative}.border,.wrapper{height:var(--size);width:var(--size)}.border{border:6px solid var(--color);-o-border-image:initial;border-image:initial;border-radius:100%;left:0;opacity:.4;perspective:800px;position:absolute;top:0}.border.\\\\31{-webkit-animation:var(--duration) linear 0s infinite normal none running ringOne;animation:var(--duration) linear 0s infinite normal none running ringOne}.border.\\\\32{-webkit-animation:var(--duration) linear 0s infinite normal none running ringTwo;animation:var(--duration) linear 0s infinite normal none running ringTwo}@-webkit-keyframes ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@keyframes ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@-webkit-keyframes ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}@keyframes ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  {#each range(2, 1) as version}\\n    <div class=\\"border {version}\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAQO,sBAAQ,CAAC,SAAS,QAAQ,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,gBAAgB,OAAO,CAAC,aAAa,OAAO,CAAC,cAAc,IAAI,CAAC,KAAK,CAAC,CAAC,QAAQ,EAAE,CAAC,YAAY,KAAK,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,OAAO,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,OAAO,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,KAAK,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,KAAK,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var RingLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$i);
  return `<div class="${"wrapper svelte-y1k2d4"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(2, 1), (version) => `<div class="${"border " + escape(version) + " svelte-y1k2d4"}"></div>`)}</div>`;
});
var css$h = {
  code: ".wrapper.svelte-1lt5stc{align-items:center;display:flex;height:var(--size);justify-content:center;width:var(--size)}.dot.svelte-1lt5stc{-webkit-animation:svelte-1lt5stc-sync var(--duration) ease-in-out infinite alternate both running;animation:svelte-1lt5stc-sync var(--duration) ease-in-out infinite alternate both running;background-color:var(--color);border-radius:100%;display:inline-block;height:var(--dotSize);margin:2px;width:var(--dotSize)}@-webkit-keyframes svelte-1lt5stc-sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}@keyframes svelte-1lt5stc-sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}",
  map: '{"version":3,"file":"SyncLoader.svelte","sources":["SyncLoader.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"0.6s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;width:var(--size)}.dot{-webkit-animation:sync var(--duration) ease-in-out infinite alternate both running;animation:sync var(--duration) ease-in-out infinite alternate both running;background-color:var(--color);border-radius:100%;display:inline-block;height:var(--dotSize);margin:2px;width:var(--dotSize)}@-webkit-keyframes sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}@keyframes sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}</style>\\n\\n<div class=\\"wrapper\\" style=\\"--size:{size}{unit}; --duration: {duration};\\">\\n  {#each range(3, 1) as i}\\n    <div\\n      class=\\"dot\\"\\n      style=\\"--dotSize:{+size * 0.25}{unit}; --color:{color}; animation-delay:  {i * (+durationNum / 10)}{durationUnit};\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,uBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAI,CAAC,kBAAkB,mBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,UAAU,mBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,SAAS,CAAC,CAAC,mBAAmB,mBAAI,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,KAAK,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAI,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,KAAK,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,CAAC"}'
};
var SyncLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "0.6s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$h);
  return `<div class="${"wrapper svelte-1lt5stc"}" style="${"--size:" + escape(size) + escape(unit) + "; --duration: " + escape(duration) + ";"}">${each(range(3, 1), (i) => `<div class="${"dot svelte-1lt5stc"}" style="${"--dotSize:" + escape(+size * 0.25) + escape(unit) + "; --color:" + escape(color) + "; animation-delay:  " + escape(i * (+durationNum / 10)) + escape(durationUnit) + ";"}"></div>`)}</div>`;
});
var css$g = {
  code: ".wrapper.svelte-v1bxxu{height:calc(var(--size)/2);overflow:hidden;width:var(--size)}.rainbow.svelte-v1bxxu{-webkit-animation:var(--duration) ease-in-out 0s infinite normal none running svelte-v1bxxu-rotate;animation:var(--duration) ease-in-out 0s infinite normal none running svelte-v1bxxu-rotate;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:var(--color);border-style:solid;border-top-color:var(--color);box-sizing:border-box;height:var(--size);transform:rotate(-200deg);width:var(--size)}@-webkit-keyframes svelte-v1bxxu-rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}@keyframes svelte-v1bxxu-rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}",
  map: '{"version":3,"file":"Rainbow.svelte","sources":["Rainbow.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"3s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.wrapper{height:calc(var(--size)/2);overflow:hidden;width:var(--size)}.rainbow{-webkit-animation:var(--duration) ease-in-out 0s infinite normal none running rotate;animation:var(--duration) ease-in-out 0s infinite normal none running rotate;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:var(--color);border-style:solid;border-top-color:var(--color);box-sizing:border-box;height:var(--size);transform:rotate(-200deg);width:var(--size)}@-webkit-keyframes rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}@keyframes rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  <div class=\\"rainbow\\" />\\n</div>\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,sBAAQ,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,oBAAM,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,oBAAM,CAAC,oBAAoB,WAAW,CAAC,kBAAkB,WAAW,CAAC,cAAc,GAAG,CAAC,mBAAmB,IAAI,OAAO,CAAC,CAAC,aAAa,KAAK,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,UAAU,OAAO,OAAO,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,aAAa,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,aAAa,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,CAAC"}'
};
var Rainbow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "3s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$g);
  return `<div class="${"wrapper svelte-v1bxxu"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"rainbow svelte-v1bxxu"}"></div></div>`;
});
var css$f = {
  code: ".wrapper.svelte-k0vapq{align-items:center;display:flex;height:var(--size);justify-content:center;overflow:hidden;position:relative;width:calc(var(--size)*2.5)}.bar.svelte-k0vapq{-webkit-animation:svelte-k0vapq-motion var(--duration) ease-in-out infinite;animation:svelte-k0vapq-motion var(--duration) ease-in-out infinite;background-color:var(--color);height:calc(var(--size)/10);margin-top:calc(var(--size) - var(--size)/10);position:absolute;top:calc(var(--size)/10);transform:skewY(0deg);width:calc(var(--size)/5)}@-webkit-keyframes svelte-k0vapq-motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}@keyframes svelte-k0vapq-motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}",
  map: '{"version":3,"file":"Wave.svelte","sources":["Wave.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.25s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;overflow:hidden;position:relative;width:calc(var(--size)*2.5)}.bar{-webkit-animation:motion var(--duration) ease-in-out infinite;animation:motion var(--duration) ease-in-out infinite;background-color:var(--color);height:calc(var(--size)/10);margin-top:calc(var(--size) - var(--size)/10);position:absolute;top:calc(var(--size)/10);transform:skewY(0deg);width:calc(var(--size)/5)}@-webkit-keyframes motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}@keyframes motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  {#each range(10, 0) as version}\\n    <div\\n      class=\\"bar\\"\\n      style=\\"left: {version * (+size / 5 + (+size / 15 - +size / 100)) + unit}; animation-delay: {version * (+durationNum / 8.3)}{durationUnit};\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,kBAAI,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,WAAW,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,UAAU,MAAM,IAAI,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,GAAG,CAAC,UAAU,MAAM,KAAK,CAAC,CAAC,GAAG,CAAC,OAAO,IAAI,CAAC,WAAW,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,MAAM,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,GAAG,CAAC,UAAU,MAAM,KAAK,CAAC,CAAC,GAAG,CAAC,OAAO,IAAI,CAAC,WAAW,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,MAAM,CAAC,CAAC,CAAC"}'
};
var Wave = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.25s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$f);
  return `<div class="${"wrapper svelte-k0vapq"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(10, 0), (version) => `<div class="${"bar svelte-k0vapq"}" style="${"left: " + escape(version * (+size / 5 + (+size / 15 - +size / 100)) + unit) + "; animation-delay: " + escape(version * (+durationNum / 8.3)) + escape(durationUnit) + ";"}"></div>`)}</div>`;
});
var css$e = {
  code: ".wrapper.svelte-btdyvu{align-items:center;display:flex;height:calc(var(--size)*1.3);justify-content:center;width:calc(var(--size)*1.3)}.firework.svelte-btdyvu{-webkit-animation:svelte-btdyvu-fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;animation:svelte-btdyvu-fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;border:calc(var(--size)/10) dotted var(--color);border-radius:50%;height:var(--size);width:var(--size)}@-webkit-keyframes svelte-btdyvu-fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}@keyframes svelte-btdyvu-fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"Firework.svelte","sources":["Firework.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.25s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;height:calc(var(--size)*1.3);justify-content:center;width:calc(var(--size)*1.3)}.firework{-webkit-animation:fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;animation:fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;border:calc(var(--size)/10) dotted var(--color);border-radius:50%;height:var(--size);width:var(--size)}@-webkit-keyframes fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}@keyframes fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  <div class=\\"firework\\" />\\n</div>\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,gBAAgB,MAAM,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,uBAAS,CAAC,kBAAkB,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,QAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,MAAM,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,GAAG,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,GAAG,CAAC,QAAQ,GAAG,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,GAAG,CAAC,QAAQ,GAAG,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
var Firework = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.25s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$e);
  return `<div class="${"wrapper svelte-btdyvu"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"firework svelte-btdyvu"}"></div></div>`;
});
var css$d = {
  code: ".wrapper.svelte-ktwz8c{align-items:center;display:flex;justify-content:center;position:relative;width:var(--size)}.cube.svelte-ktwz8c,.wrapper.svelte-ktwz8c{height:calc(var(--size)/2.5)}.cube.svelte-ktwz8c{-webkit-animation:svelte-ktwz8c-motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;animation:svelte-ktwz8c-motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;background-color:var(--color);position:absolute;top:0;width:calc(var(--size)/5)}@-webkit-keyframes svelte-ktwz8c-motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes svelte-ktwz8c-motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}",
  map: '{"version":3,"file":"Pulse.svelte","sources":["Pulse.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.5s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;justify-content:center;position:relative;width:var(--size)}.cube,.wrapper{height:calc(var(--size)/2.5)}.cube{-webkit-animation:motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;animation:motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;background-color:var(--color);position:absolute;top:0;width:calc(var(--size)/5)}@-webkit-keyframes motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\">\\n  {#each range(3, 0) as version}\\n    <div\\n      class=\\"cube\\"\\n      style=\\"animation-delay: {version * (+durationNum / 10)}{durationUnit}; left: {version * (+size / 3 + +size / 15) + unit};\\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,mBAAK,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,GAAG,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,GAAG,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC"}'
};
var Pulse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.5s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$d);
  return `<div class="${"wrapper svelte-ktwz8c"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}">${each(range(3, 0), (version) => `<div class="${"cube svelte-ktwz8c"}" style="${"animation-delay: " + escape(version * (+durationNum / 10)) + escape(durationUnit) + "; left: " + escape(version * (+size / 3 + +size / 15) + unit) + ";"}"></div>`)}</div>`;
});
var css$c = {
  code: ".wrapper.svelte-19ad7s{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.ring.svelte-19ad7s{-webkit-animation:svelte-19ad7s-motion var(--duration) ease infinite;animation:svelte-19ad7s-motion var(--duration) ease infinite;background-color:transparent;border:2px solid var(--color);border-radius:50%;position:absolute}@-webkit-keyframes svelte-19ad7s-motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}@keyframes svelte-19ad7s-motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}",
  map: '{"version":3,"file":"Jellyfish.svelte","sources":["Jellyfish.svelte"],"sourcesContent":["<script>;\\nimport { range, durationUnitRegex } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"2.5s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.ring{-webkit-animation:motion var(--duration) ease infinite;animation:motion var(--duration) ease infinite;background-color:transparent;border:2px solid var(--color);border-radius:50%;position:absolute}@-webkit-keyframes motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}@keyframes motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --motionOne: {-size / 5}{unit}; --motionTwo: {+size / 4}{unit}; --motionThree: {-size / 5}{unit}; --duration: {duration};\\">\\n  {#each range(6, 0) as version}\\n    <div\\n      class=\\"ring\\"\\n      style=\\"animation-delay: {version * (durationNum / 25)}{durationUnit}; width: {version * (+size / 6) + unit}; height: {(version * (+size / 6)) / 2 + unit}; \\" />\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,iBAAiB,WAAW,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,GAAG,CAAC,SAAS,QAAQ,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC"}'
};
var Jellyfish = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2.5s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$c);
  return `<div class="${"wrapper svelte-19ad7s"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --motionOne: " + escape(-size / 5) + escape(unit) + "; --motionTwo: " + escape(+size / 4) + escape(unit) + "; --motionThree: " + escape(-size / 5) + escape(unit) + "; --duration: " + escape(duration) + ";"}">${each(range(6, 0), (version) => `<div class="${"ring svelte-19ad7s"}" style="${"animation-delay: " + escape(version * (durationNum / 25)) + escape(durationUnit) + "; width: " + escape(version * (+size / 6) + unit) + "; height: " + escape(version * (+size / 6) / 2 + unit) + "; "}"></div>`)}</div>`;
});
var css$b = {
  code: ".wrapper.svelte-8eozmp{align-items:center;display:flex;justify-content:center}.spinner.svelte-8eozmp,.wrapper.svelte-8eozmp{height:var(--size);width:var(--size)}.spinner.svelte-8eozmp{-webkit-animation:svelte-8eozmp-rotate var(--duration) infinite linear;animation:svelte-8eozmp-rotate var(--duration) infinite linear}.dot.svelte-8eozmp{-webkit-animation:svelte-8eozmp-bounce var(--duration) infinite ease-in-out;animation:svelte-8eozmp-bounce var(--duration) infinite ease-in-out;background-color:var(--color);border-radius:100%;display:inline-block;height:60%;position:absolute;top:0;width:60%}@-webkit-keyframes svelte-8eozmp-rotate{to{transform:rotate(1turn)}}@keyframes svelte-8eozmp-rotate{to{transform:rotate(1turn)}}@-webkit-keyframes svelte-8eozmp-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes svelte-8eozmp-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}",
  map: `{"version":3,"file":"Chasing.svelte","sources":["Chasing.svelte"],"sourcesContent":["<script>;\\nimport { durationUnitRegex, range } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"2s\\";\\nexport let size = \\"60\\";\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;justify-content:center}.spinner,.wrapper{height:var(--size);width:var(--size)}.spinner{-webkit-animation:rotate var(--duration) infinite linear;animation:rotate var(--duration) infinite linear}.dot{-webkit-animation:bounce var(--duration) infinite ease-in-out;animation:bounce var(--duration) infinite ease-in-out;background-color:var(--color);border-radius:100%;display:inline-block;height:60%;position:absolute;top:0;width:60%}@-webkit-keyframes rotate{to{transform:rotate(1turn)}}@keyframes rotate{to{transform:rotate(1turn)}}@-webkit-keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  <div class=\\"spinner\\">\\n    {#each range(2, 0) as version}\\n      <div\\n        class=\\"dot\\"\\n        style=\\"animation-delay: {version === 1 ? \`\${durationNum / 2}\${durationUnit}\` : '0s'}; bottom: {version === 1 ? '0' : ''}; top: {version === 1 ? 'auto' : ''};\\" />\\n    {/each}\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,sBAAQ,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,sBAAQ,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,kBAAI,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,OAAO,GAAG,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}`
};
var Chasing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2s" } = $$props;
  let { size = "60" } = $$props;
  let durationUnit = duration.match(durationUnitRegex)[0];
  let durationNum = duration.replace(durationUnitRegex, "");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$b);
  return `<div class="${"wrapper svelte-8eozmp"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"spinner svelte-8eozmp"}">${each(range(2, 0), (version) => `<div class="${"dot svelte-8eozmp"}" style="${"animation-delay: " + escape(version === 1 ? `${durationNum / 2}${durationUnit}` : "0s") + "; bottom: " + escape(version === 1 ? "0" : "") + "; top: " + escape(version === 1 ? "auto" : "") + ";"}"></div>`)}</div></div>`;
});
var css$a = {
  code: ".wrapper.svelte-h1e8x4{align-items:center;display:flex;justify-content:center}.shadow.svelte-h1e8x4,.wrapper.svelte-h1e8x4{height:var(--size);position:relative;width:var(--size)}.shadow.svelte-h1e8x4{-webkit-animation:svelte-h1e8x4-load var(--duration) infinite ease,svelte-h1e8x4-round var(--duration) infinite ease;animation:svelte-h1e8x4-load var(--duration) infinite ease,svelte-h1e8x4-round var(--duration) infinite ease;border-radius:50%;color:var(--color);font-size:var(--size);margin:28px auto;overflow:hidden;transform:translateZ(0)}@-webkit-keyframes svelte-h1e8x4-load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes svelte-h1e8x4-load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes svelte-h1e8x4-round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes svelte-h1e8x4-round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Shadow.svelte","sources":["Shadow.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.7s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;justify-content:center}.shadow,.wrapper{height:var(--size);position:relative;width:var(--size)}.shadow{-webkit-animation:load var(--duration) infinite ease,round var(--duration) infinite ease;animation:load var(--duration) infinite ease,round var(--duration) infinite ease;border-radius:50%;color:var(--color);font-size:var(--size);margin:28px auto;overflow:hidden;transform:translateZ(0)}@-webkit-keyframes load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\n  <div class=\\"shadow\\" />\\n</div>\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,kBAAkB,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,mBAAK,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,mBAAK,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,cAAc,GAAG,CAAC,MAAM,IAAI,OAAO,CAAC,CAAC,UAAU,IAAI,MAAM,CAAC,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,SAAS,MAAM,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,mBAAmB,mBAAK,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,mBAAK,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var Shadow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.7s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$a);
  return `<div class="${"wrapper svelte-h1e8x4"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"shadow svelte-h1e8x4"}"></div></div>`;
});
var css$9 = {
  code: ".square.svelte-17enkv8{-webkit-animation:svelte-17enkv8-squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);animation:svelte-17enkv8-squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);-webkit-animation-fill-mode:both;animation-fill-mode:both;background-color:var(--color);display:inline-block;height:var(--size);perspective:100px;width:var(--size)}@-webkit-keyframes svelte-17enkv8-squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}@keyframes svelte-17enkv8-squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}",
  map: '{"version":3,"file":"Square.svelte","sources":["Square.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"3s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>.square{-webkit-animation:squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);animation:squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);-webkit-animation-fill-mode:both;animation-fill-mode:both;background-color:var(--color);display:inline-block;height:var(--size);perspective:100px;width:var(--size)}@-webkit-keyframes squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}@keyframes squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}</style>\\n\\n<div\\n  class=\\"square\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\" />\\n"],"names":[],"mappings":"AAOO,sBAAO,CAAC,kBAAkB,0BAAW,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,CAAC,UAAU,0BAAW,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,QAAQ,YAAY,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,YAAY,KAAK,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,0BAAW,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC,WAAW,0BAAW,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC"}'
};
var Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "3s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$9);
  return `<div class="${"square svelte-17enkv8"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"></div>`;
});
var css$8 = {
  code: ".wrapper.svelte-bqyz2{height:var(--size);position:relative;width:var(--size)}.circle-one.svelte-bqyz2,.wrapper.svelte-bqyz2{-webkit-animation:svelte-bqyz2-moonStretchDelay var(--duration) 0s infinite linear;animation:svelte-bqyz2-moonStretchDelay var(--duration) 0s infinite linear;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;border-radius:100%}.circle-one.svelte-bqyz2{background-color:var(--color);height:calc(var(--size)/7);opacity:.8;position:absolute;top:var(--moonSize);width:calc(var(--size)/7)}.circle-two.svelte-bqyz2{border:calc(var(--size)/7) solid var(--color);border-radius:100%;box-sizing:border-box;height:var(--size);opacity:.1;width:var(--size)}@-webkit-keyframes svelte-bqyz2-moonStretchDelay{to{transform:rotate(1turn)}}@keyframes svelte-bqyz2-moonStretchDelay{to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Moon.svelte","sources":["Moon.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"0.6s\\";\\nexport let size = \\"60\\";\\nlet moonSize = +size / 7;\\nlet top = +size / 2 - moonSize / 2;\\n<\/script>\\n\\n<style>.wrapper{height:var(--size);position:relative;width:var(--size)}.circle-one,.wrapper{-webkit-animation:moonStretchDelay var(--duration) 0s infinite linear;animation:moonStretchDelay var(--duration) 0s infinite linear;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;border-radius:100%}.circle-one{background-color:var(--color);height:calc(var(--size)/7);opacity:.8;position:absolute;top:var(--moonSize);width:calc(var(--size)/7)}.circle-two{border:calc(var(--size)/7) solid var(--color);border-radius:100%;box-sizing:border-box;height:var(--size);opacity:.1;width:var(--size)}@-webkit-keyframes moonStretchDelay{to{transform:rotate(1turn)}}@keyframes moonStretchDelay{to{transform:rotate(1turn)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --moonSize: {top}{unit}; --duration: {duration};\\">\\n  <div class=\\"circle-one\\" />\\n  <div class=\\"circle-two\\" />\\n</div>\\n"],"names":[],"mappings":"AASO,qBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,wBAAW,CAAC,qBAAQ,CAAC,kBAAkB,6BAAgB,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,6BAAgB,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,4BAA4B,QAAQ,CAAC,oBAAoB,QAAQ,CAAC,cAAc,IAAI,CAAC,wBAAW,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,UAAU,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,wBAAW,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,QAAQ,EAAE,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,6BAAgB,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,6BAAgB,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var Moon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "0.6s" } = $$props;
  let { size = "60" } = $$props;
  let moonSize = +size / 7;
  let top = +size / 2 - moonSize / 2;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$8);
  return `<div class="${"wrapper svelte-bqyz2"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --moonSize: " + escape(top) + escape(unit) + "; --duration: " + escape(duration) + ";"}"><div class="${"circle-one svelte-bqyz2"}"></div>
  <div class="${"circle-two svelte-bqyz2"}"></div></div>`;
});
var css$7 = {
  code: ".wrapper.svelte-zfth28.svelte-zfth28{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.wrapper.svelte-zfth28 .svelte-zfth28{box-sizing:border-box;line-height:0}.spinner-inner.svelte-zfth28.svelte-zfth28{height:var(--size);transform:scale(calc(var(--size)/70));width:var(--size)}.mask.svelte-zfth28.svelte-zfth28{border-radius:2px;overflow:hidden}.mask.svelte-zfth28.svelte-zfth28,.plane.svelte-zfth28.svelte-zfth28{-webkit-backface-visibility:hidden;backface-visibility:hidden;perspective:1000;position:absolute}.plane.svelte-zfth28.svelte-zfth28{background:var(--color);height:100%;width:400%;z-index:100}#top.svelte-zfth28 .plane.svelte-zfth28{-webkit-animation:svelte-zfth28-trans1 var(--duration) ease-in infinite 0s backwards;animation:svelte-zfth28-trans1 var(--duration) ease-in infinite 0s backwards;z-index:2000}#middle.svelte-zfth28 .plane.svelte-zfth28{-webkit-animation:svelte-zfth28-trans2 var(--duration) linear infinite calc(var(--duration)/4) backwards;animation:svelte-zfth28-trans2 var(--duration) linear infinite calc(var(--duration)/4) backwards;background:var(--rgba);transform:translateZ(0)}#bottom.svelte-zfth28 .plane.svelte-zfth28{-webkit-animation:svelte-zfth28-trans3 var(--duration) ease-out infinite calc(var(--duration)/2) backwards;animation:svelte-zfth28-trans3 var(--duration) ease-out infinite calc(var(--duration)/2) backwards;z-index:2000}#top.svelte-zfth28.svelte-zfth28{top:5px;transform:skew(-15deg,0);width:53px;z-index:100}#middle.svelte-zfth28.svelte-zfth28,#top.svelte-zfth28.svelte-zfth28{height:20px;left:20px}#middle.svelte-zfth28.svelte-zfth28{top:21px;transform:skew(-15deg,40deg);width:33px}#bottom.svelte-zfth28.svelte-zfth28{height:20px;top:35px;transform:skew(-15deg,0);width:53px}@-webkit-keyframes svelte-zfth28-trans1{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-250px,0,0)}}@keyframes svelte-zfth28-trans1{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-250px,0,0)}}@-webkit-keyframes svelte-zfth28-trans2{0%{transform:translate3d(-160px,0,0)}to{transform:translate3d(53px,0,0)}}@keyframes svelte-zfth28-trans2{0%{transform:translate3d(-160px,0,0)}to{transform:translate3d(53px,0,0)}}@-webkit-keyframes svelte-zfth28-trans3{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-220px,0,0)}}@keyframes svelte-zfth28-trans3{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-220px,0,0)}}",
  map: '{"version":3,"file":"Plane.svelte","sources":["Plane.svelte"],"sourcesContent":["<script>;\\nimport { calculateRgba } from \\"./utils\\";\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.3s\\";\\nexport let size = \\"60\\";\\nlet rgba;\\n$: rgba = calculateRgba(color, 0.6);\\n<\/script>\\n\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.wrapper *{box-sizing:border-box;line-height:0}.spinner-inner{height:var(--size);transform:scale(calc(var(--size)/70));width:var(--size)}.mask{border-radius:2px;overflow:hidden}.mask,.plane{-webkit-backface-visibility:hidden;backface-visibility:hidden;perspective:1000;position:absolute}.plane{background:var(--color);height:100%;width:400%;z-index:100}#top .plane{-webkit-animation:trans1 var(--duration) ease-in infinite 0s backwards;animation:trans1 var(--duration) ease-in infinite 0s backwards;z-index:2000}#middle .plane{-webkit-animation:trans2 var(--duration) linear infinite calc(var(--duration)/4) backwards;animation:trans2 var(--duration) linear infinite calc(var(--duration)/4) backwards;background:var(--rgba);transform:translateZ(0)}#bottom .plane{-webkit-animation:trans3 var(--duration) ease-out infinite calc(var(--duration)/2) backwards;animation:trans3 var(--duration) ease-out infinite calc(var(--duration)/2) backwards;z-index:2000}#top{top:5px;transform:skew(-15deg,0);width:53px;z-index:100}#middle,#top{height:20px;left:20px}#middle{top:21px;transform:skew(-15deg,40deg);width:33px}#bottom{height:20px;top:35px;transform:skew(-15deg,0);width:53px}@-webkit-keyframes trans1{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-250px,0,0)}}@keyframes trans1{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-250px,0,0)}}@-webkit-keyframes trans2{0%{transform:translate3d(-160px,0,0)}to{transform:translate3d(53px,0,0)}}@keyframes trans2{0%{transform:translate3d(-160px,0,0)}to{transform:translate3d(53px,0,0)}}@-webkit-keyframes trans3{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-220px,0,0)}}@keyframes trans3{0%{transform:translate3d(53px,0,0)}to{transform:translate3d(-220px,0,0)}}</style>\\n\\n<div\\n  class=\\"wrapper\\"\\n  style=\\"--size: {size}{unit}; --color: {color}; --rgba: {rgba}; --duration: {duration};\\">\\n  <div class=\\"spinner-inner\\">\\n    <div id=\\"top\\" class=\\"mask\\">\\n      <div class=\\"plane\\" />\\n    </div>\\n    <div id=\\"middle\\" class=\\"mask\\">\\n      <div class=\\"plane\\" />\\n    </div>\\n    <div id=\\"bottom\\" class=\\"mask\\">\\n      <div class=\\"plane\\" />\\n    </div>\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AAUO,oCAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,sBAAQ,CAAC,cAAC,CAAC,WAAW,UAAU,CAAC,YAAY,CAAC,CAAC,0CAAc,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,UAAU,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,iCAAK,CAAC,cAAc,GAAG,CAAC,SAAS,MAAM,CAAC,iCAAK,CAAC,kCAAM,CAAC,4BAA4B,MAAM,CAAC,oBAAoB,MAAM,CAAC,YAAY,IAAI,CAAC,SAAS,QAAQ,CAAC,kCAAM,CAAC,WAAW,IAAI,OAAO,CAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,QAAQ,GAAG,CAAC,kBAAI,CAAC,oBAAM,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,OAAO,CAAC,QAAQ,CAAC,EAAE,CAAC,SAAS,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,OAAO,CAAC,QAAQ,CAAC,EAAE,CAAC,SAAS,CAAC,QAAQ,IAAI,CAAC,qBAAO,CAAC,oBAAM,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,CAAC,WAAW,IAAI,MAAM,CAAC,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,qBAAO,CAAC,oBAAM,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,QAAQ,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,QAAQ,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,CAAC,QAAQ,IAAI,CAAC,gCAAI,CAAC,IAAI,GAAG,CAAC,UAAU,KAAK,MAAM,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,QAAQ,GAAG,CAAC,mCAAO,CAAC,gCAAI,CAAC,OAAO,IAAI,CAAC,KAAK,IAAI,CAAC,mCAAO,CAAC,IAAI,IAAI,CAAC,UAAU,KAAK,MAAM,CAAC,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,mCAAO,CAAC,OAAO,IAAI,CAAC,IAAI,IAAI,CAAC,UAAU,KAAK,MAAM,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC"}'
};
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.3s" } = $$props;
  let { size = "60" } = $$props;
  let rgba;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$7);
  rgba = calculateRgba(color, 0.6);
  return `<div class="${"wrapper svelte-zfth28"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --rgba: " + escape(rgba) + "; --duration: " + escape(duration) + ";"}"><div class="${"spinner-inner svelte-zfth28"}"><div id="${"top"}" class="${"mask svelte-zfth28"}"><div class="${"plane svelte-zfth28"}"></div></div>
    <div id="${"middle"}" class="${"mask svelte-zfth28"}"><div class="${"plane svelte-zfth28"}"></div></div>
    <div id="${"bottom"}" class="${"mask svelte-zfth28"}"><div class="${"plane svelte-zfth28"}"></div></div></div></div>`;
});
var css$6 = {
  code: "span.svelte-uyfyg1{display:block;position:relative;width:var(--size)}div.svelte-uyfyg1,span.svelte-uyfyg1{height:calc(var(--size)/4)}div.svelte-uyfyg1{-webkit-animation:svelte-uyfyg1-diamonds var(--duration) linear infinite;animation:svelte-uyfyg1-diamonds var(--duration) linear infinite;background:var(--color);border-radius:2px;left:0;position:absolute;top:0;transform:translateX(-50%) rotate(45deg) scale(0);width:calc(var(--size)/4)}div.svelte-uyfyg1:first-child{-webkit-animation-delay:calc(var(--duration)*2/3*-1);animation-delay:calc(var(--duration)*2/3*-1)}div.svelte-uyfyg1:nth-child(2){-webkit-animation-delay:calc(var(--duration)*2/3*-2);animation-delay:calc(var(--duration)*2/3*-2)}div.svelte-uyfyg1:nth-child(3){-webkit-animation-delay:calc(var(--duration)*2/3*-3);animation-delay:calc(var(--duration)*2/3*-3)}@-webkit-keyframes svelte-uyfyg1-diamonds{50%{left:50%;transform:translateX(-50%) rotate(45deg) scale(1)}to{left:100%;transform:translateX(-50%) rotate(45deg) scale(0)}}@keyframes svelte-uyfyg1-diamonds{50%{left:50%;transform:translateX(-50%) rotate(45deg) scale(1)}to{left:100%;transform:translateX(-50%) rotate(45deg) scale(0)}}",
  map: '{"version":3,"file":"Diamonds.svelte","sources":["Diamonds.svelte"],"sourcesContent":["<script>;\\nexport let color = \\"#FF3E00\\";\\nexport let unit = \\"px\\";\\nexport let duration = \\"1.5s\\";\\nexport let size = \\"60\\";\\n<\/script>\\n\\n<style>span{display:block;position:relative;width:var(--size)}div,span{height:calc(var(--size)/4)}div{-webkit-animation:diamonds var(--duration) linear infinite;animation:diamonds var(--duration) linear infinite;background:var(--color);border-radius:2px;left:0;position:absolute;top:0;transform:translateX(-50%) rotate(45deg) scale(0);width:calc(var(--size)/4)}div:first-child{-webkit-animation-delay:calc(var(--duration)*2/3*-1);animation-delay:calc(var(--duration)*2/3*-1)}div:nth-child(2){-webkit-animation-delay:calc(var(--duration)*2/3*-2);animation-delay:calc(var(--duration)*2/3*-2)}div:nth-child(3){-webkit-animation-delay:calc(var(--duration)*2/3*-3);animation-delay:calc(var(--duration)*2/3*-3)}@-webkit-keyframes diamonds{50%{left:50%;transform:translateX(-50%) rotate(45deg) scale(1)}to{left:100%;transform:translateX(-50%) rotate(45deg) scale(0)}}@keyframes diamonds{50%{left:50%;transform:translateX(-50%) rotate(45deg) scale(1)}to{left:100%;transform:translateX(-50%) rotate(45deg) scale(0)}}</style>\\n\\n<span style=\\"--size: {size}{unit}; --color:{color}; --duration: {duration};\\">\\n  <div />\\n  <div />\\n  <div />\\n</span>\\n"],"names":[],"mappings":"AAOO,kBAAI,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,iBAAG,CAAC,kBAAI,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,iBAAG,CAAC,kBAAkB,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,WAAW,IAAI,OAAO,CAAC,CAAC,cAAc,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,iBAAG,YAAY,CAAC,wBAAwB,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,gBAAgB,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,iBAAG,WAAW,CAAC,CAAC,CAAC,wBAAwB,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,gBAAgB,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,iBAAG,WAAW,CAAC,CAAC,CAAC,mBAAmB,KAAK,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,gBAAgB,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,mBAAmB,sBAAQ,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,sBAAQ,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC"}'
};
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "1.5s" } = $$props;
  let { size = "60" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$6);
  return `<span style="${"--size: " + escape(size) + escape(unit) + "; --color:" + escape(color) + "; --duration: " + escape(duration) + ";"}" class="${"svelte-uyfyg1"}"><div class="${"svelte-uyfyg1"}"></div>
  <div class="${"svelte-uyfyg1"}"></div>
  <div class="${"svelte-uyfyg1"}"></div></span>`;
});
var Loader_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const loaders = [
    BarLoader,
    Chasing,
    Circle,
    Circle2,
    Circle3,
    DoubleBounce,
    Firework,
    Jellyfish,
    Jumper,
    Pulse,
    Rainbow,
    RingLoader,
    ScaleOut,
    Shadow,
    SpinLine,
    Stretch,
    Wave,
    SyncLoader,
    Square,
    Moon
  ];
  const Loader = loaders[Math.floor(Math.random() * loaders.length)];
  return `<div class="${"h-full w-full flex items-center justify-center"}">${validate_component(Loader || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>`;
});
var Sermons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  const fetchSermons = () => __awaiter2(void 0, void 0, void 0, function* () {
    const { error: error2, data } = yield supabase.from("sermons").select(`
            title,id
        `);
    if (error2) {
      throw error2;
    }
    return data;
  });
  let modalOpen = false;
  let newSermonTitle = "";
  let modalError = null;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${function(__value) {
      if (is_promise(__value))
        return `
	${validate_component(Loader_1, "Loader").$$render($$result, {}, {}, {})}
`;
      return function(data) {
        return `
	${data.length === 0 ? `${validate_component(Jumbotron, "Jumbotron").$$render($$result, { title: "You Don't Have Any Sermons" }, {}, {
          default: () => `${validate_component(Button, "Button").$$render($$result, {}, {}, { default: () => `Create One` })}`
        })}` : `<ul>${each(data, (sermon) => `<li class="${"flex"}"><a href="${"/sermons/" + escape(sermon.id)}" class="${"mt-4 text-blue-800 p-2 block border-b-2 border-transparent hover:border-blue-800 active:text-blue-600"}">${escape(sermon.title)}</a>
				</li>`)}</ul>`}
`;
      }(__value);
    }(fetchSermons())}

${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
      default: () => `<h1 class="${"p-4 whitespace-nowrap bg-blue-800 text-white border-l border-r border-white flex-grow mr-auto"}">Sermons
	</h1>`
    })}

<div class="${"w-12 h-12 fixed bottom-0 mb-24 right-0 mr-8"}">${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => `${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}`
    })}</div>

${validate_component(Modal, "Modal").$$render($$result, { open: modalOpen }, {
      open: ($$value) => {
        modalOpen = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Form, "Form").$$render($$result, { title: "New Sermon", error: modalError }, {}, {
        default: () => `${validate_component(FormField, "FormField").$$render($$result, {
          type: "text",
          label: "Title",
          required: true,
          value: newSermonTitle
        }, {
          value: ($$value) => {
            newSermonTitle = $$value;
            $$settled = false;
          }
        }, {})}
		${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, { default: () => `Create` })}`
      })}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_authStore();
  return $$rendered;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sermons
});
var NavLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  return `<a${add_attribute("href", href, 0)} class="${"p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200 flex items-center"}">${slots.default ? slots.default({}) : ``}</a>`;
});
var NavButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { grow = false } = $$props;
  if ($$props.grow === void 0 && $$bindings.grow && grow !== void 0)
    $$bindings.grow(grow);
  return `<button class="${[
    "p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200 flex items-center",
    grow ? "flex-grow" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</button>`;
});
var Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"check"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"}"></path></svg>`;
});
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href } = $$props;
  let { class: className = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<a class="${escape(className) + " block rounded-lg shadow-lg bg-blue-800 text-white p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"}"${add_attribute("href", href, 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
var ArrowLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"arrow-left"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"}"></path></svg>`;
});
var SermonEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { initialData } = $$props;
  let { editor = null } = $$props;
  createEventDispatcher();
  let toolbarContainer;
  let editable;
  onMount(() => __awaiter2(void 0, void 0, void 0, function* () {
    const DecoupledEditor = (yield Promise.resolve().then(() => __toModule(__require("@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor.js")))).default;
    editor = yield DecoupledEditor.create(editable, { cloudServices: {} });
    toolbarContainer.appendChild(editor.ui.view.toolbar.element);
  }));
  if ($$props.initialData === void 0 && $$bindings.initialData && initialData !== void 0)
    $$bindings.initialData(initialData);
  if ($$props.editor === void 0 && $$bindings.editor && editor !== void 0)
    $$bindings.editor(editor);
  return `<div class="${"document-editor"}"><div class="${"document-editor__toolbar"}"${add_attribute("this", toolbarContainer, 1)}></div>
	<div class="${"document-editor__editable-container"}"><div class="${"document-editor__editable"}"${add_attribute("this", editable, 1)}><!-- HTML_TAG_START -->${initialData || `<ol style="list-style-type:decimal;"><li>Intro<ol style="list-style-type:upper-latin;"><li>Title</li><li>Verse</li><li>Pray</li></ol></li><li>Point 1<ol style="list-style-type:upper-latin;"><li>Subpoint 1</li><li>Subpoint 2</li></ol></li><li>Conclusion</li></ol>`}<!-- HTML_TAG_END --></div></div>
</div>`;
});
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  const id = $page.params.id;
  const getSermon = () => __awaiter2(void 0, void 0, void 0, function* () {
    const { error: error2, data } = yield supabase.from("sermons").select("title,content,id").eq("id", id);
    if (error2) {
      throw error2;
    }
    if (data.length === 0) {
      return { 404: true };
    }
    return data[0];
  });
  let editor = null;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${function(__value) {
      if (is_promise(__value))
        return `
	${validate_component(Loader_1, "Loader").$$render($$result, {}, {}, {})}
`;
      return function(sermon) {
        return `
	${sermon[404] ? `${validate_component(Jumbotron, "Jumbotron").$$render($$result, { title: "Sermon Not Found" }, {}, {})}` : `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
          default: () => `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/sermons" }, {}, {
            default: () => `${validate_component(ArrowLeft, "ArrowLeft").$$render($$result, { class: "h-8" }, {}, {})}`
          })}
			<h1 class="${"p-4 whitespace-nowrap bg-blue-800 text-white  flex-grow mr-auto"}">${escape(sermon.title)}</h1>
			${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
            default: () => `${validate_component(Check, "Check").$$render($$result, { class: "h-8" }, {}, {})}`
          })}`
        })}
		${validate_component(SermonEditor, "SermonEditor").$$render($$result, { initialData: sermon.content, editor }, {
          editor: ($$value) => {
            editor = $$value;
            $$settled = false;
          }
        }, {})}`}
`;
      }(__value);
    }(getSermon())}`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D
});
function isOutOfViewport(elem) {
  const bounding = elem.getBoundingClientRect();
  const out = {};
  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  return out;
}
var css$5 = {
  code: ".item.svelte-byadif{color:var(--itemColor,inherit);cursor:default;height:var(--height,42px);line-height:var(--height,42px);overflow:hidden;padding:var(--itemPadding,0 20px);text-overflow:ellipsis;white-space:nowrap}.groupHeader.svelte-byadif{text-transform:var(--groupTitleTextTransform,uppercase)}.groupItem.svelte-byadif{padding-left:var(--groupItemPaddingLeft,40px)}.item.svelte-byadif:active{background:var(--itemActiveBackground,#b9daff)}.item.active.svelte-byadif{background:var(--itemIsActiveBG,#007aff);color:var(--itemIsActiveColor,#fff)}.item.first.svelte-byadif{border-radius:var(--itemFirstBorderRadius,4px 4px 0 0)}.item.hover.svelte-byadif:not(.active){background:var(--itemHoverBG,#e7f2ff);color:var(--itemHoverColor,inherit)}",
  map: `{"version":3,"file":"Item.svelte","sources":["Item.svelte"],"sourcesContent":["<script>\\n    export let isActive = false;\\n    export let isFirst = false;\\n    export let isHover = false;\\n    export let getOptionLabel = undefined;\\n    export let item = undefined;\\n    export let filterText = '';\\n\\n    let itemClasses = '';\\n\\n    $: {\\n        const classes = [];\\n        if (isActive) {\\n            classes.push('active');\\n        }\\n        if (isFirst) {\\n            classes.push('first');\\n        }\\n        if (isHover) {\\n            classes.push('hover');\\n        }\\n        if (item.isGroupHeader) {\\n            classes.push('groupHeader');\\n        }\\n        if (item.isGroupItem) {\\n            classes.push('groupItem');\\n        }\\n        itemClasses = classes.join(' ');\\n    }\\n<\/script>\\n\\n<style>.item{color:var(--itemColor,inherit);cursor:default;height:var(--height,42px);line-height:var(--height,42px);overflow:hidden;padding:var(--itemPadding,0 20px);text-overflow:ellipsis;white-space:nowrap}.groupHeader{text-transform:var(--groupTitleTextTransform,uppercase)}.groupItem{padding-left:var(--groupItemPaddingLeft,40px)}.item:active{background:var(--itemActiveBackground,#b9daff)}.item.active{background:var(--itemIsActiveBG,#007aff);color:var(--itemIsActiveColor,#fff)}.item.first{border-radius:var(--itemFirstBorderRadius,4px 4px 0 0)}.item.hover:not(.active){background:var(--itemHoverBG,#e7f2ff);color:var(--itemHoverColor,inherit)}</style>\\n\\n<div class=\\"item {itemClasses}\\">\\n    {@html getOptionLabel(item, filterText)}\\n</div>\\n"],"names":[],"mappings":"AA+BO,mBAAK,CAAC,MAAM,IAAI,WAAW,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,SAAS,MAAM,CAAC,QAAQ,IAAI,aAAa,CAAC,MAAM,CAAC,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC,0BAAY,CAAC,eAAe,IAAI,yBAAyB,CAAC,SAAS,CAAC,CAAC,wBAAU,CAAC,aAAa,IAAI,sBAAsB,CAAC,IAAI,CAAC,CAAC,mBAAK,OAAO,CAAC,WAAW,IAAI,sBAAsB,CAAC,OAAO,CAAC,CAAC,KAAK,qBAAO,CAAC,WAAW,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,KAAK,oBAAM,CAAC,cAAc,IAAI,uBAAuB,CAAC,WAAW,CAAC,CAAC,KAAK,oBAAM,KAAK,OAAO,CAAC,CAAC,WAAW,IAAI,aAAa,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC"}`
};
var Item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isActive = false } = $$props;
  let { isFirst = false } = $$props;
  let { isHover = false } = $$props;
  let { getOptionLabel = void 0 } = $$props;
  let { item = void 0 } = $$props;
  let { filterText = "" } = $$props;
  let itemClasses = "";
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  if ($$props.isFirst === void 0 && $$bindings.isFirst && isFirst !== void 0)
    $$bindings.isFirst(isFirst);
  if ($$props.isHover === void 0 && $$bindings.isHover && isHover !== void 0)
    $$bindings.isHover(isHover);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  $$result.css.add(css$5);
  {
    {
      const classes = [];
      if (isActive) {
        classes.push("active");
      }
      if (isFirst) {
        classes.push("first");
      }
      if (isHover) {
        classes.push("hover");
      }
      if (item.isGroupHeader) {
        classes.push("groupHeader");
      }
      if (item.isGroupItem) {
        classes.push("groupItem");
      }
      itemClasses = classes.join(" ");
    }
  }
  return `<div class="${"item " + escape(itemClasses) + " svelte-byadif"}"><!-- HTML_TAG_START -->${getOptionLabel(item, filterText)}<!-- HTML_TAG_END --></div>`;
});
var css$4 = {
  code: ".listContainer.svelte-12ijemj{background:var(--listBackground,#fff);border:var(--listBorder,none);border-radius:var(--listBorderRadius,4px);box-shadow:var(--listShadow,0 2px 3px 0 rgba(44,62,80,.24));left:var(--listLeft,0);max-height:var(--listMaxHeight,250px);overflow-y:auto;position:var(--listPosition,absolute);right:var(--listRight,0);width:100%;z-index:var(--listZIndex,2)}.virtualList.svelte-12ijemj{height:var(--virtualListHeight,200px)}.listGroupTitle.svelte-12ijemj{color:var(--groupTitleColor,#8f8f8f);cursor:default;font-size:var(--groupTitleFontSize,12px);font-weight:var(--groupTitleFontWeight,600);height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--groupTitlePadding,0 20px);text-overflow:ellipsis;text-transform:var(--groupTitleTextTransform,uppercase);white-space:nowrap}.empty.svelte-12ijemj{color:var(--listEmptyColor,#78848f);padding:var(--listEmptyPadding,20px 0);text-align:var(--listEmptyTextAlign,center)}",
  map: `{"version":3,"file":"List.svelte","sources":["List.svelte"],"sourcesContent":["<script>\\n    import { beforeUpdate, createEventDispatcher, onMount, tick } from 'svelte';\\n    import isOutOfViewport from './utils/isOutOfViewport';\\n    import ItemComponent from './Item.svelte';\\n\\n    const dispatch = createEventDispatcher();\\n\\n    export let container = undefined;\\n    export let VirtualList = null;\\n    export let Item = ItemComponent;\\n    export let isVirtualList = false;\\n    export let items = [];\\n    export let labelIdentifier = 'label';\\n    export let getOptionLabel = (option, filterText) => {\\n        if (option)\\n            return option.isCreator\\n                ? \`Create \\\\\\"\${filterText}\\\\\\"\`\\n                : option[labelIdentifier];\\n    };\\n    export let getGroupHeaderLabel = null;\\n    export let itemHeight = 40;\\n    export let hoverItemIndex = 0;\\n    export let value = undefined;\\n    export let optionIdentifier = 'value';\\n    export let hideEmptyState = false;\\n    export let noOptionsMessage = 'No options';\\n    export let isMulti = false;\\n    export let activeItemIndex = 0;\\n    export let filterText = '';\\n    export let parent = null;\\n    export let listPlacement = null;\\n    export let listAutoWidth = null;\\n    export let listOffset = 5;\\n\\n    let isScrollingTimer = 0;\\n    let isScrolling = false;\\n    let prev_items;\\n\\n    onMount(() => {\\n        if (items.length > 0 && !isMulti && value) {\\n            const _hoverItemIndex = items.findIndex(\\n                (item) => item[optionIdentifier] === value[optionIdentifier]\\n            );\\n\\n            if (_hoverItemIndex) {\\n                hoverItemIndex = _hoverItemIndex;\\n            }\\n        }\\n\\n        scrollToActiveItem('active');\\n\\n        container.addEventListener(\\n            'scroll',\\n            () => {\\n                clearTimeout(isScrollingTimer);\\n\\n                isScrollingTimer = setTimeout(() => {\\n                    isScrolling = false;\\n                }, 100);\\n            },\\n            false\\n        );\\n    });\\n\\n    beforeUpdate(() => {\\n        if (!items) items = [];\\n        if (items !== prev_items && items.length > 0) {\\n            hoverItemIndex = 0;\\n        }\\n\\n        prev_items = items;\\n    });\\n\\n    function handleSelect(item) {\\n        if (item.isCreator) return;\\n        dispatch('itemSelected', item);\\n    }\\n\\n    function handleHover(i) {\\n        if (isScrolling) return;\\n        hoverItemIndex = i;\\n    }\\n\\n    function handleClick(args) {\\n        const { item, i, event } = args;\\n        event.stopPropagation();\\n\\n        if (\\n            value &&\\n            !isMulti &&\\n            value[optionIdentifier] === item[optionIdentifier]\\n        )\\n            return closeList();\\n\\n        if (item.isCreator) {\\n            dispatch('itemCreated', filterText);\\n        } else {\\n            activeItemIndex = i;\\n            hoverItemIndex = i;\\n            handleSelect(item);\\n        }\\n    }\\n\\n    function closeList() {\\n        dispatch('closeList');\\n    }\\n\\n    async function updateHoverItem(increment) {\\n        if (isVirtualList) return;\\n\\n        let isNonSelectableItem = true;\\n\\n        while (isNonSelectableItem) {\\n            if (increment > 0 && hoverItemIndex === items.length - 1) {\\n                hoverItemIndex = 0;\\n            } else if (increment < 0 && hoverItemIndex === 0) {\\n                hoverItemIndex = items.length - 1;\\n            } else {\\n                hoverItemIndex = hoverItemIndex + increment;\\n            }\\n\\n            isNonSelectableItem =\\n                items[hoverItemIndex].isGroupHeader &&\\n                !items[hoverItemIndex].isSelectable;\\n        }\\n\\n        await tick();\\n\\n        scrollToActiveItem('hover');\\n    }\\n\\n    function handleKeyDown(e) {\\n        switch (e.key) {\\n            case 'Escape':\\n                e.preventDefault();\\n                closeList();\\n                break;\\n            case 'ArrowDown':\\n                e.preventDefault();\\n                items.length && updateHoverItem(1);\\n                break;\\n            case 'ArrowUp':\\n                e.preventDefault();\\n                items.length && updateHoverItem(-1);\\n                break;\\n            case 'Enter':\\n                e.preventDefault();\\n                if (items.length === 0) break;\\n                const hoverItem = items[hoverItemIndex];\\n                if (\\n                    value &&\\n                    !isMulti &&\\n                    value[optionIdentifier] === hoverItem[optionIdentifier]\\n                ) {\\n                    closeList();\\n                    break;\\n                }\\n                if (hoverItem.isCreator) {\\n                    dispatch('itemCreated', filterText);\\n                } else {\\n                    activeItemIndex = hoverItemIndex;\\n                    handleSelect(items[hoverItemIndex]);\\n                }\\n                break;\\n            case 'Tab':\\n                e.preventDefault();\\n                if (items.length === 0) {\\n                    return closeList();\\n                }\\n                if (\\n                    value &&\\n                    value[optionIdentifier] ===\\n                        items[hoverItemIndex][optionIdentifier]\\n                )\\n                    return closeList();\\n                activeItemIndex = hoverItemIndex;\\n                handleSelect(items[hoverItemIndex]);\\n                break;\\n        }\\n    }\\n\\n    function scrollToActiveItem(className) {\\n        if (isVirtualList || !container) return;\\n\\n        let offsetBounding;\\n        const focusedElemBounding = container.querySelector(\\n            \`.listItem .\${className}\`\\n        );\\n\\n        if (focusedElemBounding) {\\n            offsetBounding =\\n                container.getBoundingClientRect().bottom -\\n                focusedElemBounding.getBoundingClientRect().bottom;\\n        }\\n\\n        container.scrollTop -= offsetBounding;\\n    }\\n\\n    function isItemActive(item, value, optionIdentifier) {\\n        return value && value[optionIdentifier] === item[optionIdentifier];\\n    }\\n\\n    function isItemFirst(itemIndex) {\\n        return itemIndex === 0;\\n    }\\n\\n    function isItemHover(hoverItemIndex, item, itemIndex, items) {\\n        return hoverItemIndex === itemIndex || items.length === 1;\\n    }\\n\\n    let listStyle;\\n    function computePlacement() {\\n        const { top, height, width } = parent.getBoundingClientRect();\\n\\n        listStyle = '';\\n        listStyle += \`min-width:\${width}px;width:\${\\n            listAutoWidth ? 'auto' : '100%'\\n        };\`;\\n\\n        if (\\n            listPlacement === 'top' ||\\n            (listPlacement === 'auto' && isOutOfViewport(parent).bottom)\\n        ) {\\n            listStyle += \`bottom:\${height + listOffset}px;\`;\\n        } else {\\n            listStyle += \`top:\${height + listOffset}px;\`;\\n        }\\n    }\\n\\n    $: {\\n        if (parent && container) computePlacement();\\n    }\\n<\/script>\\n\\n<style>.listContainer{background:var(--listBackground,#fff);border:var(--listBorder,none);border-radius:var(--listBorderRadius,4px);box-shadow:var(--listShadow,0 2px 3px 0 rgba(44,62,80,.24));left:var(--listLeft,0);max-height:var(--listMaxHeight,250px);overflow-y:auto;position:var(--listPosition,absolute);right:var(--listRight,0);width:100%;z-index:var(--listZIndex,2)}.virtualList{height:var(--virtualListHeight,200px)}.listGroupTitle{color:var(--groupTitleColor,#8f8f8f);cursor:default;font-size:var(--groupTitleFontSize,12px);font-weight:var(--groupTitleFontWeight,600);height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--groupTitlePadding,0 20px);text-overflow:ellipsis;text-transform:var(--groupTitleTextTransform,uppercase);white-space:nowrap}.empty{color:var(--listEmptyColor,#78848f);padding:var(--listEmptyPadding,20px 0);text-align:var(--listEmptyTextAlign,center)}</style>\\n\\n<svelte:window on:keydown={handleKeyDown} on:resize={computePlacement} />\\n\\n<div\\n    class=\\"listContainer\\"\\n    class:virtualList={isVirtualList}\\n    bind:this={container}\\n    style={listStyle}\\n    tabindex=\\"-1\\">\\n    {#if isVirtualList}\\n        <svelte:component\\n            this={VirtualList}\\n            {items}\\n            {itemHeight}\\n            let:item\\n            let:i>\\n            <div\\n                on:mouseover={() => handleHover(i)}\\n                on:click={(event) => handleClick({ item, i, event })}\\n                class=\\"listItem\\">\\n                <svelte:component\\n                    this={Item}\\n                    {item}\\n                    {filterText}\\n                    {getOptionLabel}\\n                    isFirst={isItemFirst(i)}\\n                    isActive={isItemActive(item, value, optionIdentifier)}\\n                    isHover={isItemHover(hoverItemIndex, item, i, items)} />\\n            </div>\\n        </svelte:component>\\n    {:else}\\n        {#each items as item, i}\\n            {#if item.isGroupHeader && !item.isSelectable}\\n                <div class=\\"listGroupTitle\\">{getGroupHeaderLabel(item)}</div>\\n            {:else}\\n                <div\\n                    on:mouseover={() => handleHover(i)}\\n                    on:click={(event) => handleClick({ item, i, event })}\\n                    class=\\"listItem\\">\\n                    <svelte:component\\n                        this={Item}\\n                        {item}\\n                        {filterText}\\n                        {getOptionLabel}\\n                        isFirst={isItemFirst(i)}\\n                        isActive={isItemActive(item, value, optionIdentifier)}\\n                        isHover={isItemHover(hoverItemIndex, item, i, items)} />\\n                </div>\\n            {/if}\\n        {:else}\\n            {#if !hideEmptyState}\\n                <div class=\\"empty\\">{noOptionsMessage}</div>\\n            {/if}\\n        {/each}\\n    {/if}\\n</div>\\n"],"names":[],"mappings":"AA0OO,6BAAc,CAAC,WAAW,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,IAAI,CAAC,CAAC,cAAc,IAAI,kBAAkB,CAAC,GAAG,CAAC,CAAC,WAAW,IAAI,YAAY,CAAC,8BAA8B,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,WAAW,IAAI,eAAe,CAAC,KAAK,CAAC,CAAC,WAAW,IAAI,CAAC,SAAS,IAAI,cAAc,CAAC,QAAQ,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,QAAQ,IAAI,YAAY,CAAC,CAAC,CAAC,CAAC,2BAAY,CAAC,OAAO,IAAI,mBAAmB,CAAC,KAAK,CAAC,CAAC,8BAAe,CAAC,MAAM,IAAI,iBAAiB,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,UAAU,IAAI,oBAAoB,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,sBAAsB,CAAC,GAAG,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,cAAc,QAAQ,CAAC,eAAe,IAAI,yBAAyB,CAAC,SAAS,CAAC,CAAC,YAAY,MAAM,CAAC,qBAAM,CAAC,MAAM,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,kBAAkB,CAAC,MAAM,CAAC,CAAC,WAAW,IAAI,oBAAoB,CAAC,MAAM,CAAC,CAAC"}`
};
function isItemActive(item, value, optionIdentifier) {
  return value && value[optionIdentifier] === item[optionIdentifier];
}
function isItemFirst(itemIndex) {
  return itemIndex === 0;
}
function isItemHover(hoverItemIndex, item, itemIndex, items) {
  return hoverItemIndex === itemIndex || items.length === 1;
}
var List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { container = void 0 } = $$props;
  let { VirtualList: VirtualList2 = null } = $$props;
  let { Item: Item$1 = Item } = $$props;
  let { isVirtualList = false } = $$props;
  let { items = [] } = $$props;
  let { labelIdentifier = "label" } = $$props;
  let { getOptionLabel = (option, filterText2) => {
    if (option)
      return option.isCreator ? `Create "${filterText2}"` : option[labelIdentifier];
  } } = $$props;
  let { getGroupHeaderLabel = null } = $$props;
  let { itemHeight = 40 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { value = void 0 } = $$props;
  let { optionIdentifier = "value" } = $$props;
  let { hideEmptyState = false } = $$props;
  let { noOptionsMessage = "No options" } = $$props;
  let { isMulti = false } = $$props;
  let { activeItemIndex = 0 } = $$props;
  let { filterText = "" } = $$props;
  let { parent = null } = $$props;
  let { listPlacement = null } = $$props;
  let { listAutoWidth = null } = $$props;
  let { listOffset = 5 } = $$props;
  let isScrollingTimer = 0;
  let prev_items;
  onMount(() => {
    if (items.length > 0 && !isMulti && value) {
      const _hoverItemIndex = items.findIndex((item) => item[optionIdentifier] === value[optionIdentifier]);
      if (_hoverItemIndex) {
        hoverItemIndex = _hoverItemIndex;
      }
    }
    scrollToActiveItem("active");
    container.addEventListener("scroll", () => {
      clearTimeout(isScrollingTimer);
      isScrollingTimer = setTimeout(() => {
      }, 100);
    }, false);
  });
  beforeUpdate(() => {
    if (!items)
      items = [];
    if (items !== prev_items && items.length > 0) {
      hoverItemIndex = 0;
    }
    prev_items = items;
  });
  function scrollToActiveItem(className) {
    if (isVirtualList || !container)
      return;
    let offsetBounding;
    const focusedElemBounding = container.querySelector(`.listItem .${className}`);
    if (focusedElemBounding) {
      offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
    }
    container.scrollTop -= offsetBounding;
  }
  let listStyle;
  function computePlacement() {
    const { top, height, width } = parent.getBoundingClientRect();
    listStyle = "";
    listStyle += `min-width:${width}px;width:${listAutoWidth ? "auto" : "100%"};`;
    if (listPlacement === "top" || listPlacement === "auto" && isOutOfViewport(parent).bottom) {
      listStyle += `bottom:${height + listOffset}px;`;
    } else {
      listStyle += `top:${height + listOffset}px;`;
    }
  }
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.VirtualList === void 0 && $$bindings.VirtualList && VirtualList2 !== void 0)
    $$bindings.VirtualList(VirtualList2);
  if ($$props.Item === void 0 && $$bindings.Item && Item$1 !== void 0)
    $$bindings.Item(Item$1);
  if ($$props.isVirtualList === void 0 && $$bindings.isVirtualList && isVirtualList !== void 0)
    $$bindings.isVirtualList(isVirtualList);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.labelIdentifier === void 0 && $$bindings.labelIdentifier && labelIdentifier !== void 0)
    $$bindings.labelIdentifier(labelIdentifier);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.getGroupHeaderLabel === void 0 && $$bindings.getGroupHeaderLabel && getGroupHeaderLabel !== void 0)
    $$bindings.getGroupHeaderLabel(getGroupHeaderLabel);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.optionIdentifier === void 0 && $$bindings.optionIdentifier && optionIdentifier !== void 0)
    $$bindings.optionIdentifier(optionIdentifier);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.noOptionsMessage === void 0 && $$bindings.noOptionsMessage && noOptionsMessage !== void 0)
    $$bindings.noOptionsMessage(noOptionsMessage);
  if ($$props.isMulti === void 0 && $$bindings.isMulti && isMulti !== void 0)
    $$bindings.isMulti(isMulti);
  if ($$props.activeItemIndex === void 0 && $$bindings.activeItemIndex && activeItemIndex !== void 0)
    $$bindings.activeItemIndex(activeItemIndex);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  if ($$props.parent === void 0 && $$bindings.parent && parent !== void 0)
    $$bindings.parent(parent);
  if ($$props.listPlacement === void 0 && $$bindings.listPlacement && listPlacement !== void 0)
    $$bindings.listPlacement(listPlacement);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.listOffset === void 0 && $$bindings.listOffset && listOffset !== void 0)
    $$bindings.listOffset(listOffset);
  $$result.css.add(css$4);
  {
    {
      if (parent && container)
        computePlacement();
    }
  }
  return `

<div class="${["listContainer svelte-12ijemj", isVirtualList ? "virtualList" : ""].join(" ").trim()}"${add_attribute("style", listStyle, 0)} tabindex="${"-1"}"${add_attribute("this", container, 1)}>${isVirtualList ? `${validate_component(VirtualList2 || missing_component, "svelte:component").$$render($$result, { items, itemHeight }, {}, {
    default: ({ item, i }) => `<div class="${"listItem"}">${validate_component(Item$1 || missing_component, "svelte:component").$$render($$result, {
      item,
      filterText,
      getOptionLabel,
      isFirst: isItemFirst(i),
      isActive: isItemActive(item, value, optionIdentifier),
      isHover: isItemHover(hoverItemIndex, item, i, items)
    }, {}, {})}</div>`
  })}` : `${items.length ? each(items, (item, i) => `${item.isGroupHeader && !item.isSelectable ? `<div class="${"listGroupTitle svelte-12ijemj"}">${escape(getGroupHeaderLabel(item))}</div>` : `<div class="${"listItem"}">${validate_component(Item$1 || missing_component, "svelte:component").$$render($$result, {
    item,
    filterText,
    getOptionLabel,
    isFirst: isItemFirst(i),
    isActive: isItemActive(item, value, optionIdentifier),
    isHover: isItemHover(hoverItemIndex, item, i, items)
  }, {}, {})}
                </div>`}`) : `${!hideEmptyState ? `<div class="${"empty svelte-12ijemj"}">${escape(noOptionsMessage)}</div>` : ``}`}`}</div>`;
});
var css$3 = {
  code: ".selection.svelte-1tpioco{overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}",
  map: '{"version":3,"file":"Selection.svelte","sources":["Selection.svelte"],"sourcesContent":["<script>\\n    export let getSelectionLabel = undefined;\\n    export let item = undefined;\\n<\/script>\\n\\n<style>.selection{overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}</style>\\n\\n<div class=\\"selection\\">\\n    {@html getSelectionLabel(item)}\\n</div>\\n"],"names":[],"mappings":"AAKO,yBAAU,CAAC,WAAW,MAAM,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC"}'
};
var Selection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { getSelectionLabel = void 0 } = $$props;
  let { item = void 0 } = $$props;
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$3);
  return `<div class="${"selection svelte-1tpioco"}"><!-- HTML_TAG_START -->${getSelectionLabel(item)}<!-- HTML_TAG_END --></div>`;
});
var css$2 = {
  code: ".multiSelectItem.svelte-1oaubvy.svelte-1oaubvy{background:var(--multiItemBG,#ebedef);border-radius:var(--multiItemBorderRadius,16px);cursor:default;display:flex;height:var(--multiItemHeight,32px);line-height:var(--multiItemHeight,32px);margin:var(--multiItemMargin,5px 5px 0 0);max-width:100%;padding:var(--multiItemPadding,0 10px 0 15px)}.multiSelectItem_label.svelte-1oaubvy.svelte-1oaubvy{margin:var(--multiLabelMargin,0 5px 0 0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multiSelectItem.active.svelte-1oaubvy.svelte-1oaubvy,.multiSelectItem.svelte-1oaubvy.svelte-1oaubvy:hover{background-color:var(--multiItemActiveBG,#006fff);color:var(--multiItemActiveColor,#fff)}.multiSelectItem.disabled.svelte-1oaubvy.svelte-1oaubvy:hover{background:var(--multiItemDisabledHoverBg,#ebedef);color:var(--multiItemDisabledHoverColor,#c1c6cc)}.multiSelectItem_clear.svelte-1oaubvy.svelte-1oaubvy{background:var(--multiClearBG,#52616f);border-radius:var(--multiClearRadius,50%);height:var(--multiClearHeight,16px);max-width:var(--multiClearWidth,16px);min-width:var(--multiClearWidth,16px);padding:var(--multiClearPadding,1px);position:relative;text-align:var(--multiClearTextAlign,center);top:var(--multiClearTop,8px)}.active.svelte-1oaubvy .multiSelectItem_clear.svelte-1oaubvy,.multiSelectItem_clear.svelte-1oaubvy.svelte-1oaubvy:hover{background:var(--multiClearHoverBG,#fff)}.active.svelte-1oaubvy .multiSelectItem_clear svg.svelte-1oaubvy,.multiSelectItem_clear.svelte-1oaubvy:hover svg.svelte-1oaubvy{fill:var(--multiClearHoverFill,#006fff)}.multiSelectItem_clear.svelte-1oaubvy svg.svelte-1oaubvy{fill:var(--multiClearFill,#ebedef);vertical-align:top}",
  map: `{"version":3,"file":"MultiSelection.svelte","sources":["MultiSelection.svelte"],"sourcesContent":["<script>\\n    import { createEventDispatcher } from 'svelte';\\n\\n    const dispatch = createEventDispatcher();\\n\\n    export let value = [];\\n    export let activeValue = undefined;\\n    export let isDisabled = false;\\n    export let multiFullItemClearable = false;\\n    export let getSelectionLabel = undefined;\\n\\n    function handleClear(i, event) {\\n        event.stopPropagation();\\n        dispatch('multiItemClear', { i });\\n    }\\n<\/script>\\n\\n<style>.multiSelectItem{background:var(--multiItemBG,#ebedef);border-radius:var(--multiItemBorderRadius,16px);cursor:default;display:flex;height:var(--multiItemHeight,32px);line-height:var(--multiItemHeight,32px);margin:var(--multiItemMargin,5px 5px 0 0);max-width:100%;padding:var(--multiItemPadding,0 10px 0 15px)}.multiSelectItem_label{margin:var(--multiLabelMargin,0 5px 0 0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multiSelectItem.active,.multiSelectItem:hover{background-color:var(--multiItemActiveBG,#006fff);color:var(--multiItemActiveColor,#fff)}.multiSelectItem.disabled:hover{background:var(--multiItemDisabledHoverBg,#ebedef);color:var(--multiItemDisabledHoverColor,#c1c6cc)}.multiSelectItem_clear{background:var(--multiClearBG,#52616f);border-radius:var(--multiClearRadius,50%);height:var(--multiClearHeight,16px);max-width:var(--multiClearWidth,16px);min-width:var(--multiClearWidth,16px);padding:var(--multiClearPadding,1px);position:relative;text-align:var(--multiClearTextAlign,center);top:var(--multiClearTop,8px)}.active .multiSelectItem_clear,.multiSelectItem_clear:hover{background:var(--multiClearHoverBG,#fff)}.active .multiSelectItem_clear svg,.multiSelectItem_clear:hover svg{fill:var(--multiClearHoverFill,#006fff)}.multiSelectItem_clear svg{fill:var(--multiClearFill,#ebedef);vertical-align:top}</style>\\n\\n{#each value as value, i}\\n    <div\\n        class=\\"multiSelectItem {activeValue === i\\n            ? 'active'\\n            : ''} {isDisabled ? 'disabled' : ''}\\"\\n        on:click={(event) =>\\n            multiFullItemClearable ? handleClear(i, event) : {}}\\n    >\\n        <div class=\\"multiSelectItem_label\\">\\n            {@html getSelectionLabel(value)}\\n        </div>\\n        {#if !isDisabled && !multiFullItemClearable}\\n            <div\\n                class=\\"multiSelectItem_clear\\"\\n                on:click={(event) => handleClear(i, event)}\\n            >\\n                <svg\\n                    width=\\"100%\\"\\n                    height=\\"100%\\"\\n                    viewBox=\\"-2 -2 50 50\\"\\n                    focusable=\\"false\\"\\n                    role=\\"presentation\\"\\n                >\\n                    <path\\n                        d=\\"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z\\"\\n                    />\\n                </svg>\\n            </div>\\n        {/if}\\n    </div>\\n{/each}\\n"],"names":[],"mappings":"AAiBO,8CAAgB,CAAC,WAAW,IAAI,aAAa,CAAC,OAAO,CAAC,CAAC,cAAc,IAAI,uBAAuB,CAAC,IAAI,CAAC,CAAC,OAAO,OAAO,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,WAAW,CAAC,CAAC,UAAU,IAAI,CAAC,QAAQ,IAAI,kBAAkB,CAAC,aAAa,CAAC,CAAC,oDAAsB,CAAC,OAAO,IAAI,kBAAkB,CAAC,SAAS,CAAC,CAAC,SAAS,MAAM,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC,gBAAgB,qCAAO,CAAC,8CAAgB,MAAM,CAAC,iBAAiB,IAAI,mBAAmB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,sBAAsB,CAAC,IAAI,CAAC,CAAC,gBAAgB,uCAAS,MAAM,CAAC,WAAW,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,6BAA6B,CAAC,OAAO,CAAC,CAAC,oDAAsB,CAAC,WAAW,IAAI,cAAc,CAAC,OAAO,CAAC,CAAC,cAAc,IAAI,kBAAkB,CAAC,GAAG,CAAC,CAAC,OAAO,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,UAAU,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,UAAU,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,mBAAmB,CAAC,GAAG,CAAC,CAAC,SAAS,QAAQ,CAAC,WAAW,IAAI,qBAAqB,CAAC,MAAM,CAAC,CAAC,IAAI,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,sBAAO,CAAC,qCAAsB,CAAC,oDAAsB,MAAM,CAAC,WAAW,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,sBAAO,CAAC,sBAAsB,CAAC,kBAAG,CAAC,qCAAsB,MAAM,CAAC,kBAAG,CAAC,KAAK,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,qCAAsB,CAAC,kBAAG,CAAC,KAAK,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,eAAe,GAAG,CAAC"}`
};
var MultiSelection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { value = [] } = $$props;
  let { activeValue = void 0 } = $$props;
  let { isDisabled = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { getSelectionLabel = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.activeValue === void 0 && $$bindings.activeValue && activeValue !== void 0)
    $$bindings.activeValue(activeValue);
  if ($$props.isDisabled === void 0 && $$bindings.isDisabled && isDisabled !== void 0)
    $$bindings.isDisabled(isDisabled);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  $$result.css.add(css$2);
  return `${each(value, (value2, i) => `<div class="${"multiSelectItem " + escape(activeValue === i ? "active" : "") + " " + escape(isDisabled ? "disabled" : "") + " svelte-1oaubvy"}"><div class="${"multiSelectItem_label svelte-1oaubvy"}"><!-- HTML_TAG_START -->${getSelectionLabel(value2)}<!-- HTML_TAG_END --></div>
        ${!isDisabled && !multiFullItemClearable ? `<div class="${"multiSelectItem_clear svelte-1oaubvy"}"><svg width="${"100%"}" height="${"100%"}" viewBox="${"-2 -2 50 50"}" focusable="${"false"}" role="${"presentation"}" class="${"svelte-1oaubvy"}"><path d="${"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"}"></path></svg>
            </div>` : ``}
    </div>`)}`;
});
var css$1 = {
  code: "svelte-virtual-list-viewport.svelte-1kdxoed{-webkit-overflow-scrolling:touch;display:block;overflow-y:auto;position:relative}svelte-virtual-list-contents.svelte-1kdxoed,svelte-virtual-list-row.svelte-1kdxoed{display:block}svelte-virtual-list-row.svelte-1kdxoed{overflow:hidden}",
  map: `{"version":3,"file":"VirtualList.svelte","sources":["VirtualList.svelte"],"sourcesContent":["<script>\\n    import { onMount, tick } from 'svelte';\\n\\n    export let items = undefined;\\n    export let height = '100%';\\n    export let itemHeight = 40;\\n    export let hoverItemIndex = 0;\\n    export let start = 0;\\n    export let end = 0;\\n\\n    let height_map = [];\\n    let rows;\\n    let viewport;\\n    let contents;\\n    let viewport_height = 0;\\n    let visible;\\n    let mounted;\\n\\n    let top = 0;\\n    let bottom = 0;\\n    let average_height;\\n\\n    $: visible = items.slice(start, end).map((data, i) => {\\n        return { index: i + start, data };\\n    });\\n\\n    $: if (mounted) refresh(items, viewport_height, itemHeight);\\n\\n    async function refresh(items, viewport_height, itemHeight) {\\n        const { scrollTop } = viewport;\\n\\n        await tick();\\n\\n        let content_height = top - scrollTop;\\n        let i = start;\\n\\n        while (content_height < viewport_height && i < items.length) {\\n            let row = rows[i - start];\\n\\n            if (!row) {\\n                end = i + 1;\\n                await tick();\\n                row = rows[i - start];\\n            }\\n\\n            const row_height = (height_map[i] = itemHeight || row.offsetHeight);\\n            content_height += row_height;\\n            i += 1;\\n        }\\n\\n        end = i;\\n\\n        const remaining = items.length - end;\\n        average_height = (top + content_height) / end;\\n\\n        bottom = remaining * average_height;\\n        height_map.length = items.length;\\n\\n        if (viewport) viewport.scrollTop = 0;\\n    }\\n\\n    async function handle_scroll() {\\n        const { scrollTop } = viewport;\\n\\n        const old_start = start;\\n\\n        for (let v = 0; v < rows.length; v += 1) {\\n            height_map[start + v] = itemHeight || rows[v].offsetHeight;\\n        }\\n\\n        let i = 0;\\n        let y = 0;\\n\\n        while (i < items.length) {\\n            const row_height = height_map[i] || average_height;\\n            if (y + row_height > scrollTop) {\\n                start = i;\\n                top = y;\\n\\n                break;\\n            }\\n\\n            y += row_height;\\n            i += 1;\\n        }\\n\\n        while (i < items.length) {\\n            y += height_map[i] || average_height;\\n            i += 1;\\n\\n            if (y > scrollTop + viewport_height) break;\\n        }\\n\\n        end = i;\\n\\n        const remaining = items.length - end;\\n        average_height = y / end;\\n\\n        while (i < items.length) height_map[i++] = average_height;\\n        bottom = remaining * average_height;\\n\\n        if (start < old_start) {\\n            await tick();\\n\\n            let expected_height = 0;\\n            let actual_height = 0;\\n\\n            for (let i = start; i < old_start; i += 1) {\\n                if (rows[i - start]) {\\n                    expected_height += height_map[i];\\n                    actual_height += itemHeight || rows[i - start].offsetHeight;\\n                }\\n            }\\n\\n            const d = actual_height - expected_height;\\n            viewport.scrollTo(0, scrollTop + d);\\n        }\\n    }\\n\\n    onMount(() => {\\n        rows = contents.getElementsByTagName('svelte-virtual-list-row');\\n        mounted = true;\\n    });\\n<\/script>\\n\\n<style>svelte-virtual-list-viewport{-webkit-overflow-scrolling:touch;display:block;overflow-y:auto;position:relative}svelte-virtual-list-contents,svelte-virtual-list-row{display:block}svelte-virtual-list-row{overflow:hidden}</style>\\n\\n<svelte-virtual-list-viewport\\n    bind:this={viewport}\\n    bind:offsetHeight={viewport_height}\\n    on:scroll={handle_scroll}\\n    style=\\"height: {height};\\">\\n    <svelte-virtual-list-contents\\n        bind:this={contents}\\n        style=\\"padding-top: {top}px; padding-bottom: {bottom}px;\\">\\n        {#each visible as row (row.index)}\\n            <svelte-virtual-list-row>\\n                <slot item={row.data} i={row.index} {hoverItemIndex}>Missing template</slot>\\n            </svelte-virtual-list-row>\\n        {/each}\\n    </svelte-virtual-list-contents>\\n</svelte-virtual-list-viewport>\\n"],"names":[],"mappings":"AA6HO,2CAA4B,CAAC,2BAA2B,KAAK,CAAC,QAAQ,KAAK,CAAC,WAAW,IAAI,CAAC,SAAS,QAAQ,CAAC,2CAA4B,CAAC,sCAAuB,CAAC,QAAQ,KAAK,CAAC,sCAAuB,CAAC,SAAS,MAAM,CAAC"}`
};
var VirtualList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items = void 0 } = $$props;
  let { height = "100%" } = $$props;
  let { itemHeight = 40 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { start = 0 } = $$props;
  let { end = 0 } = $$props;
  let height_map = [];
  let rows;
  let viewport;
  let contents;
  let viewport_height = 0;
  let visible;
  let mounted;
  let top = 0;
  let bottom = 0;
  let average_height;
  async function refresh(items2, viewport_height2, itemHeight2) {
    const { scrollTop } = viewport;
    await tick();
    let content_height = top - scrollTop;
    let i = start;
    while (content_height < viewport_height2 && i < items2.length) {
      let row = rows[i - start];
      if (!row) {
        end = i + 1;
        await tick();
        row = rows[i - start];
      }
      const row_height = height_map[i] = itemHeight2 || row.offsetHeight;
      content_height += row_height;
      i += 1;
    }
    end = i;
    const remaining = items2.length - end;
    average_height = (top + content_height) / end;
    bottom = remaining * average_height;
    height_map.length = items2.length;
  }
  onMount(() => {
    rows = contents.getElementsByTagName("svelte-virtual-list-row");
    mounted = true;
  });
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.start === void 0 && $$bindings.start && start !== void 0)
    $$bindings.start(start);
  if ($$props.end === void 0 && $$bindings.end && end !== void 0)
    $$bindings.end(end);
  $$result.css.add(css$1);
  visible = items.slice(start, end).map((data, i) => {
    return { index: i + start, data };
  });
  {
    if (mounted)
      refresh(items, viewport_height, itemHeight);
  }
  return `<svelte-virtual-list-viewport style="${"height: " + escape(height) + ";"}" class="${"svelte-1kdxoed"}"${add_attribute("this", viewport, 1)}><svelte-virtual-list-contents style="${"padding-top: " + escape(top) + "px; padding-bottom: " + escape(bottom) + "px;"}" class="${"svelte-1kdxoed"}"${add_attribute("this", contents, 1)}>${each(visible, (row) => `<svelte-virtual-list-row class="${"svelte-1kdxoed"}">${slots.default ? slots.default({
    item: row.data,
    i: row.index,
    hoverItemIndex
  }) : `Missing template`}
            </svelte-virtual-list-row>`)}</svelte-virtual-list-contents></svelte-virtual-list-viewport>`;
});
var ClearIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="${"100%"}" height="${"100%"}" viewBox="${"-2 -2 50 50"}" focusable="${"false"}" role="${"presentation"}"><path fill="${"currentColor"}" d="${"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"}"></path></svg>`;
});
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    let context = this;
    let args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  };
}
var { Object: Object_1 } = globals;
var css = {
  code: ".selectContainer.svelte-3uafxb.svelte-3uafxb{--padding:0 16px;align-items:center;background:var(--background,#fff);border:var(--border,1px solid #d8dbdf);border-radius:var(--borderRadius,3px);box-sizing:border-box;display:flex;height:var(--height,42px);margin:var(--margin,0);padding:var(--padding);position:relative}.selectContainer.svelte-3uafxb input.svelte-3uafxb{background:transparent;border:none;color:var(--inputColor,#3f4f5f);cursor:default;font-size:var(--inputFontSize,14px);height:var(--height,42px);left:var(--inputLeft,0);letter-spacing:var(--inputLetterSpacing,-.08px);line-height:var(--height,42px);margin:var(--inputMargin,0);padding:var(--inputPadding,var(--padding));position:absolute;width:100%}.selectContainer.svelte-3uafxb input.svelte-3uafxb::-moz-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-3uafxb input.svelte-3uafxb:-ms-input-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-3uafxb input.svelte-3uafxb::placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-3uafxb input.svelte-3uafxb:focus{outline:none}.selectContainer.svelte-3uafxb.svelte-3uafxb:hover{border-color:var(--borderHoverColor,#b2b8bf)}.selectContainer.focused.svelte-3uafxb.svelte-3uafxb{border-color:var(--borderFocusColor,#006fe8)}.selectContainer.disabled.svelte-3uafxb.svelte-3uafxb{background:var(--disabledBackground,#ebedef);border-color:var(--disabledBorderColor,#ebedef);color:var(--disabledColor,#c1c6cc)}.selectContainer.disabled.svelte-3uafxb input.svelte-3uafxb::-moz-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled.svelte-3uafxb input.svelte-3uafxb:-ms-input-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled.svelte-3uafxb input.svelte-3uafxb::placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectedItem.svelte-3uafxb.svelte-3uafxb{height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--selectedItemPadding,0 20px 0 0)}.selectedItem.svelte-3uafxb.svelte-3uafxb:focus{outline:none}.clearSelect.svelte-3uafxb.svelte-3uafxb{bottom:var(--clearSelectBottom,11px);color:var(--clearSelectColor,#c5cacf);flex:none!important;position:absolute;right:var(--clearSelectRight,10px);top:var(--clearSelectTop,11px);width:var(--clearSelectWidth,20px)}.clearSelect.svelte-3uafxb.svelte-3uafxb:hover{color:var(--clearSelectHoverColor,#2c3e50)}.selectContainer.focused.svelte-3uafxb .clearSelect.svelte-3uafxb{color:var(--clearSelectFocusColor,#3f4f5f)}.indicator.svelte-3uafxb.svelte-3uafxb{color:var(--indicatorColor,#c5cacf);height:var(--indicatorHeight,20px);position:absolute;right:var(--indicatorRight,10px);top:var(--indicatorTop,11px);width:var(--indicatorWidth,20px)}.indicator.svelte-3uafxb svg.svelte-3uafxb{fill:var(--indicatorFill,currentcolor);stroke:var(--indicatorStroke,currentcolor);stroke-width:0;display:inline-block;line-height:1}.spinner.svelte-3uafxb.svelte-3uafxb{-webkit-animation:svelte-3uafxb-rotate .75s linear infinite;animation:svelte-3uafxb-rotate .75s linear infinite;color:var(--spinnerColor,#51ce6c);height:var(--spinnerHeight,20px);position:absolute;right:var(--spinnerRight,10px);top:var(--spinnerLeft,11px);width:var(--spinnerWidth,20px)}.spinner_icon.svelte-3uafxb.svelte-3uafxb{bottom:0;display:block;height:100%;left:0;margin:auto;position:absolute;right:0;top:0;-webkit-transform:none;transform-origin:center center;width:100%}.spinner_path.svelte-3uafxb.svelte-3uafxb{stroke-dasharray:90;stroke-linecap:round}.multiSelect.svelte-3uafxb.svelte-3uafxb{align-items:stretch;display:flex;flex-wrap:wrap;height:auto;padding:var(--multiSelectPadding,0 35px 0 16px)}.multiSelect.svelte-3uafxb>.svelte-3uafxb{flex:1 1 50px}.selectContainer.multiSelect.svelte-3uafxb input.svelte-3uafxb{margin:var(--multiSelectInputMargin,0);padding:var(--multiSelectInputPadding,0);position:relative}.hasError.svelte-3uafxb.svelte-3uafxb{background:var(--errorBackground,#fff);border:var(--errorBorder,1px solid #ff2d55)}@-webkit-keyframes svelte-3uafxb-rotate{to{transform:rotate(1turn)}}@keyframes svelte-3uafxb-rotate{to{transform:rotate(1turn)}}",
  map: `{"version":3,"file":"Select.svelte","sources":["Select.svelte"],"sourcesContent":["<script>\\n    import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';\\n\\n    import _List from './List.svelte';\\n    import _Item from './Item.svelte';\\n    import _Selection from './Selection.svelte';\\n    import _MultiSelection from './MultiSelection.svelte';\\n    import _VirtualList from './VirtualList.svelte';\\n    import _ClearIcon from './ClearIcon.svelte';\\n    import debounce from './utils/debounce';\\n\\n    const dispatch = createEventDispatcher();\\n\\n    export let container = undefined;\\n    export let input = undefined;\\n    export let isMulti = false;\\n    export let multiFullItemClearable = false;\\n    export let isDisabled = false;\\n    export let isCreatable = false;\\n    export let isFocused = false;\\n    export let value = undefined;\\n    export let filterText = '';\\n    export let placeholder = 'Select...';\\n    export let placeholderAlwaysShow = false;\\n    export let items = null;\\n    export let itemFilter = (label, filterText, option) =>\\n        \`\${label}\`.toLowerCase().includes(filterText.toLowerCase());\\n    export let groupBy = undefined;\\n    export let groupFilter = (groups) => groups;\\n    export let isGroupHeaderSelectable = false;\\n    export let getGroupHeaderLabel = (option) => {\\n        return option[labelIdentifier] || option.id;\\n    };\\n    export let labelIdentifier = 'label';\\n    export let getOptionLabel = (option, filterText) => {\\n        return option.isCreator\\n            ? \`Create \\\\\\"\${filterText}\\\\\\"\`\\n            : option[labelIdentifier];\\n    };\\n    export let optionIdentifier = 'value';\\n    export let loadOptions = undefined;\\n    export let hasError = false;\\n    export let containerStyles = '';\\n    export let getSelectionLabel = (option) => {\\n        if (option) return option[labelIdentifier];\\n    };\\n\\n    export let createGroupHeaderItem = (groupValue) => {\\n        return {\\n            value: groupValue,\\n            label: groupValue,\\n        };\\n    };\\n\\n    export let createItem = (filterText) => {\\n        return {\\n            value: filterText,\\n            label: filterText,\\n        };\\n    };\\n\\n    export const getFilteredItems = () => {\\n        return filteredItems;\\n    };\\n\\n    export let isSearchable = true;\\n    export let inputStyles = '';\\n    export let isClearable = true;\\n    export let isWaiting = false;\\n    export let listPlacement = 'auto';\\n    export let listOpen = false;\\n    export let isVirtualList = false;\\n    export let loadOptionsInterval = 300;\\n    export let noOptionsMessage = 'No options';\\n    export let hideEmptyState = false;\\n    export let inputAttributes = {};\\n    export let listAutoWidth = true;\\n    export let itemHeight = 40;\\n    export let Icon = undefined;\\n    export let iconProps = {};\\n    export let showChevron = false;\\n    export let showIndicator = false;\\n    export let containerClasses = '';\\n    export let indicatorSvg = undefined;\\n    export let listOffset = 5;\\n\\n    export let ClearIcon = _ClearIcon;\\n    export let Item = _Item;\\n    export let List = _List;\\n    export let Selection = _Selection;\\n    export let MultiSelection = _MultiSelection;\\n    export let VirtualList = _VirtualList;\\n\\n    function filterMethod(args) {\\n        if (args.loadOptions && args.filterText.length > 0) return;\\n        if (!args.items) return [];\\n\\n        if (\\n            args.items &&\\n            args.items.length > 0 &&\\n            typeof args.items[0] !== 'object'\\n        ) {\\n            args.items = convertStringItemsToObjects(args.items);\\n        }\\n\\n        let filterResults = args.items.filter((item) => {\\n            let matchesFilter = itemFilter(\\n                getOptionLabel(item, args.filterText),\\n                args.filterText,\\n                item\\n            );\\n\\n            if (\\n                matchesFilter &&\\n                args.isMulti &&\\n                args.value &&\\n                Array.isArray(args.value)\\n            ) {\\n                matchesFilter = !args.value.some((x) => {\\n                    return (\\n                        x[args.optionIdentifier] === item[args.optionIdentifier]\\n                    );\\n                });\\n            }\\n\\n            return matchesFilter;\\n        });\\n\\n        if (args.groupBy) {\\n            filterResults = filterGroupedItems(filterResults);\\n        }\\n\\n        if (args.isCreatable && filterResults.length === 0) {\\n            filterResults = addCreatableItem(filterResults, args.filterText);\\n        }\\n\\n        return filterResults;\\n    }\\n\\n    function addCreatableItem(_items, _filterText) {\\n        const itemToCreate = createItem(_filterText);\\n        itemToCreate.isCreator = true;\\n\\n        return [..._items, itemToCreate];\\n    }\\n\\n    $: filteredItems = filterMethod({\\n        loadOptions,\\n        filterText,\\n        items,\\n        value,\\n        isMulti,\\n        optionIdentifier,\\n        groupBy,\\n        isCreatable,\\n    });\\n\\n    export let selectedValue = null;\\n    $: {\\n        if (selectedValue)\\n            console.warn(\\n                'selectedValue is no longer used. Please use value instead.'\\n            );\\n    }\\n\\n    let activeValue;\\n    let prev_value;\\n    let prev_filterText;\\n    let prev_isFocused;\\n    let prev_isMulti;\\n\\n    const getItems = debounce(async () => {\\n        isWaiting = true;\\n        let res = await loadOptions(filterText).catch((err) => {\\n            console.warn('svelte-select loadOptions error :>> ', err);\\n            dispatch('error', { type: 'loadOptions', details: err });\\n        });\\n\\n        if (res && !res.cancelled) {\\n            if (res) {\\n                if (res && res.length > 0 && typeof res[0] !== 'object') {\\n                    res = convertStringItemsToObjects(res);\\n                }\\n                filteredItems = [...res];\\n                dispatch('loaded', { items: filteredItems });\\n            } else {\\n                filteredItems = [];\\n            }\\n\\n            if (filteredItems.length === 0 && isCreatable) {\\n                filteredItems = addCreatableItem(filteredItems, filterText);\\n            }\\n\\n            isWaiting = false;\\n            isFocused = true;\\n            listOpen = true;\\n        }\\n    }, loadOptionsInterval);\\n\\n    $: updateValueDisplay(items);\\n\\n    function setValue() {\\n        if (typeof value === 'string') {\\n            value = {\\n                [optionIdentifier]: value,\\n                label: value,\\n            };\\n        } else if (isMulti && Array.isArray(value) && value.length > 0) {\\n            value = value.map((item) =>\\n                typeof item === 'string' ? { value: item, label: item } : item\\n            );\\n        }\\n\\n        if (prev_filterText && !loadOptions) {\\n            filterText = '';\\n        }\\n    }\\n\\n    let _inputAttributes;\\n    function assignInputAttributes() {\\n        _inputAttributes = Object.assign(\\n            {\\n                autocomplete: 'off',\\n                autocorrect: 'off',\\n                spellcheck: false,\\n            },\\n            inputAttributes\\n        );\\n\\n        if (!isSearchable) {\\n            _inputAttributes.readonly = true;\\n        }\\n    }\\n\\n    function convertStringItemsToObjects(_items) {\\n        return _items.map((item, index) => {\\n            return {\\n                index,\\n                value: item,\\n                label: \`\${item}\`,\\n            };\\n        });\\n    }\\n\\n    function filterGroupedItems(_items) {\\n        const groupValues = [];\\n        const groups = {};\\n\\n        _items.forEach((item) => {\\n            const groupValue = groupBy(item);\\n\\n            if (!groupValues.includes(groupValue)) {\\n                groupValues.push(groupValue);\\n                groups[groupValue] = [];\\n\\n                if (groupValue) {\\n                    groups[groupValue].push(\\n                        Object.assign(createGroupHeaderItem(groupValue, item), {\\n                            id: groupValue,\\n                            isGroupHeader: true,\\n                            isSelectable: isGroupHeaderSelectable,\\n                        })\\n                    );\\n                }\\n            }\\n\\n            groups[groupValue].push(\\n                Object.assign({ isGroupItem: !!groupValue }, item)\\n            );\\n        });\\n\\n        const sortedGroupedItems = [];\\n\\n        groupFilter(groupValues).forEach((groupValue) => {\\n            sortedGroupedItems.push(...groups[groupValue]);\\n        });\\n\\n        return sortedGroupedItems;\\n    }\\n\\n    function dispatchSelectedItem() {\\n        if (isMulti) {\\n            if (JSON.stringify(value) !== JSON.stringify(prev_value)) {\\n                if (checkValueForDuplicates()) {\\n                    dispatch('select', value);\\n                }\\n            }\\n            return;\\n        }\\n\\n        if (\\n            !prev_value ||\\n            JSON.stringify(value[optionIdentifier]) !==\\n                JSON.stringify(prev_value[optionIdentifier])\\n        ) {\\n            dispatch('select', value);\\n        }\\n    }\\n\\n    function setupFocus() {\\n        if (isFocused || listOpen) {\\n            handleFocus();\\n        } else {\\n            if (input) input.blur();\\n        }\\n    }\\n\\n    function setupMulti() {\\n        if (value) {\\n            if (Array.isArray(value)) {\\n                value = [...value];\\n            } else {\\n                value = [value];\\n            }\\n        }\\n    }\\n\\n    function setupSingle() {\\n        if (value) value = null;\\n    }\\n\\n    $: {\\n        if (value) setValue();\\n    }\\n\\n    $: {\\n        if (inputAttributes || !isSearchable) assignInputAttributes();\\n    }\\n\\n    $: {\\n        if (isMulti) {\\n            setupMulti();\\n        }\\n\\n        if (prev_isMulti && !isMulti) {\\n            setupSingle();\\n        }\\n    }\\n\\n    $: {\\n        if (isMulti && value && value.length > 1) {\\n            checkValueForDuplicates();\\n        }\\n    }\\n\\n    $: {\\n        if (value) dispatchSelectedItem();\\n    }\\n\\n    $: {\\n        if (!value && isMulti && prev_value) {\\n            dispatch('select', value);\\n        }\\n    }\\n\\n    $: {\\n        if (isFocused !== prev_isFocused) {\\n            setupFocus();\\n        }\\n    }\\n\\n    $: {\\n        if (filterText !== prev_filterText) {\\n            setupFilterText();\\n        }\\n    }\\n\\n    function setupFilterText() {\\n        if (filterText.length === 0) return;\\n\\n        isFocused = true;\\n        listOpen = true;\\n\\n        if (loadOptions) {\\n            getItems();\\n        } else {\\n            listOpen = true;\\n\\n            if (isMulti) {\\n                activeValue = undefined;\\n            }\\n        }\\n    }\\n\\n    $: showSelectedItem = value && filterText.length === 0;\\n    $: showClearIcon =\\n        showSelectedItem && isClearable && !isDisabled && !isWaiting;\\n    $: placeholderText =\\n        placeholderAlwaysShow && isMulti\\n            ? placeholder\\n            : value\\n            ? ''\\n            : placeholder;\\n\\n    beforeUpdate(async () => {\\n        prev_value = value;\\n        prev_filterText = filterText;\\n        prev_isFocused = isFocused;\\n        prev_isMulti = isMulti;\\n    });\\n\\n    function checkValueForDuplicates() {\\n        let noDuplicates = true;\\n        if (value) {\\n            const ids = [];\\n            const uniqueValues = [];\\n\\n            value.forEach((val) => {\\n                if (!ids.includes(val[optionIdentifier])) {\\n                    ids.push(val[optionIdentifier]);\\n                    uniqueValues.push(val);\\n                } else {\\n                    noDuplicates = false;\\n                }\\n            });\\n\\n            if (!noDuplicates) value = uniqueValues;\\n        }\\n        return noDuplicates;\\n    }\\n\\n    function findItem(selection) {\\n        let matchTo = selection\\n            ? selection[optionIdentifier]\\n            : value[optionIdentifier];\\n        return items.find((item) => item[optionIdentifier] === matchTo);\\n    }\\n\\n    function updateValueDisplay(items) {\\n        if (\\n            !items ||\\n            items.length === 0 ||\\n            items.some((item) => typeof item !== 'object')\\n        )\\n            return;\\n        if (\\n            !value ||\\n            (isMulti\\n                ? value.some(\\n                      (selection) => !selection || !selection[optionIdentifier]\\n                  )\\n                : !value[optionIdentifier])\\n        )\\n            return;\\n\\n        if (Array.isArray(value)) {\\n            value = value.map((selection) => findItem(selection) || selection);\\n        } else {\\n            value = findItem() || value;\\n        }\\n    }\\n\\n    function handleMultiItemClear(event) {\\n        const { detail } = event;\\n        const itemToRemove = value[detail ? detail.i : value.length - 1];\\n\\n        if (value.length === 1) {\\n            value = undefined;\\n        } else {\\n            value = value.filter((item) => {\\n                return item !== itemToRemove;\\n            });\\n        }\\n\\n        dispatch('clear', itemToRemove);\\n    }\\n\\n    function handleKeyDown(e) {\\n        if (!isFocused) return;\\n\\n        switch (e.key) {\\n            case 'ArrowDown':\\n                e.preventDefault();\\n                listOpen = true;\\n                activeValue = undefined;\\n                break;\\n            case 'ArrowUp':\\n                e.preventDefault();\\n                listOpen = true;\\n                activeValue = undefined;\\n                break;\\n            case 'Tab':\\n                if (!listOpen) isFocused = false;\\n                break;\\n            case 'Backspace':\\n                if (!isMulti || filterText.length > 0) return;\\n                if (isMulti && value && value.length > 0) {\\n                    handleMultiItemClear(\\n                        activeValue !== undefined\\n                            ? activeValue\\n                            : value.length - 1\\n                    );\\n                    if (activeValue === 0 || activeValue === undefined) break;\\n                    activeValue =\\n                        value.length > activeValue\\n                            ? activeValue - 1\\n                            : undefined;\\n                }\\n                break;\\n            case 'ArrowLeft':\\n                if (!isMulti || filterText.length > 0) return;\\n                if (activeValue === undefined) {\\n                    activeValue = value.length - 1;\\n                } else if (value.length > activeValue && activeValue !== 0) {\\n                    activeValue -= 1;\\n                }\\n                break;\\n            case 'ArrowRight':\\n                if (\\n                    !isMulti ||\\n                    filterText.length > 0 ||\\n                    activeValue === undefined\\n                )\\n                    return;\\n                if (activeValue === value.length - 1) {\\n                    activeValue = undefined;\\n                } else if (activeValue < value.length - 1) {\\n                    activeValue += 1;\\n                }\\n                break;\\n        }\\n    }\\n\\n    function handleFocus() {\\n        isFocused = true;\\n        if (input) input.focus();\\n    }\\n\\n    function handleWindowEvent(event) {\\n        if (!container) return;\\n        const eventTarget =\\n            event.path && event.path.length > 0 ? event.path[0] : event.target;\\n        if (container.contains(eventTarget)) return;\\n        isFocused = false;\\n        listOpen = false;\\n        activeValue = undefined;\\n        if (input) input.blur();\\n    }\\n\\n    function handleClick() {\\n        if (isDisabled) return;\\n        isFocused = true;\\n        listOpen = !listOpen;\\n    }\\n\\n    export function handleClear() {\\n        value = undefined;\\n        listOpen = false;\\n        dispatch('clear', value);\\n        handleFocus();\\n    }\\n\\n    onMount(() => {\\n        if (isFocused && input) input.focus();\\n    });\\n\\n    $: listProps = {\\n        Item,\\n        filterText,\\n        optionIdentifier,\\n        noOptionsMessage,\\n        hideEmptyState,\\n        isVirtualList,\\n        VirtualList,\\n        value,\\n        isMulti,\\n        getGroupHeaderLabel,\\n        items: filteredItems,\\n        itemHeight,\\n        getOptionLabel,\\n        listPlacement,\\n        parent: container,\\n        listAutoWidth,\\n        listOffset,\\n    };\\n\\n    function itemSelected(event) {\\n        const { detail } = event;\\n\\n        if (detail) {\\n            filterText = '';\\n            const item = Object.assign({}, detail);\\n\\n            if (!item.isGroupHeader || item.isSelectable) {\\n                if (isMulti) {\\n                    value = value ? value.concat([item]) : [item];\\n                } else {\\n                    value = item;\\n                }\\n\\n                value = value;\\n\\n                setTimeout(() => {\\n                    listOpen = false;\\n                    activeValue = undefined;\\n                });\\n            }\\n        }\\n    }\\n\\n    function itemCreated(event) {\\n        const { detail } = event;\\n        if (isMulti) {\\n            value = value || [];\\n            value = [...value, createItem(detail)];\\n        } else {\\n            value = createItem(detail);\\n        }\\n\\n        dispatch('itemCreated', detail);\\n        filterText = '';\\n        listOpen = false;\\n        activeValue = undefined;\\n    }\\n\\n    function closeList() {\\n        filterText = '';\\n        listOpen = false;\\n    }\\n<\/script>\\n\\n<style>.selectContainer{--padding:0 16px;align-items:center;background:var(--background,#fff);border:var(--border,1px solid #d8dbdf);border-radius:var(--borderRadius,3px);box-sizing:border-box;display:flex;height:var(--height,42px);margin:var(--margin,0);padding:var(--padding);position:relative}.selectContainer input{background:transparent;border:none;color:var(--inputColor,#3f4f5f);cursor:default;font-size:var(--inputFontSize,14px);height:var(--height,42px);left:var(--inputLeft,0);letter-spacing:var(--inputLetterSpacing,-.08px);line-height:var(--height,42px);margin:var(--inputMargin,0);padding:var(--inputPadding,var(--padding));position:absolute;width:100%}.selectContainer input::-moz-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input:-ms-input-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input::placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input:focus{outline:none}.selectContainer:hover{border-color:var(--borderHoverColor,#b2b8bf)}.selectContainer.focused{border-color:var(--borderFocusColor,#006fe8)}.selectContainer.disabled{background:var(--disabledBackground,#ebedef);border-color:var(--disabledBorderColor,#ebedef);color:var(--disabledColor,#c1c6cc)}.selectContainer.disabled input::-moz-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled input:-ms-input-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled input::placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectedItem{height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--selectedItemPadding,0 20px 0 0)}.selectedItem:focus{outline:none}.clearSelect{bottom:var(--clearSelectBottom,11px);color:var(--clearSelectColor,#c5cacf);flex:none!important;position:absolute;right:var(--clearSelectRight,10px);top:var(--clearSelectTop,11px);width:var(--clearSelectWidth,20px)}.clearSelect:hover{color:var(--clearSelectHoverColor,#2c3e50)}.selectContainer.focused .clearSelect{color:var(--clearSelectFocusColor,#3f4f5f)}.indicator{color:var(--indicatorColor,#c5cacf);height:var(--indicatorHeight,20px);position:absolute;right:var(--indicatorRight,10px);top:var(--indicatorTop,11px);width:var(--indicatorWidth,20px)}.indicator svg{fill:var(--indicatorFill,currentcolor);stroke:var(--indicatorStroke,currentcolor);stroke-width:0;display:inline-block;line-height:1}.spinner{-webkit-animation:rotate .75s linear infinite;animation:rotate .75s linear infinite;color:var(--spinnerColor,#51ce6c);height:var(--spinnerHeight,20px);position:absolute;right:var(--spinnerRight,10px);top:var(--spinnerLeft,11px);width:var(--spinnerWidth,20px)}.spinner_icon{bottom:0;display:block;height:100%;left:0;margin:auto;position:absolute;right:0;top:0;-webkit-transform:none;transform-origin:center center;width:100%}.spinner_path{stroke-dasharray:90;stroke-linecap:round}.multiSelect{align-items:stretch;display:flex;flex-wrap:wrap;height:auto;padding:var(--multiSelectPadding,0 35px 0 16px)}.multiSelect>*{flex:1 1 50px}.selectContainer.multiSelect input{margin:var(--multiSelectInputMargin,0);padding:var(--multiSelectInputPadding,0);position:relative}.hasError{background:var(--errorBackground,#fff);border:var(--errorBorder,1px solid #ff2d55)}@-webkit-keyframes rotate{to{transform:rotate(1turn)}}@keyframes rotate{to{transform:rotate(1turn)}}</style>\\n\\n<svelte:window\\n    on:click={handleWindowEvent}\\n    on:focusin={handleWindowEvent}\\n    on:keydown={handleKeyDown} />\\n\\n<div\\n    class=\\"selectContainer {containerClasses}\\"\\n    class:hasError\\n    class:multiSelect={isMulti}\\n    class:disabled={isDisabled}\\n    class:focused={isFocused}\\n    style={containerStyles}\\n    on:click={handleClick}\\n    bind:this={container}>\\n    {#if Icon}\\n        <svelte:component this={Icon} {...iconProps} />\\n    {/if}\\n\\n    {#if isMulti && value && value.length > 0}\\n        <svelte:component\\n            this={MultiSelection}\\n            {value}\\n            {getSelectionLabel}\\n            {activeValue}\\n            {isDisabled}\\n            {multiFullItemClearable}\\n            on:multiItemClear={handleMultiItemClear}\\n            on:focus={handleFocus} />\\n    {/if}\\n\\n    <input\\n        readOnly={!isSearchable}\\n        {..._inputAttributes}\\n        bind:this={input}\\n        on:focus={handleFocus}\\n        bind:value={filterText}\\n        placeholder={placeholderText}\\n        style={inputStyles}\\n        disabled={isDisabled} />\\n\\n    {#if !isMulti && showSelectedItem}\\n        <div class=\\"selectedItem\\" on:focus={handleFocus}>\\n            <svelte:component\\n                this={Selection}\\n                item={value}\\n                {getSelectionLabel} />\\n        </div>\\n    {/if}\\n\\n    {#if showClearIcon}\\n        <div class=\\"clearSelect\\" on:click|preventDefault={handleClear}>\\n            <svelte:component this={ClearIcon} />\\n        </div>\\n    {/if}\\n\\n    {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}\\n        <div class=\\"indicator\\">\\n            {#if indicatorSvg}\\n                {@html indicatorSvg}\\n            {:else}\\n                <svg\\n                    width=\\"100%\\"\\n                    height=\\"100%\\"\\n                    viewBox=\\"0 0 20 20\\"\\n                    focusable=\\"false\\">\\n                    <path\\n                        d=\\"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z\\" />\\n                </svg>\\n            {/if}\\n        </div>\\n    {/if}\\n\\n    {#if isWaiting}\\n        <div class=\\"spinner\\">\\n            <svg class=\\"spinner_icon\\" viewBox=\\"25 25 50 50\\">\\n                <circle\\n                    class=\\"spinner_path\\"\\n                    cx=\\"50\\"\\n                    cy=\\"50\\"\\n                    r=\\"20\\"\\n                    fill=\\"none\\"\\n                    stroke=\\"currentColor\\"\\n                    stroke-width=\\"5\\"\\n                    stroke-miterlimit=\\"10\\" />\\n            </svg>\\n        </div>\\n    {/if}\\n\\n    {#if listOpen}\\n        <svelte:component\\n            this={List}\\n            {...listProps}\\n            on:itemSelected={itemSelected}\\n            on:itemCreated={itemCreated}\\n            on:closeList={closeList} />\\n    {/if}\\n</div>\\n"],"names":[],"mappings":"AA6mBO,4CAAgB,CAAC,UAAU,MAAM,CAAC,YAAY,MAAM,CAAC,WAAW,IAAI,YAAY,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,iBAAiB,CAAC,CAAC,cAAc,IAAI,cAAc,CAAC,GAAG,CAAC,CAAC,WAAW,UAAU,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,SAAS,QAAQ,CAAC,8BAAgB,CAAC,mBAAK,CAAC,WAAW,WAAW,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,YAAY,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,UAAU,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,KAAK,IAAI,WAAW,CAAC,CAAC,CAAC,CAAC,eAAe,IAAI,oBAAoB,CAAC,MAAM,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,QAAQ,IAAI,cAAc,CAAC,cAAc,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,8BAAgB,CAAC,mBAAK,kBAAkB,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,sBAAsB,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,aAAa,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,MAAM,CAAC,QAAQ,IAAI,CAAC,4CAAgB,MAAM,CAAC,aAAa,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,gBAAgB,oCAAQ,CAAC,aAAa,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,gBAAgB,qCAAS,CAAC,WAAW,IAAI,oBAAoB,CAAC,OAAO,CAAC,CAAC,aAAa,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,eAAe,CAAC,OAAO,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,kBAAkB,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,sBAAsB,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,aAAa,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,yCAAa,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,qBAAqB,CAAC,UAAU,CAAC,CAAC,yCAAa,MAAM,CAAC,QAAQ,IAAI,CAAC,wCAAY,CAAC,OAAO,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,wCAAY,MAAM,CAAC,MAAM,IAAI,uBAAuB,CAAC,OAAO,CAAC,CAAC,gBAAgB,sBAAQ,CAAC,0BAAY,CAAC,MAAM,IAAI,uBAAuB,CAAC,OAAO,CAAC,CAAC,sCAAU,CAAC,MAAM,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,wBAAU,CAAC,iBAAG,CAAC,KAAK,IAAI,eAAe,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,YAAY,CAAC,CAAC,aAAa,CAAC,CAAC,QAAQ,YAAY,CAAC,YAAY,CAAC,CAAC,oCAAQ,CAAC,kBAAkB,oBAAM,CAAC,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,MAAM,IAAI,cAAc,CAAC,OAAO,CAAC,CAAC,OAAO,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,yCAAa,CAAC,OAAO,CAAC,CAAC,QAAQ,KAAK,CAAC,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,CAAC,kBAAkB,IAAI,CAAC,iBAAiB,MAAM,CAAC,MAAM,CAAC,MAAM,IAAI,CAAC,yCAAa,CAAC,iBAAiB,EAAE,CAAC,eAAe,KAAK,CAAC,wCAAY,CAAC,YAAY,OAAO,CAAC,QAAQ,IAAI,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,CAAC,QAAQ,IAAI,oBAAoB,CAAC,aAAa,CAAC,CAAC,0BAAY,CAAC,cAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,gBAAgB,0BAAY,CAAC,mBAAK,CAAC,OAAO,IAAI,wBAAwB,CAAC,CAAC,CAAC,CAAC,QAAQ,IAAI,yBAAyB,CAAC,CAAC,CAAC,CAAC,SAAS,QAAQ,CAAC,qCAAS,CAAC,WAAW,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,aAAa,CAAC,iBAAiB,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}`
};
function convertStringItemsToObjects(_items) {
  return _items.map((item, index2) => {
    return { index: index2, value: item, label: `${item}` };
  });
}
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredItems;
  let showSelectedItem;
  let showClearIcon;
  let placeholderText;
  let listProps;
  const dispatch = createEventDispatcher();
  let { container = void 0 } = $$props;
  let { input = void 0 } = $$props;
  let { isMulti = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { isDisabled = false } = $$props;
  let { isCreatable = false } = $$props;
  let { isFocused = false } = $$props;
  let { value = void 0 } = $$props;
  let { filterText = "" } = $$props;
  let { placeholder = "Select..." } = $$props;
  let { placeholderAlwaysShow = false } = $$props;
  let { items = null } = $$props;
  let { itemFilter = (label, filterText2, option) => `${label}`.toLowerCase().includes(filterText2.toLowerCase()) } = $$props;
  let { groupBy = void 0 } = $$props;
  let { groupFilter = (groups) => groups } = $$props;
  let { isGroupHeaderSelectable = false } = $$props;
  let { getGroupHeaderLabel = (option) => {
    return option[labelIdentifier] || option.id;
  } } = $$props;
  let { labelIdentifier = "label" } = $$props;
  let { getOptionLabel = (option, filterText2) => {
    return option.isCreator ? `Create "${filterText2}"` : option[labelIdentifier];
  } } = $$props;
  let { optionIdentifier = "value" } = $$props;
  let { loadOptions = void 0 } = $$props;
  let { hasError = false } = $$props;
  let { containerStyles = "" } = $$props;
  let { getSelectionLabel = (option) => {
    if (option)
      return option[labelIdentifier];
  } } = $$props;
  let { createGroupHeaderItem = (groupValue) => {
    return { value: groupValue, label: groupValue };
  } } = $$props;
  let { createItem = (filterText2) => {
    return { value: filterText2, label: filterText2 };
  } } = $$props;
  const getFilteredItems = () => {
    return filteredItems;
  };
  let { isSearchable = true } = $$props;
  let { inputStyles = "" } = $$props;
  let { isClearable = true } = $$props;
  let { isWaiting = false } = $$props;
  let { listPlacement = "auto" } = $$props;
  let { listOpen = false } = $$props;
  let { isVirtualList = false } = $$props;
  let { loadOptionsInterval = 300 } = $$props;
  let { noOptionsMessage = "No options" } = $$props;
  let { hideEmptyState = false } = $$props;
  let { inputAttributes = {} } = $$props;
  let { listAutoWidth = true } = $$props;
  let { itemHeight = 40 } = $$props;
  let { Icon = void 0 } = $$props;
  let { iconProps = {} } = $$props;
  let { showChevron = false } = $$props;
  let { showIndicator = false } = $$props;
  let { containerClasses = "" } = $$props;
  let { indicatorSvg = void 0 } = $$props;
  let { listOffset = 5 } = $$props;
  let { ClearIcon: ClearIcon$1 = ClearIcon } = $$props;
  let { Item: Item$1 = Item } = $$props;
  let { List: List$1 = List } = $$props;
  let { Selection: Selection$1 = Selection } = $$props;
  let { MultiSelection: MultiSelection$1 = MultiSelection } = $$props;
  let { VirtualList: VirtualList$1 = VirtualList } = $$props;
  function filterMethod(args) {
    if (args.loadOptions && args.filterText.length > 0)
      return;
    if (!args.items)
      return [];
    if (args.items && args.items.length > 0 && typeof args.items[0] !== "object") {
      args.items = convertStringItemsToObjects(args.items);
    }
    let filterResults = args.items.filter((item) => {
      let matchesFilter = itemFilter(getOptionLabel(item, args.filterText), args.filterText, item);
      if (matchesFilter && args.isMulti && args.value && Array.isArray(args.value)) {
        matchesFilter = !args.value.some((x) => {
          return x[args.optionIdentifier] === item[args.optionIdentifier];
        });
      }
      return matchesFilter;
    });
    if (args.groupBy) {
      filterResults = filterGroupedItems(filterResults);
    }
    if (args.isCreatable && filterResults.length === 0) {
      filterResults = addCreatableItem(filterResults, args.filterText);
    }
    return filterResults;
  }
  function addCreatableItem(_items, _filterText) {
    const itemToCreate = createItem(_filterText);
    itemToCreate.isCreator = true;
    return [..._items, itemToCreate];
  }
  let { selectedValue = null } = $$props;
  let activeValue;
  let prev_value;
  let prev_filterText;
  let prev_isFocused;
  let prev_isMulti;
  const getItems = debounce(async () => {
    isWaiting = true;
    let res = await loadOptions(filterText).catch((err) => {
      console.warn("svelte-select loadOptions error :>> ", err);
      dispatch("error", { type: "loadOptions", details: err });
    });
    if (res && !res.cancelled) {
      if (res) {
        if (res && res.length > 0 && typeof res[0] !== "object") {
          res = convertStringItemsToObjects(res);
        }
        filteredItems = [...res];
        dispatch("loaded", { items: filteredItems });
      } else {
        filteredItems = [];
      }
      if (filteredItems.length === 0 && isCreatable) {
        filteredItems = addCreatableItem(filteredItems, filterText);
      }
      isWaiting = false;
      isFocused = true;
      listOpen = true;
    }
  }, loadOptionsInterval);
  function setValue() {
    if (typeof value === "string") {
      value = { [optionIdentifier]: value, label: value };
    } else if (isMulti && Array.isArray(value) && value.length > 0) {
      value = value.map((item) => typeof item === "string" ? { value: item, label: item } : item);
    }
    if (prev_filterText && !loadOptions) {
      filterText = "";
    }
  }
  let _inputAttributes;
  function assignInputAttributes() {
    _inputAttributes = Object.assign({
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false
    }, inputAttributes);
    if (!isSearchable) {
      _inputAttributes.readonly = true;
    }
  }
  function filterGroupedItems(_items) {
    const groupValues = [];
    const groups = {};
    _items.forEach((item) => {
      const groupValue = groupBy(item);
      if (!groupValues.includes(groupValue)) {
        groupValues.push(groupValue);
        groups[groupValue] = [];
        if (groupValue) {
          groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
            id: groupValue,
            isGroupHeader: true,
            isSelectable: isGroupHeaderSelectable
          }));
        }
      }
      groups[groupValue].push(Object.assign({ isGroupItem: !!groupValue }, item));
    });
    const sortedGroupedItems = [];
    groupFilter(groupValues).forEach((groupValue) => {
      sortedGroupedItems.push(...groups[groupValue]);
    });
    return sortedGroupedItems;
  }
  function dispatchSelectedItem() {
    if (isMulti) {
      if (JSON.stringify(value) !== JSON.stringify(prev_value)) {
        if (checkValueForDuplicates()) {
          dispatch("select", value);
        }
      }
      return;
    }
    if (!prev_value || JSON.stringify(value[optionIdentifier]) !== JSON.stringify(prev_value[optionIdentifier])) {
      dispatch("select", value);
    }
  }
  function setupFocus() {
    if (isFocused || listOpen) {
      handleFocus();
    } else {
      if (input)
        input.blur();
    }
  }
  function setupMulti() {
    if (value) {
      if (Array.isArray(value)) {
        value = [...value];
      } else {
        value = [value];
      }
    }
  }
  function setupSingle() {
    if (value)
      value = null;
  }
  function setupFilterText() {
    if (filterText.length === 0)
      return;
    isFocused = true;
    listOpen = true;
    if (loadOptions) {
      getItems();
    } else {
      listOpen = true;
      if (isMulti) {
        activeValue = void 0;
      }
    }
  }
  beforeUpdate(async () => {
    prev_value = value;
    prev_filterText = filterText;
    prev_isFocused = isFocused;
    prev_isMulti = isMulti;
  });
  function checkValueForDuplicates() {
    let noDuplicates = true;
    if (value) {
      const ids = [];
      const uniqueValues = [];
      value.forEach((val) => {
        if (!ids.includes(val[optionIdentifier])) {
          ids.push(val[optionIdentifier]);
          uniqueValues.push(val);
        } else {
          noDuplicates = false;
        }
      });
      if (!noDuplicates)
        value = uniqueValues;
    }
    return noDuplicates;
  }
  function findItem(selection) {
    let matchTo = selection ? selection[optionIdentifier] : value[optionIdentifier];
    return items.find((item) => item[optionIdentifier] === matchTo);
  }
  function updateValueDisplay(items2) {
    if (!items2 || items2.length === 0 || items2.some((item) => typeof item !== "object"))
      return;
    if (!value || (isMulti ? value.some((selection) => !selection || !selection[optionIdentifier]) : !value[optionIdentifier]))
      return;
    if (Array.isArray(value)) {
      value = value.map((selection) => findItem(selection) || selection);
    } else {
      value = findItem() || value;
    }
  }
  function handleFocus() {
    isFocused = true;
    if (input)
      input.focus();
  }
  function handleClear() {
    value = void 0;
    listOpen = false;
    dispatch("clear", value);
    handleFocus();
  }
  onMount(() => {
    if (isFocused && input)
      input.focus();
  });
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.isMulti === void 0 && $$bindings.isMulti && isMulti !== void 0)
    $$bindings.isMulti(isMulti);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.isDisabled === void 0 && $$bindings.isDisabled && isDisabled !== void 0)
    $$bindings.isDisabled(isDisabled);
  if ($$props.isCreatable === void 0 && $$bindings.isCreatable && isCreatable !== void 0)
    $$bindings.isCreatable(isCreatable);
  if ($$props.isFocused === void 0 && $$bindings.isFocused && isFocused !== void 0)
    $$bindings.isFocused(isFocused);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.placeholderAlwaysShow === void 0 && $$bindings.placeholderAlwaysShow && placeholderAlwaysShow !== void 0)
    $$bindings.placeholderAlwaysShow(placeholderAlwaysShow);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.itemFilter === void 0 && $$bindings.itemFilter && itemFilter !== void 0)
    $$bindings.itemFilter(itemFilter);
  if ($$props.groupBy === void 0 && $$bindings.groupBy && groupBy !== void 0)
    $$bindings.groupBy(groupBy);
  if ($$props.groupFilter === void 0 && $$bindings.groupFilter && groupFilter !== void 0)
    $$bindings.groupFilter(groupFilter);
  if ($$props.isGroupHeaderSelectable === void 0 && $$bindings.isGroupHeaderSelectable && isGroupHeaderSelectable !== void 0)
    $$bindings.isGroupHeaderSelectable(isGroupHeaderSelectable);
  if ($$props.getGroupHeaderLabel === void 0 && $$bindings.getGroupHeaderLabel && getGroupHeaderLabel !== void 0)
    $$bindings.getGroupHeaderLabel(getGroupHeaderLabel);
  if ($$props.labelIdentifier === void 0 && $$bindings.labelIdentifier && labelIdentifier !== void 0)
    $$bindings.labelIdentifier(labelIdentifier);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.optionIdentifier === void 0 && $$bindings.optionIdentifier && optionIdentifier !== void 0)
    $$bindings.optionIdentifier(optionIdentifier);
  if ($$props.loadOptions === void 0 && $$bindings.loadOptions && loadOptions !== void 0)
    $$bindings.loadOptions(loadOptions);
  if ($$props.hasError === void 0 && $$bindings.hasError && hasError !== void 0)
    $$bindings.hasError(hasError);
  if ($$props.containerStyles === void 0 && $$bindings.containerStyles && containerStyles !== void 0)
    $$bindings.containerStyles(containerStyles);
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  if ($$props.createGroupHeaderItem === void 0 && $$bindings.createGroupHeaderItem && createGroupHeaderItem !== void 0)
    $$bindings.createGroupHeaderItem(createGroupHeaderItem);
  if ($$props.createItem === void 0 && $$bindings.createItem && createItem !== void 0)
    $$bindings.createItem(createItem);
  if ($$props.getFilteredItems === void 0 && $$bindings.getFilteredItems && getFilteredItems !== void 0)
    $$bindings.getFilteredItems(getFilteredItems);
  if ($$props.isSearchable === void 0 && $$bindings.isSearchable && isSearchable !== void 0)
    $$bindings.isSearchable(isSearchable);
  if ($$props.inputStyles === void 0 && $$bindings.inputStyles && inputStyles !== void 0)
    $$bindings.inputStyles(inputStyles);
  if ($$props.isClearable === void 0 && $$bindings.isClearable && isClearable !== void 0)
    $$bindings.isClearable(isClearable);
  if ($$props.isWaiting === void 0 && $$bindings.isWaiting && isWaiting !== void 0)
    $$bindings.isWaiting(isWaiting);
  if ($$props.listPlacement === void 0 && $$bindings.listPlacement && listPlacement !== void 0)
    $$bindings.listPlacement(listPlacement);
  if ($$props.listOpen === void 0 && $$bindings.listOpen && listOpen !== void 0)
    $$bindings.listOpen(listOpen);
  if ($$props.isVirtualList === void 0 && $$bindings.isVirtualList && isVirtualList !== void 0)
    $$bindings.isVirtualList(isVirtualList);
  if ($$props.loadOptionsInterval === void 0 && $$bindings.loadOptionsInterval && loadOptionsInterval !== void 0)
    $$bindings.loadOptionsInterval(loadOptionsInterval);
  if ($$props.noOptionsMessage === void 0 && $$bindings.noOptionsMessage && noOptionsMessage !== void 0)
    $$bindings.noOptionsMessage(noOptionsMessage);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.inputAttributes === void 0 && $$bindings.inputAttributes && inputAttributes !== void 0)
    $$bindings.inputAttributes(inputAttributes);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.Icon === void 0 && $$bindings.Icon && Icon !== void 0)
    $$bindings.Icon(Icon);
  if ($$props.iconProps === void 0 && $$bindings.iconProps && iconProps !== void 0)
    $$bindings.iconProps(iconProps);
  if ($$props.showChevron === void 0 && $$bindings.showChevron && showChevron !== void 0)
    $$bindings.showChevron(showChevron);
  if ($$props.showIndicator === void 0 && $$bindings.showIndicator && showIndicator !== void 0)
    $$bindings.showIndicator(showIndicator);
  if ($$props.containerClasses === void 0 && $$bindings.containerClasses && containerClasses !== void 0)
    $$bindings.containerClasses(containerClasses);
  if ($$props.indicatorSvg === void 0 && $$bindings.indicatorSvg && indicatorSvg !== void 0)
    $$bindings.indicatorSvg(indicatorSvg);
  if ($$props.listOffset === void 0 && $$bindings.listOffset && listOffset !== void 0)
    $$bindings.listOffset(listOffset);
  if ($$props.ClearIcon === void 0 && $$bindings.ClearIcon && ClearIcon$1 !== void 0)
    $$bindings.ClearIcon(ClearIcon$1);
  if ($$props.Item === void 0 && $$bindings.Item && Item$1 !== void 0)
    $$bindings.Item(Item$1);
  if ($$props.List === void 0 && $$bindings.List && List$1 !== void 0)
    $$bindings.List(List$1);
  if ($$props.Selection === void 0 && $$bindings.Selection && Selection$1 !== void 0)
    $$bindings.Selection(Selection$1);
  if ($$props.MultiSelection === void 0 && $$bindings.MultiSelection && MultiSelection$1 !== void 0)
    $$bindings.MultiSelection(MultiSelection$1);
  if ($$props.VirtualList === void 0 && $$bindings.VirtualList && VirtualList$1 !== void 0)
    $$bindings.VirtualList(VirtualList$1);
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.handleClear === void 0 && $$bindings.handleClear && handleClear !== void 0)
    $$bindings.handleClear(handleClear);
  $$result.css.add(css);
  filteredItems = filterMethod({
    loadOptions,
    filterText,
    items,
    value,
    isMulti,
    optionIdentifier,
    groupBy,
    isCreatable
  });
  {
    {
      if (selectedValue)
        console.warn("selectedValue is no longer used. Please use value instead.");
    }
  }
  {
    updateValueDisplay(items);
  }
  {
    {
      if (value)
        setValue();
    }
  }
  {
    {
      if (inputAttributes || !isSearchable)
        assignInputAttributes();
    }
  }
  {
    {
      if (isMulti) {
        setupMulti();
      }
      if (prev_isMulti && !isMulti) {
        setupSingle();
      }
    }
  }
  {
    {
      if (isMulti && value && value.length > 1) {
        checkValueForDuplicates();
      }
    }
  }
  {
    {
      if (value)
        dispatchSelectedItem();
    }
  }
  {
    {
      if (!value && isMulti && prev_value) {
        dispatch("select", value);
      }
    }
  }
  {
    {
      if (isFocused !== prev_isFocused) {
        setupFocus();
      }
    }
  }
  {
    {
      if (filterText !== prev_filterText) {
        setupFilterText();
      }
    }
  }
  showSelectedItem = value && filterText.length === 0;
  showClearIcon = showSelectedItem && isClearable && !isDisabled && !isWaiting;
  placeholderText = placeholderAlwaysShow && isMulti ? placeholder : value ? "" : placeholder;
  listProps = {
    Item: Item$1,
    filterText,
    optionIdentifier,
    noOptionsMessage,
    hideEmptyState,
    isVirtualList,
    VirtualList: VirtualList$1,
    value,
    isMulti,
    getGroupHeaderLabel,
    items: filteredItems,
    itemHeight,
    getOptionLabel,
    listPlacement,
    parent: container,
    listAutoWidth,
    listOffset
  };
  return `

<div class="${[
    "selectContainer " + escape(containerClasses) + " svelte-3uafxb",
    (hasError ? "hasError" : "") + " " + (isMulti ? "multiSelect" : "") + " " + (isDisabled ? "disabled" : "") + " " + (isFocused ? "focused" : "")
  ].join(" ").trim()}"${add_attribute("style", containerStyles, 0)}${add_attribute("this", container, 1)}>${Icon ? `${validate_component(Icon || missing_component, "svelte:component").$$render($$result, Object_1.assign(iconProps), {}, {})}` : ``}

    ${isMulti && value && value.length > 0 ? `${validate_component(MultiSelection$1 || missing_component, "svelte:component").$$render($$result, {
    value,
    getSelectionLabel,
    activeValue,
    isDisabled,
    multiFullItemClearable
  }, {}, {})}` : ``}

    <input${spread([
    { readonly: !isSearchable || null },
    escape_object(_inputAttributes),
    {
      placeholder: escape_attribute_value(placeholderText)
    },
    {
      style: escape_attribute_value(inputStyles)
    },
    { disabled: isDisabled || null }
  ], "svelte-3uafxb")}${add_attribute("this", input, 1)}${add_attribute("value", filterText, 1)}>

    ${!isMulti && showSelectedItem ? `<div class="${"selectedItem svelte-3uafxb"}">${validate_component(Selection$1 || missing_component, "svelte:component").$$render($$result, { item: value, getSelectionLabel }, {}, {})}</div>` : ``}

    ${showClearIcon ? `<div class="${"clearSelect svelte-3uafxb"}">${validate_component(ClearIcon$1 || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>` : ``}

    ${!showClearIcon && (showIndicator || showChevron && !value || !isSearchable && !isDisabled && !isWaiting && (showSelectedItem && !isClearable || !showSelectedItem)) ? `<div class="${"indicator svelte-3uafxb"}">${indicatorSvg ? `<!-- HTML_TAG_START -->${indicatorSvg}<!-- HTML_TAG_END -->` : `<svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 20 20"}" focusable="${"false"}" class="${"svelte-3uafxb"}"><path d="${"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"}"></path></svg>`}</div>` : ``}

    ${isWaiting ? `<div class="${"spinner svelte-3uafxb"}"><svg class="${"spinner_icon svelte-3uafxb"}" viewBox="${"25 25 50 50"}"><circle class="${"spinner_path svelte-3uafxb"}" cx="${"50"}" cy="${"50"}" r="${"20"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"5"}" stroke-miterlimit="${"10"}"></circle></svg></div>` : ``}

    ${listOpen ? `${validate_component(List$1 || missing_component, "svelte:component").$$render($$result, Object_1.assign(listProps), {}, {})}` : ``}</div>`;
});
function formatBookName(book) {
  if (book === "songofsolomon") {
    return "Song of Solomon";
  }
  let result = book;
  if (book.startsWith("1") || book.startsWith("2")) {
    result = `${result[0]} ${result.slice(1)}`;
  }
  return ` ${result}`.replace(/ ([a-z])/, (v) => v.toUpperCase()).trim();
}
var Copy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"copy"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"}"></path></svg>`;
});
var Times = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"times"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 352 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"}"></path></svg>`;
});
var AngleDown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"angle-down"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}"${add_attribute("class", clazz, 0)} style="${""}"><path fill="${"currentColor"}" d="${"M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"}"></path></svg>`;
});
var AngleLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"angle-left"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 256 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"}"></path></svg>`;
});
var AngleRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"angle-right"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 256 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"}" class="${""}"></path></svg>`;
});
var Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { sections } = $$props;
  let { activeSectionId } = $$props;
  let { sizeClasses = "h-96 w-96" } = $$props;
  if ($$props.sections === void 0 && $$bindings.sections && sections !== void 0)
    $$bindings.sections(sections);
  if ($$props.activeSectionId === void 0 && $$bindings.activeSectionId && activeSectionId !== void 0)
    $$bindings.activeSectionId(activeSectionId);
  if ($$props.sizeClasses === void 0 && $$bindings.sizeClasses && sizeClasses !== void 0)
    $$bindings.sizeClasses(sizeClasses);
  !activeSectionId && (activeSectionId = sections[0].id);
  sections.find((i) => i.id == activeSectionId);
  return `<section class="${"shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden " + escape(sizeClasses)}"><div class="${"shadow-lg bg-blue-200 rounded-t-2xl p-4 sticky"}">${each(sections, (section) => `<button>${escape(section.label)}</button>`)}</div>

	<div class="${"flex-grow p-4 rounded-b-2xl flex"}">${slots.default ? slots.default({}) : ``}</div></section>`;
});
var TabPane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section class="${"w-full flex-shrink-0"}">${slots.default ? slots.default({}) : ``}</section>`;
});
var ChapterSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chapters;
  let { open } = $$props;
  let { initialBook } = $$props;
  let book = initialBook;
  let activeSectionId = "book";
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.initialBook === void 0 && $$bindings.initialBook && initialBook !== void 0)
    $$bindings.initialBook(initialBook);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    chapters = getChapterNumbers(book);
    $$rendered = `${validate_component(Modal, "Modal").$$render($$result, { open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Tabs, "Tabs").$$render($$result, {
        sizeClasses: "h-full w-full",
        sections: [{ id: "book", label: "Book" }, { id: "chapter", label: "Chapter" }],
        activeSectionId
      }, {
        activeSectionId: ($$value) => {
          activeSectionId = $$value;
          $$settled = false;
        }
      }, {
        default: () => `${validate_component(TabPane, "TabPane").$$render($$result, {}, {}, {
          default: () => `<div class="${"flex flex-wrap"}">${each(bookNames, (bookName) => `<button class="${"w-1/3 p-4 bg-gray-200"}">${escape(formatBookName(bookName))}</button>`)}</div>`
        })}
		${validate_component(TabPane, "TabPane").$$render($$result, {}, {}, {
          default: () => `<div class="${"flex flex-wrap"}">${each(chapters, (chapter) => `<a class="${"w-1/4 p-4 bg-gray-200 text-center"}">${escape(chapter)}</a>`)}</div>`
        })}`
      })}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load({ page: page2, fetch: fetch2, session, context }) {
  return __awaiter(this, void 0, void 0, function* () {
    const { book, chapter } = page2.params;
    const response = yield fetch2(`/api/bible/${book}/${chapter}.json`);
    if (response.ok) {
      return {
        props: { chapter: yield response.json() }
      };
    } else {
      return {
        status: response.status,
        error: new Error(`Page not found`)
      };
    }
  });
}
var U5Bchapteru5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let activeVersesArray;
  let $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { chapter } = $$props;
  let activeVerses = {};
  const highlightColors = ["#9adab9", "#efc082", "#f2a5c4", "#f3e482", "#8bc5e0"];
  let highlights;
  let mounted = false;
  onMount(() => mounted = true);
  let selectChapterModalOpen = false;
  if ($$props.chapter === void 0 && $$bindings.chapter && chapter !== void 0)
    $$bindings.chapter(chapter);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    activeVersesArray = Object.entries(activeVerses).filter(([k, v]) => v).map(([k, v]) => +k);
    {
      {
        mounted && (() => __awaiter2(void 0, void 0, void 0, function* () {
          highlights = null;
          const { data, error: error2 } = yield supabase.from("bible_formatting").select("formatting,verse").filter("book", "eq", chapter.book).filter("chapter", "eq", chapter.chapter);
          if (error2)
            throw error2;
          highlights = data;
        }))();
      }
    }
    {
      console.log(highlights);
    }
    $$rendered = `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
      default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {
        href: "/bible/" + chapter.previous.book + "/" + chapter.previous.chapter
      }, {}, {
        default: () => `${validate_component(AngleLeft, "AngleLeft").$$render($$result, { class: "h-8" }, {}, {})}`
      })}

	${validate_component(NavButton, "NavButton").$$render($$result, { grow: true }, {}, {
        default: () => `<span class="${"mr-4"}">${escape(formatBookName(chapter.book))}
			${escape(chapter.chapter)}</span>

		${validate_component(AngleDown, "AngleDown").$$render($$result, { class: "h-6 ml-2" }, {}, {})}`
      })}

	${validate_component(NavLink, "NavLink").$$render($$result, {
        href: "/bible/" + chapter.next.book + "/" + chapter.next.chapter
      }, {}, {
        default: () => `${validate_component(AngleRight, "AngleRight").$$render($$result, { class: "h-8" }, {}, {})}`
      })}`
    })}

${validate_component(ChapterSelector, "ChapterSelector").$$render($$result, {
      initialBook: chapter.book,
      open: selectChapterModalOpen
    }, {
      open: ($$value) => {
        selectChapterModalOpen = $$value;
        $$settled = false;
      }
    }, {})}

${activeVersesArray.length > 0 ? `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
      default: () => `${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
        default: () => `${validate_component(Times, "Times").$$render($$result, { class: "h-8" }, {}, {})}`
      })}
		${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
        default: () => `${validate_component(Copy, "Copy").$$render($$result, { class: "h-8" }, {}, {})}`
      })}
		${each(highlightColors, (color) => `${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
        default: () => `<div class="${"h-8 w-8 rounded-full"}" style="${"background: " + escape(color)}"></div>
			`
      })}`)}`
    })}` : ``}

<main>${each(chapter.verses, (verse) => {
      var _a;
      return `<article class="${[
        "flex p-4 duration-200 cursor-pointer border-2",
        (activeVerses[verse.verse] ? "border-black" : "") + " " + (activeVerses[verse.verse] ? "text-gray-600" : "") + " " + (!activeVerses[verse.verse] ? "border-transparent" : "")
      ].join(" ").trim()}" style="${escape((_a = highlights == null ? void 0 : highlights.find((item) => item.verse === verse.verse)) == null ? void 0 : _a.formatting) + ";"}"><h2 class="${"mr-4 p-2 text-xs bg-gray-200 flex items-center"}">${escape(verse.verse)}</h2>
			<p class="${"self-center"}">${escape(verse.text)}</p>
		</article>`;
    })}</main>`;
  } while (!$$settled);
  $$unsubscribe_authStore();
  return $$rendered;
});
var _chapter_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bchapteru5D,
  load
});
var Sign_in = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  let email = "";
  let password = "";
  let error2 = null;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if ($authStore) {
        goto(localStorage["goto-after-login"] || "/");
      }
    }
    $$rendered = `${validate_component(Form, "Form").$$render($$result, { error: error2, title: "Sign In" }, {}, {
      default: () => `${validate_component(FormField, "FormField").$$render($$result, {
        required: true,
        label: "Email",
        type: "email",
        value: email
      }, {
        value: ($$value) => {
          email = $$value;
          $$settled = false;
        }
      }, {})}
	${validate_component(FormField, "FormField").$$render($$result, {
        required: true,
        label: "Password",
        type: "password",
        value: password
      }, {
        value: ($$value) => {
          password = $$value;
          $$settled = false;
        }
      }, {})}
	${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, { default: () => `Sign In` })}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_authStore();
  return $$rendered;
});
var signIn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sign_in
});
var Sign_up = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let error2;
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let email = "";
  let password = "";
  let passwordConfirmation = "";
  let hasAttemptedSubmit = false;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if ($authStore) {
        goto("/");
      }
    }
    error2 = password !== passwordConfirmation && hasAttemptedSubmit ? "Password Must Match Password Confirmation" : null;
    $$rendered = `${validate_component(Form, "Form").$$render($$result, { error: error2, title: "Sign Up" }, {}, {
      default: () => `${validate_component(FormField, "FormField").$$render($$result, {
        required: true,
        label: "Email",
        type: "email",
        value: email
      }, {
        value: ($$value) => {
          email = $$value;
          $$settled = false;
        }
      }, {})}
	${validate_component(FormField, "FormField").$$render($$result, {
        required: true,
        label: "Password",
        type: "password",
        value: password
      }, {
        value: ($$value) => {
          password = $$value;
          $$settled = false;
        }
      }, {})}
	${validate_component(FormField, "FormField").$$render($$result, {
        required: true,
        label: "Password Confirmation",
        type: "password",
        value: passwordConfirmation
      }, {
        value: ($$value) => {
          passwordConfirmation = $$value;
          $$settled = false;
        }
      }, {})}
	${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, { default: () => `Sign Up` })}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_authStore();
  return $$rendered;
});
var signUp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sign_up
});

// .svelte-kit/node/env.js
var host = process.env["HOST"] || "0.0.0.0";
var port = process.env["PORT"] || 3e3;

// .svelte-kit/node/index.js
import require$$0$1, { resolve as resolve2, join as join2, normalize as normalize2, dirname } from "path";
import buffer from "buffer";
import tty from "tty";
import util from "util";
import {
  createReadStream,
  existsSync,
  statSync
} from "fs";
import fs__default, { readdirSync, statSync as statSync2 } from "fs";
import require$$2 from "net";
import zlib from "zlib";
import http from "http";
import {
  parse
} from "querystring";
import { fileURLToPath } from "url";
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h2["content-type"].split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding3 = h2["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding3).decode(data));
      }
      fulfil(data);
    });
  });
}
var charset = preferredCharsets;
var preferredCharsets_1 = preferredCharsets;
var simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseAcceptCharset(accept) {
  var accepts2 = accept.split(",");
  for (var i = 0, j = 0; i < accepts2.length; i++) {
    var charset3 = parseCharset(accepts2[i].trim(), i);
    if (charset3) {
      accepts2[j++] = charset3;
    }
  }
  accepts2.length = j;
  return accepts2;
}
function parseCharset(str, i) {
  var match = simpleCharsetRegExp.exec(str);
  if (!match)
    return null;
  var charset3 = match[1];
  var q = 1;
  if (match[2]) {
    var params = match[2].split(";");
    for (var j = 0; j < params.length; j++) {
      var p = params[j].trim().split("=");
      if (p[0] === "q") {
        q = parseFloat(p[1]);
        break;
      }
    }
  }
  return {
    charset: charset3,
    q,
    i
  };
}
function getCharsetPriority(charset3, accepted, index2) {
  var priority = { o: -1, q: 0, s: 0 };
  for (var i = 0; i < accepted.length; i++) {
    var spec = specify$3(charset3, accepted[i], index2);
    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }
  return priority;
}
function specify$3(charset3, spec, index2) {
  var s3 = 0;
  if (spec.charset.toLowerCase() === charset3.toLowerCase()) {
    s3 |= 1;
  } else if (spec.charset !== "*") {
    return null;
  }
  return {
    i: index2,
    o: spec.i,
    q: spec.q,
    s: s3
  };
}
function preferredCharsets(accept, provided) {
  var accepts2 = parseAcceptCharset(accept === void 0 ? "*" : accept || "");
  if (!provided) {
    return accepts2.filter(isQuality$3).sort(compareSpecs$3).map(getFullCharset);
  }
  var priorities = provided.map(function getPriority(type, index2) {
    return getCharsetPriority(type, accepts2, index2);
  });
  return priorities.filter(isQuality$3).sort(compareSpecs$3).map(function getCharset(priority) {
    return provided[priorities.indexOf(priority)];
  });
}
function compareSpecs$3(a, b) {
  return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
function getFullCharset(spec) {
  return spec.charset;
}
function isQuality$3(spec) {
  return spec.q > 0;
}
charset.preferredCharsets = preferredCharsets_1;
var encoding = preferredEncodings;
var preferredEncodings_1 = preferredEncodings;
var simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseAcceptEncoding(accept) {
  var accepts2 = accept.split(",");
  var hasIdentity = false;
  var minQuality = 1;
  for (var i = 0, j = 0; i < accepts2.length; i++) {
    var encoding3 = parseEncoding(accepts2[i].trim(), i);
    if (encoding3) {
      accepts2[j++] = encoding3;
      hasIdentity = hasIdentity || specify$2("identity", encoding3);
      minQuality = Math.min(minQuality, encoding3.q || 1);
    }
  }
  if (!hasIdentity) {
    accepts2[j++] = {
      encoding: "identity",
      q: minQuality,
      i
    };
  }
  accepts2.length = j;
  return accepts2;
}
function parseEncoding(str, i) {
  var match = simpleEncodingRegExp.exec(str);
  if (!match)
    return null;
  var encoding3 = match[1];
  var q = 1;
  if (match[2]) {
    var params = match[2].split(";");
    for (var j = 0; j < params.length; j++) {
      var p = params[j].trim().split("=");
      if (p[0] === "q") {
        q = parseFloat(p[1]);
        break;
      }
    }
  }
  return {
    encoding: encoding3,
    q,
    i
  };
}
function getEncodingPriority(encoding3, accepted, index2) {
  var priority = { o: -1, q: 0, s: 0 };
  for (var i = 0; i < accepted.length; i++) {
    var spec = specify$2(encoding3, accepted[i], index2);
    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }
  return priority;
}
function specify$2(encoding3, spec, index2) {
  var s3 = 0;
  if (spec.encoding.toLowerCase() === encoding3.toLowerCase()) {
    s3 |= 1;
  } else if (spec.encoding !== "*") {
    return null;
  }
  return {
    i: index2,
    o: spec.i,
    q: spec.q,
    s: s3
  };
}
function preferredEncodings(accept, provided) {
  var accepts2 = parseAcceptEncoding(accept || "");
  if (!provided) {
    return accepts2.filter(isQuality$2).sort(compareSpecs$2).map(getFullEncoding);
  }
  var priorities = provided.map(function getPriority(type, index2) {
    return getEncodingPriority(type, accepts2, index2);
  });
  return priorities.filter(isQuality$2).sort(compareSpecs$2).map(function getEncoding(priority) {
    return provided[priorities.indexOf(priority)];
  });
}
function compareSpecs$2(a, b) {
  return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
function getFullEncoding(spec) {
  return spec.encoding;
}
function isQuality$2(spec) {
  return spec.q > 0;
}
encoding.preferredEncodings = preferredEncodings_1;
var language = preferredLanguages;
var preferredLanguages_1 = preferredLanguages;
var simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
function parseAcceptLanguage(accept) {
  var accepts2 = accept.split(",");
  for (var i = 0, j = 0; i < accepts2.length; i++) {
    var language3 = parseLanguage(accepts2[i].trim(), i);
    if (language3) {
      accepts2[j++] = language3;
    }
  }
  accepts2.length = j;
  return accepts2;
}
function parseLanguage(str, i) {
  var match = simpleLanguageRegExp.exec(str);
  if (!match)
    return null;
  var prefix = match[1], suffix = match[2], full = prefix;
  if (suffix)
    full += "-" + suffix;
  var q = 1;
  if (match[3]) {
    var params = match[3].split(";");
    for (var j = 0; j < params.length; j++) {
      var p = params[j].split("=");
      if (p[0] === "q")
        q = parseFloat(p[1]);
    }
  }
  return {
    prefix,
    suffix,
    q,
    i,
    full
  };
}
function getLanguagePriority(language3, accepted, index2) {
  var priority = { o: -1, q: 0, s: 0 };
  for (var i = 0; i < accepted.length; i++) {
    var spec = specify$1(language3, accepted[i], index2);
    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }
  return priority;
}
function specify$1(language3, spec, index2) {
  var p = parseLanguage(language3);
  if (!p)
    return null;
  var s3 = 0;
  if (spec.full.toLowerCase() === p.full.toLowerCase()) {
    s3 |= 4;
  } else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) {
    s3 |= 2;
  } else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
    s3 |= 1;
  } else if (spec.full !== "*") {
    return null;
  }
  return {
    i: index2,
    o: spec.i,
    q: spec.q,
    s: s3
  };
}
function preferredLanguages(accept, provided) {
  var accepts2 = parseAcceptLanguage(accept === void 0 ? "*" : accept || "");
  if (!provided) {
    return accepts2.filter(isQuality$1).sort(compareSpecs$1).map(getFullLanguage);
  }
  var priorities = provided.map(function getPriority(type, index2) {
    return getLanguagePriority(type, accepts2, index2);
  });
  return priorities.filter(isQuality$1).sort(compareSpecs$1).map(function getLanguage(priority) {
    return provided[priorities.indexOf(priority)];
  });
}
function compareSpecs$1(a, b) {
  return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
function getFullLanguage(spec) {
  return spec.full;
}
function isQuality$1(spec) {
  return spec.q > 0;
}
language.preferredLanguages = preferredLanguages_1;
var mediaType = preferredMediaTypes;
var preferredMediaTypes_1 = preferredMediaTypes;
var simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
function parseAccept(accept) {
  var accepts2 = splitMediaTypes(accept);
  for (var i = 0, j = 0; i < accepts2.length; i++) {
    var mediaType3 = parseMediaType(accepts2[i].trim(), i);
    if (mediaType3) {
      accepts2[j++] = mediaType3;
    }
  }
  accepts2.length = j;
  return accepts2;
}
function parseMediaType(str, i) {
  var match = simpleMediaTypeRegExp.exec(str);
  if (!match)
    return null;
  var params = Object.create(null);
  var q = 1;
  var subtype = match[2];
  var type = match[1];
  if (match[3]) {
    var kvps = splitParameters(match[3]).map(splitKeyValuePair);
    for (var j = 0; j < kvps.length; j++) {
      var pair = kvps[j];
      var key = pair[0].toLowerCase();
      var val = pair[1];
      var value = val && val[0] === '"' && val[val.length - 1] === '"' ? val.substr(1, val.length - 2) : val;
      if (key === "q") {
        q = parseFloat(value);
        break;
      }
      params[key] = value;
    }
  }
  return {
    type,
    subtype,
    params,
    q,
    i
  };
}
function getMediaTypePriority(type, accepted, index2) {
  var priority = { o: -1, q: 0, s: 0 };
  for (var i = 0; i < accepted.length; i++) {
    var spec = specify(type, accepted[i], index2);
    if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
      priority = spec;
    }
  }
  return priority;
}
function specify(type, spec, index2) {
  var p = parseMediaType(type);
  var s3 = 0;
  if (!p) {
    return null;
  }
  if (spec.type.toLowerCase() == p.type.toLowerCase()) {
    s3 |= 4;
  } else if (spec.type != "*") {
    return null;
  }
  if (spec.subtype.toLowerCase() == p.subtype.toLowerCase()) {
    s3 |= 2;
  } else if (spec.subtype != "*") {
    return null;
  }
  var keys = Object.keys(spec.params);
  if (keys.length > 0) {
    if (keys.every(function(k) {
      return spec.params[k] == "*" || (spec.params[k] || "").toLowerCase() == (p.params[k] || "").toLowerCase();
    })) {
      s3 |= 1;
    } else {
      return null;
    }
  }
  return {
    i: index2,
    o: spec.i,
    q: spec.q,
    s: s3
  };
}
function preferredMediaTypes(accept, provided) {
  var accepts2 = parseAccept(accept === void 0 ? "*/*" : accept || "");
  if (!provided) {
    return accepts2.filter(isQuality).sort(compareSpecs).map(getFullType);
  }
  var priorities = provided.map(function getPriority(type, index2) {
    return getMediaTypePriority(type, accepts2, index2);
  });
  return priorities.filter(isQuality).sort(compareSpecs).map(function getType2(priority) {
    return provided[priorities.indexOf(priority)];
  });
}
function compareSpecs(a, b) {
  return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
function getFullType(spec) {
  return spec.type + "/" + spec.subtype;
}
function isQuality(spec) {
  return spec.q > 0;
}
function quoteCount(string) {
  var count = 0;
  var index2 = 0;
  while ((index2 = string.indexOf('"', index2)) !== -1) {
    count++;
    index2++;
  }
  return count;
}
function splitKeyValuePair(str) {
  var index2 = str.indexOf("=");
  var key;
  var val;
  if (index2 === -1) {
    key = str;
  } else {
    key = str.substr(0, index2);
    val = str.substr(index2 + 1);
  }
  return [key, val];
}
function splitMediaTypes(accept) {
  var accepts2 = accept.split(",");
  for (var i = 1, j = 0; i < accepts2.length; i++) {
    if (quoteCount(accepts2[j]) % 2 == 0) {
      accepts2[++j] = accepts2[i];
    } else {
      accepts2[j] += "," + accepts2[i];
    }
  }
  accepts2.length = j + 1;
  return accepts2;
}
function splitParameters(str) {
  var parameters = str.split(";");
  for (var i = 1, j = 0; i < parameters.length; i++) {
    if (quoteCount(parameters[j]) % 2 == 0) {
      parameters[++j] = parameters[i];
    } else {
      parameters[j] += ";" + parameters[i];
    }
  }
  parameters.length = j + 1;
  for (var i = 0; i < parameters.length; i++) {
    parameters[i] = parameters[i].trim();
  }
  return parameters;
}
mediaType.preferredMediaTypes = preferredMediaTypes_1;
var modules = Object.create(null);
var negotiator = Negotiator;
var Negotiator_1 = Negotiator;
function Negotiator(request) {
  if (!(this instanceof Negotiator)) {
    return new Negotiator(request);
  }
  this.request = request;
}
Negotiator.prototype.charset = function charset2(available) {
  var set = this.charsets(available);
  return set && set[0];
};
Negotiator.prototype.charsets = function charsets(available) {
  var preferredCharsets2 = loadModule("charset").preferredCharsets;
  return preferredCharsets2(this.request.headers["accept-charset"], available);
};
Negotiator.prototype.encoding = function encoding2(available) {
  var set = this.encodings(available);
  return set && set[0];
};
Negotiator.prototype.encodings = function encodings(available) {
  var preferredEncodings2 = loadModule("encoding").preferredEncodings;
  return preferredEncodings2(this.request.headers["accept-encoding"], available);
};
Negotiator.prototype.language = function language2(available) {
  var set = this.languages(available);
  return set && set[0];
};
Negotiator.prototype.languages = function languages(available) {
  var preferredLanguages2 = loadModule("language").preferredLanguages;
  return preferredLanguages2(this.request.headers["accept-language"], available);
};
Negotiator.prototype.mediaType = function mediaType2(available) {
  var set = this.mediaTypes(available);
  return set && set[0];
};
Negotiator.prototype.mediaTypes = function mediaTypes(available) {
  var preferredMediaTypes2 = loadModule("mediaType").preferredMediaTypes;
  return preferredMediaTypes2(this.request.headers.accept, available);
};
Negotiator.prototype.preferredCharset = Negotiator.prototype.charset;
Negotiator.prototype.preferredCharsets = Negotiator.prototype.charsets;
Negotiator.prototype.preferredEncoding = Negotiator.prototype.encoding;
Negotiator.prototype.preferredEncodings = Negotiator.prototype.encodings;
Negotiator.prototype.preferredLanguage = Negotiator.prototype.language;
Negotiator.prototype.preferredLanguages = Negotiator.prototype.languages;
Negotiator.prototype.preferredMediaType = Negotiator.prototype.mediaType;
Negotiator.prototype.preferredMediaTypes = Negotiator.prototype.mediaTypes;
function loadModule(moduleName) {
  var module = modules[moduleName];
  if (module !== void 0) {
    return module;
  }
  switch (moduleName) {
    case "charset":
      module = charset;
      break;
    case "encoding":
      module = encoding;
      break;
    case "language":
      module = language;
      break;
    case "mediaType":
      module = mediaType;
      break;
    default:
      throw new Error("Cannot find module '" + moduleName + "'");
  }
  modules[moduleName] = module;
  return module;
}
negotiator.Negotiator = Negotiator_1;
function createCommonjsModule(fn) {
  var module = { exports: {} };
  return fn(module, module.exports), module.exports;
}
var require$$0 = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: true
  },
  "application/a2l": {
    source: "iana"
  },
  "application/activemessage": {
    source: "iana"
  },
  "application/activity+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: true
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: true
  },
  "application/aml": {
    source: "iana"
  },
  "application/andrew-inset": {
    source: "iana",
    extensions: [
      "ez"
    ]
  },
  "application/applefile": {
    source: "iana"
  },
  "application/applixware": {
    source: "apache",
    extensions: [
      "aw"
    ]
  },
  "application/atf": {
    source: "iana"
  },
  "application/atfx": {
    source: "iana"
  },
  "application/atom+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: true
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: true
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: false
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: false,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/calendar+json": {
    source: "iana",
    compressible: true
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xcs"
    ]
  },
  "application/call-completion": {
    source: "iana"
  },
  "application/cals-1840": {
    source: "iana"
  },
  "application/captive+json": {
    source: "iana",
    compressible: true
  },
  "application/cbor": {
    source: "iana"
  },
  "application/cbor-seq": {
    source: "iana"
  },
  "application/cccex": {
    source: "iana"
  },
  "application/ccmp+xml": {
    source: "iana",
    compressible: true
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "cdfx"
    ]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: [
      "cdmia"
    ]
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: [
      "cdmic"
    ]
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: [
      "cdmid"
    ]
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: [
      "cdmio"
    ]
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: [
      "cdmiq"
    ]
  },
  "application/cdni": {
    source: "iana"
  },
  "application/cea": {
    source: "iana"
  },
  "application/cea-2018+xml": {
    source: "iana",
    compressible: true
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: true
  },
  "application/cfw": {
    source: "iana"
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: true
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: true
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: true
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: true
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/cose": {
    source: "iana"
  },
  "application/cose-key": {
    source: "iana"
  },
  "application/cose-key-set": {
    source: "iana"
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: true
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: true
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/csvm+json": {
    source: "iana",
    compressible: true
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: [
      "cu"
    ]
  },
  "application/cwt": {
    source: "iana"
  },
  "application/cybercash": {
    source: "iana"
  },
  "application/dart": {
    compressible: true
  },
  "application/dash+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpd"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "davmount"
    ]
  },
  "application/dca-rft": {
    source: "iana"
  },
  "application/dcd": {
    source: "iana"
  },
  "application/dec-dx": {
    source: "iana"
  },
  "application/dialog-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: true
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: true
  },
  "application/dii": {
    source: "iana"
  },
  "application/dit": {
    source: "iana"
  },
  "application/dns": {
    source: "iana"
  },
  "application/dns+json": {
    source: "iana",
    compressible: true
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: true,
    extensions: [
      "es",
      "ecma"
    ]
  },
  "application/edi-consent": {
    source: "iana"
  },
  "application/edi-x12": {
    source: "iana",
    compressible: false
  },
  "application/edifact": {
    source: "iana",
    compressible: false
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/elm+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: true
  },
  "application/emma+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: true
  },
  "application/epub+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "epub"
    ]
  },
  "application/eshop": {
    source: "iana"
  },
  "application/exi": {
    source: "iana",
    extensions: [
      "exi"
    ]
  },
  "application/expect-ct-report+json": {
    source: "iana",
    compressible: true
  },
  "application/fastinfoset": {
    source: "iana"
  },
  "application/fastsoap": {
    source: "iana"
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/fido.trusted-apps+json": {
    compressible: true
  },
  "application/fits": {
    source: "iana"
  },
  "application/flexfec": {
    source: "iana"
  },
  "application/font-sfnt": {
    source: "iana"
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: [
      "pfr"
    ]
  },
  "application/font-woff": {
    source: "iana",
    compressible: false
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: true
  },
  "application/geo+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "geojson"
    ]
  },
  "application/geo+json-seq": {
    source: "iana"
  },
  "application/geopackage+sqlite3": {
    source: "iana"
  },
  "application/geoxacml+xml": {
    source: "iana",
    compressible: true
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "gpx"
    ]
  },
  "application/gxf": {
    source: "apache",
    extensions: [
      "gxf"
    ]
  },
  "application/gzip": {
    source: "iana",
    compressible: false,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: true
  },
  "application/hjson": {
    extensions: [
      "hjson"
    ]
  },
  "application/http": {
    source: "iana"
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: [
      "stk"
    ]
  },
  "application/ibe-key-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: true
  },
  "application/ibe-pp-data": {
    source: "iana"
  },
  "application/iges": {
    source: "iana"
  },
  "application/im-iscomposing+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/index": {
    source: "iana"
  },
  "application/index.cmd": {
    source: "iana"
  },
  "application/index.obj": {
    source: "iana"
  },
  "application/index.response": {
    source: "iana"
  },
  "application/index.vnd": {
    source: "iana"
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ink",
      "inkml"
    ]
  },
  "application/iotp": {
    source: "iana"
  },
  "application/ipfix": {
    source: "iana",
    extensions: [
      "ipfix"
    ]
  },
  "application/ipp": {
    source: "iana"
  },
  "application/isup": {
    source: "iana"
  },
  "application/its+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: false,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: false,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: false,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: true
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: true
  },
  "application/jrd+json": {
    source: "iana",
    compressible: true
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: true
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/json-seq": {
    source: "iana"
  },
  "application/json5": {
    extensions: [
      "json5"
    ]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: true,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: true
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: true
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/ld+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: true
  },
  "application/lost+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: false
  },
  "application/lxf": {
    source: "iana"
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: [
      "hqx"
    ]
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: [
      "cpt"
    ]
  },
  "application/macwriteii": {
    source: "iana"
  },
  "application/mads+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "webmanifest"
    ]
  },
  "application/marc": {
    source: "iana",
    extensions: [
      "mrc"
    ]
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mrcx"
    ]
  },
  "application/mathematica": {
    source: "iana",
    extensions: [
      "ma",
      "nb",
      "mb"
    ]
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: true
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: true
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: true
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: true
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mets"
    ]
  },
  "application/mf4": {
    source: "iana"
  },
  "application/mikey": {
    source: "iana"
  },
  "application/mipc": {
    source: "iana"
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mods"
    ]
  },
  "application/moss-keys": {
    source: "iana"
  },
  "application/moss-signature": {
    source: "iana"
  },
  "application/mosskey-data": {
    source: "iana"
  },
  "application/mosskey-request": {
    source: "iana"
  },
  "application/mp21": {
    source: "iana",
    extensions: [
      "m21",
      "mp21"
    ]
  },
  "application/mp4": {
    source: "iana",
    extensions: [
      "mp4s",
      "m4p"
    ]
  },
  "application/mpeg4-generic": {
    source: "iana"
  },
  "application/mpeg4-iod": {
    source: "iana"
  },
  "application/mpeg4-iod-xmt": {
    source: "iana"
  },
  "application/mrb-consumer+xml": {
    source: "iana",
    compressible: true
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: true
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/msword": {
    source: "iana",
    compressible: false,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: true
  },
  "application/multipart-core": {
    source: "iana"
  },
  "application/mxf": {
    source: "iana",
    extensions: [
      "mxf"
    ]
  },
  "application/n-quads": {
    source: "iana",
    extensions: [
      "nq"
    ]
  },
  "application/n-triples": {
    source: "iana",
    extensions: [
      "nt"
    ]
  },
  "application/nasdata": {
    source: "iana"
  },
  "application/news-checkgroups": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-groupinfo": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-transmission": {
    source: "iana"
  },
  "application/nlsml+xml": {
    source: "iana",
    compressible: true
  },
  "application/node": {
    source: "iana",
    extensions: [
      "cjs"
    ]
  },
  "application/nss": {
    source: "iana"
  },
  "application/ocsp-request": {
    source: "iana"
  },
  "application/ocsp-response": {
    source: "iana"
  },
  "application/octet-stream": {
    source: "iana",
    compressible: false,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: [
      "oda"
    ]
  },
  "application/odm+xml": {
    source: "iana",
    compressible: true
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "omdoc"
    ]
  },
  "application/onenote": {
    source: "apache",
    extensions: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ]
  },
  "application/opc-nodeset+xml": {
    source: "iana",
    compressible: true
  },
  "application/oscore": {
    source: "iana"
  },
  "application/oxps": {
    source: "iana",
    extensions: [
      "oxps"
    ]
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "relo"
    ]
  },
  "application/parityfec": {
    source: "iana"
  },
  "application/passport": {
    source: "iana"
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: false,
    extensions: [
      "pdf"
    ]
  },
  "application/pdx": {
    source: "iana"
  },
  "application/pem-certificate-chain": {
    source: "iana"
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: false,
    extensions: [
      "pgp"
    ]
  },
  "application/pgp-keys": {
    source: "iana"
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: [
      "asc",
      "sig"
    ]
  },
  "application/pics-rules": {
    source: "apache",
    extensions: [
      "prf"
    ]
  },
  "application/pidf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/pkcs10": {
    source: "iana",
    extensions: [
      "p10"
    ]
  },
  "application/pkcs12": {
    source: "iana"
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: [
      "p7m",
      "p7c"
    ]
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: [
      "p7s"
    ]
  },
  "application/pkcs8": {
    source: "iana",
    extensions: [
      "p8"
    ]
  },
  "application/pkcs8-encrypted": {
    source: "iana"
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: [
      "ac"
    ]
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: [
      "cer"
    ]
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: [
      "crl"
    ]
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: [
      "pkipath"
    ]
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: [
      "pki"
    ]
  },
  "application/pls+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/postscript": {
    source: "iana",
    compressible: true,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+json": {
    source: "iana",
    compressible: true
  },
  "application/problem+xml": {
    source: "iana",
    compressible: true
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "provx"
    ]
  },
  "application/prs.alvestrand.titrax-sheet": {
    source: "iana"
  },
  "application/prs.cww": {
    source: "iana",
    extensions: [
      "cww"
    ]
  },
  "application/prs.cyn": {
    source: "iana",
    charset: "7-BIT"
  },
  "application/prs.hpub+zip": {
    source: "iana",
    compressible: false
  },
  "application/prs.nprend": {
    source: "iana"
  },
  "application/prs.plucker": {
    source: "iana"
  },
  "application/prs.rdf-xml-crypt": {
    source: "iana"
  },
  "application/prs.xsf+xml": {
    source: "iana",
    compressible: true
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: true
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: true,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: true
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rif"
    ]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: [
      "rnc"
    ]
  },
  "application/remote-printing": {
    source: "iana"
  },
  "application/reputon+json": {
    source: "iana",
    compressible: true
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: true
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: true
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rusd"
    ]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: [
      "gbr"
    ]
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: [
      "mft"
    ]
  },
  "application/rpki-publication": {
    source: "iana"
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: [
      "roa"
    ]
  },
  "application/rpki-updown": {
    source: "iana"
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtf"
    ]
  },
  "application/rtploopback": {
    source: "iana"
  },
  "application/rtx": {
    source: "iana"
  },
  "application/samlassertion+xml": {
    source: "iana",
    compressible: true
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/sarif+json": {
    source: "iana",
    compressible: true
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: true
  },
  "application/scim+json": {
    source: "iana",
    compressible: true
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: [
      "scq"
    ]
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: [
      "scs"
    ]
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: [
      "spq"
    ]
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: [
      "spp"
    ]
  },
  "application/sdp": {
    source: "iana",
    extensions: [
      "sdp"
    ]
  },
  "application/secevent+jwt": {
    source: "iana"
  },
  "application/senml+cbor": {
    source: "iana"
  },
  "application/senml+json": {
    source: "iana",
    compressible: true
  },
  "application/senml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: true
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: true
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: true
  },
  "application/sep-exi": {
    source: "iana"
  },
  "application/session-info": {
    source: "iana"
  },
  "application/set-payment": {
    source: "iana"
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: [
      "setpay"
    ]
  },
  "application/set-registration": {
    source: "iana"
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: [
      "setreg"
    ]
  },
  "application/sgml": {
    source: "iana"
  },
  "application/sgml-open-catalog": {
    source: "iana"
  },
  "application/shf+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "shf"
    ]
  },
  "application/sieve": {
    source: "iana",
    extensions: [
      "siv",
      "sieve"
    ]
  },
  "application/simple-filter+xml": {
    source: "iana",
    compressible: true
  },
  "application/simple-message-summary": {
    source: "iana"
  },
  "application/simplesymbolcontainer": {
    source: "iana"
  },
  "application/sipc": {
    source: "iana"
  },
  "application/slate": {
    source: "iana"
  },
  "application/smil": {
    source: "iana"
  },
  "application/smil+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "smi",
      "smil"
    ]
  },
  "application/smpte336m": {
    source: "iana"
  },
  "application/soap+fastinfoset": {
    source: "iana"
  },
  "application/soap+xml": {
    source: "iana",
    compressible: true
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "srx"
    ]
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: true
  },
  "application/sql": {
    source: "iana"
  },
  "application/srgs": {
    source: "iana",
    extensions: [
      "gram"
    ]
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: true
  },
  "application/swid+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "swidtag"
    ]
  },
  "application/tamp-apex-update": {
    source: "iana"
  },
  "application/tamp-apex-update-confirm": {
    source: "iana"
  },
  "application/tamp-community-update": {
    source: "iana"
  },
  "application/tamp-community-update-confirm": {
    source: "iana"
  },
  "application/tamp-error": {
    source: "iana"
  },
  "application/tamp-sequence-adjust": {
    source: "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    source: "iana"
  },
  "application/tamp-status-query": {
    source: "iana"
  },
  "application/tamp-status-response": {
    source: "iana"
  },
  "application/tamp-update": {
    source: "iana"
  },
  "application/tamp-update-confirm": {
    source: "iana"
  },
  "application/tar": {
    compressible: true
  },
  "application/taxii+json": {
    source: "iana",
    compressible: true
  },
  "application/td+json": {
    source: "iana",
    compressible: true
  },
  "application/tei+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "tei",
      "teicorpus"
    ]
  },
  "application/tetra_isi": {
    source: "iana"
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "tfi"
    ]
  },
  "application/timestamp-query": {
    source: "iana"
  },
  "application/timestamp-reply": {
    source: "iana"
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: [
      "tsd"
    ]
  },
  "application/tlsrpt+gzip": {
    source: "iana"
  },
  "application/tlsrpt+json": {
    source: "iana",
    compressible: true
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/toml": {
    compressible: true,
    extensions: [
      "toml"
    ]
  },
  "application/trickle-ice-sdpfrag": {
    source: "iana"
  },
  "application/trig": {
    source: "iana"
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ttml"
    ]
  },
  "application/tve-trigger": {
    source: "iana"
  },
  "application/tzif": {
    source: "iana"
  },
  "application/tzif-leap": {
    source: "iana"
  },
  "application/ubjson": {
    compressible: false,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vcard+json": {
    source: "iana",
    compressible: true
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: true
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.interworking-data": {
    source: "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: [
      "plb"
    ]
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: [
      "psb"
    ]
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: [
      "pvb"
    ]
  },
  "application/vnd.3gpp.sms": {
    source: "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.3gpp2.sms": {
    source: "iana"
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: [
      "tcap"
    ]
  },
  "application/vnd.3lightssoftware.imagescal": {
    source: "iana"
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: [
      "pwn"
    ]
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: [
      "aso"
    ]
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: [
      "imp"
    ]
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: [
      "acu"
    ]
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: [
      "atc",
      "acutc"
    ]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: false,
    extensions: [
      "air"
    ]
  },
  "application/vnd.adobe.flash.movie": {
    source: "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: [
      "fcdt"
    ]
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: [
      "fxp",
      "fxpl"
    ]
  },
  "application/vnd.adobe.partial-upload": {
    source: "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdp"
    ]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: [
      "xfdf"
    ]
  },
  "application/vnd.aether.imp": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    source: "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    source: "iana"
  },
  "application/vnd.afpc.foca-charset": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    source: "iana"
  },
  "application/vnd.afpc.modca": {
    source: "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    source: "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    source: "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    source: "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    source: "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    source: "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    source: "iana"
  },
  "application/vnd.ah-barcode": {
    source: "iana"
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: [
      "ahead"
    ]
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: [
      "azf"
    ]
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: [
      "azs"
    ]
  },
  "application/vnd.amadeus+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: [
      "azw"
    ]
  },
  "application/vnd.amazon.mobi8-ebook": {
    source: "iana"
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: [
      "acc"
    ]
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: [
      "ami"
    ]
  },
  "application/vnd.amundsen.maze+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: false,
    extensions: [
      "apk"
    ]
  },
  "application/vnd.anki": {
    source: "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: [
      "cii"
    ]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: [
      "fti"
    ]
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: [
      "atx"
    ]
  },
  "application/vnd.apache.thrift.binary": {
    source: "iana"
  },
  "application/vnd.apache.thrift.compact": {
    source: "iana"
  },
  "application/vnd.apache.thrift.json": {
    source: "iana"
  },
  "application/vnd.api+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mpkg"
    ]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: [
      "key"
    ]
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: [
      "m3u8"
    ]
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: [
      "numbers"
    ]
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: [
      "pages"
    ]
  },
  "application/vnd.apple.pkpass": {
    compressible: false,
    extensions: [
      "pkpass"
    ]
  },
  "application/vnd.arastra.swi": {
    source: "iana"
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: [
      "swi"
    ]
  },
  "application/vnd.artisan+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.artsquare": {
    source: "iana"
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: [
      "iota"
    ]
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: [
      "aep"
    ]
  },
  "application/vnd.autopackage": {
    source: "iana"
  },
  "application/vnd.avalon+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "bmml"
    ]
  },
  "application/vnd.balsamiq.bmpr": {
    source: "iana"
  },
  "application/vnd.banana-accounting": {
    source: "iana"
  },
  "application/vnd.bbf.usp.error": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.blink-idb-value-wrapper": {
    source: "iana"
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: [
      "mpm"
    ]
  },
  "application/vnd.bluetooth.ep.oob": {
    source: "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    source: "iana"
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: [
      "bmi"
    ]
  },
  "application/vnd.bpf": {
    source: "iana"
  },
  "application/vnd.bpf3": {
    source: "iana"
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: [
      "rep"
    ]
  },
  "application/vnd.byu.uapi+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cab-jscript": {
    source: "iana"
  },
  "application/vnd.canon-cpdl": {
    source: "iana"
  },
  "application/vnd.canon-lips": {
    source: "iana"
  },
  "application/vnd.capasystems-pg+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "cdxml"
    ]
  },
  "application/vnd.chess-pgn": {
    source: "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: [
      "mmd"
    ]
  },
  "application/vnd.ciedi": {
    source: "iana"
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: [
      "cdy"
    ]
  },
  "application/vnd.cirpack.isdn-ext": {
    source: "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "csl"
    ]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: [
      "cla"
    ]
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: [
      "rp9"
    ]
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: [
      "c11amc"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: [
      "c11amz"
    ]
  },
  "application/vnd.coffeescript": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    source: "iana"
  },
  "application/vnd.collection+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.comicbook-rar": {
    source: "iana"
  },
  "application/vnd.commerce-battelle": {
    source: "iana"
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: [
      "csp"
    ]
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: [
      "cdbcmsg"
    ]
  },
  "application/vnd.coreos.ignition+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: [
      "cmc"
    ]
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: [
      "clkx"
    ]
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: [
      "clkk"
    ]
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: [
      "clkp"
    ]
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: [
      "clkt"
    ]
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: [
      "clkw"
    ]
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.crypto-shade-file": {
    source: "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    source: "iana"
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: [
      "pml"
    ]
  },
  "application/vnd.ctct.ws+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cups-pdf": {
    source: "iana"
  },
  "application/vnd.cups-postscript": {
    source: "iana"
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: [
      "ppd"
    ]
  },
  "application/vnd.cups-raster": {
    source: "iana"
  },
  "application/vnd.cups-raw": {
    source: "iana"
  },
  "application/vnd.curl": {
    source: "iana"
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: [
      "car"
    ]
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: [
      "pcurl"
    ]
  },
  "application/vnd.cyan.dean.root+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: true,
    extensions: [
      "dart"
    ]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: [
      "rdz"
    ]
  },
  "application/vnd.datapackage+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: [
      "dbf"
    ]
  },
  "application/vnd.debian.binary-package": {
    source: "iana"
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ]
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "uvt",
      "uvvt"
    ]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: [
      "uvx",
      "uvvx"
    ]
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: [
      "uvz",
      "uvvz"
    ]
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: [
      "fe_launch"
    ]
  },
  "application/vnd.desmume.movie": {
    source: "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    source: "iana"
  },
  "application/vnd.dm.delegation+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: [
      "mlp"
    ]
  },
  "application/vnd.dolby.mobile.1": {
    source: "iana"
  },
  "application/vnd.dolby.mobile.2": {
    source: "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    source: "iana"
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: [
      "dpg"
    ]
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: [
      "dfac"
    ]
  },
  "application/vnd.drive+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: [
      "kpxx"
    ]
  },
  "application/vnd.dtg.local": {
    source: "iana"
  },
  "application/vnd.dtg.local.flash": {
    source: "iana"
  },
  "application/vnd.dtg.local.html": {
    source: "iana"
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: [
      "ait"
    ]
  },
  "application/vnd.dvb.dvbisl+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.dvbj": {
    source: "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    source: "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.dvb.pfr": {
    source: "iana"
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: [
      "svc"
    ]
  },
  "application/vnd.dxr": {
    source: "iana"
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: [
      "geo"
    ]
  },
  "application/vnd.dzr": {
    source: "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    source: "iana"
  },
  "application/vnd.ecdis-update": {
    source: "iana"
  },
  "application/vnd.ecip.rlp": {
    source: "iana"
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: [
      "mag"
    ]
  },
  "application/vnd.ecowin.filerequest": {
    source: "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    source: "iana"
  },
  "application/vnd.ecowin.series": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    source: "iana"
  },
  "application/vnd.efi.img": {
    source: "iana"
  },
  "application/vnd.efi.iso": {
    source: "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: [
      "nml"
    ]
  },
  "application/vnd.enphase.envoy": {
    source: "iana"
  },
  "application/vnd.eprints.data+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: [
      "esf"
    ]
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: [
      "msf"
    ]
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: [
      "qam"
    ]
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: [
      "slt"
    ]
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: [
      "ssf"
    ]
  },
  "application/vnd.ericsson.quickcall": {
    source: "iana"
  },
  "application/vnd.espass-espass+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eudora.data": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    source: "iana"
  },
  "application/vnd.exstream-empower+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.exstream-package": {
    source: "iana"
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: [
      "ez2"
    ]
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: [
      "ez3"
    ]
  },
  "application/vnd.f-secure.mobile": {
    source: "iana"
  },
  "application/vnd.fastcopy-disk-image": {
    source: "iana"
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: [
      "fdf"
    ]
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: [
      "mseed"
    ]
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: [
      "seed",
      "dataless"
    ]
  },
  "application/vnd.ffsns": {
    source: "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.filmit.zfc": {
    source: "iana"
  },
  "application/vnd.fints": {
    source: "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    source: "iana"
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: [
      "gph"
    ]
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: [
      "ftc"
    ]
  },
  "application/vnd.font-fontforge-sfd": {
    source: "iana"
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: [
      "fm",
      "frame",
      "maker",
      "book"
    ]
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: [
      "fnc"
    ]
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: [
      "ltf"
    ]
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: [
      "fsc"
    ]
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: [
      "oas"
    ]
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: [
      "oa2"
    ]
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: [
      "oa3"
    ]
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: [
      "fg5"
    ]
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: [
      "bh2"
    ]
  },
  "application/vnd.fujixerox.art-ex": {
    source: "iana"
  },
  "application/vnd.fujixerox.art4": {
    source: "iana"
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: [
      "ddd"
    ]
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: [
      "xdw"
    ]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: [
      "xbd"
    ]
  },
  "application/vnd.fujixerox.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    source: "iana"
  },
  "application/vnd.fut-misnet": {
    source: "iana"
  },
  "application/vnd.futoin+cbor": {
    source: "iana"
  },
  "application/vnd.futoin+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: [
      "fzs"
    ]
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: [
      "txd"
    ]
  },
  "application/vnd.gentics.grd+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: [
      "ggb"
    ]
  },
  "application/vnd.geogebra.slides": {
    source: "iana"
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: [
      "ggt"
    ]
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: [
      "gex",
      "gre"
    ]
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: [
      "gxt"
    ]
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: [
      "g2w"
    ]
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: [
      "g3w"
    ]
  },
  "application/vnd.gerber": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    source: "iana"
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: [
      "gmx"
    ]
  },
  "application/vnd.google-apps.document": {
    compressible: false,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: false,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: false,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: false,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: [
      "gqf",
      "gqs"
    ]
  },
  "application/vnd.gridmp": {
    source: "iana"
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: [
      "gac"
    ]
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: [
      "ghf"
    ]
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: [
      "gim"
    ]
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: [
      "grv"
    ]
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: [
      "gtm"
    ]
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: [
      "tpl"
    ]
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: [
      "vcg"
    ]
  },
  "application/vnd.hal+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "zmm"
    ]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: [
      "hbci"
    ]
  },
  "application/vnd.hc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: [
      "les"
    ]
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: [
      "hpgl"
    ]
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: [
      "hpid"
    ]
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: [
      "hps"
    ]
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: [
      "jlt"
    ]
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: [
      "pcl"
    ]
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: [
      "pclxl"
    ]
  },
  "application/vnd.httphone": {
    source: "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: [
      "sfd-hdstx"
    ]
  },
  "application/vnd.hyper+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.hzn-3d-crossword": {
    source: "iana"
  },
  "application/vnd.ibm.afplinedata": {
    source: "iana"
  },
  "application/vnd.ibm.electronic-media": {
    source: "iana"
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: [
      "mpy"
    ]
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: [
      "afp",
      "listafp",
      "list3820"
    ]
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: [
      "irm"
    ]
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: [
      "sc"
    ]
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: [
      "icc",
      "icm"
    ]
  },
  "application/vnd.ieee.1905": {
    source: "iana"
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: [
      "igl"
    ]
  },
  "application/vnd.imagemeter.folder+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: [
      "ivp"
    ]
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: [
      "ivu"
    ]
  },
  "application/vnd.ims.imsccv1p1": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    source: "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.innopath.wamp.notification": {
    source: "iana"
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: [
      "igm"
    ]
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: [
      "xpw",
      "xpx"
    ]
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: [
      "i2g"
    ]
  },
  "application/vnd.intertrust.digibox": {
    source: "iana"
  },
  "application/vnd.intertrust.nncp": {
    source: "iana"
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: [
      "qbo"
    ]
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: [
      "qfx"
    ]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "irp"
    ]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: [
      "xpr"
    ]
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: [
      "fcs"
    ]
  },
  "application/vnd.iso11783-10+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: [
      "jam"
    ]
  },
  "application/vnd.japannet-directory-service": {
    source: "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-registration": {
    source: "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-verification": {
    source: "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    source: "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: [
      "rms"
    ]
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: [
      "jisp"
    ]
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: [
      "joda"
    ]
  },
  "application/vnd.jsk.isdn-ngn": {
    source: "iana"
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: [
      "ktz",
      "ktr"
    ]
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: [
      "karbon"
    ]
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: [
      "chrt"
    ]
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: [
      "kfo"
    ]
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: [
      "flw"
    ]
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: [
      "kon"
    ]
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: [
      "kpr",
      "kpt"
    ]
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: [
      "ksp"
    ]
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: [
      "kwd",
      "kwt"
    ]
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: [
      "htke"
    ]
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: [
      "kia"
    ]
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: [
      "kne",
      "knp"
    ]
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: [
      "skp",
      "skd",
      "skt",
      "skm"
    ]
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: [
      "sse"
    ]
  },
  "application/vnd.las": {
    source: "iana"
  },
  "application/vnd.las.las+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: false
  },
  "application/vnd.loom": {
    source: "iana"
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: [
      "123"
    ]
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: [
      "apr"
    ]
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: [
      "pre"
    ]
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: [
      "nsf"
    ]
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: [
      "org"
    ]
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: [
      "scm"
    ]
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: [
      "lwp"
    ]
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: [
      "portpkg"
    ]
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana"
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.maxmind.maxmind-db": {
    source: "iana"
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: [
      "mcd"
    ]
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: [
      "mc1"
    ]
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: [
      "cdkey"
    ]
  },
  "application/vnd.meridian-slingshot": {
    source: "iana"
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: [
      "mwf"
    ]
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: [
      "mfm"
    ]
  },
  "application/vnd.micro+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: [
      "flo"
    ]
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: [
      "igx"
    ]
  },
  "application/vnd.microsoft.portable-executable": {
    source: "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    source: "iana"
  },
  "application/vnd.miele+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: [
      "mif"
    ]
  },
  "application/vnd.minisoft-hp3000-save": {
    source: "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    source: "iana"
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: [
      "daf"
    ]
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: [
      "dis"
    ]
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: [
      "mbk"
    ]
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: [
      "mqy"
    ]
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: [
      "msl"
    ]
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: [
      "plc"
    ]
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: [
      "txf"
    ]
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: [
      "mpn"
    ]
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: [
      "mpc"
    ]
  },
  "application/vnd.motorola.flexsuite": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    source: "iana"
  },
  "application/vnd.motorola.iprm": {
    source: "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xul"
    ]
  },
  "application/vnd.ms-3mfdocument": {
    source: "iana"
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: [
      "cil"
    ]
  },
  "application/vnd.ms-asf": {
    source: "iana"
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: [
      "cab"
    ]
  },
  "application/vnd.ms-color.iccprofile": {
    source: "apache"
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: false,
    extensions: [
      "xls",
      "xlm",
      "xla",
      "xlc",
      "xlt",
      "xlw"
    ]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlam"
    ]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsb"
    ]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsm"
    ]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "xltm"
    ]
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: true,
    extensions: [
      "eot"
    ]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: [
      "chm"
    ]
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: [
      "ims"
    ]
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: [
      "lrm"
    ]
  },
  "application/vnd.ms-office.activex+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-outlook": {
    compressible: false,
    extensions: [
      "msg"
    ]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    source: "apache"
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: [
      "cat"
    ]
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: [
      "stl"
    ]
  },
  "application/vnd.ms-playready.initiator+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: false,
    extensions: [
      "ppt",
      "pps",
      "pot"
    ]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppam"
    ]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: [
      "pptm"
    ]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: [
      "sldm"
    ]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppsm"
    ]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "potm"
    ]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: true
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: [
      "mpp",
      "mpt"
    ]
  },
  "application/vnd.ms-tnef": {
    source: "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    source: "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    source: "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: [
      "docm"
    ]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "dotm"
    ]
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ]
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: [
      "wpl"
    ]
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: false,
    extensions: [
      "xps"
    ]
  },
  "application/vnd.msa-disk-image": {
    source: "iana"
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: [
      "mseq"
    ]
  },
  "application/vnd.msign": {
    source: "iana"
  },
  "application/vnd.multiad.creator": {
    source: "iana"
  },
  "application/vnd.multiad.creator.cif": {
    source: "iana"
  },
  "application/vnd.music-niff": {
    source: "iana"
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: [
      "mus"
    ]
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: [
      "msty"
    ]
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: [
      "taglet"
    ]
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nebumind.line": {
    source: "iana"
  },
  "application/vnd.nervana": {
    source: "iana"
  },
  "application/vnd.netfpx": {
    source: "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: [
      "nlu"
    ]
  },
  "application/vnd.nimn": {
    source: "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    source: "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    source: "iana"
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: [
      "ntf",
      "nitf"
    ]
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: [
      "nnd"
    ]
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: [
      "nns"
    ]
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: [
      "nnw"
    ]
  },
  "application/vnd.nokia.catalogs": {
    source: "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.conml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "ac"
    ]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: [
      "ngdat"
    ]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: [
      "n-gage"
    ]
  },
  "application/vnd.nokia.ncd": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: [
      "rpst"
    ]
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: [
      "rpss"
    ]
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: [
      "edm"
    ]
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: [
      "edx"
    ]
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: [
      "ext"
    ]
  },
  "application/vnd.ntt-local.content-share": {
    source: "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    source: "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    source: "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: [
      "odc"
    ]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: [
      "otc"
    ]
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: [
      "odb"
    ]
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: [
      "odf"
    ]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: [
      "odft"
    ]
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: false,
    extensions: [
      "odg"
    ]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: [
      "otg"
    ]
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: [
      "odi"
    ]
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: [
      "oti"
    ]
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: false,
    extensions: [
      "odp"
    ]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: [
      "otp"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: false,
    extensions: [
      "ods"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: [
      "ots"
    ]
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: false,
    extensions: [
      "odt"
    ]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: [
      "odm"
    ]
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: [
      "ott"
    ]
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: [
      "oth"
    ]
  },
  "application/vnd.obn": {
    source: "iana"
  },
  "application/vnd.ocf+cbor": {
    source: "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: [
      "xo"
    ]
  },
  "application/vnd.oma-scws-config": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-request": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-response": {
    source: "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.omaloc-supl-init": {
    source: "iana"
  },
  "application/vnd.onepager": {
    source: "iana"
  },
  "application/vnd.onepagertamp": {
    source: "iana"
  },
  "application/vnd.onepagertamx": {
    source: "iana"
  },
  "application/vnd.onepagertat": {
    source: "iana"
  },
  "application/vnd.onepagertatp": {
    source: "iana"
  },
  "application/vnd.onepagertatx": {
    source: "iana"
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "obgx"
    ]
  },
  "application/vnd.openblox.game-binary": {
    source: "iana"
  },
  "application/vnd.openeye.oeb": {
    source: "iana"
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: [
      "oxt"
    ]
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: false,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: false,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: false,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.orange.indata": {
    source: "iana"
  },
  "application/vnd.osa.netdeploy": {
    source: "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: [
      "mgp"
    ]
  },
  "application/vnd.osgi.bundle": {
    source: "iana"
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: [
      "dp"
    ]
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: [
      "esa"
    ]
  },
  "application/vnd.otps.ct-kip+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: [
      "pdb",
      "pqa",
      "oprc"
    ]
  },
  "application/vnd.panoply": {
    source: "iana"
  },
  "application/vnd.paos.xml": {
    source: "iana"
  },
  "application/vnd.patentdive": {
    source: "iana"
  },
  "application/vnd.patientecommsdoc": {
    source: "iana"
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: [
      "paw"
    ]
  },
  "application/vnd.pcos": {
    source: "iana"
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: [
      "str"
    ]
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: [
      "ei6"
    ]
  },
  "application/vnd.piaccess.application-licence": {
    source: "iana"
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: [
      "efif"
    ]
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: [
      "wg"
    ]
  },
  "application/vnd.poc.group-advertisement+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: [
      "plf"
    ]
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: [
      "pbd"
    ]
  },
  "application/vnd.powerbuilder6-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder7": {
    source: "iana"
  },
  "application/vnd.powerbuilder7-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder75": {
    source: "iana"
  },
  "application/vnd.powerbuilder75-s": {
    source: "iana"
  },
  "application/vnd.preminet": {
    source: "iana"
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: [
      "box"
    ]
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: [
      "mgz"
    ]
  },
  "application/vnd.psfs": {
    source: "iana"
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: [
      "qps"
    ]
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: [
      "ptid"
    ]
  },
  "application/vnd.pwg-multiplexed": {
    source: "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.qualcomm.brew-app-res": {
    source: "iana"
  },
  "application/vnd.quarantainenet": {
    source: "iana"
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ]
  },
  "application/vnd.quobject-quoxdocument": {
    source: "iana"
  },
  "application/vnd.radisys.moml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.rainstor.data": {
    source: "iana"
  },
  "application/vnd.rapid": {
    source: "iana"
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: [
      "rar"
    ]
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: [
      "bed"
    ]
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: [
      "mxl"
    ]
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "musicxml"
    ]
  },
  "application/vnd.renlearn.rlprint": {
    source: "iana"
  },
  "application/vnd.restful+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: [
      "cryptonote"
    ]
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: [
      "cod"
    ]
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: [
      "rm"
    ]
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: [
      "rmvb"
    ]
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "link66"
    ]
  },
  "application/vnd.rs-274x": {
    source: "iana"
  },
  "application/vnd.ruckus.download": {
    source: "iana"
  },
  "application/vnd.s3sms": {
    source: "iana"
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: [
      "st"
    ]
  },
  "application/vnd.sar": {
    source: "iana"
  },
  "application/vnd.sbm.cid": {
    source: "iana"
  },
  "application/vnd.sbm.mid2": {
    source: "iana"
  },
  "application/vnd.scribus": {
    source: "iana"
  },
  "application/vnd.sealed.3df": {
    source: "iana"
  },
  "application/vnd.sealed.csf": {
    source: "iana"
  },
  "application/vnd.sealed.doc": {
    source: "iana"
  },
  "application/vnd.sealed.eml": {
    source: "iana"
  },
  "application/vnd.sealed.mht": {
    source: "iana"
  },
  "application/vnd.sealed.net": {
    source: "iana"
  },
  "application/vnd.sealed.ppt": {
    source: "iana"
  },
  "application/vnd.sealed.tiff": {
    source: "iana"
  },
  "application/vnd.sealed.xls": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    source: "iana"
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: [
      "see"
    ]
  },
  "application/vnd.seis+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: [
      "sema"
    ]
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: [
      "semd"
    ]
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: [
      "semf"
    ]
  },
  "application/vnd.shade-save-file": {
    source: "iana"
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: [
      "ifm"
    ]
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: [
      "itp"
    ]
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: [
      "iif"
    ]
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: [
      "ipk"
    ]
  },
  "application/vnd.shootproof+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.shp": {
    source: "iana"
  },
  "application/vnd.shx": {
    source: "iana"
  },
  "application/vnd.sigrok.session": {
    source: "iana"
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: [
      "twd",
      "twds"
    ]
  },
  "application/vnd.siren+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: [
      "mmf"
    ]
  },
  "application/vnd.smart.notebook": {
    source: "iana"
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: [
      "teacher"
    ]
  },
  "application/vnd.snesdev-page-table": {
    source: "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "sdkm",
      "sdkd"
    ]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: [
      "dxp"
    ]
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: [
      "sfs"
    ]
  },
  "application/vnd.sqlite3": {
    source: "iana"
  },
  "application/vnd.sss-cod": {
    source: "iana"
  },
  "application/vnd.sss-dtf": {
    source: "iana"
  },
  "application/vnd.sss-ntf": {
    source: "iana"
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: [
      "sdc"
    ]
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: [
      "sda"
    ]
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: [
      "sdd"
    ]
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: [
      "smf"
    ]
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: [
      "sdw",
      "vor"
    ]
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: [
      "sgl"
    ]
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: [
      "smzip"
    ]
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: [
      "sm"
    ]
  },
  "application/vnd.street-stream": {
    source: "iana"
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wadl"
    ]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: [
      "sxc"
    ]
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: [
      "stc"
    ]
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: [
      "sxd"
    ]
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: [
      "std"
    ]
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: [
      "sxi"
    ]
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: [
      "sti"
    ]
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: [
      "sxm"
    ]
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: [
      "sxw"
    ]
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: [
      "sxg"
    ]
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: [
      "stw"
    ]
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: [
      "sus",
      "susp"
    ]
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: [
      "svd"
    ]
  },
  "application/vnd.swiftview-ics": {
    source: "iana"
  },
  "application/vnd.sycle+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: [
      "sis",
      "sisx"
    ]
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "xsm"
    ]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "bdm"
    ]
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "xdm"
    ]
  },
  "application/vnd.syncml.dm.notification": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "ddf"
    ]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: [
      "tao"
    ]
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: [
      "pcap",
      "cap",
      "dmp"
    ]
  },
  "application/vnd.think-cell.ppttc+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.tml": {
    source: "iana"
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: [
      "tmo"
    ]
  },
  "application/vnd.tri.onesource": {
    source: "iana"
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: [
      "tpt"
    ]
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: [
      "mxs"
    ]
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: [
      "tra"
    ]
  },
  "application/vnd.truedoc": {
    source: "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    source: "iana"
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: [
      "ufd",
      "ufdl"
    ]
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: [
      "utz"
    ]
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: [
      "umj"
    ]
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: [
      "unityweb"
    ]
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "uoml"
    ]
  },
  "application/vnd.uplanet.alert": {
    source: "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.channel": {
    source: "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.list": {
    source: "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.signal": {
    source: "iana"
  },
  "application/vnd.uri-map": {
    source: "iana"
  },
  "application/vnd.valve.source.material": {
    source: "iana"
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: [
      "vcx"
    ]
  },
  "application/vnd.vd-study": {
    source: "iana"
  },
  "application/vnd.vectorworks": {
    source: "iana"
  },
  "application/vnd.vel+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veryant.thin": {
    source: "iana"
  },
  "application/vnd.ves.encrypted": {
    source: "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    source: "iana"
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: [
      "vsd",
      "vst",
      "vss",
      "vsw"
    ]
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: [
      "vis"
    ]
  },
  "application/vnd.vividence.scriptfile": {
    source: "iana"
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: [
      "vsf"
    ]
  },
  "application/vnd.wap.sic": {
    source: "iana"
  },
  "application/vnd.wap.slc": {
    source: "iana"
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "wbxml"
    ]
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: [
      "wmlc"
    ]
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: [
      "wmlsc"
    ]
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: [
      "wtb"
    ]
  },
  "application/vnd.wfa.dpp": {
    source: "iana"
  },
  "application/vnd.wfa.p2p": {
    source: "iana"
  },
  "application/vnd.wfa.wsc": {
    source: "iana"
  },
  "application/vnd.windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.wmc": {
    source: "iana"
  },
  "application/vnd.wmf.bootstrap": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    source: "iana"
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: [
      "nbp"
    ]
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: [
      "wpd"
    ]
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: [
      "wqd"
    ]
  },
  "application/vnd.wrq-hp3000-labelled": {
    source: "iana"
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: [
      "stf"
    ]
  },
  "application/vnd.wv.csp+wbxml": {
    source: "iana"
  },
  "application/vnd.wv.csp+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: [
      "xar"
    ]
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: [
      "xfdl"
    ]
  },
  "application/vnd.xfdl.webform": {
    source: "iana"
  },
  "application/vnd.xmi+xml": {
    source: "iana",
    compressible: true
  },
  "application/vnd.xmpie.cpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.dpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.plan": {
    source: "iana"
  },
  "application/vnd.xmpie.ppkg": {
    source: "iana"
  },
  "application/vnd.xmpie.xlim": {
    source: "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: [
      "hvd"
    ]
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: [
      "hvs"
    ]
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: [
      "hvp"
    ]
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: [
      "osf"
    ]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "osfpvg"
    ]
  },
  "application/vnd.yamaha.remote-setup": {
    source: "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: [
      "saf"
    ]
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: [
      "spf"
    ]
  },
  "application/vnd.yamaha.through-ngn": {
    source: "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    source: "iana"
  },
  "application/vnd.yaoweme": {
    source: "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: [
      "cmp"
    ]
  },
  "application/vnd.youtube.yt": {
    source: "iana"
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: [
      "zir",
      "zirz"
    ]
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: true
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    compressible: true,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: true
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: true
  },
  "application/whoispp-query": {
    source: "iana"
  },
  "application/whoispp-response": {
    source: "iana"
  },
  "application/widget": {
    source: "iana",
    extensions: [
      "wgt"
    ]
  },
  "application/winhlp": {
    source: "apache",
    extensions: [
      "hlp"
    ]
  },
  "application/wita": {
    source: "iana"
  },
  "application/wordperfect5.1": {
    source: "iana"
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: false,
    extensions: [
      "7z"
    ]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: [
      "abw"
    ]
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: [
      "ace"
    ]
  },
  "application/x-amf": {
    source: "apache"
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: [
      "dmg"
    ]
  },
  "application/x-arj": {
    compressible: false,
    extensions: [
      "arj"
    ]
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: [
      "aab",
      "x32",
      "u32",
      "vox"
    ]
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: [
      "aam"
    ]
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: [
      "aas"
    ]
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: [
      "bcpio"
    ]
  },
  "application/x-bdoc": {
    compressible: false,
    extensions: [
      "bdoc"
    ]
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: [
      "torrent"
    ]
  },
  "application/x-blorb": {
    source: "apache",
    extensions: [
      "blb",
      "blorb"
    ]
  },
  "application/x-bzip": {
    source: "apache",
    compressible: false,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: false,
    extensions: [
      "bz2",
      "boz"
    ]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: [
      "cbr",
      "cba",
      "cbt",
      "cbz",
      "cb7"
    ]
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: [
      "vcd"
    ]
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: [
      "cfs"
    ]
  },
  "application/x-chat": {
    source: "apache",
    extensions: [
      "chat"
    ]
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: [
      "pgn"
    ]
  },
  "application/x-chrome-extension": {
    extensions: [
      "crx"
    ]
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: [
      "cco"
    ]
  },
  "application/x-compress": {
    source: "apache"
  },
  "application/x-conference": {
    source: "apache",
    extensions: [
      "nsc"
    ]
  },
  "application/x-cpio": {
    source: "apache",
    extensions: [
      "cpio"
    ]
  },
  "application/x-csh": {
    source: "apache",
    extensions: [
      "csh"
    ]
  },
  "application/x-deb": {
    compressible: false
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: [
      "deb",
      "udeb"
    ]
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: [
      "dgc"
    ]
  },
  "application/x-director": {
    source: "apache",
    extensions: [
      "dir",
      "dcr",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ]
  },
  "application/x-doom": {
    source: "apache",
    extensions: [
      "wad"
    ]
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: false,
    extensions: [
      "dvi"
    ]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: [
      "evy"
    ]
  },
  "application/x-eva": {
    source: "apache",
    extensions: [
      "eva"
    ]
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: [
      "bdf"
    ]
  },
  "application/x-font-dos": {
    source: "apache"
  },
  "application/x-font-framemaker": {
    source: "apache"
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: [
      "gsf"
    ]
  },
  "application/x-font-libgrx": {
    source: "apache"
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: [
      "psf"
    ]
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: [
      "pcf"
    ]
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: [
      "snf"
    ]
  },
  "application/x-font-speedo": {
    source: "apache"
  },
  "application/x-font-sunos-news": {
    source: "apache"
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ]
  },
  "application/x-font-vfont": {
    source: "apache"
  },
  "application/x-freearc": {
    source: "apache",
    extensions: [
      "arc"
    ]
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: [
      "spl"
    ]
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: [
      "gca"
    ]
  },
  "application/x-glulx": {
    source: "apache",
    extensions: [
      "ulx"
    ]
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: [
      "gnumeric"
    ]
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: [
      "gramps"
    ]
  },
  "application/x-gtar": {
    source: "apache",
    extensions: [
      "gtar"
    ]
  },
  "application/x-gzip": {
    source: "apache"
  },
  "application/x-hdf": {
    source: "apache",
    extensions: [
      "hdf"
    ]
  },
  "application/x-httpd-php": {
    compressible: true,
    extensions: [
      "php"
    ]
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: [
      "install"
    ]
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: [
      "iso"
    ]
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: [
      "jardiff"
    ]
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: false,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: true
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: false,
    extensions: [
      "latex"
    ]
  },
  "application/x-lua-bytecode": {
    extensions: [
      "luac"
    ]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: [
      "lzh",
      "lha"
    ]
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: [
      "run"
    ]
  },
  "application/x-mie": {
    source: "apache",
    extensions: [
      "mie"
    ]
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: [
      "prc",
      "mobi"
    ]
  },
  "application/x-mpegurl": {
    compressible: false
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: [
      "application"
    ]
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: [
      "lnk"
    ]
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: [
      "wmd"
    ]
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: [
      "wmz"
    ]
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: [
      "xbap"
    ]
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: [
      "mdb"
    ]
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: [
      "obd"
    ]
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: [
      "crd"
    ]
  },
  "application/x-msclip": {
    source: "apache",
    extensions: [
      "clp"
    ]
  },
  "application/x-msdos-program": {
    extensions: [
      "exe"
    ]
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: [
      "exe",
      "dll",
      "com",
      "bat",
      "msi"
    ]
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: [
      "mvb",
      "m13",
      "m14"
    ]
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ]
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: [
      "mny"
    ]
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: [
      "pub"
    ]
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: [
      "scd"
    ]
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: [
      "trm"
    ]
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: [
      "wri"
    ]
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: [
      "nc",
      "cdf"
    ]
  },
  "application/x-ns-proxy-autoconfig": {
    compressible: true,
    extensions: [
      "pac"
    ]
  },
  "application/x-nzb": {
    source: "apache",
    extensions: [
      "nzb"
    ]
  },
  "application/x-perl": {
    source: "nginx",
    extensions: [
      "pl",
      "pm"
    ]
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: [
      "prc",
      "pdb"
    ]
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: false,
    extensions: [
      "p12",
      "pfx"
    ]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: [
      "p7b",
      "spc"
    ]
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: [
      "p7r"
    ]
  },
  "application/x-pki-message": {
    source: "iana"
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: false,
    extensions: [
      "rar"
    ]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: [
      "rpm"
    ]
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: [
      "ris"
    ]
  },
  "application/x-sea": {
    source: "nginx",
    extensions: [
      "sea"
    ]
  },
  "application/x-sh": {
    source: "apache",
    compressible: true,
    extensions: [
      "sh"
    ]
  },
  "application/x-shar": {
    source: "apache",
    extensions: [
      "shar"
    ]
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: false,
    extensions: [
      "swf"
    ]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: [
      "xap"
    ]
  },
  "application/x-sql": {
    source: "apache",
    extensions: [
      "sql"
    ]
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: false,
    extensions: [
      "sit"
    ]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: [
      "sitx"
    ]
  },
  "application/x-subrip": {
    source: "apache",
    extensions: [
      "srt"
    ]
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: [
      "sv4cpio"
    ]
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: [
      "sv4crc"
    ]
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: [
      "t3"
    ]
  },
  "application/x-tads": {
    source: "apache",
    extensions: [
      "gam"
    ]
  },
  "application/x-tar": {
    source: "apache",
    compressible: true,
    extensions: [
      "tar"
    ]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: [
      "tcl",
      "tk"
    ]
  },
  "application/x-tex": {
    source: "apache",
    extensions: [
      "tex"
    ]
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: [
      "tfm"
    ]
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: [
      "texinfo",
      "texi"
    ]
  },
  "application/x-tgif": {
    source: "apache",
    extensions: [
      "obj"
    ]
  },
  "application/x-ustar": {
    source: "apache",
    extensions: [
      "ustar"
    ]
  },
  "application/x-virtualbox-hdd": {
    compressible: true,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: true,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: true,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: true,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: false,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: true,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: true,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: true,
    extensions: [
      "vmdk"
    ]
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: [
      "src"
    ]
  },
  "application/x-web-app-manifest+json": {
    compressible: true,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: true
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: [
      "der",
      "crt",
      "pem"
    ]
  },
  "application/x-x509-ca-ra-cert": {
    source: "iana"
  },
  "application/x-x509-next-ca-cert": {
    source: "iana"
  },
  "application/x-xfig": {
    source: "apache",
    extensions: [
      "fig"
    ]
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: false,
    extensions: [
      "xpi"
    ]
  },
  "application/x-xz": {
    source: "apache",
    extensions: [
      "xz"
    ]
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ]
  },
  "application/x400-bp": {
    source: "iana"
  },
  "application/xacml+xml": {
    source: "iana",
    compressible: true
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: true
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: true
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: true
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: true,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: true
  },
  "application/xop+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: true,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ]
  },
  "application/yang": {
    source: "iana",
    extensions: [
      "yang"
    ]
  },
  "application/yang-data+json": {
    source: "iana",
    compressible: true
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: true
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: true
  },
  "application/yin+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "zip"
    ]
  },
  "application/zlib": {
    source: "iana"
  },
  "application/zstd": {
    source: "iana"
  },
  "audio/1d-interleaved-parityfec": {
    source: "iana"
  },
  "audio/32kadpcm": {
    source: "iana"
  },
  "audio/3gpp": {
    source: "iana",
    compressible: false,
    extensions: [
      "3gpp"
    ]
  },
  "audio/3gpp2": {
    source: "iana"
  },
  "audio/aac": {
    source: "iana"
  },
  "audio/ac3": {
    source: "iana"
  },
  "audio/adpcm": {
    source: "apache",
    extensions: [
      "adp"
    ]
  },
  "audio/amr": {
    source: "iana",
    extensions: [
      "amr"
    ]
  },
  "audio/amr-wb": {
    source: "iana"
  },
  "audio/amr-wb+": {
    source: "iana"
  },
  "audio/aptx": {
    source: "iana"
  },
  "audio/asc": {
    source: "iana"
  },
  "audio/atrac-advanced-lossless": {
    source: "iana"
  },
  "audio/atrac-x": {
    source: "iana"
  },
  "audio/atrac3": {
    source: "iana"
  },
  "audio/basic": {
    source: "iana",
    compressible: false,
    extensions: [
      "au",
      "snd"
    ]
  },
  "audio/bv16": {
    source: "iana"
  },
  "audio/bv32": {
    source: "iana"
  },
  "audio/clearmode": {
    source: "iana"
  },
  "audio/cn": {
    source: "iana"
  },
  "audio/dat12": {
    source: "iana"
  },
  "audio/dls": {
    source: "iana"
  },
  "audio/dsr-es201108": {
    source: "iana"
  },
  "audio/dsr-es202050": {
    source: "iana"
  },
  "audio/dsr-es202211": {
    source: "iana"
  },
  "audio/dsr-es202212": {
    source: "iana"
  },
  "audio/dv": {
    source: "iana"
  },
  "audio/dvi4": {
    source: "iana"
  },
  "audio/eac3": {
    source: "iana"
  },
  "audio/encaprtp": {
    source: "iana"
  },
  "audio/evrc": {
    source: "iana"
  },
  "audio/evrc-qcp": {
    source: "iana"
  },
  "audio/evrc0": {
    source: "iana"
  },
  "audio/evrc1": {
    source: "iana"
  },
  "audio/evrcb": {
    source: "iana"
  },
  "audio/evrcb0": {
    source: "iana"
  },
  "audio/evrcb1": {
    source: "iana"
  },
  "audio/evrcnw": {
    source: "iana"
  },
  "audio/evrcnw0": {
    source: "iana"
  },
  "audio/evrcnw1": {
    source: "iana"
  },
  "audio/evrcwb": {
    source: "iana"
  },
  "audio/evrcwb0": {
    source: "iana"
  },
  "audio/evrcwb1": {
    source: "iana"
  },
  "audio/evs": {
    source: "iana"
  },
  "audio/flexfec": {
    source: "iana"
  },
  "audio/fwdred": {
    source: "iana"
  },
  "audio/g711-0": {
    source: "iana"
  },
  "audio/g719": {
    source: "iana"
  },
  "audio/g722": {
    source: "iana"
  },
  "audio/g7221": {
    source: "iana"
  },
  "audio/g723": {
    source: "iana"
  },
  "audio/g726-16": {
    source: "iana"
  },
  "audio/g726-24": {
    source: "iana"
  },
  "audio/g726-32": {
    source: "iana"
  },
  "audio/g726-40": {
    source: "iana"
  },
  "audio/g728": {
    source: "iana"
  },
  "audio/g729": {
    source: "iana"
  },
  "audio/g7291": {
    source: "iana"
  },
  "audio/g729d": {
    source: "iana"
  },
  "audio/g729e": {
    source: "iana"
  },
  "audio/gsm": {
    source: "iana"
  },
  "audio/gsm-efr": {
    source: "iana"
  },
  "audio/gsm-hr-08": {
    source: "iana"
  },
  "audio/ilbc": {
    source: "iana"
  },
  "audio/ip-mr_v2.5": {
    source: "iana"
  },
  "audio/isac": {
    source: "apache"
  },
  "audio/l16": {
    source: "iana"
  },
  "audio/l20": {
    source: "iana"
  },
  "audio/l24": {
    source: "iana",
    compressible: false
  },
  "audio/l8": {
    source: "iana"
  },
  "audio/lpc": {
    source: "iana"
  },
  "audio/melp": {
    source: "iana"
  },
  "audio/melp1200": {
    source: "iana"
  },
  "audio/melp2400": {
    source: "iana"
  },
  "audio/melp600": {
    source: "iana"
  },
  "audio/mhas": {
    source: "iana"
  },
  "audio/midi": {
    source: "apache",
    extensions: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ]
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: [
      "mxmf"
    ]
  },
  "audio/mp3": {
    compressible: false,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: false,
    extensions: [
      "m4a",
      "mp4a"
    ]
  },
  "audio/mp4a-latm": {
    source: "iana"
  },
  "audio/mpa": {
    source: "iana"
  },
  "audio/mpa-robust": {
    source: "iana"
  },
  "audio/mpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "mpga",
      "mp2",
      "mp2a",
      "mp3",
      "m2a",
      "m3a"
    ]
  },
  "audio/mpeg4-generic": {
    source: "iana"
  },
  "audio/musepack": {
    source: "apache"
  },
  "audio/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "oga",
      "ogg",
      "spx",
      "opus"
    ]
  },
  "audio/opus": {
    source: "iana"
  },
  "audio/parityfec": {
    source: "iana"
  },
  "audio/pcma": {
    source: "iana"
  },
  "audio/pcma-wb": {
    source: "iana"
  },
  "audio/pcmu": {
    source: "iana"
  },
  "audio/pcmu-wb": {
    source: "iana"
  },
  "audio/prs.sid": {
    source: "iana"
  },
  "audio/qcelp": {
    source: "iana"
  },
  "audio/raptorfec": {
    source: "iana"
  },
  "audio/red": {
    source: "iana"
  },
  "audio/rtp-enc-aescm128": {
    source: "iana"
  },
  "audio/rtp-midi": {
    source: "iana"
  },
  "audio/rtploopback": {
    source: "iana"
  },
  "audio/rtx": {
    source: "iana"
  },
  "audio/s3m": {
    source: "apache",
    extensions: [
      "s3m"
    ]
  },
  "audio/scip": {
    source: "iana"
  },
  "audio/silk": {
    source: "apache",
    extensions: [
      "sil"
    ]
  },
  "audio/smv": {
    source: "iana"
  },
  "audio/smv-qcp": {
    source: "iana"
  },
  "audio/smv0": {
    source: "iana"
  },
  "audio/sofa": {
    source: "iana"
  },
  "audio/sp-midi": {
    source: "iana"
  },
  "audio/speex": {
    source: "iana"
  },
  "audio/t140c": {
    source: "iana"
  },
  "audio/t38": {
    source: "iana"
  },
  "audio/telephone-event": {
    source: "iana"
  },
  "audio/tetra_acelp": {
    source: "iana"
  },
  "audio/tetra_acelp_bb": {
    source: "iana"
  },
  "audio/tone": {
    source: "iana"
  },
  "audio/tsvcis": {
    source: "iana"
  },
  "audio/uemclip": {
    source: "iana"
  },
  "audio/ulpfec": {
    source: "iana"
  },
  "audio/usac": {
    source: "iana"
  },
  "audio/vdvi": {
    source: "iana"
  },
  "audio/vmr-wb": {
    source: "iana"
  },
  "audio/vnd.3gpp.iufp": {
    source: "iana"
  },
  "audio/vnd.4sb": {
    source: "iana"
  },
  "audio/vnd.audiokoz": {
    source: "iana"
  },
  "audio/vnd.celp": {
    source: "iana"
  },
  "audio/vnd.cisco.nse": {
    source: "iana"
  },
  "audio/vnd.cmles.radio-events": {
    source: "iana"
  },
  "audio/vnd.cns.anp1": {
    source: "iana"
  },
  "audio/vnd.cns.inf1": {
    source: "iana"
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: [
      "uva",
      "uvva"
    ]
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: [
      "eol"
    ]
  },
  "audio/vnd.dlna.adts": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    source: "iana"
  },
  "audio/vnd.dolby.mlp": {
    source: "iana"
  },
  "audio/vnd.dolby.mps": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2x": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2z": {
    source: "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    source: "iana"
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: [
      "dra"
    ]
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: [
      "dts"
    ]
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: [
      "dtshd"
    ]
  },
  "audio/vnd.dts.uhd": {
    source: "iana"
  },
  "audio/vnd.dvb.file": {
    source: "iana"
  },
  "audio/vnd.everad.plj": {
    source: "iana"
  },
  "audio/vnd.hns.audio": {
    source: "iana"
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: [
      "lvp"
    ]
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: [
      "pya"
    ]
  },
  "audio/vnd.nokia.mobile-xmf": {
    source: "iana"
  },
  "audio/vnd.nortel.vbk": {
    source: "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: [
      "ecelp4800"
    ]
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: [
      "ecelp7470"
    ]
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: [
      "ecelp9600"
    ]
  },
  "audio/vnd.octel.sbc": {
    source: "iana"
  },
  "audio/vnd.presonus.multitrack": {
    source: "iana"
  },
  "audio/vnd.qcelp": {
    source: "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    source: "iana"
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: [
      "rip"
    ]
  },
  "audio/vnd.rn-realaudio": {
    compressible: false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: false
  },
  "audio/vorbis": {
    source: "iana",
    compressible: false
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: false,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: false,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: false,
    extensions: [
      "aac"
    ]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: [
      "aif",
      "aiff",
      "aifc"
    ]
  },
  "audio/x-caf": {
    source: "apache",
    compressible: false,
    extensions: [
      "caf"
    ]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: [
      "flac"
    ]
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: [
      "m4a"
    ]
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: [
      "mka"
    ]
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: [
      "m3u"
    ]
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: [
      "wax"
    ]
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: [
      "wma"
    ]
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: [
      "ram",
      "ra"
    ]
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: [
      "rmp"
    ]
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: [
      "ra"
    ]
  },
  "audio/x-tta": {
    source: "apache"
  },
  "audio/x-wav": {
    source: "apache",
    extensions: [
      "wav"
    ]
  },
  "audio/xm": {
    source: "apache",
    extensions: [
      "xm"
    ]
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: [
      "cdx"
    ]
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: [
      "cif"
    ]
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: [
      "cmdf"
    ]
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: [
      "cml"
    ]
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: [
      "csml"
    ]
  },
  "chemical/x-pdb": {
    source: "apache"
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: [
      "xyz"
    ]
  },
  "font/collection": {
    source: "iana",
    extensions: [
      "ttc"
    ]
  },
  "font/otf": {
    source: "iana",
    compressible: true,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: true,
    extensions: [
      "ttf"
    ]
  },
  "font/woff": {
    source: "iana",
    extensions: [
      "woff"
    ]
  },
  "font/woff2": {
    source: "iana",
    extensions: [
      "woff2"
    ]
  },
  "image/aces": {
    source: "iana",
    extensions: [
      "exr"
    ]
  },
  "image/apng": {
    compressible: false,
    extensions: [
      "apng"
    ]
  },
  "image/avci": {
    source: "iana"
  },
  "image/avcs": {
    source: "iana"
  },
  "image/avif": {
    source: "iana",
    compressible: false,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: true,
    extensions: [
      "bmp"
    ]
  },
  "image/cgm": {
    source: "iana",
    extensions: [
      "cgm"
    ]
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: [
      "drle"
    ]
  },
  "image/emf": {
    source: "iana",
    extensions: [
      "emf"
    ]
  },
  "image/fits": {
    source: "iana",
    extensions: [
      "fits"
    ]
  },
  "image/g3fax": {
    source: "iana",
    extensions: [
      "g3"
    ]
  },
  "image/gif": {
    source: "iana",
    compressible: false,
    extensions: [
      "gif"
    ]
  },
  "image/heic": {
    source: "iana",
    extensions: [
      "heic"
    ]
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: [
      "heics"
    ]
  },
  "image/heif": {
    source: "iana",
    extensions: [
      "heif"
    ]
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: [
      "heifs"
    ]
  },
  "image/hej2k": {
    source: "iana",
    extensions: [
      "hej2"
    ]
  },
  "image/hsj2": {
    source: "iana",
    extensions: [
      "hsj2"
    ]
  },
  "image/ief": {
    source: "iana",
    extensions: [
      "ief"
    ]
  },
  "image/jls": {
    source: "iana",
    extensions: [
      "jls"
    ]
  },
  "image/jp2": {
    source: "iana",
    compressible: false,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpeg",
      "jpg",
      "jpe"
    ]
  },
  "image/jph": {
    source: "iana",
    extensions: [
      "jph"
    ]
  },
  "image/jphc": {
    source: "iana",
    extensions: [
      "jhc"
    ]
  },
  "image/jpm": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: false,
    extensions: [
      "jpx",
      "jpf"
    ]
  },
  "image/jxr": {
    source: "iana",
    extensions: [
      "jxr"
    ]
  },
  "image/jxra": {
    source: "iana",
    extensions: [
      "jxra"
    ]
  },
  "image/jxrs": {
    source: "iana",
    extensions: [
      "jxrs"
    ]
  },
  "image/jxs": {
    source: "iana",
    extensions: [
      "jxs"
    ]
  },
  "image/jxsc": {
    source: "iana",
    extensions: [
      "jxsc"
    ]
  },
  "image/jxsi": {
    source: "iana",
    extensions: [
      "jxsi"
    ]
  },
  "image/jxss": {
    source: "iana",
    extensions: [
      "jxss"
    ]
  },
  "image/ktx": {
    source: "iana",
    extensions: [
      "ktx"
    ]
  },
  "image/ktx2": {
    source: "iana",
    extensions: [
      "ktx2"
    ]
  },
  "image/naplps": {
    source: "iana"
  },
  "image/pjpeg": {
    compressible: false
  },
  "image/png": {
    source: "iana",
    compressible: false,
    extensions: [
      "png"
    ]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: [
      "btif"
    ]
  },
  "image/prs.pti": {
    source: "iana",
    extensions: [
      "pti"
    ]
  },
  "image/pwg-raster": {
    source: "iana"
  },
  "image/sgi": {
    source: "apache",
    extensions: [
      "sgi"
    ]
  },
  "image/svg+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "svg",
      "svgz"
    ]
  },
  "image/t38": {
    source: "iana",
    extensions: [
      "t38"
    ]
  },
  "image/tiff": {
    source: "iana",
    compressible: false,
    extensions: [
      "tif",
      "tiff"
    ]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: [
      "tfx"
    ]
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: true,
    extensions: [
      "psd"
    ]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: [
      "azv"
    ]
  },
  "image/vnd.cns.inf2": {
    source: "iana"
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ]
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: [
      "djvu",
      "djv"
    ]
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: [
      "dwg"
    ]
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: [
      "dxf"
    ]
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: [
      "fbs"
    ]
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: [
      "fpx"
    ]
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: [
      "fst"
    ]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: [
      "mmr"
    ]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: [
      "rlc"
    ]
  },
  "image/vnd.globalgraphics.pgb": {
    source: "iana"
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    extensions: [
      "ico"
    ]
  },
  "image/vnd.mix": {
    source: "iana"
  },
  "image/vnd.mozilla.apng": {
    source: "iana"
  },
  "image/vnd.ms-dds": {
    extensions: [
      "dds"
    ]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: [
      "mdi"
    ]
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: [
      "wdp"
    ]
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: [
      "npx"
    ]
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: [
      "b16"
    ]
  },
  "image/vnd.radiance": {
    source: "iana"
  },
  "image/vnd.sealed.png": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    source: "iana"
  },
  "image/vnd.svf": {
    source: "iana"
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: [
      "tap"
    ]
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: [
      "vtf"
    ]
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: [
      "wbmp"
    ]
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: [
      "xif"
    ]
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: [
      "pcx"
    ]
  },
  "image/webp": {
    source: "apache",
    extensions: [
      "webp"
    ]
  },
  "image/wmf": {
    source: "iana",
    extensions: [
      "wmf"
    ]
  },
  "image/x-3ds": {
    source: "apache",
    extensions: [
      "3ds"
    ]
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: [
      "ras"
    ]
  },
  "image/x-cmx": {
    source: "apache",
    extensions: [
      "cmx"
    ]
  },
  "image/x-freehand": {
    source: "apache",
    extensions: [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ]
  },
  "image/x-icon": {
    source: "apache",
    compressible: true,
    extensions: [
      "ico"
    ]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: [
      "jng"
    ]
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: [
      "sid"
    ]
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: true,
    extensions: [
      "bmp"
    ]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: [
      "pcx"
    ]
  },
  "image/x-pict": {
    source: "apache",
    extensions: [
      "pic",
      "pct"
    ]
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: [
      "pnm"
    ]
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: [
      "pbm"
    ]
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: [
      "pgm"
    ]
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: [
      "ppm"
    ]
  },
  "image/x-rgb": {
    source: "apache",
    extensions: [
      "rgb"
    ]
  },
  "image/x-tga": {
    source: "apache",
    extensions: [
      "tga"
    ]
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: [
      "xbm"
    ]
  },
  "image/x-xcf": {
    compressible: false
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: [
      "xpm"
    ]
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: [
      "xwd"
    ]
  },
  "message/cpim": {
    source: "iana"
  },
  "message/delivery-status": {
    source: "iana"
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    source: "iana"
  },
  "message/feedback-report": {
    source: "iana"
  },
  "message/global": {
    source: "iana",
    extensions: [
      "u8msg"
    ]
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: [
      "u8dsn"
    ]
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: [
      "u8mdn"
    ]
  },
  "message/global-headers": {
    source: "iana",
    extensions: [
      "u8hdr"
    ]
  },
  "message/http": {
    source: "iana",
    compressible: false
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: true
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: false
  },
  "message/rfc822": {
    source: "iana",
    compressible: true,
    extensions: [
      "eml",
      "mime"
    ]
  },
  "message/s-http": {
    source: "iana"
  },
  "message/sip": {
    source: "iana"
  },
  "message/sipfrag": {
    source: "iana"
  },
  "message/tracking-status": {
    source: "iana"
  },
  "message/vnd.si.simp": {
    source: "iana"
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: [
      "wsc"
    ]
  },
  "model/3mf": {
    source: "iana",
    extensions: [
      "3mf"
    ]
  },
  "model/e57": {
    source: "iana"
  },
  "model/gltf+json": {
    source: "iana",
    compressible: true,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: true,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: false,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: false,
    extensions: [
      "msh",
      "mesh",
      "silo"
    ]
  },
  "model/mtl": {
    source: "iana",
    extensions: [
      "mtl"
    ]
  },
  "model/obj": {
    source: "iana",
    extensions: [
      "obj"
    ]
  },
  "model/stl": {
    source: "iana",
    extensions: [
      "stl"
    ]
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "dae"
    ]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: [
      "dwf"
    ]
  },
  "model/vnd.flatland.3dml": {
    source: "iana"
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: [
      "gdl"
    ]
  },
  "model/vnd.gs-gdl": {
    source: "apache"
  },
  "model/vnd.gs.gdl": {
    source: "iana"
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: [
      "gtw"
    ]
  },
  "model/vnd.moml+xml": {
    source: "iana",
    compressible: true
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: [
      "mts"
    ]
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: [
      "ogex"
    ]
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: [
      "x_b"
    ]
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: [
      "x_t"
    ]
  },
  "model/vnd.rosette.annotated-data-model": {
    source: "iana"
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: [
      "vds"
    ]
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: false,
    extensions: [
      "usdz"
    ]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: [
      "bsp"
    ]
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: [
      "vtu"
    ]
  },
  "model/vrml": {
    source: "iana",
    compressible: false,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: false,
    extensions: [
      "x3db",
      "x3dbz"
    ]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: [
      "x3db"
    ]
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: false,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "x3d",
      "x3dz"
    ]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: [
      "x3dv"
    ]
  },
  "multipart/alternative": {
    source: "iana",
    compressible: false
  },
  "multipart/appledouble": {
    source: "iana"
  },
  "multipart/byteranges": {
    source: "iana"
  },
  "multipart/digest": {
    source: "iana"
  },
  "multipart/encrypted": {
    source: "iana",
    compressible: false
  },
  "multipart/form-data": {
    source: "iana",
    compressible: false
  },
  "multipart/header-set": {
    source: "iana"
  },
  "multipart/mixed": {
    source: "iana"
  },
  "multipart/multilingual": {
    source: "iana"
  },
  "multipart/parallel": {
    source: "iana"
  },
  "multipart/related": {
    source: "iana",
    compressible: false
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: false
  },
  "multipart/vnd.bint.med-plus": {
    source: "iana"
  },
  "multipart/voice-message": {
    source: "iana"
  },
  "multipart/x-mixed-replace": {
    source: "iana"
  },
  "text/1d-interleaved-parityfec": {
    source: "iana"
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: true,
    extensions: [
      "appcache",
      "manifest"
    ]
  },
  "text/calendar": {
    source: "iana",
    extensions: [
      "ics",
      "ifb"
    ]
  },
  "text/calender": {
    compressible: true
  },
  "text/cmd": {
    compressible: true
  },
  "text/coffeescript": {
    extensions: [
      "coffee",
      "litcoffee"
    ]
  },
  "text/cql": {
    source: "iana"
  },
  "text/cql-expression": {
    source: "iana"
  },
  "text/cql-identifier": {
    source: "iana"
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: true,
    extensions: [
      "csv"
    ]
  },
  "text/csv-schema": {
    source: "iana"
  },
  "text/directory": {
    source: "iana"
  },
  "text/dns": {
    source: "iana"
  },
  "text/ecmascript": {
    source: "iana"
  },
  "text/encaprtp": {
    source: "iana"
  },
  "text/enriched": {
    source: "iana"
  },
  "text/fhirpath": {
    source: "iana"
  },
  "text/flexfec": {
    source: "iana"
  },
  "text/fwdred": {
    source: "iana"
  },
  "text/gff3": {
    source: "iana"
  },
  "text/grammar-ref-list": {
    source: "iana"
  },
  "text/html": {
    source: "iana",
    compressible: true,
    extensions: [
      "html",
      "htm",
      "shtml"
    ]
  },
  "text/jade": {
    extensions: [
      "jade"
    ]
  },
  "text/javascript": {
    source: "iana",
    compressible: true
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: true,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: true,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: true,
    extensions: [
      "markdown",
      "md"
    ]
  },
  "text/mathml": {
    source: "nginx",
    extensions: [
      "mml"
    ]
  },
  "text/mdx": {
    compressible: true,
    extensions: [
      "mdx"
    ]
  },
  "text/mizar": {
    source: "iana"
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "n3"
    ]
  },
  "text/parameters": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/parityfec": {
    source: "iana"
  },
  "text/plain": {
    source: "iana",
    compressible: true,
    extensions: [
      "txt",
      "text",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "ini"
    ]
  },
  "text/provenance-notation": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    source: "iana"
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: [
      "dsc"
    ]
  },
  "text/prs.prop.logic": {
    source: "iana"
  },
  "text/raptorfec": {
    source: "iana"
  },
  "text/red": {
    source: "iana"
  },
  "text/rfc822-headers": {
    source: "iana"
  },
  "text/richtext": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: true,
    extensions: [
      "rtf"
    ]
  },
  "text/rtp-enc-aescm128": {
    source: "iana"
  },
  "text/rtploopback": {
    source: "iana"
  },
  "text/rtx": {
    source: "iana"
  },
  "text/sgml": {
    source: "iana",
    extensions: [
      "sgml",
      "sgm"
    ]
  },
  "text/shaclc": {
    source: "iana"
  },
  "text/shex": {
    extensions: [
      "shex"
    ]
  },
  "text/slim": {
    extensions: [
      "slim",
      "slm"
    ]
  },
  "text/spdx": {
    source: "iana",
    extensions: [
      "spdx"
    ]
  },
  "text/strings": {
    source: "iana"
  },
  "text/stylus": {
    extensions: [
      "stylus",
      "styl"
    ]
  },
  "text/t140": {
    source: "iana"
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: true,
    extensions: [
      "tsv"
    ]
  },
  "text/troff": {
    source: "iana",
    extensions: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ]
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "ttl"
    ]
  },
  "text/ulpfec": {
    source: "iana"
  },
  "text/uri-list": {
    source: "iana",
    compressible: true,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: true,
    extensions: [
      "vcard"
    ]
  },
  "text/vnd.a": {
    source: "iana"
  },
  "text/vnd.abc": {
    source: "iana"
  },
  "text/vnd.ascii-art": {
    source: "iana"
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: [
      "curl"
    ]
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: [
      "dcurl"
    ]
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: [
      "mcurl"
    ]
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: [
      "scurl"
    ]
  },
  "text/vnd.debian.copyright": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.dmclientscript": {
    source: "iana"
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "text/vnd.esmertec.theme-descriptor": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.ficlab.flt": {
    source: "iana"
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: [
      "fly"
    ]
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: [
      "flx"
    ]
  },
  "text/vnd.gml": {
    source: "iana"
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: [
      "gv"
    ]
  },
  "text/vnd.hans": {
    source: "iana"
  },
  "text/vnd.hgl": {
    source: "iana"
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: [
      "3dml"
    ]
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: [
      "spot"
    ]
  },
  "text/vnd.iptc.newsml": {
    source: "iana"
  },
  "text/vnd.iptc.nitf": {
    source: "iana"
  },
  "text/vnd.latex-z": {
    source: "iana"
  },
  "text/vnd.motorola.reflex": {
    source: "iana"
  },
  "text/vnd.ms-mediapackage": {
    source: "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    source: "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    source: "iana"
  },
  "text/vnd.senx.warpscript": {
    source: "iana"
  },
  "text/vnd.si.uricatalogue": {
    source: "iana"
  },
  "text/vnd.sosi": {
    source: "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "jad"
    ]
  },
  "text/vnd.trolltech.linguist": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.wap.si": {
    source: "iana"
  },
  "text/vnd.wap.sl": {
    source: "iana"
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: [
      "wml"
    ]
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: [
      "wmls"
    ]
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: [
      "vtt"
    ]
  },
  "text/x-asm": {
    source: "apache",
    extensions: [
      "s",
      "asm"
    ]
  },
  "text/x-c": {
    source: "apache",
    extensions: [
      "c",
      "cc",
      "cxx",
      "cpp",
      "h",
      "hh",
      "dic"
    ]
  },
  "text/x-component": {
    source: "nginx",
    extensions: [
      "htc"
    ]
  },
  "text/x-fortran": {
    source: "apache",
    extensions: [
      "f",
      "for",
      "f77",
      "f90"
    ]
  },
  "text/x-gwt-rpc": {
    compressible: true
  },
  "text/x-handlebars-template": {
    extensions: [
      "hbs"
    ]
  },
  "text/x-java-source": {
    source: "apache",
    extensions: [
      "java"
    ]
  },
  "text/x-jquery-tmpl": {
    compressible: true
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: true,
    extensions: [
      "mkd"
    ]
  },
  "text/x-nfo": {
    source: "apache",
    extensions: [
      "nfo"
    ]
  },
  "text/x-opml": {
    source: "apache",
    extensions: [
      "opml"
    ]
  },
  "text/x-org": {
    compressible: true,
    extensions: [
      "org"
    ]
  },
  "text/x-pascal": {
    source: "apache",
    extensions: [
      "p",
      "pas"
    ]
  },
  "text/x-processing": {
    compressible: true,
    extensions: [
      "pde"
    ]
  },
  "text/x-sass": {
    extensions: [
      "sass"
    ]
  },
  "text/x-scss": {
    extensions: [
      "scss"
    ]
  },
  "text/x-setext": {
    source: "apache",
    extensions: [
      "etx"
    ]
  },
  "text/x-sfv": {
    source: "apache",
    extensions: [
      "sfv"
    ]
  },
  "text/x-suse-ymp": {
    compressible: true,
    extensions: [
      "ymp"
    ]
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: [
      "uu"
    ]
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: [
      "vcs"
    ]
  },
  "text/x-vcard": {
    source: "apache",
    extensions: [
      "vcf"
    ]
  },
  "text/xml": {
    source: "iana",
    compressible: true,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    extensions: [
      "yaml",
      "yml"
    ]
  },
  "video/1d-interleaved-parityfec": {
    source: "iana"
  },
  "video/3gpp": {
    source: "iana",
    extensions: [
      "3gp",
      "3gpp"
    ]
  },
  "video/3gpp-tt": {
    source: "iana"
  },
  "video/3gpp2": {
    source: "iana",
    extensions: [
      "3g2"
    ]
  },
  "video/av1": {
    source: "iana"
  },
  "video/bmpeg": {
    source: "iana"
  },
  "video/bt656": {
    source: "iana"
  },
  "video/celb": {
    source: "iana"
  },
  "video/dv": {
    source: "iana"
  },
  "video/encaprtp": {
    source: "iana"
  },
  "video/ffv1": {
    source: "iana"
  },
  "video/flexfec": {
    source: "iana"
  },
  "video/h261": {
    source: "iana",
    extensions: [
      "h261"
    ]
  },
  "video/h263": {
    source: "iana",
    extensions: [
      "h263"
    ]
  },
  "video/h263-1998": {
    source: "iana"
  },
  "video/h263-2000": {
    source: "iana"
  },
  "video/h264": {
    source: "iana",
    extensions: [
      "h264"
    ]
  },
  "video/h264-rcdo": {
    source: "iana"
  },
  "video/h264-svc": {
    source: "iana"
  },
  "video/h265": {
    source: "iana"
  },
  "video/iso.segment": {
    source: "iana",
    extensions: [
      "m4s"
    ]
  },
  "video/jpeg": {
    source: "iana",
    extensions: [
      "jpgv"
    ]
  },
  "video/jpeg2000": {
    source: "iana"
  },
  "video/jpm": {
    source: "apache",
    extensions: [
      "jpm",
      "jpgm"
    ]
  },
  "video/mj2": {
    source: "iana",
    extensions: [
      "mj2",
      "mjp2"
    ]
  },
  "video/mp1s": {
    source: "iana"
  },
  "video/mp2p": {
    source: "iana"
  },
  "video/mp2t": {
    source: "iana",
    extensions: [
      "ts"
    ]
  },
  "video/mp4": {
    source: "iana",
    compressible: false,
    extensions: [
      "mp4",
      "mp4v",
      "mpg4"
    ]
  },
  "video/mp4v-es": {
    source: "iana"
  },
  "video/mpeg": {
    source: "iana",
    compressible: false,
    extensions: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v"
    ]
  },
  "video/mpeg4-generic": {
    source: "iana"
  },
  "video/mpv": {
    source: "iana"
  },
  "video/nv": {
    source: "iana"
  },
  "video/ogg": {
    source: "iana",
    compressible: false,
    extensions: [
      "ogv"
    ]
  },
  "video/parityfec": {
    source: "iana"
  },
  "video/pointer": {
    source: "iana"
  },
  "video/quicktime": {
    source: "iana",
    compressible: false,
    extensions: [
      "qt",
      "mov"
    ]
  },
  "video/raptorfec": {
    source: "iana"
  },
  "video/raw": {
    source: "iana"
  },
  "video/rtp-enc-aescm128": {
    source: "iana"
  },
  "video/rtploopback": {
    source: "iana"
  },
  "video/rtx": {
    source: "iana"
  },
  "video/scip": {
    source: "iana"
  },
  "video/smpte291": {
    source: "iana"
  },
  "video/smpte292m": {
    source: "iana"
  },
  "video/ulpfec": {
    source: "iana"
  },
  "video/vc1": {
    source: "iana"
  },
  "video/vc2": {
    source: "iana"
  },
  "video/vnd.cctv": {
    source: "iana"
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: [
      "uvh",
      "uvvh"
    ]
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: [
      "uvm",
      "uvvm"
    ]
  },
  "video/vnd.dece.mp4": {
    source: "iana"
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: [
      "uvp",
      "uvvp"
    ]
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: [
      "uvs",
      "uvvs"
    ]
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: [
      "uvv",
      "uvvv"
    ]
  },
  "video/vnd.directv.mpeg": {
    source: "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: [
      "dvb"
    ]
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: [
      "fvt"
    ]
  },
  "video/vnd.hns.video": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    source: "iana"
  },
  "video/vnd.motorola.video": {
    source: "iana"
  },
  "video/vnd.motorola.videop": {
    source: "iana"
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: [
      "mxu",
      "m4u"
    ]
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: [
      "pyv"
    ]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    source: "iana"
  },
  "video/vnd.nokia.mp4vr": {
    source: "iana"
  },
  "video/vnd.nokia.videovoip": {
    source: "iana"
  },
  "video/vnd.objectvideo": {
    source: "iana"
  },
  "video/vnd.radgamettools.bink": {
    source: "iana"
  },
  "video/vnd.radgamettools.smacker": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg1": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg4": {
    source: "iana"
  },
  "video/vnd.sealed.swf": {
    source: "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    source: "iana"
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: [
      "uvu",
      "uvvu"
    ]
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: [
      "viv"
    ]
  },
  "video/vnd.youtube.yt": {
    source: "iana"
  },
  "video/vp8": {
    source: "iana"
  },
  "video/webm": {
    source: "apache",
    compressible: false,
    extensions: [
      "webm"
    ]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: [
      "f4v"
    ]
  },
  "video/x-fli": {
    source: "apache",
    extensions: [
      "fli"
    ]
  },
  "video/x-flv": {
    source: "apache",
    compressible: false,
    extensions: [
      "flv"
    ]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: [
      "m4v"
    ]
  },
  "video/x-matroska": {
    source: "apache",
    compressible: false,
    extensions: [
      "mkv",
      "mk3d",
      "mks"
    ]
  },
  "video/x-mng": {
    source: "apache",
    extensions: [
      "mng"
    ]
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: [
      "asf",
      "asx"
    ]
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: [
      "vob"
    ]
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: [
      "wm"
    ]
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: false,
    extensions: [
      "wmv"
    ]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: [
      "wmx"
    ]
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: [
      "wvx"
    ]
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: [
      "avi"
    ]
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: [
      "movie"
    ]
  },
  "video/x-smv": {
    source: "apache",
    extensions: [
      "smv"
    ]
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: [
      "ice"
    ]
  },
  "x-shader/x-fragment": {
    compressible: true
  },
  "x-shader/x-vertex": {
    compressible: true
  }
};
var mimeDb = require$$0;
var mimeTypes = createCommonjsModule(function(module, exports) {
  var extname = require$$0$1.extname;
  var EXTRACT_TYPE_REGEXP2 = /^\s*([^;\s]*)(?:;|\s|$)/;
  var TEXT_TYPE_REGEXP = /^text\//i;
  exports.charset = charset3;
  exports.charsets = { lookup: charset3 };
  exports.contentType = contentType;
  exports.extension = extension;
  exports.extensions = Object.create(null);
  exports.lookup = lookup;
  exports.types = Object.create(null);
  populateMaps(exports.extensions, exports.types);
  function charset3(type) {
    if (!type || typeof type !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP2.exec(type);
    var mime = match && mimeDb[match[1].toLowerCase()];
    if (mime && mime.charset) {
      return mime.charset;
    }
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
      return "UTF-8";
    }
    return false;
  }
  function contentType(str) {
    if (!str || typeof str !== "string") {
      return false;
    }
    var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
    if (!mime) {
      return false;
    }
    if (mime.indexOf("charset") === -1) {
      var charset4 = exports.charset(mime);
      if (charset4)
        mime += "; charset=" + charset4.toLowerCase();
    }
    return mime;
  }
  function extension(type) {
    if (!type || typeof type !== "string") {
      return false;
    }
    var match = EXTRACT_TYPE_REGEXP2.exec(type);
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
      return false;
    }
    return exts[0];
  }
  function lookup(path) {
    if (!path || typeof path !== "string") {
      return false;
    }
    var extension2 = extname("x." + path).toLowerCase().substr(1);
    if (!extension2) {
      return false;
    }
    return exports.types[extension2] || false;
  }
  function populateMaps(extensions, types) {
    var preference = ["nginx", "apache", void 0, "iana"];
    Object.keys(mimeDb).forEach(function forEachMimeType(type) {
      var mime = mimeDb[type];
      var exts = mime.extensions;
      if (!exts || !exts.length) {
        return;
      }
      extensions[type] = exts;
      for (var i = 0; i < exts.length; i++) {
        var extension2 = exts[i];
        if (types[extension2]) {
          var from = preference.indexOf(mimeDb[types[extension2]].source);
          var to = preference.indexOf(mime.source);
          if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
            continue;
          }
        }
        types[extension2] = type;
      }
    });
  }
});
var accepts = Accepts;
function Accepts(req) {
  if (!(this instanceof Accepts)) {
    return new Accepts(req);
  }
  this.headers = req.headers;
  this.negotiator = new negotiator(req);
}
Accepts.prototype.type = Accepts.prototype.types = function(types_) {
  var types = types_;
  if (types && !Array.isArray(types)) {
    types = new Array(arguments.length);
    for (var i = 0; i < types.length; i++) {
      types[i] = arguments[i];
    }
  }
  if (!types || types.length === 0) {
    return this.negotiator.mediaTypes();
  }
  if (!this.headers.accept) {
    return types[0];
  }
  var mimes = types.map(extToMime);
  var accepts2 = this.negotiator.mediaTypes(mimes.filter(validMime));
  var first = accepts2[0];
  return first ? types[mimes.indexOf(first)] : false;
};
Accepts.prototype.encoding = Accepts.prototype.encodings = function(encodings_) {
  var encodings2 = encodings_;
  if (encodings2 && !Array.isArray(encodings2)) {
    encodings2 = new Array(arguments.length);
    for (var i = 0; i < encodings2.length; i++) {
      encodings2[i] = arguments[i];
    }
  }
  if (!encodings2 || encodings2.length === 0) {
    return this.negotiator.encodings();
  }
  return this.negotiator.encodings(encodings2)[0] || false;
};
Accepts.prototype.charset = Accepts.prototype.charsets = function(charsets_) {
  var charsets2 = charsets_;
  if (charsets2 && !Array.isArray(charsets2)) {
    charsets2 = new Array(arguments.length);
    for (var i = 0; i < charsets2.length; i++) {
      charsets2[i] = arguments[i];
    }
  }
  if (!charsets2 || charsets2.length === 0) {
    return this.negotiator.charsets();
  }
  return this.negotiator.charsets(charsets2)[0] || false;
};
Accepts.prototype.lang = Accepts.prototype.langs = Accepts.prototype.language = Accepts.prototype.languages = function(languages_) {
  var languages2 = languages_;
  if (languages2 && !Array.isArray(languages2)) {
    languages2 = new Array(arguments.length);
    for (var i = 0; i < languages2.length; i++) {
      languages2[i] = arguments[i];
    }
  }
  if (!languages2 || languages2.length === 0) {
    return this.negotiator.languages();
  }
  return this.negotiator.languages(languages2)[0] || false;
};
function extToMime(type) {
  return type.indexOf("/") === -1 ? mimeTypes.lookup(type) : type;
}
function validMime(type) {
  return typeof type === "string";
}
var safeBuffer = createCommonjsModule(function(module, exports) {
  var Buffer2 = buffer.Buffer;
  function copyProps(src2, dst) {
    for (var key in src2) {
      dst[key] = src2[key];
    }
  }
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  }
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding3) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== void 0) {
      if (typeof encoding3 === "string") {
        buf.fill(fill, encoding3);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});
var bytes_1 = bytes;
var format_1 = format;
var parse_1 = parse$4;
var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;
var map = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: (1 << 30) * 1024
};
var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb)$/i;
function bytes(value, options2) {
  if (typeof value === "string") {
    return parse$4(value);
  }
  if (typeof value === "number") {
    return format(value, options2);
  }
  return null;
}
function format(value, options2) {
  if (!Number.isFinite(value)) {
    return null;
  }
  var mag = Math.abs(value);
  var thousandsSeparator = options2 && options2.thousandsSeparator || "";
  var unitSeparator = options2 && options2.unitSeparator || "";
  var decimalPlaces = options2 && options2.decimalPlaces !== void 0 ? options2.decimalPlaces : 2;
  var fixedDecimals = Boolean(options2 && options2.fixedDecimals);
  var unit = options2 && options2.unit || "";
  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.tb) {
      unit = "TB";
    } else if (mag >= map.gb) {
      unit = "GB";
    } else if (mag >= map.mb) {
      unit = "MB";
    } else if (mag >= map.kb) {
      unit = "KB";
    } else {
      unit = "B";
    }
  }
  var val = value / map[unit.toLowerCase()];
  var str = val.toFixed(decimalPlaces);
  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, "$1");
  }
  if (thousandsSeparator) {
    str = str.replace(formatThousandsRegExp, thousandsSeparator);
  }
  return str + unitSeparator + unit;
}
function parse$4(val) {
  if (typeof val === "number" && !isNaN(val)) {
    return val;
  }
  if (typeof val !== "string") {
    return null;
  }
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = "b";
  if (!results) {
    floatValue = parseInt(val, 10);
    unit = "b";
  } else {
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }
  return Math.floor(map[unit] * floatValue);
}
bytes_1.format = format_1;
bytes_1.parse = parse_1;
var COMPRESSIBLE_TYPE_REGEXP = /^text\/|\+(?:json|text|xml)$/i;
var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var compressible_1 = compressible;
function compressible(type) {
  if (!type || typeof type !== "string") {
    return false;
  }
  var match = EXTRACT_TYPE_REGEXP.exec(type);
  var mime = match && match[1].toLowerCase();
  var data = mimeDb[mime];
  if (data && data.compressible !== void 0) {
    return data.compressible;
  }
  return COMPRESSIBLE_TYPE_REGEXP.test(mime) || void 0;
}
var s2 = 1e3;
var m = s2 * 60;
var h = m * 60;
var d2 = h * 24;
var y = d2 * 365.25;
var ms = function(val, options2) {
  options2 = options2 || {};
  var type = typeof val;
  if (type === "string" && val.length > 0) {
    return parse$3(val);
  } else if (type === "number" && isNaN(val) === false) {
    return options2.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
};
function parse$3(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || "ms").toLowerCase();
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "days":
    case "day":
    case "d":
      return n * d2;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s2;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return void 0;
  }
}
function fmtShort(ms2) {
  if (ms2 >= d2) {
    return Math.round(ms2 / d2) + "d";
  }
  if (ms2 >= h) {
    return Math.round(ms2 / h) + "h";
  }
  if (ms2 >= m) {
    return Math.round(ms2 / m) + "m";
  }
  if (ms2 >= s2) {
    return Math.round(ms2 / s2) + "s";
  }
  return ms2 + "ms";
}
function fmtLong(ms2) {
  return plural(ms2, d2, "day") || plural(ms2, h, "hour") || plural(ms2, m, "minute") || plural(ms2, s2, "second") || ms2 + " ms";
}
function plural(ms2, n, name) {
  if (ms2 < n) {
    return;
  }
  if (ms2 < n * 1.5) {
    return Math.floor(ms2 / n) + " " + name;
  }
  return Math.ceil(ms2 / n) + " " + name + "s";
}
var debug$1 = createCommonjsModule(function(module, exports) {
  exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = ms;
  exports.names = [];
  exports.skips = [];
  exports.formatters = {};
  var prevTime;
  function selectColor(namespace) {
    var hash2 = 0, i;
    for (i in namespace) {
      hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
      hash2 |= 0;
    }
    return exports.colors[Math.abs(hash2) % exports.colors.length];
  }
  function createDebug(namespace) {
    function debug2() {
      if (!debug2.enabled)
        return;
      var self = debug2;
      var curr = +new Date();
      var ms2 = curr - (prevTime || curr);
      self.diff = ms2;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      args[0] = exports.coerce(args[0]);
      if (typeof args[0] !== "string") {
        args.unshift("%O");
      }
      var index2 = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format2) {
        if (match === "%%")
          return match;
        index2++;
        var formatter = exports.formatters[format2];
        if (typeof formatter === "function") {
          var val = args[index2];
          match = formatter.call(self, val);
          args.splice(index2, 1);
          index2--;
        }
        return match;
      });
      exports.formatArgs.call(self, args);
      var logFn = debug2.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }
    debug2.namespace = namespace;
    debug2.enabled = exports.enabled(namespace);
    debug2.useColors = exports.useColors();
    debug2.color = selectColor(namespace);
    if (typeof exports.init === "function") {
      exports.init(debug2);
    }
    return debug2;
  }
  function enable(namespaces) {
    exports.save(namespaces);
    exports.names = [];
    exports.skips = [];
    var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
    var len = split.length;
    for (var i = 0; i < len; i++) {
      if (!split[i])
        continue;
      namespaces = split[i].replace(/\*/g, ".*?");
      if (namespaces[0] === "-") {
        exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
      } else {
        exports.names.push(new RegExp("^" + namespaces + "$"));
      }
    }
  }
  function disable() {
    exports.enable("");
  }
  function enabled(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }
  function coerce(val) {
    if (val instanceof Error)
      return val.stack || val.message;
    return val;
  }
});
var browser = createCommonjsModule(function(module, exports) {
  exports = module.exports = debug$1;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load2;
  exports.useColors = useColors;
  exports.storage = typeof chrome != "undefined" && typeof chrome.storage != "undefined" ? chrome.storage.local : localstorage();
  exports.colors = [
    "lightseagreen",
    "forestgreen",
    "goldenrod",
    "dodgerblue",
    "darkorchid",
    "crimson"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
      return true;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  exports.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return "[UnexpectedJSONParseError]: " + err.message;
    }
  };
  function formatArgs(args) {
    var useColors2 = this.useColors;
    args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
    if (!useColors2)
      return;
    var c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    var index2 = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function(match) {
      if (match === "%%")
        return;
      index2++;
      if (match === "%c") {
        lastC = index2;
      }
    });
    args.splice(lastC, 0, c);
  }
  function log() {
    return typeof console === "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }
  function save(namespaces) {
    try {
      if (namespaces == null) {
        exports.storage.removeItem("debug");
      } else {
        exports.storage.debug = namespaces;
      }
    } catch (e) {
    }
  }
  function load2() {
    var r;
    try {
      r = exports.storage.debug;
    } catch (e) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  exports.enable(load2());
  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {
    }
  }
});
var node = createCommonjsModule(function(module, exports) {
  exports = module.exports = debug$1;
  exports.init = init2;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load2;
  exports.useColors = useColors;
  exports.colors = [6, 2, 3, 4, 5, 1];
  exports.inspectOpts = Object.keys(process.env).filter(function(key) {
    return /^debug_/i.test(key);
  }).reduce(function(obj, key) {
    var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
      return k.toUpperCase();
    });
    var val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val))
      val = true;
    else if (/^(no|off|false|disabled)$/i.test(val))
      val = false;
    else if (val === "null")
      val = null;
    else
      val = Number(val);
    obj[prop] = val;
    return obj;
  }, {});
  var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
  if (fd !== 1 && fd !== 2) {
    util.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
  }
  var stream = fd === 1 ? process.stdout : fd === 2 ? process.stderr : createWritableStdioStream(fd);
  function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
  }
  exports.formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
      return str.trim();
    }).join(" ");
  };
  exports.formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
  function formatArgs(args) {
    var name = this.namespace;
    var useColors2 = this.useColors;
    if (useColors2) {
      var c = this.color;
      var prefix = "  [3" + c + ";1m" + name + " [0m";
      args[0] = prefix + args[0].split("\n").join("\n" + prefix);
      args.push("[3" + c + "m+" + exports.humanize(this.diff) + "[0m");
    } else {
      args[0] = new Date().toUTCString() + " " + name + " " + args[0];
    }
  }
  function log() {
    return stream.write(util.format.apply(util, arguments) + "\n");
  }
  function save(namespaces) {
    if (namespaces == null) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = namespaces;
    }
  }
  function load2() {
    return process.env.DEBUG;
  }
  function createWritableStdioStream(fd2) {
    var stream2;
    var tty_wrap = process.binding("tty_wrap");
    switch (tty_wrap.guessHandleType(fd2)) {
      case "TTY":
        stream2 = new tty.WriteStream(fd2);
        stream2._type = "tty";
        if (stream2._handle && stream2._handle.unref) {
          stream2._handle.unref();
        }
        break;
      case "FILE":
        var fs2 = fs__default;
        stream2 = new fs2.SyncWriteStream(fd2, { autoClose: false });
        stream2._type = "fs";
        break;
      case "PIPE":
      case "TCP":
        var net = require$$2;
        stream2 = new net.Socket({
          fd: fd2,
          readable: false,
          writable: true
        });
        stream2.readable = false;
        stream2.read = null;
        stream2._type = "pipe";
        if (stream2._handle && stream2._handle.unref) {
          stream2._handle.unref();
        }
        break;
      default:
        throw new Error("Implement me. Unknown stream file type!");
    }
    stream2.fd = fd2;
    stream2._isStdio = true;
    return stream2;
  }
  function init2(debug2) {
    debug2.inspectOpts = {};
    var keys = Object.keys(exports.inspectOpts);
    for (var i = 0; i < keys.length; i++) {
      debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }
  exports.enable(load2());
});
var src = createCommonjsModule(function(module) {
  if (typeof process !== "undefined" && process.type === "renderer") {
    module.exports = browser;
  } else {
    module.exports = node;
  }
});
var onHeaders_1 = onHeaders;
function createWriteHead(prevWriteHead, listener) {
  var fired = false;
  return function writeHead(statusCode) {
    var args = setWriteHeadHeaders.apply(this, arguments);
    if (!fired) {
      fired = true;
      listener.call(this);
      if (typeof args[0] === "number" && this.statusCode !== args[0]) {
        args[0] = this.statusCode;
        args.length = 1;
      }
    }
    return prevWriteHead.apply(this, args);
  };
}
function onHeaders(res, listener) {
  if (!res) {
    throw new TypeError("argument res is required");
  }
  if (typeof listener !== "function") {
    throw new TypeError("argument listener must be a function");
  }
  res.writeHead = createWriteHead(res.writeHead, listener);
}
function setHeadersFromArray(res, headers) {
  for (var i = 0; i < headers.length; i++) {
    res.setHeader(headers[i][0], headers[i][1]);
  }
}
function setHeadersFromObject(res, headers) {
  var keys = Object.keys(headers);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (k)
      res.setHeader(k, headers[k]);
  }
}
function setWriteHeadHeaders(statusCode) {
  var length = arguments.length;
  var headerIndex = length > 1 && typeof arguments[1] === "string" ? 2 : 1;
  var headers = length >= headerIndex + 1 ? arguments[headerIndex] : void 0;
  this.statusCode = statusCode;
  if (Array.isArray(headers)) {
    setHeadersFromArray(this, headers);
  } else if (headers) {
    setHeadersFromObject(this, headers);
  }
  var args = new Array(Math.min(length, headerIndex));
  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  return args;
}
var vary_1 = vary;
var append_1 = append;
var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
function append(header, field) {
  if (typeof header !== "string") {
    throw new TypeError("header argument is required");
  }
  if (!field) {
    throw new TypeError("field argument is required");
  }
  var fields = !Array.isArray(field) ? parse$2(String(field)) : field;
  for (var j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError("field argument contains an invalid header name");
    }
  }
  if (header === "*") {
    return header;
  }
  var val = header;
  var vals = parse$2(header.toLowerCase());
  if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
    return "*";
  }
  for (var i = 0; i < fields.length; i++) {
    var fld = fields[i].toLowerCase();
    if (vals.indexOf(fld) === -1) {
      vals.push(fld);
      val = val ? val + ", " + fields[i] : fields[i];
    }
  }
  return val;
}
function parse$2(header) {
  var end = 0;
  var list2 = [];
  var start = 0;
  for (var i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
      case 32:
        if (start === end) {
          start = end = i + 1;
        }
        break;
      case 44:
        list2.push(header.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }
  }
  list2.push(header.substring(start, end));
  return list2;
}
function vary(res, field) {
  if (!res || !res.getHeader || !res.setHeader) {
    throw new TypeError("res argument is required");
  }
  var val = res.getHeader("Vary") || "";
  var header = Array.isArray(val) ? val.join(", ") : String(val);
  if (val = append(header, field)) {
    res.setHeader("Vary", val);
  }
}
vary_1.append = append_1;
var Buffer$1 = safeBuffer.Buffer;
var debug = src("compression");
var compression_1 = compression;
var filter = shouldCompress;
var cacheControlNoTransformRegExp = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;
function compression(options2) {
  var opts = options2 || {};
  var filter2 = opts.filter || shouldCompress;
  var threshold = bytes_1.parse(opts.threshold);
  if (threshold == null) {
    threshold = 1024;
  }
  return function compression2(req, res, next) {
    var ended = false;
    var length;
    var listeners = [];
    var stream;
    var _end = res.end;
    var _on = res.on;
    var _write = res.write;
    res.flush = function flush2() {
      if (stream) {
        stream.flush();
      }
    };
    res.write = function write(chunk, encoding3) {
      if (ended) {
        return false;
      }
      if (!this._header) {
        this._implicitHeader();
      }
      return stream ? stream.write(toBuffer(chunk, encoding3)) : _write.call(this, chunk, encoding3);
    };
    res.end = function end(chunk, encoding3) {
      if (ended) {
        return false;
      }
      if (!this._header) {
        if (!this.getHeader("Content-Length")) {
          length = chunkLength(chunk, encoding3);
        }
        this._implicitHeader();
      }
      if (!stream) {
        return _end.call(this, chunk, encoding3);
      }
      ended = true;
      return chunk ? stream.end(toBuffer(chunk, encoding3)) : stream.end();
    };
    res.on = function on(type, listener) {
      if (!listeners || type !== "drain") {
        return _on.call(this, type, listener);
      }
      if (stream) {
        return stream.on(type, listener);
      }
      listeners.push([type, listener]);
      return this;
    };
    function nocompress(msg) {
      debug("no compression: %s", msg);
      addListeners(res, _on, listeners);
      listeners = null;
    }
    onHeaders_1(res, function onResponseHeaders() {
      if (!filter2(req, res)) {
        nocompress("filtered");
        return;
      }
      if (!shouldTransform(req, res)) {
        nocompress("no transform");
        return;
      }
      vary_1(res, "Accept-Encoding");
      if (Number(res.getHeader("Content-Length")) < threshold || length < threshold) {
        nocompress("size below threshold");
        return;
      }
      var encoding3 = res.getHeader("Content-Encoding") || "identity";
      if (encoding3 !== "identity") {
        nocompress("already encoded");
        return;
      }
      if (req.method === "HEAD") {
        nocompress("HEAD request");
        return;
      }
      var accept = accepts(req);
      var method = accept.encoding(["gzip", "deflate", "identity"]);
      if (method === "deflate" && accept.encoding(["gzip"])) {
        method = accept.encoding(["gzip", "identity"]);
      }
      if (!method || method === "identity") {
        nocompress("not acceptable");
        return;
      }
      debug("%s compression", method);
      stream = method === "gzip" ? zlib.createGzip(opts) : zlib.createDeflate(opts);
      addListeners(stream, stream.on, listeners);
      res.setHeader("Content-Encoding", method);
      res.removeHeader("Content-Length");
      stream.on("data", function onStreamData(chunk) {
        if (_write.call(res, chunk) === false) {
          stream.pause();
        }
      });
      stream.on("end", function onStreamEnd() {
        _end.call(res);
      });
      _on.call(res, "drain", function onResponseDrain() {
        stream.resume();
      });
    });
    next();
  };
}
function addListeners(stream, on, listeners) {
  for (var i = 0; i < listeners.length; i++) {
    on.apply(stream, listeners[i]);
  }
}
function chunkLength(chunk, encoding3) {
  if (!chunk) {
    return 0;
  }
  return !Buffer$1.isBuffer(chunk) ? Buffer$1.byteLength(chunk, encoding3) : chunk.length;
}
function shouldCompress(req, res) {
  var type = res.getHeader("Content-Type");
  if (type === void 0 || !compressible_1(type)) {
    debug("%s not compressible", type);
    return false;
  }
  return true;
}
function shouldTransform(req, res) {
  var cacheControl = res.getHeader("Cache-Control");
  return !cacheControl || !cacheControlNoTransformRegExp.test(cacheControl);
}
function toBuffer(chunk, encoding3) {
  return !Buffer$1.isBuffer(chunk) ? Buffer$1.from(chunk, encoding3) : chunk;
}
compression_1.filter = filter;
function parse$1(str, loose) {
  if (str instanceof RegExp)
    return { keys: false, pattern: str };
  var c, o, tmp, ext, keys = [], pattern = "", arr = str.split("/");
  arr[0] || arr.shift();
  while (tmp = arr.shift()) {
    c = tmp[0];
    if (c === "*") {
      keys.push("wild");
      pattern += "/(.*)";
    } else if (c === ":") {
      o = tmp.indexOf("?", 1);
      ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (!!~ext)
        pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
  };
}
var Trouter = class {
  constructor() {
    this.routes = [];
    this.all = this.add.bind(this, "");
    this.get = this.add.bind(this, "GET");
    this.head = this.add.bind(this, "HEAD");
    this.patch = this.add.bind(this, "PATCH");
    this.options = this.add.bind(this, "OPTIONS");
    this.connect = this.add.bind(this, "CONNECT");
    this.delete = this.add.bind(this, "DELETE");
    this.trace = this.add.bind(this, "TRACE");
    this.post = this.add.bind(this, "POST");
    this.put = this.add.bind(this, "PUT");
  }
  use(route, ...fns) {
    let handlers = [].concat.apply([], fns);
    let { keys, pattern } = parse$1(route, true);
    this.routes.push({ keys, pattern, method: "", handlers });
    return this;
  }
  add(method, route, ...fns) {
    let { keys, pattern } = parse$1(route);
    let handlers = [].concat.apply([], fns);
    this.routes.push({ keys, pattern, method, handlers });
    return this;
  }
  find(method, url) {
    let isHEAD = method === "HEAD";
    let i = 0, j = 0, k, tmp, arr = this.routes;
    let matches = [], params = {}, handlers = [];
    for (; i < arr.length; i++) {
      tmp = arr[i];
      if (tmp.method.length === 0 || tmp.method === method || isHEAD && tmp.method === "GET") {
        if (tmp.keys === false) {
          matches = tmp.pattern.exec(url);
          if (matches === null)
            continue;
          if (matches.groups !== void 0)
            for (k in matches.groups)
              params[k] = matches.groups[k];
          tmp.handlers.length > 1 ? handlers = handlers.concat(tmp.handlers) : handlers.push(tmp.handlers[0]);
        } else if (tmp.keys.length > 0) {
          matches = tmp.pattern.exec(url);
          if (matches === null)
            continue;
          for (j = 0; j < tmp.keys.length; )
            params[tmp.keys[j]] = matches[++j];
          tmp.handlers.length > 1 ? handlers = handlers.concat(tmp.handlers) : handlers.push(tmp.handlers[0]);
        } else if (tmp.pattern.test(url)) {
          tmp.handlers.length > 1 ? handlers = handlers.concat(tmp.handlers) : handlers.push(tmp.handlers[0]);
        }
      }
    }
    return { params, handlers };
  }
};
function parse2(req, toDecode) {
  let raw = req.url;
  if (raw == null)
    return;
  let prev = req._parsedUrl;
  if (prev && prev.raw === raw)
    return prev;
  let pathname = raw, search = "", query;
  if (raw.length > 1) {
    let idx = raw.indexOf("?", 1);
    if (idx !== -1) {
      search = raw.substring(idx);
      pathname = raw.substring(0, idx);
      if (search.length > 1) {
        query = parse(search.substring(1));
      }
    }
    if (!!toDecode && !req._decoded) {
      req._decoded = true;
      if (pathname.indexOf("%") !== -1) {
        try {
          pathname = decodeURIComponent(pathname);
        } catch (e) {
        }
      }
    }
  }
  return req._parsedUrl = { pathname, search, query, raw };
}
function onError(err, req, res) {
  let code = res.statusCode = err.code || err.status || 500;
  if (typeof err === "string" || Buffer.isBuffer(err))
    res.end(err);
  else
    res.end(err.message || http.STATUS_CODES[code]);
}
var mount = (fn) => fn instanceof Polka ? fn.attach : fn;
var Polka = class extends Trouter {
  constructor(opts = {}) {
    super();
    this.parse = parse2;
    this.server = opts.server;
    this.handler = this.handler.bind(this);
    this.onError = opts.onError || onError;
    this.onNoMatch = opts.onNoMatch || this.onError.bind(null, { code: 404 });
    this.attach = (req, res) => setImmediate(this.handler, req, res);
  }
  use(base, ...fns) {
    if (base === "/") {
      super.use(base, fns.map(mount));
    } else if (typeof base === "function" || base instanceof Polka) {
      super.use("/", [base, ...fns].map(mount));
    } else {
      super.use(base, (req, _, next) => {
        if (typeof base === "string") {
          let len = base.length;
          base.startsWith("/") || len++;
          req.url = req.url.substring(len) || "/";
          req.path = req.path.substring(len) || "/";
        } else {
          req.url = req.url.replace(base, "") || "/";
          req.path = req.path.replace(base, "") || "/";
        }
        if (req.url.charAt(0) !== "/") {
          req.url = "/" + req.url;
        }
        next();
      }, fns.map(mount), (req, _, next) => {
        req.path = req._parsedUrl.pathname;
        req.url = req.path + req._parsedUrl.search;
        next();
      });
    }
    return this;
  }
  listen() {
    (this.server = this.server || http.createServer()).on("request", this.attach);
    this.server.listen.apply(this.server, arguments);
    return this;
  }
  handler(req, res, next) {
    let info = this.parse(req, true);
    let obj = this.find(req.method, req.path = info.pathname);
    req.params = obj.params;
    req.originalUrl = req.originalUrl || req.url;
    req.url = info.pathname + info.search;
    req.query = info.query || {};
    req.search = info.search;
    let i = 0, arr = obj.handlers.concat(this.onNoMatch), len = arr.length;
    let loop = async () => res.finished || i < len && arr[i++](req, res, next);
    (next = next || ((err) => err ? this.onError(err, req, res, next) : loop().catch(next)))();
  }
};
function polka(opts) {
  return new Polka(opts);
}
function list(dir, callback, pre = "") {
  dir = resolve2(".", dir);
  let arr = readdirSync(dir);
  let i = 0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join2(dir, arr[i]);
    stats = statSync2(abs);
    stats.isDirectory() ? list(abs, callback, join2(pre, arr[i])) : callback(join2(pre, arr[i]), abs, stats);
  }
}
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);
  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }
  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}
Mime.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();
    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      if (ext[0] === "*") {
        continue;
      }
      if (!force && ext in this._types) {
        throw new Error('Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".');
      }
      this._types[ext] = type;
    }
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
    }
  }
};
Mime.prototype.getType = function(path) {
  path = String(path);
  let last2 = path.replace(/^.*[/\\]/, "").toLowerCase();
  let ext = last2.replace(/^.*\./, "").toLowerCase();
  let hasPath = last2.length < path.length;
  let hasDot = ext.length < last2.length - 1;
  return (hasDot || !hasPath) && this._types[ext] || null;
};
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};
var Mime_1 = Mime;
var standard = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma", "es"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/mrb-consumer+xml": ["*xdf"], "application/mrb-publish+xml": ["*xdf"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["*xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-error+xml": ["xer"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
var lite = new Mime_1(standard);
var noop3 = () => {
};
function isMatch(uri, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].test(uri))
      return true;
  }
}
function toAssume(uri, extns) {
  let i = 0, x, len = uri.length - 1;
  if (uri.charCodeAt(len) === 47) {
    uri = uri.substring(0, len);
  }
  let arr = [], tmp = `${uri}/index`;
  for (; i < extns.length; i++) {
    x = extns[i] ? `.${extns[i]}` : "";
    if (uri)
      arr.push(uri + x);
    arr.push(tmp + x);
  }
  return arr;
}
function viaCache(cache, uri, extns) {
  let i = 0, data, arr = toAssume(uri, extns);
  for (; i < arr.length; i++) {
    if (data = cache[arr[i]])
      return data;
  }
}
function viaLocal(dir, isEtag, uri, extns) {
  let i = 0, arr = toAssume(uri, extns);
  let abs, stats, name, headers;
  for (; i < arr.length; i++) {
    abs = normalize2(join2(dir, name = arr[i]));
    if (abs.startsWith(dir) && existsSync(abs)) {
      stats = statSync(abs);
      if (stats.isDirectory())
        continue;
      headers = toHeaders(name, stats, isEtag);
      headers["Cache-Control"] = isEtag ? "no-cache" : "no-store";
      return { abs, stats, headers };
    }
  }
}
function is404(req, res) {
  return res.statusCode = 404, res.end();
}
function send(req, res, file, stats, headers) {
  let code = 200, tmp, opts = {};
  headers = __spreadValues({}, headers);
  for (let key in headers) {
    tmp = res.getHeader(key);
    if (tmp)
      headers[key] = tmp;
  }
  if (tmp = res.getHeader("content-type")) {
    headers["Content-Type"] = tmp;
  }
  if (req.headers.range) {
    code = 206;
    let [x, y2] = req.headers.range.replace("bytes=", "").split("-");
    let end = opts.end = parseInt(y2, 10) || stats.size - 1;
    let start = opts.start = parseInt(x, 10) || 0;
    if (start >= stats.size || end >= stats.size) {
      res.setHeader("Content-Range", `bytes */${stats.size}`);
      res.statusCode = 416;
      return res.end();
    }
    headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    headers["Content-Length"] = end - start + 1;
    headers["Accept-Ranges"] = "bytes";
  }
  res.writeHead(code, headers);
  createReadStream(file, opts).pipe(res);
}
function isEncoding(name, type, headers) {
  headers["Content-Encoding"] = type;
  headers["Content-Type"] = lite.getType(name.replace(/\.([^.]*)$/, "")) || "";
}
function toHeaders(name, stats, isEtag) {
  let headers = {
    "Content-Length": stats.size,
    "Content-Type": lite.getType(name) || "",
    "Last-Modified": stats.mtime.toUTCString()
  };
  if (isEtag)
    headers["ETag"] = `W/"${stats.size}-${stats.mtime.getTime()}"`;
  if (/\.br$/.test(name))
    isEncoding(name, "br", headers);
  if (/\.gz$/.test(name))
    isEncoding(name, "gzip", headers);
  return headers;
}
function sirv(dir, opts = {}) {
  dir = resolve2(dir || ".");
  let isNotFound = opts.onNoMatch || is404;
  let setHeaders = opts.setHeaders || noop3;
  let extensions = opts.extensions || ["html", "htm"];
  let gzips = opts.gzip && extensions.map((x) => `${x}.gz`).concat("gz");
  let brots = opts.brotli && extensions.map((x) => `${x}.br`).concat("br");
  const FILES = {};
  let fallback = "/";
  let isEtag = !!opts.etag;
  let isSPA = !!opts.single;
  if (typeof opts.single === "string") {
    let idx = opts.single.lastIndexOf(".");
    fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
  }
  let ignores = [];
  if (opts.ignores !== false) {
    ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/);
    if (opts.dotfiles)
      ignores.push(/\/\.\w/);
    else
      ignores.push(/\/\.well-known/);
    [].concat(opts.ignores || []).forEach((x) => {
      ignores.push(new RegExp(x, "i"));
    });
  }
  let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
  if (cc && opts.immutable)
    cc += ",immutable";
  else if (cc && opts.maxAge === 0)
    cc += ",must-revalidate";
  if (!opts.dev) {
    list(dir, (name, abs, stats) => {
      if (/\.well-known[\\+\/]/.test(name))
        ;
      else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name))
        return;
      let headers = toHeaders(name, stats, isEtag);
      if (cc)
        headers["Cache-Control"] = cc;
      FILES["/" + name.normalize().replace(/\\+/g, "/")] = { abs, stats, headers };
    });
  }
  let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);
  return function(req, res, next) {
    let extns = [""];
    let val = req.headers["accept-encoding"] || "";
    if (gzips && val.includes("gzip"))
      extns.unshift(...gzips);
    if (brots && /(br|brotli)/i.test(val))
      extns.unshift(...brots);
    extns.push(...extensions);
    let pathname = req.path || parse2(req, true).pathname;
    let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
    if (!data)
      return next ? next() : isNotFound(req, res);
    if (isEtag && req.headers["if-none-match"] === data.headers["ETag"]) {
      res.writeHead(304);
      return res.end();
    }
    if (gzips || brots) {
      res.setHeader("Vary", "Accept-Encoding");
    }
    setHeaders(res, pathname, data.stats);
    send(req, res, data.abs, data.stats, data.headers);
  };
}
var __dirname = dirname(fileURLToPath(import.meta.url));
var noop_handler = (_req, _res, next) => next();
var paths = {
  assets: join2(__dirname, "/assets"),
  prerendered: join2(__dirname, "/prerendered")
};
function createServer({ render: render2 }) {
  const immutable_path = (pathname) => {
    let app_dir = "_app";
    if (app_dir === "/") {
      return false;
    }
    if (app_dir.startsWith("/")) {
      app_dir = app_dir.slice(1);
    }
    if (app_dir.endsWith("/")) {
      app_dir = app_dir.slice(0, -1);
    }
    return pathname.startsWith(`/${app_dir}/`);
  };
  const prerendered_handler = fs__default.existsSync(paths.prerendered) ? sirv(paths.prerendered, {
    etag: true,
    maxAge: 0,
    gzip: true,
    brotli: true
  }) : noop_handler;
  const assets_handler = fs__default.existsSync(paths.assets) ? sirv(paths.assets, {
    setHeaders: (res, pathname, stats) => {
      if (immutable_path(pathname)) {
        res.setHeader("cache-control", "public, max-age=31536000, immutable");
      }
    },
    gzip: true,
    brotli: true
  }) : noop_handler;
  const server = polka().use(compression_1({ threshold: 0 }), assets_handler, prerendered_handler, async (req, res) => {
    const parsed = new URL(req.url || "", "http://localhost");
    let body;
    try {
      body = await getRawBody(req);
    } catch (err) {
      res.statusCode = err.status || 400;
      return res.end(err.reason || "Invalid request body");
    }
    const rendered = await render2({
      method: req.method,
      headers: req.headers,
      path: parsed.pathname,
      query: parsed.searchParams,
      rawBody: body
    });
    if (rendered) {
      res.writeHead(rendered.status, rendered.headers);
      if (rendered.body)
        res.write(rendered.body);
      res.end();
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  });
  return server;
}
init();
var instance = createServer({ render }).listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});
export {
  instance
};
/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */
/*!
 * compressible
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Jeremiah Senkpiel
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * compression
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * negotiator
 * Copyright(c) 2012 Federico Romero
 * Copyright(c) 2012-2014 Isaac Z. Schlueter
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * on-headers
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
