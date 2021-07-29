var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, src, Readable, wm, Blob2, fetchBlob, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    src = dataUriToBuffer;
    ({ Readable } = import_stream.default);
    wm = new WeakMap();
    Blob2 = class {
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map((element) => {
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob2) {
            buffer = element;
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length || buffer.size || 0;
          return buffer;
        });
        const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
        wm.set(this, {
          type: /[^\u0020-\u007E]/.test(type) ? "" : type,
          size,
          parts
        });
      }
      get size() {
        return wm.get(this).size;
      }
      get type() {
        return wm.get(this).type;
      }
      async text() {
        return Buffer.from(await this.arrayBuffer()).toString();
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of this.stream()) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        return Readable.from(read(wm.get(this).parts));
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = wm.get(this).parts.values();
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
            blobParts.push(chunk);
            added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
            relativeStart = 0;
            if (added >= span) {
              break;
            }
          }
        }
        const blob = new Blob2([], { type: String(type).toLowerCase() });
        Object.assign(wm.get(blob), { size: span, parts: blobParts });
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(Blob2.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    fetchBlob = Blob2;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && object[NAME] === "AbortSignal";
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on("error", (err) => {
            const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new fetchBlob([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw err;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const err = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
        throw err;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback) {
        for (const name of this.keys()) {
          callback(this.get(name), name);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status || 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal !== null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search2 = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search2,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-netlify/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-netlify/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/@supabase/supabase-js/dist/main/lib/constants.js
var require_constants = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/lib/constants.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_HEADERS = void 0;
    exports.DEFAULT_HEADERS = {};
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports, module2) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream2 = _interopDefault(require("stream"));
    var http2 = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var https2 = _interopDefault(require("https"));
    var zlib2 = _interopDefault(require("zlib"));
    var Readable2 = Stream2.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob3 = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options2 = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob3) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options2 && options2.type !== void 0 && String(options2.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable2 = new Readable2();
        readable2._read = function() {
        };
        readable2.push(this[BUFFER]);
        readable2.push(null);
        return readable2;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob3([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob3.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob3.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError2(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError2.prototype = Object.create(Error.prototype);
    FetchError2.prototype.constructor = FetchError2;
    FetchError2.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS2 = Symbol("Body internals");
    var PassThrough2 = Stream2.PassThrough;
    function Body2(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob2(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream2)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS2] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream2) {
        body.on("error", function(err) {
          const error2 = err.name === "AbortError" ? err : new FetchError2(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS2].error = error2;
        });
      }
    }
    Body2.prototype = {
      get body() {
        return this[INTERNALS2].body;
      },
      get bodyUsed() {
        return this[INTERNALS2].disturbed;
      },
      arrayBuffer() {
        return consumeBody2.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody2.call(this).then(function(buf) {
          return Object.assign(new Blob3([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody2.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body2.Promise.reject(new FetchError2(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody2.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody2.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody2.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body2.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body2.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body2.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body2.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody2() {
      var _this4 = this;
      if (this[INTERNALS2].disturbed) {
        return Body2.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS2].disturbed = true;
      if (this[INTERNALS2].error) {
        return Body2.Promise.reject(this[INTERNALS2].error);
      }
      let body = this.body;
      if (body === null) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob2(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body2.Promise.resolve(body);
      }
      if (!(body instanceof Stream2)) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body2.Promise(function(resolve2, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError2(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError2(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError2(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve2(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError2(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob2(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone2(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream2 && typeof body.getBoundary !== "function") {
        p1 = new PassThrough2();
        p2 = new PassThrough2();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS2].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType2(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob2(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream2) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes2(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob2(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream2(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob2(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body2.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers2 = class {
      constructor() {
        let init2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init2 instanceof Headers2) {
          const rawHeaders = init2.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init2 == null)
          ;
        else if (typeof init2 === "object") {
          const method = init2[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init2) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init2)) {
              const value = init2[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers2.prototype.entries = Headers2.prototype[Symbol.iterator];
    Object.defineProperty(Headers2.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers2.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index2 = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index2 >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index2 + 1;
        return {
          value: values[index2],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers2();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$12 = Symbol("Response internals");
    var STATUS_CODES = http2.STATUS_CODES;
    var Response2 = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body2.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers2(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType2(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$12] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$12].url || "";
      }
      get status() {
        return this[INTERNALS$12].status;
      }
      get ok() {
        return this[INTERNALS$12].status >= 200 && this[INTERNALS$12].status < 300;
      }
      get redirected() {
        return this[INTERNALS$12].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$12].statusText;
      }
      get headers() {
        return this[INTERNALS$12].headers;
      }
      clone() {
        return new Response2(clone2(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body2.mixIn(Response2.prototype);
    Object.defineProperties(Response2.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response2.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$22 = Symbol("Request internals");
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = "destroy" in Stream2.Readable.prototype;
    function isRequest2(input) {
      return typeof input === "object" && typeof input[INTERNALS$22] === "object";
    }
    function isAbortSignal2(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request2 = class {
      constructor(input) {
        let init2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest2(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest2(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init2.body != null ? init2.body : isRequest2(input) && input.body !== null ? clone2(input) : null;
        Body2.call(this, inputBody, {
          timeout: init2.timeout || input.timeout || 0,
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType2(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest2(input) ? input.signal : null;
        if ("signal" in init2)
          signal = init2.signal;
        if (signal != null && !isAbortSignal2(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$22] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow !== void 0 ? init2.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init2.compress !== void 0 ? init2.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$22].method;
      }
      get url() {
        return format_url(this[INTERNALS$22].parsedURL);
      }
      get headers() {
        return this[INTERNALS$22].headers;
      }
      get redirect() {
        return this[INTERNALS$22].redirect;
      }
      get signal() {
        return this[INTERNALS$22].signal;
      }
      clone() {
        return new Request2(this);
      }
    };
    Body2.mixIn(Request2.prototype);
    Object.defineProperty(Request2.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions2(request) {
      const parsedURL = request[INTERNALS$22].parsedURL;
      const headers = new Headers2(request[INTERNALS$22].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream2.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes2(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError2(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError2.prototype = Object.create(Error.prototype);
    AbortError2.prototype.constructor = AbortError2;
    AbortError2.prototype.name = "AbortError";
    var PassThrough$1 = Stream2.PassThrough;
    var resolve_url = Url.resolve;
    function fetch2(url, opts) {
      if (!fetch2.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body2.Promise = fetch2.Promise;
      return new fetch2.Promise(function(resolve2, reject) {
        const request = new Request2(url, opts);
        const options2 = getNodeRequestOptions2(request);
        const send = (options2.protocol === "https:" ? https2 : http2).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error2 = new AbortError2("The user aborted a request.");
          reject(error2);
          if (request.body && request.body instanceof Stream2.Readable) {
            request.body.destroy(error2);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error2);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options2);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError2(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError2(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch2.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case "error":
                reject(new FetchError2(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError2(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes2(request) === null) {
                  reject(new FetchError2("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve2(fetch2(new Request2(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response2(body, response_options);
            resolve2(response);
            return;
          }
          const zlibOptions = {
            flush: zlib2.Z_SYNC_FLUSH,
            finishFlush: zlib2.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib2.createGunzip(zlibOptions));
            response = new Response2(body, response_options);
            resolve2(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib2.createInflate());
              } else {
                body = body.pipe(zlib2.createInflateRaw());
              }
              response = new Response2(body, response_options);
              resolve2(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib2.createBrotliDecompress === "function") {
            body = body.pipe(zlib2.createBrotliDecompress());
            response = new Response2(body, response_options);
            resolve2(response);
            return;
          }
          response = new Response2(body, response_options);
          resolve2(response);
        });
        writeToStream2(req, request);
      });
    }
    fetch2.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch2.Promise = global.Promise;
    module2.exports = exports = fetch2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports;
    exports.Headers = Headers2;
    exports.Request = Request2;
    exports.Response = Response2;
    exports.FetchError = FetchError2;
  }
});

// node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/node-ponyfill.js"(exports, module2) {
    init_shims();
    var nodeFetch = require_lib();
    var realFetch = nodeFetch.default || nodeFetch;
    var fetch2 = function(url, options2) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options2);
    };
    fetch2.ponyfill = true;
    module2.exports = exports = fetch2;
    exports.fetch = fetch2;
    exports.Headers = nodeFetch.Headers;
    exports.Request = nodeFetch.Request;
    exports.Response = nodeFetch.Response;
    exports.default = fetch2;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/fetch.js
var require_fetch = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/fetch.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.remove = exports.put = exports.post = exports.get = void 0;
    var cross_fetch_1 = __importDefault(require_node_ponyfill());
    var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    var handleError = (error2, reject) => {
      if (typeof error2.json !== "function") {
        return reject(error2);
      }
      error2.json().then((err) => {
        return reject({
          message: _getErrorMessage(err),
          status: (error2 === null || error2 === void 0 ? void 0 : error2.status) || 500
        });
      });
    };
    var _getRequestParams = (method, options2, body) => {
      const params = { method, headers: (options2 === null || options2 === void 0 ? void 0 : options2.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "text/plain;charset=UTF-8" }, options2 === null || options2 === void 0 ? void 0 : options2.headers);
      params.body = JSON.stringify(body);
      return params;
    };
    function _handleRequest(method, url, options2, body) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve2, reject) => {
          cross_fetch_1.default(url, _getRequestParams(method, options2, body)).then((result) => {
            if (!result.ok)
              throw result;
            if (options2 === null || options2 === void 0 ? void 0 : options2.noResolveJson)
              return resolve2;
            return result.json();
          }).then((data) => resolve2(data)).catch((error2) => handleError(error2, reject));
        });
      });
    }
    function get2(url, options2) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("GET", url, options2);
      });
    }
    exports.get = get2;
    function post(url, body, options2) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("POST", url, options2, body);
      });
    }
    exports.post = post;
    function put(url, body, options2) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("PUT", url, options2, body);
      });
    }
    exports.put = put;
    function remove(url, body, options2) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("DELETE", url, options2, body);
      });
    }
    exports.remove = remove;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/constants.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COOKIE_OPTIONS = exports.STORAGE_KEY = exports.EXPIRY_MARGIN = exports.DEFAULT_HEADERS = exports.AUDIENCE = exports.GOTRUE_URL = void 0;
    exports.GOTRUE_URL = "http://localhost:9999";
    exports.AUDIENCE = "";
    exports.DEFAULT_HEADERS = {};
    exports.EXPIRY_MARGIN = 60 * 1e3;
    exports.STORAGE_KEY = "supabase.auth.token";
    exports.COOKIE_OPTIONS = {
      name: "sb:token",
      lifetime: 60 * 60 * 8,
      domain: "",
      path: "/",
      sameSite: "lax"
    };
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/cookies.js
var require_cookies = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/cookies.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteCookie = exports.setCookie = exports.setCookies = void 0;
    function serialize(name, val, options2) {
      const opt = options2 || {};
      const enc = encodeURIComponent;
      const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      const value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      let str = name + "=" + value;
      if (opt.maxAge != null) {
        const maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== "function") {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.sameSite) {
        const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function isSecureEnvironment(req) {
      if (!req || !req.headers || !req.headers.host) {
        throw new Error('The "host" request header is not available');
      }
      const host = req.headers.host.indexOf(":") > -1 && req.headers.host.split(":")[0] || req.headers.host;
      if (["localhost", "127.0.0.1"].indexOf(host) > -1 || host.endsWith(".local")) {
        return false;
      }
      return true;
    }
    function serializeCookie(cookie, secure) {
      var _a, _b, _c;
      return serialize(cookie.name, cookie.value, {
        maxAge: cookie.maxAge,
        expires: new Date(Date.now() + cookie.maxAge * 1e3),
        httpOnly: true,
        secure,
        path: (_a = cookie.path) !== null && _a !== void 0 ? _a : "/",
        domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : "",
        sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : "lax"
      });
    }
    function setCookies(req, res, cookies) {
      const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
      const previousCookies = res.getHeader("Set-Cookie");
      if (previousCookies) {
        if (previousCookies instanceof Array) {
          Array.prototype.push.apply(strCookies, previousCookies);
        } else if (typeof previousCookies === "string") {
          strCookies.push(previousCookies);
        }
      }
      res.setHeader("Set-Cookie", strCookies);
    }
    exports.setCookies = setCookies;
    function setCookie(req, res, cookie) {
      setCookies(req, res, [cookie]);
    }
    exports.setCookie = setCookie;
    function deleteCookie(req, res, name) {
      setCookie(req, res, {
        name,
        value: "",
        maxAge: -1
      });
    }
    exports.deleteCookie = deleteCookie;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/helpers.js
var require_helpers = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/helpers.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalStorage = exports.getParameterByName = exports.isBrowser = exports.uuid = exports.expiresAt = void 0;
    function expiresAt(expiresIn) {
      const timeNow = Math.round(Date.now() / 1e3);
      return timeNow + expiresIn;
    }
    exports.expiresAt = expiresAt;
    function uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    }
    exports.uuid = uuid;
    exports.isBrowser = () => typeof window !== "undefined";
    function getParameterByName(name, url) {
      if (!url)
        url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
      if (!results)
        return null;
      if (!results[2])
        return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    var LocalStorage = class {
      constructor(localStorage2) {
        this.localStorage = localStorage2 || globalThis.localStorage;
      }
      clear() {
        return this.localStorage.clear();
      }
      key(index2) {
        return this.localStorage.key(index2);
      }
      setItem(key, value) {
        return this.localStorage.setItem(key, value);
      }
      getItem(key) {
        return this.localStorage.getItem(key);
      }
      removeItem(key) {
        return this.localStorage.removeItem(key);
      }
    };
    exports.LocalStorage = LocalStorage;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/GoTrueApi.js
var require_GoTrueApi = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/GoTrueApi.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var fetch_1 = require_fetch();
    var constants_1 = require_constants2();
    var cookies_1 = require_cookies();
    var helpers_1 = require_helpers();
    var GoTrueApi = class {
      constructor({ url = "", headers = {}, cookieOptions }) {
        this.url = url;
        this.headers = headers;
        this.cookieOptions = Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), cookieOptions);
      }
      signUpWithEmail(email, password, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "";
            if (options2.redirectTo) {
              queryString = "?redirect_to=" + encodeURIComponent(options2.redirectTo);
            }
            const data = yield fetch_1.post(`${this.url}/signup${queryString}`, { email, password }, { headers });
            let session = Object.assign({}, data);
            if (session.expires_in)
              session.expires_at = helpers_1.expiresAt(data.expires_in);
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      signInWithEmail(email, password, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "?grant_type=password";
            if (options2.redirectTo) {
              queryString += "&redirect_to=" + encodeURIComponent(options2.redirectTo);
            }
            const data = yield fetch_1.post(`${this.url}/token${queryString}`, { email, password }, { headers });
            let session = Object.assign({}, data);
            if (session.expires_in)
              session.expires_at = helpers_1.expiresAt(data.expires_in);
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      signUpWithPhone(phone, password) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            const data = yield fetch_1.post(`${this.url}/signup`, { phone, password }, { headers });
            let session = Object.assign({}, data);
            if (session.expires_in)
              session.expires_at = helpers_1.expiresAt(data.expires_in);
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      signInWithPhone(phone, password) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "?grant_type=password";
            const data = yield fetch_1.post(`${this.url}/token${queryString}`, { phone, password }, { headers });
            let session = Object.assign({}, data);
            if (session.expires_in)
              session.expires_at = helpers_1.expiresAt(data.expires_in);
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      sendMagicLinkEmail(email, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "";
            if (options2.redirectTo) {
              queryString += "?redirect_to=" + encodeURIComponent(options2.redirectTo);
            }
            const data = yield fetch_1.post(`${this.url}/magiclink${queryString}`, { email }, { headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      sendMobileOTP(phone) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            const data = yield fetch_1.post(`${this.url}/otp`, { phone }, { headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      verifyMobileOTP(phone, token, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            const data = yield fetch_1.post(`${this.url}/verify`, { phone, token, type: "sms", redirect_to: options2.redirectTo }, { headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      inviteUserByEmail(email, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "";
            if (options2.redirectTo) {
              queryString += "?redirect_to=" + encodeURIComponent(options2.redirectTo);
            }
            const data = yield fetch_1.post(`${this.url}/invite${queryString}`, { email }, { headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      resetPasswordForEmail(email, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let headers = Object.assign({}, this.headers);
            let queryString = "";
            if (options2.redirectTo) {
              queryString += "?redirect_to=" + encodeURIComponent(options2.redirectTo);
            }
            const data = yield fetch_1.post(`${this.url}/recover${queryString}`, { email }, { headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      _createRequestHeaders(jwt) {
        const headers = Object.assign({}, this.headers);
        headers["Authorization"] = `Bearer ${jwt}`;
        return headers;
      }
      signOut(jwt) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            yield fetch_1.post(`${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
            return { error: null };
          } catch (error2) {
            return { error: error2 };
          }
        });
      }
      getUrlForProvider(provider, options2) {
        let urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options2 === null || options2 === void 0 ? void 0 : options2.redirectTo) {
          urlParams.push(`redirect_to=${encodeURIComponent(options2.redirectTo)}`);
        }
        if (options2 === null || options2 === void 0 ? void 0 : options2.scopes) {
          urlParams.push(`scopes=${encodeURIComponent(options2.scopes)}`);
        }
        return `${this.url}/authorize?${urlParams.join("&")}`;
      }
      getUser(jwt) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.get(`${this.url}/user`, { headers: this._createRequestHeaders(jwt) });
            return { user: data, data, error: null };
          } catch (error2) {
            return { user: null, data: null, error: error2 };
          }
        });
      }
      updateUser(jwt, attributes) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.put(`${this.url}/user`, attributes, {
              headers: this._createRequestHeaders(jwt)
            });
            return { user: data, data, error: null };
          } catch (error2) {
            return { user: null, data: null, error: error2 };
          }
        });
      }
      deleteUser(uid, jwt) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.remove(`${this.url}/admin/users/${uid}`, {}, {
              headers: this._createRequestHeaders(jwt)
            });
            return { user: data, data, error: null };
          } catch (error2) {
            return { user: null, data: null, error: error2 };
          }
        });
      }
      refreshAccessToken(refreshToken) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.post(`${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
            let session = Object.assign({}, data);
            if (session.expires_in)
              session.expires_at = helpers_1.expiresAt(data.expires_in);
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      setAuthCookie(req, res) {
        if (req.method !== "POST") {
          res.setHeader("Allow", "POST");
          res.status(405).end("Method Not Allowed");
        }
        const { event, session } = req.body;
        if (!event)
          throw new Error("Auth event missing!");
        if (event === "SIGNED_IN") {
          if (!session)
            throw new Error("Auth session missing!");
          cookies_1.setCookie(req, res, {
            name: this.cookieOptions.name,
            value: session.access_token,
            domain: this.cookieOptions.domain,
            maxAge: this.cookieOptions.lifetime,
            path: this.cookieOptions.path,
            sameSite: this.cookieOptions.sameSite
          });
        }
        if (event === "SIGNED_OUT")
          cookies_1.deleteCookie(req, res, this.cookieOptions.name);
        res.status(200).json({});
      }
      getUserByCookie(req) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!req.cookies)
              throw new Error("Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!");
            if (!req.cookies[this.cookieOptions.name])
              throw new Error("No cookie found!");
            const token = req.cookies[this.cookieOptions.name];
            const { user, error: error2 } = yield this.getUser(token);
            if (error2)
              throw error2;
            return { user, data: user, error: null };
          } catch (error2) {
            return { user: null, data: null, error: error2 };
          }
        });
      }
      generateLink(type, email, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.post(`${this.url}/admin/generate_link`, {
              type,
              email,
              password: options2.password,
              data: options2.data,
              redirect_to: options2.redirectTo
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
    };
    exports.default = GoTrueApi;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/polyfills.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.polyfillGlobalThis = void 0;
    function polyfillGlobalThis() {
      if (typeof globalThis === "object")
        return;
      try {
        Object.defineProperty(Object.prototype, "__magic__", {
          get: function() {
            return this;
          },
          configurable: true
        });
        __magic__.globalThis = __magic__;
        delete Object.prototype.__magic__;
      } catch (e) {
        if (typeof self !== "undefined") {
          self.globalThis = self;
        }
      }
    }
    exports.polyfillGlobalThis = polyfillGlobalThis;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/GoTrueClient.js
var require_GoTrueClient = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/GoTrueClient.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoTrueApi_1 = __importDefault(require_GoTrueApi());
    var helpers_1 = require_helpers();
    var constants_1 = require_constants2();
    var polyfills_1 = require_polyfills();
    polyfills_1.polyfillGlobalThis();
    var DEFAULT_OPTIONS = {
      url: constants_1.GOTRUE_URL,
      autoRefreshToken: true,
      persistSession: true,
      localStorage: globalThis.localStorage,
      detectSessionInUrl: true,
      headers: constants_1.DEFAULT_HEADERS
    };
    var GoTrueClient = class {
      constructor(options2) {
        this.stateChangeEmitters = new Map();
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options2);
        this.currentUser = null;
        this.currentSession = null;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.persistSession = settings.persistSession;
        this.localStorage = new helpers_1.LocalStorage(settings.localStorage);
        this.api = new GoTrueApi_1.default({
          url: settings.url,
          headers: settings.headers,
          cookieOptions: settings.cookieOptions
        });
        this._recoverSession();
        this._recoverAndRefresh();
        try {
          if (settings.detectSessionInUrl && helpers_1.isBrowser() && !!helpers_1.getParameterByName("access_token")) {
            this.getSessionFromUrl({ storeSession: true });
          }
        } catch (error2) {
          console.log("Error getting session from URL.");
        }
      }
      signUp({ email, password, phone }, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            this._removeSession();
            const { data, error: error2 } = phone && password ? yield this.api.signUpWithPhone(phone, password) : yield this.api.signUpWithEmail(email, password, {
              redirectTo: options2.redirectTo
            });
            if (error2) {
              throw error2;
            }
            if (!data) {
              throw "An error occurred on sign up.";
            }
            let session = null;
            let user = null;
            if (data.access_token) {
              session = data;
              user = session.user;
              this._saveSession(session);
              this._notifyAllSubscribers("SIGNED_IN");
            }
            if (data.id) {
              user = data;
            }
            return { data, user, session, error: null };
          } catch (error2) {
            return { data: null, user: null, session: null, error: error2 };
          }
        });
      }
      signIn({ email, phone, password, refreshToken, provider }, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            this._removeSession();
            if (email && !password) {
              const { error: error2 } = yield this.api.sendMagicLinkEmail(email, {
                redirectTo: options2.redirectTo
              });
              return { data: null, user: null, session: null, error: error2 };
            }
            if (email && password) {
              return this._handleEmailSignIn(email, password, {
                redirectTo: options2.redirectTo
              });
            }
            if (phone && !password) {
              const { error: error2 } = yield this.api.sendMobileOTP(phone);
              return { data: null, user: null, session: null, error: error2 };
            }
            if (phone && password) {
              return this._handlePhoneSignIn(phone, password);
            }
            if (refreshToken) {
              const { error: error2 } = yield this._callRefreshToken(refreshToken);
              if (error2)
                throw error2;
              return {
                data: this.currentSession,
                user: this.currentUser,
                session: this.currentSession,
                error: null
              };
            }
            if (provider) {
              return this._handleProviderSignIn(provider, {
                redirectTo: options2.redirectTo,
                scopes: options2.scopes
              });
            }
            throw new Error(`You must provide either an email, phone number or a third-party provider.`);
          } catch (error2) {
            return { data: null, user: null, session: null, error: error2 };
          }
        });
      }
      verifyOTP({ phone, token }, options2 = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            this._removeSession();
            const { data, error: error2 } = yield this.api.verifyMobileOTP(phone, token, options2);
            if (error2) {
              throw error2;
            }
            if (!data) {
              throw "An error occurred on token verification.";
            }
            let session = null;
            let user = null;
            if (data.access_token) {
              session = data;
              user = session.user;
              this._saveSession(session);
              this._notifyAllSubscribers("SIGNED_IN");
            }
            if (data.id) {
              user = data;
            }
            return { data, user, session, error: null };
          } catch (error2) {
            return { data: null, user: null, session: null, error: error2 };
          }
        });
      }
      user() {
        return this.currentUser;
      }
      session() {
        return this.currentSession;
      }
      refreshSession() {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
              throw new Error("Not logged in.");
            const { error: error2 } = yield this._callRefreshToken();
            if (error2)
              throw error2;
            return { data: this.currentSession, user: this.currentUser, error: null };
          } catch (error2) {
            return { data: null, user: null, error: error2 };
          }
        });
      }
      update(attributes) {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
              throw new Error("Not logged in.");
            const { user, error: error2 } = yield this.api.updateUser(this.currentSession.access_token, attributes);
            if (error2)
              throw error2;
            if (!user)
              throw Error("Invalid user data.");
            const session = Object.assign(Object.assign({}, this.currentSession), { user });
            this._saveSession(session);
            this._notifyAllSubscribers("USER_UPDATED");
            return { data: user, user, error: null };
          } catch (error2) {
            return { data: null, user: null, error: error2 };
          }
        });
      }
      setSession(refresh_token) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!refresh_token) {
              throw new Error("No current session.");
            }
            const { data, error: error2 } = yield this.api.refreshAccessToken(refresh_token);
            if (error2) {
              return { session: null, error: error2 };
            }
            if (!data) {
              return {
                session: null,
                error: { name: "Invalid refresh_token", message: "JWT token provided is Invalid" }
              };
            }
            this._saveSession(data);
            this._notifyAllSubscribers("SIGNED_IN");
            return { session: data, error: null };
          } catch (error2) {
            return { error: error2, session: null };
          }
        });
      }
      setAuth(access_token) {
        this.currentSession = Object.assign(Object.assign({}, this.currentSession), { access_token, token_type: "bearer", user: null });
        return this.currentSession;
      }
      getSessionFromUrl(options2) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!helpers_1.isBrowser())
              throw new Error("No browser detected.");
            const error_description = helpers_1.getParameterByName("error_description");
            if (error_description)
              throw new Error(error_description);
            const provider_token = helpers_1.getParameterByName("provider_token");
            const access_token = helpers_1.getParameterByName("access_token");
            if (!access_token)
              throw new Error("No access_token detected.");
            const expires_in = helpers_1.getParameterByName("expires_in");
            if (!expires_in)
              throw new Error("No expires_in detected.");
            const refresh_token = helpers_1.getParameterByName("refresh_token");
            if (!refresh_token)
              throw new Error("No refresh_token detected.");
            const token_type = helpers_1.getParameterByName("token_type");
            if (!token_type)
              throw new Error("No token_type detected.");
            const timeNow = Math.round(Date.now() / 1e3);
            const expires_at = timeNow + parseInt(expires_in);
            const { user, error: error2 } = yield this.api.getUser(access_token);
            if (error2)
              throw error2;
            const session = {
              provider_token,
              access_token,
              expires_in: parseInt(expires_in),
              expires_at,
              refresh_token,
              token_type,
              user
            };
            if (options2 === null || options2 === void 0 ? void 0 : options2.storeSession) {
              this._saveSession(session);
              this._notifyAllSubscribers("SIGNED_IN");
              if (helpers_1.getParameterByName("type") === "recovery") {
                this._notifyAllSubscribers("PASSWORD_RECOVERY");
              }
            }
            window.location.hash = "";
            return { data: session, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      signOut() {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;
          this._removeSession();
          this._notifyAllSubscribers("SIGNED_OUT");
          if (accessToken) {
            const { error: error2 } = yield this.api.signOut(accessToken);
            if (error2)
              return { error: error2 };
          }
          return { error: null };
        });
      }
      onAuthStateChange(callback) {
        try {
          const id = helpers_1.uuid();
          const self2 = this;
          const subscription = {
            id,
            callback,
            unsubscribe: () => {
              self2.stateChangeEmitters.delete(id);
            }
          };
          this.stateChangeEmitters.set(id, subscription);
          return { data: subscription, error: null };
        } catch (error2) {
          return { data: null, error: error2 };
        }
      }
      _handleEmailSignIn(email, password, options2 = {}) {
        var _a, _b;
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const { data, error: error2 } = yield this.api.signInWithEmail(email, password, {
              redirectTo: options2.redirectTo
            });
            if (error2 || !data)
              return { data: null, user: null, session: null, error: error2 };
            if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
              this._saveSession(data);
              this._notifyAllSubscribers("SIGNED_IN");
            }
            return { data, user: data.user, session: data, error: null };
          } catch (error2) {
            return { data: null, user: null, session: null, error: error2 };
          }
        });
      }
      _handlePhoneSignIn(phone, password) {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const { data, error: error2 } = yield this.api.signInWithPhone(phone, password);
            if (error2 || !data)
              return { data: null, user: null, session: null, error: error2 };
            if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
              this._saveSession(data);
              this._notifyAllSubscribers("SIGNED_IN");
            }
            return { data, user: data.user, session: data, error: null };
          } catch (error2) {
            return { data: null, user: null, session: null, error: error2 };
          }
        });
      }
      _handleProviderSignIn(provider, options2 = {}) {
        const url = this.api.getUrlForProvider(provider, {
          redirectTo: options2.redirectTo,
          scopes: options2.scopes
        });
        try {
          if (helpers_1.isBrowser()) {
            window.location.href = url;
          }
          return { provider, url, data: null, session: null, user: null, error: null };
        } catch (error2) {
          if (!!url)
            return { provider, url, data: null, session: null, user: null, error: null };
          return { data: null, user: null, session: null, error: error2 };
        }
      }
      _recoverSession() {
        var _a;
        try {
          const json = helpers_1.isBrowser() && ((_a = this.localStorage) === null || _a === void 0 ? void 0 : _a.getItem(constants_1.STORAGE_KEY));
          if (!json || typeof json !== "string") {
            return null;
          }
          const data = JSON.parse(json);
          const { currentSession, expiresAt } = data;
          const timeNow = Math.round(Date.now() / 1e3);
          if (expiresAt >= timeNow && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
            this._saveSession(currentSession);
            this._notifyAllSubscribers("SIGNED_IN");
          }
        } catch (error2) {
          console.log("error", error2);
        }
      }
      _recoverAndRefresh() {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const json = helpers_1.isBrowser() && (yield this.localStorage.getItem(constants_1.STORAGE_KEY));
            if (!json) {
              return null;
            }
            const data = JSON.parse(json);
            const { currentSession, expiresAt } = data;
            const timeNow = Math.round(Date.now() / 1e3);
            if (expiresAt < timeNow) {
              if (this.autoRefreshToken && currentSession.refresh_token) {
                const { error: error2 } = yield this._callRefreshToken(currentSession.refresh_token);
                if (error2) {
                  console.log(error2.message);
                  yield this._removeSession();
                }
              } else {
                this._removeSession();
              }
            } else if (!currentSession || !currentSession.user) {
              console.log("Current session is missing data.");
              this._removeSession();
            } else {
              this._saveSession(currentSession);
              this._notifyAllSubscribers("SIGNED_IN");
            }
          } catch (err) {
            console.error(err);
            return null;
          }
        });
      }
      _callRefreshToken(refresh_token) {
        var _a;
        if (refresh_token === void 0) {
          refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token;
        }
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            if (!refresh_token) {
              throw new Error("No current session.");
            }
            const { data, error: error2 } = yield this.api.refreshAccessToken(refresh_token);
            if (error2)
              throw error2;
            if (!data)
              throw Error("Invalid session data.");
            this._saveSession(data);
            this._notifyAllSubscribers("SIGNED_IN");
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      _notifyAllSubscribers(event) {
        this.stateChangeEmitters.forEach((x) => x.callback(event, this.currentSession));
      }
      _saveSession(session) {
        this.currentSession = session;
        this.currentUser = session.user;
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const timeNow = Math.round(Date.now() / 1e3);
          const expiresIn = expiresAt - timeNow;
          const refreshDurationBeforeExpires = expiresIn > 60 ? 60 : 0.5;
          this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1e3);
        }
        if (this.persistSession && session.expires_at) {
          this._persistSession(this.currentSession);
        }
      }
      _persistSession(currentSession) {
        const data = { currentSession, expiresAt: currentSession.expires_at };
        helpers_1.isBrowser() && this.localStorage.setItem(constants_1.STORAGE_KEY, JSON.stringify(data));
      }
      _removeSession() {
        return __awaiter2(this, void 0, void 0, function* () {
          this.currentSession = null;
          this.currentUser = null;
          if (this.refreshTokenTimer)
            clearTimeout(this.refreshTokenTimer);
          helpers_1.isBrowser() && (yield this.localStorage.removeItem(constants_1.STORAGE_KEY));
        });
      }
      _startAutoRefreshToken(value) {
        if (this.refreshTokenTimer)
          clearTimeout(this.refreshTokenTimer);
        if (value <= 0 || !this.autoRefreshToken)
          return;
        this.refreshTokenTimer = setTimeout(() => this._callRefreshToken(), value);
        if (typeof this.refreshTokenTimer.unref === "function")
          this.refreshTokenTimer.unref();
      }
    };
    exports.default = GoTrueClient;
  }
});

// node_modules/@supabase/gotrue-js/dist/main/lib/types.js
var require_types = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/lib/types.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@supabase/gotrue-js/dist/main/index.js
var require_main = __commonJS({
  "node_modules/@supabase/gotrue-js/dist/main/index.js"(exports) {
    init_shims();
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GoTrueClient = exports.GoTrueApi = void 0;
    var GoTrueApi_1 = __importDefault(require_GoTrueApi());
    exports.GoTrueApi = GoTrueApi_1.default;
    var GoTrueClient_1 = __importDefault(require_GoTrueClient());
    exports.GoTrueClient = GoTrueClient_1.default;
    __exportStar(require_types(), exports);
  }
});

// node_modules/@supabase/supabase-js/dist/main/lib/SupabaseAuthClient.js
var require_SupabaseAuthClient = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/lib/SupabaseAuthClient.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseAuthClient = void 0;
    var gotrue_js_1 = require_main();
    var SupabaseAuthClient = class extends gotrue_js_1.GoTrueClient {
      constructor(options2) {
        super(options2);
      }
    };
    exports.SupabaseAuthClient = SupabaseAuthClient;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/lib/types.js
var require_types2 = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/lib/types.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgrestBuilder = void 0;
    var cross_fetch_1 = __importDefault(require_node_ponyfill());
    var PostgrestBuilder = class {
      constructor(builder) {
        Object.assign(this, builder);
      }
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      then(onfulfilled, onrejected) {
        if (typeof this.schema === "undefined") {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers["Accept-Profile"] = this.schema;
        } else {
          this.headers["Content-Profile"] = this.schema;
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers["Content-Type"] = "application/json";
        }
        return cross_fetch_1.default(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body)
        }).then((res) => __awaiter2(this, void 0, void 0, function* () {
          var _a, _b, _c;
          let error2 = null;
          let data = null;
          let count = null;
          if (res.ok) {
            const isReturnMinimal = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.split(",").includes("return=minimal");
            if (this.method !== "HEAD" && !isReturnMinimal) {
              const text = yield res.text();
              if (!text) {
              } else if (this.headers["Accept"] === "text/csv") {
                data = text;
              } else {
                data = JSON.parse(text);
              }
            }
            const countHeader = (_b = this.headers["Prefer"]) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
            const contentRange = (_c = res.headers.get("content-range")) === null || _c === void 0 ? void 0 : _c.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
          } else {
            error2 = yield res.json();
            if (error2 && this.shouldThrowOnError) {
              throw error2;
            }
          }
          const postgrestResponse = {
            error: error2,
            data,
            count,
            status: res.status,
            statusText: res.statusText,
            body: data
          };
          return postgrestResponse;
        })).then(onfulfilled, onrejected);
      }
    };
    exports.PostgrestBuilder = PostgrestBuilder;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestTransformBuilder.js
var require_PostgrestTransformBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestTransformBuilder.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require_types2();
    var PostgrestTransformBuilder = class extends types_1.PostgrestBuilder {
      select(columns = "*") {
        let quoted = false;
        const cleanedColumns = columns.split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        return this;
      }
      order(column, { ascending = true, nullsFirst = false, foreignTable } = {}) {
        const key = typeof foreignTable === "undefined" ? "order" : `${foreignTable}.order`;
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}.${nullsFirst ? "nullsfirst" : "nullslast"}`);
        return this;
      }
      limit(count, { foreignTable } = {}) {
        const key = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
      }
      range(from, to, { foreignTable } = {}) {
        const keyOffset = typeof foreignTable === "undefined" ? "offset" : `${foreignTable}.offset`;
        const keyLimit = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      single() {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
        return this;
      }
      maybeSingle() {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
        const _this = new PostgrestTransformBuilder(this);
        _this.then = (onfulfilled, onrejected) => this.then((res) => {
          var _a;
          if ((_a = res.error) === null || _a === void 0 ? void 0 : _a.details.includes("Results contain 0 rows")) {
            return onfulfilled({
              error: null,
              data: null,
              count: res.count,
              status: 200,
              statusText: "OK",
              body: null
            });
          }
          return onfulfilled(res);
        }, onrejected);
        return _this;
      }
      csv() {
        this.headers["Accept"] = "text/csv";
        return this;
      }
    };
    exports.default = PostgrestTransformBuilder;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestFilterBuilder.js
var require_PostgrestFilterBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestFilterBuilder.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    var PostgrestFilterBuilder = class extends PostgrestTransformBuilder_1.default {
      constructor() {
        super(...arguments);
        this.cs = this.contains;
        this.cd = this.containedBy;
        this.sl = this.rangeLt;
        this.sr = this.rangeGt;
        this.nxl = this.rangeGte;
        this.nxr = this.rangeLte;
        this.adj = this.rangeAdjacent;
        this.ov = this.overlaps;
      }
      not(column, operator, value) {
        this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
        return this;
      }
      or(filters, { foreignTable } = {}) {
        const key = typeof foreignTable === "undefined" ? "or" : `${foreignTable}.or`;
        this.url.searchParams.append(key, `(${filters})`);
        return this;
      }
      eq(column, value) {
        this.url.searchParams.append(`${column}`, `eq.${value}`);
        return this;
      }
      neq(column, value) {
        this.url.searchParams.append(`${column}`, `neq.${value}`);
        return this;
      }
      gt(column, value) {
        this.url.searchParams.append(`${column}`, `gt.${value}`);
        return this;
      }
      gte(column, value) {
        this.url.searchParams.append(`${column}`, `gte.${value}`);
        return this;
      }
      lt(column, value) {
        this.url.searchParams.append(`${column}`, `lt.${value}`);
        return this;
      }
      lte(column, value) {
        this.url.searchParams.append(`${column}`, `lte.${value}`);
        return this;
      }
      like(column, pattern) {
        this.url.searchParams.append(`${column}`, `like.${pattern}`);
        return this;
      }
      ilike(column, pattern) {
        this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
        return this;
      }
      is(column, value) {
        this.url.searchParams.append(`${column}`, `is.${value}`);
        return this;
      }
      in(column, values) {
        const cleanedValues = values.map((s2) => {
          if (typeof s2 === "string" && new RegExp("[,()]").test(s2))
            return `"${s2}"`;
          else
            return `${s2}`;
        }).join(",");
        this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
        return this;
      }
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(`${column}`, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(`${column}`, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(`${column}`, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(`${column}`, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      rangeLt(column, range2) {
        this.url.searchParams.append(`${column}`, `sl.${range2}`);
        return this;
      }
      rangeGt(column, range2) {
        this.url.searchParams.append(`${column}`, `sr.${range2}`);
        return this;
      }
      rangeGte(column, range2) {
        this.url.searchParams.append(`${column}`, `nxl.${range2}`);
        return this;
      }
      rangeLte(column, range2) {
        this.url.searchParams.append(`${column}`, `nxr.${range2}`);
        return this;
      }
      rangeAdjacent(column, range2) {
        this.url.searchParams.append(`${column}`, `adj.${range2}`);
        return this;
      }
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(`${column}`, `ov.${value}`);
        } else {
          this.url.searchParams.append(`${column}`, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      textSearch(column, query, { config, type = null } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config === void 0 ? "" : `(${config})`;
        this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      fts(column, query, { config } = {}) {
        const configPart = typeof config === "undefined" ? "" : `(${config})`;
        this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
        return this;
      }
      plfts(column, query, { config } = {}) {
        const configPart = typeof config === "undefined" ? "" : `(${config})`;
        this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
        return this;
      }
      phfts(column, query, { config } = {}) {
        const configPart = typeof config === "undefined" ? "" : `(${config})`;
        this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
        return this;
      }
      wfts(column, query, { config } = {}) {
        const configPart = typeof config === "undefined" ? "" : `(${config})`;
        this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
        return this;
      }
      filter(column, operator, value) {
        this.url.searchParams.append(`${column}`, `${operator}.${value}`);
        return this;
      }
      match(query) {
        Object.keys(query).forEach((key) => {
          this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
        });
        return this;
      }
    };
    exports.default = PostgrestFilterBuilder;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestQueryBuilder.js
var require_PostgrestQueryBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestQueryBuilder.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require_types2();
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestQueryBuilder = class extends types_1.PostgrestBuilder {
      constructor(url, { headers = {}, schema } = {}) {
        super({});
        this.url = new URL(url);
        this.headers = Object.assign({}, headers);
        this.schema = schema;
      }
      select(columns = "*", { head = false, count = null } = {}) {
        this.method = "GET";
        let quoted = false;
        const cleanedColumns = columns.split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers["Prefer"] = `count=${count}`;
        }
        if (head) {
          this.method = "HEAD";
        }
        return new PostgrestFilterBuilder_1.default(this);
      }
      insert(values, { upsert = false, onConflict, returning = "representation", count = null } = {}) {
        this.method = "POST";
        const prefersHeaders = [`return=${returning}`];
        if (upsert)
          prefersHeaders.push("resolution=merge-duplicates");
        if (upsert && onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        this.body = values;
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)];
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default(this);
      }
      upsert(values, { onConflict, returning = "representation", count = null, ignoreDuplicates = false } = {}) {
        this.method = "POST";
        const prefersHeaders = [
          `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`,
          `return=${returning}`
        ];
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        this.body = values;
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default(this);
      }
      update(values, { returning = "representation", count = null } = {}) {
        this.method = "PATCH";
        const prefersHeaders = [`return=${returning}`];
        this.body = values;
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default(this);
      }
      delete({ returning = "representation", count = null } = {}) {
        this.method = "DELETE";
        const prefersHeaders = [`return=${returning}`];
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default(this);
      }
    };
    exports.default = PostgrestQueryBuilder;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestRpcBuilder.js
var require_PostgrestRpcBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/lib/PostgrestRpcBuilder.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require_types2();
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestRpcBuilder = class extends types_1.PostgrestBuilder {
      constructor(url, { headers = {}, schema } = {}) {
        super({});
        this.url = new URL(url);
        this.headers = Object.assign({}, headers);
        this.schema = schema;
      }
      rpc(params, { count = null } = {}) {
        this.method = "POST";
        this.body = params;
        if (count) {
          if (this.headers["Prefer"] !== void 0)
            this.headers["Prefer"] += `,count=${count}`;
          else
            this.headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default(this);
      }
    };
    exports.default = PostgrestRpcBuilder;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/PostgrestClient.js
var require_PostgrestClient = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/PostgrestClient.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    var PostgrestRpcBuilder_1 = __importDefault(require_PostgrestRpcBuilder());
    var PostgrestClient = class {
      constructor(url, { headers = {}, schema } = {}) {
        this.url = url;
        this.headers = headers;
        this.schema = schema;
      }
      auth(token) {
        this.headers["Authorization"] = `Bearer ${token}`;
        return this;
      }
      from(table) {
        const url = `${this.url}/${table}`;
        return new PostgrestQueryBuilder_1.default(url, { headers: this.headers, schema: this.schema });
      }
      rpc(fn, params, { count = null } = {}) {
        const url = `${this.url}/rpc/${fn}`;
        return new PostgrestRpcBuilder_1.default(url, {
          headers: this.headers,
          schema: this.schema
        }).rpc(params, { count });
      }
    };
    exports.default = PostgrestClient;
  }
});

// node_modules/@supabase/postgrest-js/dist/main/index.js
var require_main2 = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/main/index.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestBuilder = exports.PostgrestClient = void 0;
    var PostgrestClient_1 = __importDefault(require_PostgrestClient());
    exports.PostgrestClient = PostgrestClient_1.default;
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
    var types_1 = require_types2();
    Object.defineProperty(exports, "PostgrestBuilder", { enumerable: true, get: function() {
      return types_1.PostgrestBuilder;
    } });
  }
});

// node_modules/@supabase/realtime-js/dist/main/lib/transformers.js
var require_transformers = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/lib/transformers.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toTimestampString = exports.toArray = exports.toJson = exports.toIntRange = exports.toInt = exports.toFloat = exports.toDateRange = exports.toDate = exports.toBoolean = exports.convertCell = exports.convertColumn = exports.convertChangeData = exports.PostgresTypes = void 0;
    var PostgresTypes;
    (function(PostgresTypes2) {
      PostgresTypes2["abstime"] = "abstime";
      PostgresTypes2["bool"] = "bool";
      PostgresTypes2["date"] = "date";
      PostgresTypes2["daterange"] = "daterange";
      PostgresTypes2["float4"] = "float4";
      PostgresTypes2["float8"] = "float8";
      PostgresTypes2["int2"] = "int2";
      PostgresTypes2["int4"] = "int4";
      PostgresTypes2["int4range"] = "int4range";
      PostgresTypes2["int8"] = "int8";
      PostgresTypes2["int8range"] = "int8range";
      PostgresTypes2["json"] = "json";
      PostgresTypes2["jsonb"] = "jsonb";
      PostgresTypes2["money"] = "money";
      PostgresTypes2["numeric"] = "numeric";
      PostgresTypes2["oid"] = "oid";
      PostgresTypes2["reltime"] = "reltime";
      PostgresTypes2["time"] = "time";
      PostgresTypes2["timestamp"] = "timestamp";
      PostgresTypes2["timestamptz"] = "timestamptz";
      PostgresTypes2["timetz"] = "timetz";
      PostgresTypes2["tsrange"] = "tsrange";
      PostgresTypes2["tstzrange"] = "tstzrange";
    })(PostgresTypes = exports.PostgresTypes || (exports.PostgresTypes = {}));
    exports.convertChangeData = (columns, records, options2 = {}) => {
      let result = {};
      let skipTypes = typeof options2.skipTypes !== "undefined" ? options2.skipTypes : [];
      Object.entries(records).map(([key, value]) => {
        result[key] = exports.convertColumn(key, columns, records, skipTypes);
      });
      return result;
    };
    exports.convertColumn = (columnName, columns, records, skipTypes) => {
      let column = columns.find((x) => x.name == columnName);
      if (!column || skipTypes.includes(column.type)) {
        return noop2(records[columnName]);
      } else {
        return exports.convertCell(column.type, records[columnName]);
      }
    };
    exports.convertCell = (type, stringValue) => {
      try {
        if (stringValue === null)
          return null;
        if (type.charAt(0) === "_") {
          let arrayValue = type.slice(1, type.length);
          return exports.toArray(stringValue, arrayValue);
        }
        switch (type) {
          case PostgresTypes.abstime:
            return noop2(stringValue);
          case PostgresTypes.bool:
            return exports.toBoolean(stringValue);
          case PostgresTypes.date:
            return noop2(stringValue);
          case PostgresTypes.daterange:
            return exports.toDateRange(stringValue);
          case PostgresTypes.float4:
            return exports.toFloat(stringValue);
          case PostgresTypes.float8:
            return exports.toFloat(stringValue);
          case PostgresTypes.int2:
            return exports.toInt(stringValue);
          case PostgresTypes.int4:
            return exports.toInt(stringValue);
          case PostgresTypes.int4range:
            return exports.toIntRange(stringValue);
          case PostgresTypes.int8:
            return exports.toInt(stringValue);
          case PostgresTypes.int8range:
            return exports.toIntRange(stringValue);
          case PostgresTypes.json:
            return exports.toJson(stringValue);
          case PostgresTypes.jsonb:
            return exports.toJson(stringValue);
          case PostgresTypes.money:
            return exports.toFloat(stringValue);
          case PostgresTypes.numeric:
            return exports.toFloat(stringValue);
          case PostgresTypes.oid:
            return exports.toInt(stringValue);
          case PostgresTypes.reltime:
            return noop2(stringValue);
          case PostgresTypes.time:
            return noop2(stringValue);
          case PostgresTypes.timestamp:
            return exports.toTimestampString(stringValue);
          case PostgresTypes.timestamptz:
            return noop2(stringValue);
          case PostgresTypes.timetz:
            return noop2(stringValue);
          case PostgresTypes.tsrange:
            return exports.toDateRange(stringValue);
          case PostgresTypes.tstzrange:
            return exports.toDateRange(stringValue);
          default:
            return noop2(stringValue);
        }
      } catch (error2) {
        console.log(`Could not convert cell of type ${type} and value ${stringValue}`);
        console.log(`This is the error: ${error2}`);
        return stringValue;
      }
    };
    var noop2 = (stringValue) => {
      return stringValue;
    };
    exports.toBoolean = (stringValue) => {
      switch (stringValue) {
        case "t":
          return true;
        case "f":
          return false;
        default:
          return null;
      }
    };
    exports.toDate = (stringValue) => {
      return new Date(stringValue);
    };
    exports.toDateRange = (stringValue) => {
      let arr = JSON.parse(stringValue);
      return [new Date(arr[0]), new Date(arr[1])];
    };
    exports.toFloat = (stringValue) => {
      return parseFloat(stringValue);
    };
    exports.toInt = (stringValue) => {
      return parseInt(stringValue);
    };
    exports.toIntRange = (stringValue) => {
      let arr = JSON.parse(stringValue);
      return [parseInt(arr[0]), parseInt(arr[1])];
    };
    exports.toJson = (stringValue) => {
      return JSON.parse(stringValue);
    };
    exports.toArray = (stringValue, type) => {
      let stringEnriched = stringValue.slice(1, stringValue.length - 1);
      let stringArray = stringEnriched.length > 0 ? stringEnriched.split(",") : [];
      let array = stringArray.map((string) => {
        return exports.convertCell(type, string);
      });
      return array;
    };
    exports.toTimestampString = (stringValue) => {
      return stringValue.replace(" ", "T");
    };
  }
});

// node_modules/@supabase/realtime-js/dist/main/lib/constants.js
var require_constants3 = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/lib/constants.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TRANSPORTS = exports.CHANNEL_EVENTS = exports.CHANNEL_STATES = exports.SOCKET_STATES = exports.WS_CLOSE_NORMAL = exports.DEFAULT_TIMEOUT = exports.VSN = void 0;
    exports.VSN = "1.0.0";
    exports.DEFAULT_TIMEOUT = 1e4;
    exports.WS_CLOSE_NORMAL = 1e3;
    var SOCKET_STATES;
    (function(SOCKET_STATES2) {
      SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
      SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
      SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
      SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
    })(SOCKET_STATES = exports.SOCKET_STATES || (exports.SOCKET_STATES = {}));
    var CHANNEL_STATES;
    (function(CHANNEL_STATES2) {
      CHANNEL_STATES2["closed"] = "closed";
      CHANNEL_STATES2["errored"] = "errored";
      CHANNEL_STATES2["joined"] = "joined";
      CHANNEL_STATES2["joining"] = "joining";
      CHANNEL_STATES2["leaving"] = "leaving";
    })(CHANNEL_STATES = exports.CHANNEL_STATES || (exports.CHANNEL_STATES = {}));
    var CHANNEL_EVENTS;
    (function(CHANNEL_EVENTS2) {
      CHANNEL_EVENTS2["close"] = "phx_close";
      CHANNEL_EVENTS2["error"] = "phx_error";
      CHANNEL_EVENTS2["join"] = "phx_join";
      CHANNEL_EVENTS2["reply"] = "phx_reply";
      CHANNEL_EVENTS2["leave"] = "phx_leave";
    })(CHANNEL_EVENTS = exports.CHANNEL_EVENTS || (exports.CHANNEL_EVENTS = {}));
    var TRANSPORTS;
    (function(TRANSPORTS2) {
      TRANSPORTS2["websocket"] = "websocket";
    })(TRANSPORTS = exports.TRANSPORTS || (exports.TRANSPORTS = {}));
  }
});

// node_modules/@supabase/realtime-js/dist/main/lib/timer.js
var require_timer = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/lib/timer.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Timer = class {
      constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = void 0;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
      }
      reset() {
        this.tries = 0;
        clearTimeout(this.timer);
      }
      scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.tries = this.tries + 1;
          this.callback();
        }, this.timerCalc(this.tries + 1));
      }
    };
    exports.default = Timer;
  }
});

// node_modules/@supabase/realtime-js/dist/main/lib/push.js
var require_push = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/lib/push.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var Push = class {
      constructor(channel, event, payload = {}, timeout = constants_1.DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = void 0;
        this.ref = "";
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
      }
      resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = "";
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
      }
      send() {
        if (this._hasReceived("timeout")) {
          return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
          topic: this.channel.topic,
          event: this.event,
          payload: this.payload,
          ref: this.ref
        });
      }
      receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
          callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
      }
      startTimeout() {
        if (this.timeoutTimer) {
          return;
        }
        this.ref = this.channel.socket.makeRef();
        this.refEvent = this.channel.replyEventName(this.ref);
        this.channel.on(this.refEvent, (payload) => {
          this._cancelRefEvent();
          this._cancelTimeout();
          this.receivedResp = payload;
          this._matchReceive(payload);
        });
        this.timeoutTimer = setTimeout(() => {
          this.trigger("timeout", {});
        }, this.timeout);
      }
      trigger(status, response) {
        if (this.refEvent)
          this.channel.trigger(this.refEvent, { status, response });
      }
      _cancelRefEvent() {
        if (!this.refEvent) {
          return;
        }
        this.channel.off(this.refEvent);
      }
      _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = void 0;
      }
      _matchReceive({ status, response }) {
        this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
      }
      _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
      }
    };
    exports.default = Push;
  }
});

// node_modules/@supabase/realtime-js/dist/main/RealtimeSubscription.js
var require_RealtimeSubscription = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/RealtimeSubscription.js"(exports) {
    init_shims();
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var push_1 = __importDefault(require_push());
    var timer_1 = __importDefault(require_timer());
    var RealtimeSubscription = class {
      constructor(topic, params = {}, socket) {
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = [];
        this.state = constants_1.CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.timeout = this.socket.timeout;
        this.joinPush = new push_1.default(this, constants_1.CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new timer_1.default(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive("ok", () => {
          this.state = constants_1.CHANNEL_STATES.joined;
          this.rejoinTimer.reset();
          this.pushBuffer.forEach((pushEvent) => pushEvent.send());
          this.pushBuffer = [];
        });
        this.onClose(() => {
          this.rejoinTimer.reset();
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
          this.state = constants_1.CHANNEL_STATES.closed;
          this.socket.remove(this);
        });
        this.onError((reason) => {
          if (this.isLeaving() || this.isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = constants_1.CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("timeout", () => {
          if (!this.isJoining()) {
            return;
          }
          this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
          this.state = constants_1.CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.on(constants_1.CHANNEL_EVENTS.reply, (payload, ref) => {
          this.trigger(this.replyEventName(ref), payload);
        });
      }
      rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }
      subscribe(timeout = this.timeout) {
        if (this.joinedOnce) {
          throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
        } else {
          this.joinedOnce = true;
          this.rejoin(timeout);
          return this.joinPush;
        }
      }
      onClose(callback) {
        this.on(constants_1.CHANNEL_EVENTS.close, callback);
      }
      onError(callback) {
        this.on(constants_1.CHANNEL_EVENTS.error, (reason) => callback(reason));
      }
      on(event, callback) {
        this.bindings.push({ event, callback });
      }
      off(event) {
        this.bindings = this.bindings.filter((bind) => bind.event !== event);
      }
      canPush() {
        return this.socket.isConnected() && this.isJoined();
      }
      push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
          throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new push_1.default(this, event, payload, timeout);
        if (this.canPush()) {
          pushEvent.send();
        } else {
          pushEvent.startTimeout();
          this.pushBuffer.push(pushEvent);
        }
        return pushEvent;
      }
      unsubscribe(timeout = this.timeout) {
        this.state = constants_1.CHANNEL_STATES.leaving;
        let onClose = () => {
          this.socket.log("channel", `leave ${this.topic}`);
          this.trigger(constants_1.CHANNEL_EVENTS.close, "leave", this.joinRef());
        };
        let leavePush = new push_1.default(this, constants_1.CHANNEL_EVENTS.leave, {}, timeout);
        leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
        leavePush.send();
        if (!this.canPush()) {
          leavePush.trigger("ok", {});
        }
        return leavePush;
      }
      onMessage(event, payload, ref) {
        return payload;
      }
      isMember(topic) {
        return this.topic === topic;
      }
      joinRef() {
        return this.joinPush.ref;
      }
      sendJoin(timeout) {
        this.state = constants_1.CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
      }
      rejoin(timeout = this.timeout) {
        if (this.isLeaving()) {
          return;
        }
        this.sendJoin(timeout);
      }
      trigger(event, payload, ref) {
        let { close, error: error2, leave, join: join2 } = constants_1.CHANNEL_EVENTS;
        let events = [close, error2, leave, join2];
        if (ref && events.indexOf(event) >= 0 && ref !== this.joinRef()) {
          return;
        }
        let handledPayload = this.onMessage(event, payload, ref);
        if (payload && !handledPayload) {
          throw "channel onMessage callbacks must return the payload, modified or unmodified";
        }
        this.bindings.filter((bind) => {
          if (bind.event === "*") {
            return event === (payload === null || payload === void 0 ? void 0 : payload.type);
          } else {
            return bind.event === event;
          }
        }).map((bind) => bind.callback(handledPayload, ref));
      }
      replyEventName(ref) {
        return `chan_reply_${ref}`;
      }
      isClosed() {
        return this.state === constants_1.CHANNEL_STATES.closed;
      }
      isErrored() {
        return this.state === constants_1.CHANNEL_STATES.errored;
      }
      isJoined() {
        return this.state === constants_1.CHANNEL_STATES.joined;
      }
      isJoining() {
        return this.state === constants_1.CHANNEL_STATES.joining;
      }
      isLeaving() {
        return this.state === constants_1.CHANNEL_STATES.leaving;
      }
    };
    exports.default = RealtimeSubscription;
  }
});

// node_modules/websocket/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/websocket/node_modules/ms/index.js"(exports, module2) {
    init_shims();
    var s2 = 1e3;
    var m = s2 * 60;
    var h = m * 60;
    var d2 = h * 24;
    var y = d2 * 365.25;
    module2.exports = function(val, options2) {
      options2 = options2 || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options2.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
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
    function fmtShort(ms) {
      if (ms >= d2) {
        return Math.round(ms / d2) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s2) {
        return Math.round(ms / s2) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d2, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s2, "second") || ms + " ms";
    }
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
  }
});

// node_modules/websocket/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/websocket/node_modules/debug/src/debug.js"(exports, module2) {
    init_shims();
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
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
      function debug() {
        if (!debug.enabled)
          return;
        var self2 = debug;
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
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
            match = formatter.call(self2, val);
            args.splice(index2, 1);
            index2--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      if (typeof exports.init === "function") {
        exports.init(debug);
      }
      return debug;
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
  }
});

// node_modules/websocket/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/websocket/node_modules/debug/src/browser.js"(exports, module2) {
    init_shims();
    exports = module2.exports = require_debug();
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
  }
});

// node_modules/websocket/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/websocket/node_modules/debug/src/node.js"(exports, module2) {
    init_shims();
    var tty = require("tty");
    var util = require("util");
    exports = module2.exports = require_debug();
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
          var fs = require("fs");
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
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
    function init2(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load2());
  }
});

// node_modules/websocket/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/websocket/node_modules/debug/src/index.js"(exports, module2) {
    init_shims();
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/websocket/lib/utils.js
var require_utils = __commonJS({
  "node_modules/websocket/lib/utils.js"(exports) {
    init_shims();
    var noop2 = exports.noop = function() {
    };
    exports.extend = function extend(dest, source) {
      for (var prop in source) {
        dest[prop] = source[prop];
      }
    };
    exports.eventEmitterListenerCount = require("events").EventEmitter.listenerCount || function(emitter, type) {
      return emitter.listeners(type).length;
    };
    exports.bufferAllocUnsafe = Buffer.allocUnsafe ? Buffer.allocUnsafe : function oldBufferAllocUnsafe(size) {
      return new Buffer(size);
    };
    exports.bufferFromString = Buffer.from ? Buffer.from : function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };
    exports.BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
      var logFunction = require_src()(identifier);
      if (logFunction.enabled) {
        var logger = new BufferingLogger(identifier, uniqueID, logFunction);
        var debug = logger.log.bind(logger);
        debug.printOutput = logger.printOutput.bind(logger);
        debug.enabled = logFunction.enabled;
        return debug;
      }
      logFunction.printOutput = noop2;
      return logFunction;
    };
    function BufferingLogger(identifier, uniqueID, logFunction) {
      this.logFunction = logFunction;
      this.identifier = identifier;
      this.uniqueID = uniqueID;
      this.buffer = [];
    }
    BufferingLogger.prototype.log = function() {
      this.buffer.push([new Date(), Array.prototype.slice.call(arguments)]);
      return this;
    };
    BufferingLogger.prototype.clear = function() {
      this.buffer = [];
      return this;
    };
    BufferingLogger.prototype.printOutput = function(logFunction) {
      if (!logFunction) {
        logFunction = this.logFunction;
      }
      var uniqueID = this.uniqueID;
      this.buffer.forEach(function(entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== void 0 && formatString !== null) {
          formatString = "%s - %s - " + formatString.toString();
          args.splice(0, 1, formatString, date, uniqueID);
          logFunction.apply(global, args);
        }
      });
    };
  }
});

// node_modules/node-gyp-build/index.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports, module2) {
    init_shims();
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : "node";
    var arch = os.arch();
    var platform = os.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module2.exports = load2;
    function load2(dir) {
      return runtimeRequire(load2.path(dir));
    }
    load2.path = function(dir) {
      dir = path.resolve(dir || ".");
      try {
        var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"])
          dir = process.env[name + "_PREBUILD"];
      } catch (err) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, "build/Release"), matchBuild);
        if (release)
          return release;
        var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
        if (debug)
          return debug;
      }
      var prebuild = resolve2(dir);
      if (prebuild)
        return prebuild;
      var nearby = resolve2(path.dirname(process.execPath));
      if (nearby)
        return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions && process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve2(dir2) {
        var prebuilds = path.join(dir2, "prebuilds", platform + "-" + arch);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner)
          return path.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node")
        return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null)
          return false;
        if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
          return false;
        if (tags.abi !== abi2 && !tags.napi)
          return false;
        if (tags.uv && tags.uv !== uv)
          return false;
        if (tags.armv && tags.armv !== armv)
          return false;
        if (tags.libc && tags.libc !== libc)
          return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isElectron() {
      if (process.versions && process.versions.electron)
        return true;
      if (process.env.ELECTRON_RUN_AS_NODE)
        return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
    }
    load2.parseTags = parseTags;
    load2.matchTags = matchTags;
    load2.compareTags = compareTags;
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports, module2) {
    init_shims();
    "use strict";
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module2.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports, module2) {
    init_shims();
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback();
    }
  }
});

// node_modules/websocket/lib/WebSocketFrame.js
var require_WebSocketFrame = __commonJS({
  "node_modules/websocket/lib/WebSocketFrame.js"(exports, module2) {
    init_shims();
    var bufferUtil = require_bufferutil();
    var bufferAllocUnsafe = require_utils().bufferAllocUnsafe;
    var DECODE_HEADER = 1;
    var WAITING_FOR_16_BIT_LENGTH = 2;
    var WAITING_FOR_64_BIT_LENGTH = 3;
    var WAITING_FOR_MASK_KEY = 4;
    var WAITING_FOR_PAYLOAD = 5;
    var COMPLETE = 6;
    function WebSocketFrame(maskBytes, frameHeader, config) {
      this.maskBytes = maskBytes;
      this.frameHeader = frameHeader;
      this.config = config;
      this.maxReceivedFrameSize = config.maxReceivedFrameSize;
      this.protocolError = false;
      this.frameTooLarge = false;
      this.invalidCloseFrameLength = false;
      this.parseState = DECODE_HEADER;
      this.closeStatus = -1;
    }
    WebSocketFrame.prototype.addData = function(bufferList) {
      if (this.parseState === DECODE_HEADER) {
        if (bufferList.length >= 2) {
          bufferList.joinInto(this.frameHeader, 0, 0, 2);
          bufferList.advance(2);
          var firstByte = this.frameHeader[0];
          var secondByte = this.frameHeader[1];
          this.fin = Boolean(firstByte & 128);
          this.rsv1 = Boolean(firstByte & 64);
          this.rsv2 = Boolean(firstByte & 32);
          this.rsv3 = Boolean(firstByte & 16);
          this.mask = Boolean(secondByte & 128);
          this.opcode = firstByte & 15;
          this.length = secondByte & 127;
          if (this.opcode >= 8) {
            if (this.length > 125) {
              this.protocolError = true;
              this.dropReason = "Illegal control frame longer than 125 bytes.";
              return true;
            }
            if (!this.fin) {
              this.protocolError = true;
              this.dropReason = "Control frames must not be fragmented.";
              return true;
            }
          }
          if (this.length === 126) {
            this.parseState = WAITING_FOR_16_BIT_LENGTH;
          } else if (this.length === 127) {
            this.parseState = WAITING_FOR_64_BIT_LENGTH;
          } else {
            this.parseState = WAITING_FOR_MASK_KEY;
          }
        }
      }
      if (this.parseState === WAITING_FOR_16_BIT_LENGTH) {
        if (bufferList.length >= 2) {
          bufferList.joinInto(this.frameHeader, 2, 0, 2);
          bufferList.advance(2);
          this.length = this.frameHeader.readUInt16BE(2);
          this.parseState = WAITING_FOR_MASK_KEY;
        }
      } else if (this.parseState === WAITING_FOR_64_BIT_LENGTH) {
        if (bufferList.length >= 8) {
          bufferList.joinInto(this.frameHeader, 2, 0, 8);
          bufferList.advance(8);
          var lengthPair = [
            this.frameHeader.readUInt32BE(2),
            this.frameHeader.readUInt32BE(2 + 4)
          ];
          if (lengthPair[0] !== 0) {
            this.protocolError = true;
            this.dropReason = "Unsupported 64-bit length frame received";
            return true;
          }
          this.length = lengthPair[1];
          this.parseState = WAITING_FOR_MASK_KEY;
        }
      }
      if (this.parseState === WAITING_FOR_MASK_KEY) {
        if (this.mask) {
          if (bufferList.length >= 4) {
            bufferList.joinInto(this.maskBytes, 0, 0, 4);
            bufferList.advance(4);
            this.parseState = WAITING_FOR_PAYLOAD;
          }
        } else {
          this.parseState = WAITING_FOR_PAYLOAD;
        }
      }
      if (this.parseState === WAITING_FOR_PAYLOAD) {
        if (this.length > this.maxReceivedFrameSize) {
          this.frameTooLarge = true;
          this.dropReason = "Frame size of " + this.length.toString(10) + " bytes exceeds maximum accepted frame size";
          return true;
        }
        if (this.length === 0) {
          this.binaryPayload = bufferAllocUnsafe(0);
          this.parseState = COMPLETE;
          return true;
        }
        if (bufferList.length >= this.length) {
          this.binaryPayload = bufferList.take(this.length);
          bufferList.advance(this.length);
          if (this.mask) {
            bufferUtil.unmask(this.binaryPayload, this.maskBytes);
          }
          if (this.opcode === 8) {
            if (this.length === 1) {
              this.binaryPayload = bufferAllocUnsafe(0);
              this.invalidCloseFrameLength = true;
            }
            if (this.length >= 2) {
              this.closeStatus = this.binaryPayload.readUInt16BE(0);
              this.binaryPayload = this.binaryPayload.slice(2);
            }
          }
          this.parseState = COMPLETE;
          return true;
        }
      }
      return false;
    };
    WebSocketFrame.prototype.throwAwayPayload = function(bufferList) {
      if (bufferList.length >= this.length) {
        bufferList.advance(this.length);
        this.parseState = COMPLETE;
        return true;
      }
      return false;
    };
    WebSocketFrame.prototype.toBuffer = function(nullMask) {
      var maskKey;
      var headerLength = 2;
      var data;
      var outputPos;
      var firstByte = 0;
      var secondByte = 0;
      if (this.fin) {
        firstByte |= 128;
      }
      if (this.rsv1) {
        firstByte |= 64;
      }
      if (this.rsv2) {
        firstByte |= 32;
      }
      if (this.rsv3) {
        firstByte |= 16;
      }
      if (this.mask) {
        secondByte |= 128;
      }
      firstByte |= this.opcode & 15;
      if (this.opcode === 8) {
        this.length = 2;
        if (this.binaryPayload) {
          this.length += this.binaryPayload.length;
        }
        data = bufferAllocUnsafe(this.length);
        data.writeUInt16BE(this.closeStatus, 0);
        if (this.length > 2) {
          this.binaryPayload.copy(data, 2);
        }
      } else if (this.binaryPayload) {
        data = this.binaryPayload;
        this.length = data.length;
      } else {
        this.length = 0;
      }
      if (this.length <= 125) {
        secondByte |= this.length & 127;
      } else if (this.length > 125 && this.length <= 65535) {
        secondByte |= 126;
        headerLength += 2;
      } else if (this.length > 65535) {
        secondByte |= 127;
        headerLength += 8;
      }
      var output = bufferAllocUnsafe(this.length + headerLength + (this.mask ? 4 : 0));
      output[0] = firstByte;
      output[1] = secondByte;
      outputPos = 2;
      if (this.length > 125 && this.length <= 65535) {
        output.writeUInt16BE(this.length, outputPos);
        outputPos += 2;
      } else if (this.length > 65535) {
        output.writeUInt32BE(0, outputPos);
        output.writeUInt32BE(this.length, outputPos + 4);
        outputPos += 8;
      }
      if (this.mask) {
        maskKey = nullMask ? 0 : Math.random() * 4294967295 >>> 0;
        this.maskBytes.writeUInt32BE(maskKey, 0);
        this.maskBytes.copy(output, outputPos);
        outputPos += 4;
        if (data) {
          bufferUtil.mask(data, this.maskBytes, output, outputPos, this.length);
        }
      } else if (data) {
        data.copy(output, outputPos);
      }
      return output;
    };
    WebSocketFrame.prototype.toString = function() {
      return "Opcode: " + this.opcode + ", fin: " + this.fin + ", length: " + this.length + ", hasPayload: " + Boolean(this.binaryPayload) + ", masked: " + this.mask;
    };
    module2.exports = WebSocketFrame;
  }
});

// node_modules/websocket/vendor/FastBufferList.js
var require_FastBufferList = __commonJS({
  "node_modules/websocket/vendor/FastBufferList.js"(exports, module2) {
    init_shims();
    var Buffer2 = require("buffer").Buffer;
    var EventEmitter = require("events").EventEmitter;
    var bufferAllocUnsafe = require_utils().bufferAllocUnsafe;
    module2.exports = BufferList;
    module2.exports.BufferList = BufferList;
    function BufferList(opts) {
      if (!(this instanceof BufferList))
        return new BufferList(opts);
      EventEmitter.call(this);
      var self2 = this;
      if (typeof opts == "undefined")
        opts = {};
      self2.encoding = opts.encoding;
      var head = { next: null, buffer: null };
      var last2 = { next: null, buffer: null };
      var length = 0;
      self2.__defineGetter__("length", function() {
        return length;
      });
      var offset = 0;
      self2.write = function(buf) {
        if (!head.buffer) {
          head.buffer = buf;
          last2 = head;
        } else {
          last2.next = { next: null, buffer: buf };
          last2 = last2.next;
        }
        length += buf.length;
        self2.emit("write", buf);
        return true;
      };
      self2.end = function(buf) {
        if (Buffer2.isBuffer(buf))
          self2.write(buf);
      };
      self2.push = function() {
        var args = [].concat.apply([], arguments);
        args.forEach(self2.write);
        return self2;
      };
      self2.forEach = function(fn) {
        if (!head.buffer)
          return bufferAllocUnsafe(0);
        if (head.buffer.length - offset <= 0)
          return self2;
        var firstBuf = head.buffer.slice(offset);
        var b = { buffer: firstBuf, next: head.next };
        while (b && b.buffer) {
          var r = fn(b.buffer);
          if (r)
            break;
          b = b.next;
        }
        return self2;
      };
      self2.join = function(start, end) {
        if (!head.buffer)
          return bufferAllocUnsafe(0);
        if (start == void 0)
          start = 0;
        if (end == void 0)
          end = self2.length;
        var big = bufferAllocUnsafe(end - start);
        var ix = 0;
        self2.forEach(function(buffer) {
          if (start < ix + buffer.length && ix < end) {
            buffer.copy(big, Math.max(0, ix - start), Math.max(0, start - ix), Math.min(buffer.length, end - ix));
          }
          ix += buffer.length;
          if (ix > end)
            return true;
        });
        return big;
      };
      self2.joinInto = function(targetBuffer, targetStart, sourceStart, sourceEnd) {
        if (!head.buffer)
          return new bufferAllocUnsafe(0);
        if (sourceStart == void 0)
          sourceStart = 0;
        if (sourceEnd == void 0)
          sourceEnd = self2.length;
        var big = targetBuffer;
        if (big.length - targetStart < sourceEnd - sourceStart) {
          throw new Error("Insufficient space available in target Buffer.");
        }
        var ix = 0;
        self2.forEach(function(buffer) {
          if (sourceStart < ix + buffer.length && ix < sourceEnd) {
            buffer.copy(big, Math.max(targetStart, targetStart + ix - sourceStart), Math.max(0, sourceStart - ix), Math.min(buffer.length, sourceEnd - ix));
          }
          ix += buffer.length;
          if (ix > sourceEnd)
            return true;
        });
        return big;
      };
      self2.advance = function(n) {
        offset += n;
        length -= n;
        while (head.buffer && offset >= head.buffer.length) {
          offset -= head.buffer.length;
          head = head.next ? head.next : { buffer: null, next: null };
        }
        if (head.buffer === null)
          last2 = { next: null, buffer: null };
        self2.emit("advance", n);
        return self2;
      };
      self2.take = function(n, encoding) {
        if (n == void 0)
          n = self2.length;
        else if (typeof n !== "number") {
          encoding = n;
          n = self2.length;
        }
        var b = head;
        if (!encoding)
          encoding = self2.encoding;
        if (encoding) {
          var acc = "";
          self2.forEach(function(buffer) {
            if (n <= 0)
              return true;
            acc += buffer.toString(encoding, 0, Math.min(n, buffer.length));
            n -= buffer.length;
          });
          return acc;
        } else {
          return self2.join(0, n);
        }
      };
      self2.toString = function() {
        return self2.take("binary");
      };
    }
    require("util").inherits(BufferList, EventEmitter);
  }
});

// node_modules/utf-8-validate/fallback.js
var require_fallback2 = __commonJS({
  "node_modules/utf-8-validate/fallback.js"(exports, module2) {
    init_shims();
    "use strict";
    function isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    module2.exports = isValidUTF8;
  }
});

// node_modules/utf-8-validate/index.js
var require_utf_8_validate = __commonJS({
  "node_modules/utf-8-validate/index.js"(exports, module2) {
    init_shims();
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback2();
    }
  }
});

// node_modules/websocket/lib/WebSocketConnection.js
var require_WebSocketConnection = __commonJS({
  "node_modules/websocket/lib/WebSocketConnection.js"(exports, module2) {
    init_shims();
    var util = require("util");
    var utils = require_utils();
    var EventEmitter = require("events").EventEmitter;
    var WebSocketFrame = require_WebSocketFrame();
    var BufferList = require_FastBufferList();
    var isValidUTF8 = require_utf_8_validate();
    var bufferAllocUnsafe = utils.bufferAllocUnsafe;
    var bufferFromString = utils.bufferFromString;
    var STATE_OPEN = "open";
    var STATE_PEER_REQUESTED_CLOSE = "peer_requested_close";
    var STATE_ENDING = "ending";
    var STATE_CLOSED = "closed";
    var setImmediateImpl = "setImmediate" in global ? global.setImmediate.bind(global) : process.nextTick.bind(process);
    var idCounter = 0;
    function WebSocketConnection(socket, extensions, protocol, maskOutgoingPackets, config) {
      this._debug = utils.BufferingLogger("websocket:connection", ++idCounter);
      this._debug("constructor");
      if (this._debug.enabled) {
        instrumentSocketForDebugging(this, socket);
      }
      EventEmitter.call(this);
      this._pingListenerCount = 0;
      this.on("newListener", function(ev) {
        if (ev === "ping") {
          this._pingListenerCount++;
        }
      }).on("removeListener", function(ev) {
        if (ev === "ping") {
          this._pingListenerCount--;
        }
      });
      this.config = config;
      this.socket = socket;
      this.protocol = protocol;
      this.extensions = extensions;
      this.remoteAddress = socket.remoteAddress;
      this.closeReasonCode = -1;
      this.closeDescription = null;
      this.closeEventEmitted = false;
      this.maskOutgoingPackets = maskOutgoingPackets;
      this.maskBytes = bufferAllocUnsafe(4);
      this.frameHeader = bufferAllocUnsafe(10);
      this.bufferList = new BufferList();
      this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      this.fragmentationSize = 0;
      this.frameQueue = [];
      this.connected = true;
      this.state = STATE_OPEN;
      this.waitingForCloseResponse = false;
      this.receivedEnd = false;
      this.closeTimeout = this.config.closeTimeout;
      this.assembleFragments = this.config.assembleFragments;
      this.maxReceivedMessageSize = this.config.maxReceivedMessageSize;
      this.outputBufferFull = false;
      this.inputPaused = false;
      this.receivedDataHandler = this.processReceivedData.bind(this);
      this._closeTimerHandler = this.handleCloseTimer.bind(this);
      this.socket.setNoDelay(this.config.disableNagleAlgorithm);
      this.socket.setTimeout(0);
      if (this.config.keepalive && !this.config.useNativeKeepalive) {
        if (typeof this.config.keepaliveInterval !== "number") {
          throw new Error("keepaliveInterval must be specified and numeric if keepalive is true.");
        }
        this._keepaliveTimerHandler = this.handleKeepaliveTimer.bind(this);
        this.setKeepaliveTimer();
        if (this.config.dropConnectionOnKeepaliveTimeout) {
          if (typeof this.config.keepaliveGracePeriod !== "number") {
            throw new Error("keepaliveGracePeriod  must be specified and numeric if dropConnectionOnKeepaliveTimeout is true.");
          }
          this._gracePeriodTimerHandler = this.handleGracePeriodTimer.bind(this);
        }
      } else if (this.config.keepalive && this.config.useNativeKeepalive) {
        if (!("setKeepAlive" in this.socket)) {
          throw new Error("Unable to use native keepalive: unsupported by this version of Node.");
        }
        this.socket.setKeepAlive(true, this.config.keepaliveInterval);
      }
      this.socket.removeAllListeners("error");
    }
    WebSocketConnection.CLOSE_REASON_NORMAL = 1e3;
    WebSocketConnection.CLOSE_REASON_GOING_AWAY = 1001;
    WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR = 1002;
    WebSocketConnection.CLOSE_REASON_UNPROCESSABLE_INPUT = 1003;
    WebSocketConnection.CLOSE_REASON_RESERVED = 1004;
    WebSocketConnection.CLOSE_REASON_NOT_PROVIDED = 1005;
    WebSocketConnection.CLOSE_REASON_ABNORMAL = 1006;
    WebSocketConnection.CLOSE_REASON_INVALID_DATA = 1007;
    WebSocketConnection.CLOSE_REASON_POLICY_VIOLATION = 1008;
    WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG = 1009;
    WebSocketConnection.CLOSE_REASON_EXTENSION_REQUIRED = 1010;
    WebSocketConnection.CLOSE_REASON_INTERNAL_SERVER_ERROR = 1011;
    WebSocketConnection.CLOSE_REASON_TLS_HANDSHAKE_FAILED = 1015;
    WebSocketConnection.CLOSE_DESCRIPTIONS = {
      1e3: "Normal connection closure",
      1001: "Remote peer is going away",
      1002: "Protocol error",
      1003: "Unprocessable input",
      1004: "Reserved",
      1005: "Reason not provided",
      1006: "Abnormal closure, no further detail available",
      1007: "Invalid data received",
      1008: "Policy violation",
      1009: "Message too big",
      1010: "Extension requested by client is required",
      1011: "Internal Server Error",
      1015: "TLS Handshake Failed"
    };
    function validateCloseReason(code) {
      if (code < 1e3) {
        return false;
      }
      if (code >= 1e3 && code <= 2999) {
        return [1e3, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015].indexOf(code) !== -1;
      }
      if (code >= 3e3 && code <= 3999) {
        return true;
      }
      if (code >= 4e3 && code <= 4999) {
        return true;
      }
      if (code >= 5e3) {
        return false;
      }
    }
    util.inherits(WebSocketConnection, EventEmitter);
    WebSocketConnection.prototype._addSocketEventListeners = function() {
      this.socket.on("error", this.handleSocketError.bind(this));
      this.socket.on("end", this.handleSocketEnd.bind(this));
      this.socket.on("close", this.handleSocketClose.bind(this));
      this.socket.on("drain", this.handleSocketDrain.bind(this));
      this.socket.on("pause", this.handleSocketPause.bind(this));
      this.socket.on("resume", this.handleSocketResume.bind(this));
      this.socket.on("data", this.handleSocketData.bind(this));
    };
    WebSocketConnection.prototype.setKeepaliveTimer = function() {
      this._debug("setKeepaliveTimer");
      if (!this.config.keepalive || this.config.useNativeKeepalive) {
        return;
      }
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      this._keepaliveTimeoutID = setTimeout(this._keepaliveTimerHandler, this.config.keepaliveInterval);
    };
    WebSocketConnection.prototype.clearKeepaliveTimer = function() {
      if (this._keepaliveTimeoutID) {
        clearTimeout(this._keepaliveTimeoutID);
      }
    };
    WebSocketConnection.prototype.handleKeepaliveTimer = function() {
      this._debug("handleKeepaliveTimer");
      this._keepaliveTimeoutID = null;
      this.ping();
      if (this.config.dropConnectionOnKeepaliveTimeout) {
        this.setGracePeriodTimer();
      } else {
        this.setKeepaliveTimer();
      }
    };
    WebSocketConnection.prototype.setGracePeriodTimer = function() {
      this._debug("setGracePeriodTimer");
      this.clearGracePeriodTimer();
      this._gracePeriodTimeoutID = setTimeout(this._gracePeriodTimerHandler, this.config.keepaliveGracePeriod);
    };
    WebSocketConnection.prototype.clearGracePeriodTimer = function() {
      if (this._gracePeriodTimeoutID) {
        clearTimeout(this._gracePeriodTimeoutID);
      }
    };
    WebSocketConnection.prototype.handleGracePeriodTimer = function() {
      this._debug("handleGracePeriodTimer");
      this._gracePeriodTimeoutID = null;
      this.drop(WebSocketConnection.CLOSE_REASON_ABNORMAL, "Peer not responding.", true);
    };
    WebSocketConnection.prototype.handleSocketData = function(data) {
      this._debug("handleSocketData");
      this.setKeepaliveTimer();
      this.bufferList.write(data);
      this.processReceivedData();
    };
    WebSocketConnection.prototype.processReceivedData = function() {
      this._debug("processReceivedData");
      if (!this.connected) {
        return;
      }
      if (this.inputPaused) {
        return;
      }
      var frame = this.currentFrame;
      if (!frame.addData(this.bufferList)) {
        this._debug("-- insufficient data for frame");
        return;
      }
      var self2 = this;
      if (frame.protocolError) {
        this._debug("-- protocol error");
        process.nextTick(function() {
          self2.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, frame.dropReason);
        });
        return;
      } else if (frame.frameTooLarge) {
        this._debug("-- frame too large");
        process.nextTick(function() {
          self2.drop(WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG, frame.dropReason);
        });
        return;
      }
      if (frame.rsv1 || frame.rsv2 || frame.rsv3) {
        this._debug("-- illegal rsv flag");
        process.nextTick(function() {
          self2.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, "Unsupported usage of rsv bits without negotiated extension.");
        });
        return;
      }
      if (!this.assembleFragments) {
        this._debug("-- emitting frame");
        process.nextTick(function() {
          self2.emit("frame", frame);
        });
      }
      process.nextTick(function() {
        self2.processFrame(frame);
      });
      this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      if (this.bufferList.length > 0) {
        setImmediateImpl(this.receivedDataHandler);
      }
    };
    WebSocketConnection.prototype.handleSocketError = function(error2) {
      this._debug("handleSocketError: %j", error2);
      if (this.state === STATE_CLOSED) {
        this._debug("  --- Socket 'error' after 'close'");
        return;
      }
      this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
      this.closeDescription = "Socket Error: " + error2.syscall + " " + error2.code;
      this.connected = false;
      this.state = STATE_CLOSED;
      this.fragmentationSize = 0;
      if (utils.eventEmitterListenerCount(this, "error") > 0) {
        this.emit("error", error2);
      }
      this.socket.destroy();
      this._debug.printOutput();
    };
    WebSocketConnection.prototype.handleSocketEnd = function() {
      this._debug("handleSocketEnd: received socket end.  state = %s", this.state);
      this.receivedEnd = true;
      if (this.state === STATE_CLOSED) {
        this._debug("  --- Socket 'end' after 'close'");
        return;
      }
      if (this.state !== STATE_PEER_REQUESTED_CLOSE && this.state !== STATE_ENDING) {
        this._debug("  --- UNEXPECTED socket end.");
        this.socket.end();
      }
    };
    WebSocketConnection.prototype.handleSocketClose = function(hadError) {
      this._debug("handleSocketClose: received socket close");
      this.socketHadError = hadError;
      this.connected = false;
      this.state = STATE_CLOSED;
      if (this.closeReasonCode === -1) {
        this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
        this.closeDescription = "Connection dropped by remote peer.";
      }
      this.clearCloseTimer();
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug("-- Emitting WebSocketConnection close event");
        this.emit("close", this.closeReasonCode, this.closeDescription);
      }
    };
    WebSocketConnection.prototype.handleSocketDrain = function() {
      this._debug("handleSocketDrain: socket drain event");
      this.outputBufferFull = false;
      this.emit("drain");
    };
    WebSocketConnection.prototype.handleSocketPause = function() {
      this._debug("handleSocketPause: socket pause event");
      this.inputPaused = true;
      this.emit("pause");
    };
    WebSocketConnection.prototype.handleSocketResume = function() {
      this._debug("handleSocketResume: socket resume event");
      this.inputPaused = false;
      this.emit("resume");
      this.processReceivedData();
    };
    WebSocketConnection.prototype.pause = function() {
      this._debug("pause: pause requested");
      this.socket.pause();
    };
    WebSocketConnection.prototype.resume = function() {
      this._debug("resume: resume requested");
      this.socket.resume();
    };
    WebSocketConnection.prototype.close = function(reasonCode, description) {
      if (this.connected) {
        this._debug("close: Initating clean WebSocket close sequence.");
        if (typeof reasonCode !== "number") {
          reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
        }
        if (!validateCloseReason(reasonCode)) {
          throw new Error("Close code " + reasonCode + " is not valid.");
        }
        if (typeof description !== "string") {
          description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
        }
        this.closeReasonCode = reasonCode;
        this.closeDescription = description;
        this.setCloseTimer();
        this.sendCloseFrame(this.closeReasonCode, this.closeDescription);
        this.state = STATE_ENDING;
        this.connected = false;
      }
    };
    WebSocketConnection.prototype.drop = function(reasonCode, description, skipCloseFrame) {
      this._debug("drop");
      if (typeof reasonCode !== "number") {
        reasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
      }
      if (typeof description !== "string") {
        description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
      }
      this._debug("Forcefully dropping connection. skipCloseFrame: %s, code: %d, description: %s", skipCloseFrame, reasonCode, description);
      this.closeReasonCode = reasonCode;
      this.closeDescription = description;
      this.frameQueue = [];
      this.fragmentationSize = 0;
      if (!skipCloseFrame) {
        this.sendCloseFrame(reasonCode, description);
      }
      this.connected = false;
      this.state = STATE_CLOSED;
      this.clearCloseTimer();
      this.clearKeepaliveTimer();
      this.clearGracePeriodTimer();
      if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug("Emitting WebSocketConnection close event");
        this.emit("close", this.closeReasonCode, this.closeDescription);
      }
      this._debug("Drop: destroying socket");
      this.socket.destroy();
    };
    WebSocketConnection.prototype.setCloseTimer = function() {
      this._debug("setCloseTimer");
      this.clearCloseTimer();
      this._debug("Setting close timer");
      this.waitingForCloseResponse = true;
      this.closeTimer = setTimeout(this._closeTimerHandler, this.closeTimeout);
    };
    WebSocketConnection.prototype.clearCloseTimer = function() {
      this._debug("clearCloseTimer");
      if (this.closeTimer) {
        this._debug("Clearing close timer");
        clearTimeout(this.closeTimer);
        this.waitingForCloseResponse = false;
        this.closeTimer = null;
      }
    };
    WebSocketConnection.prototype.handleCloseTimer = function() {
      this._debug("handleCloseTimer");
      this.closeTimer = null;
      if (this.waitingForCloseResponse) {
        this._debug("Close response not received from client.  Forcing socket end.");
        this.waitingForCloseResponse = false;
        this.state = STATE_CLOSED;
        this.socket.end();
      }
    };
    WebSocketConnection.prototype.processFrame = function(frame) {
      this._debug("processFrame");
      this._debug(" -- frame: %s", frame);
      if (this.frameQueue.length !== 0 && (frame.opcode > 0 && frame.opcode < 8)) {
        this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, "Illegal frame opcode 0x" + frame.opcode.toString(16) + " received in middle of fragmented message.");
        return;
      }
      switch (frame.opcode) {
        case 2:
          this._debug("-- Binary Frame");
          if (this.assembleFragments) {
            if (frame.fin) {
              this._debug("---- Emitting 'message' event");
              this.emit("message", {
                type: "binary",
                binaryData: frame.binaryPayload
              });
            } else {
              this.frameQueue.push(frame);
              this.fragmentationSize = frame.length;
            }
          }
          break;
        case 1:
          this._debug("-- Text Frame");
          if (this.assembleFragments) {
            if (frame.fin) {
              if (!isValidUTF8(frame.binaryPayload)) {
                this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA, "Invalid UTF-8 Data Received");
                return;
              }
              this._debug("---- Emitting 'message' event");
              this.emit("message", {
                type: "utf8",
                utf8Data: frame.binaryPayload.toString("utf8")
              });
            } else {
              this.frameQueue.push(frame);
              this.fragmentationSize = frame.length;
            }
          }
          break;
        case 0:
          this._debug("-- Continuation Frame");
          if (this.assembleFragments) {
            if (this.frameQueue.length === 0) {
              this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, "Unexpected Continuation Frame");
              return;
            }
            this.fragmentationSize += frame.length;
            if (this.fragmentationSize > this.maxReceivedMessageSize) {
              this.drop(WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG, "Maximum message size exceeded.");
              return;
            }
            this.frameQueue.push(frame);
            if (frame.fin) {
              var bytesCopied = 0;
              var binaryPayload = bufferAllocUnsafe(this.fragmentationSize);
              var opcode = this.frameQueue[0].opcode;
              this.frameQueue.forEach(function(currentFrame) {
                currentFrame.binaryPayload.copy(binaryPayload, bytesCopied);
                bytesCopied += currentFrame.binaryPayload.length;
              });
              this.frameQueue = [];
              this.fragmentationSize = 0;
              switch (opcode) {
                case 2:
                  this.emit("message", {
                    type: "binary",
                    binaryData: binaryPayload
                  });
                  break;
                case 1:
                  if (!isValidUTF8(binaryPayload)) {
                    this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA, "Invalid UTF-8 Data Received");
                    return;
                  }
                  this.emit("message", {
                    type: "utf8",
                    utf8Data: binaryPayload.toString("utf8")
                  });
                  break;
                default:
                  this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, "Unexpected first opcode in fragmentation sequence: 0x" + opcode.toString(16));
                  return;
              }
            }
          }
          break;
        case 9:
          this._debug("-- Ping Frame");
          if (this._pingListenerCount > 0) {
            var cancelled = false;
            var cancel = function() {
              cancelled = true;
            };
            this.emit("ping", cancel, frame.binaryPayload);
            if (!cancelled) {
              this.pong(frame.binaryPayload);
            }
          } else {
            this.pong(frame.binaryPayload);
          }
          break;
        case 10:
          this._debug("-- Pong Frame");
          this.emit("pong", frame.binaryPayload);
          break;
        case 8:
          this._debug("-- Close Frame");
          if (this.waitingForCloseResponse) {
            this._debug("---- Got close response from peer.  Completing closing handshake.");
            this.clearCloseTimer();
            this.waitingForCloseResponse = false;
            this.state = STATE_CLOSED;
            this.socket.end();
            return;
          }
          this._debug("---- Closing handshake initiated by peer.");
          this.state = STATE_PEER_REQUESTED_CLOSE;
          var respondCloseReasonCode;
          if (frame.invalidCloseFrameLength) {
            this.closeReasonCode = 1005;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
          } else if (frame.closeStatus === -1 || validateCloseReason(frame.closeStatus)) {
            this.closeReasonCode = frame.closeStatus;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
          } else {
            this.closeReasonCode = frame.closeStatus;
            respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
          }
          if (frame.binaryPayload.length > 1) {
            if (!isValidUTF8(frame.binaryPayload)) {
              this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA, "Invalid UTF-8 Data Received");
              return;
            }
            this.closeDescription = frame.binaryPayload.toString("utf8");
          } else {
            this.closeDescription = WebSocketConnection.CLOSE_DESCRIPTIONS[this.closeReasonCode];
          }
          this._debug("------ Remote peer %s - code: %d - %s - close frame payload length: %d", this.remoteAddress, this.closeReasonCode, this.closeDescription, frame.length);
          this._debug("------ responding to remote peer's close request.");
          this.sendCloseFrame(respondCloseReasonCode, null);
          this.connected = false;
          break;
        default:
          this._debug("-- Unrecognized Opcode %d", frame.opcode);
          this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, "Unrecognized Opcode: 0x" + frame.opcode.toString(16));
          break;
      }
    };
    WebSocketConnection.prototype.send = function(data, cb) {
      this._debug("send");
      if (Buffer.isBuffer(data)) {
        this.sendBytes(data, cb);
      } else if (typeof data["toString"] === "function") {
        this.sendUTF(data, cb);
      } else {
        throw new Error("Data provided must either be a Node Buffer or implement toString()");
      }
    };
    WebSocketConnection.prototype.sendUTF = function(data, cb) {
      data = bufferFromString(data.toString(), "utf8");
      this._debug("sendUTF: %d bytes", data.length);
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 1;
      frame.binaryPayload = data;
      this.fragmentAndSend(frame, cb);
    };
    WebSocketConnection.prototype.sendBytes = function(data, cb) {
      this._debug("sendBytes");
      if (!Buffer.isBuffer(data)) {
        throw new Error("You must pass a Node Buffer object to WebSocketConnection.prototype.sendBytes()");
      }
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 2;
      frame.binaryPayload = data;
      this.fragmentAndSend(frame, cb);
    };
    WebSocketConnection.prototype.ping = function(data) {
      this._debug("ping");
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 9;
      frame.fin = true;
      if (data) {
        if (!Buffer.isBuffer(data)) {
          data = bufferFromString(data.toString(), "utf8");
        }
        if (data.length > 125) {
          this._debug("WebSocket: Data for ping is longer than 125 bytes.  Truncating.");
          data = data.slice(0, 124);
        }
        frame.binaryPayload = data;
      }
      this.sendFrame(frame);
    };
    WebSocketConnection.prototype.pong = function(binaryPayload) {
      this._debug("pong");
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.opcode = 10;
      if (Buffer.isBuffer(binaryPayload) && binaryPayload.length > 125) {
        this._debug("WebSocket: Data for pong is longer than 125 bytes.  Truncating.");
        binaryPayload = binaryPayload.slice(0, 124);
      }
      frame.binaryPayload = binaryPayload;
      frame.fin = true;
      this.sendFrame(frame);
    };
    WebSocketConnection.prototype.fragmentAndSend = function(frame, cb) {
      this._debug("fragmentAndSend");
      if (frame.opcode > 7) {
        throw new Error("You cannot fragment control frames.");
      }
      var threshold = this.config.fragmentationThreshold;
      var length = frame.binaryPayload.length;
      if (!this.config.fragmentOutgoingMessages || frame.binaryPayload && length <= threshold) {
        frame.fin = true;
        this.sendFrame(frame, cb);
        return;
      }
      var numFragments = Math.ceil(length / threshold);
      var sentFragments = 0;
      var sentCallback = function fragmentSentCallback(err) {
        if (err) {
          if (typeof cb === "function") {
            cb(err);
            cb = null;
          }
          return;
        }
        ++sentFragments;
        if (sentFragments === numFragments && typeof cb === "function") {
          cb();
        }
      };
      for (var i = 1; i <= numFragments; i++) {
        var currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
        currentFrame.opcode = i === 1 ? frame.opcode : 0;
        currentFrame.fin = i === numFragments;
        var currentLength = i === numFragments ? length - threshold * (i - 1) : threshold;
        var sliceStart = threshold * (i - 1);
        currentFrame.binaryPayload = frame.binaryPayload.slice(sliceStart, sliceStart + currentLength);
        this.sendFrame(currentFrame, sentCallback);
      }
    };
    WebSocketConnection.prototype.sendCloseFrame = function(reasonCode, description, cb) {
      if (typeof reasonCode !== "number") {
        reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
      }
      this._debug("sendCloseFrame state: %s, reasonCode: %d, description: %s", this.state, reasonCode, description);
      if (this.state !== STATE_OPEN && this.state !== STATE_PEER_REQUESTED_CLOSE) {
        return;
      }
      var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
      frame.fin = true;
      frame.opcode = 8;
      frame.closeStatus = reasonCode;
      if (typeof description === "string") {
        frame.binaryPayload = bufferFromString(description, "utf8");
      }
      this.sendFrame(frame, cb);
      this.socket.end();
    };
    WebSocketConnection.prototype.sendFrame = function(frame, cb) {
      this._debug("sendFrame");
      frame.mask = this.maskOutgoingPackets;
      var flushed = this.socket.write(frame.toBuffer(), cb);
      this.outputBufferFull = !flushed;
      return flushed;
    };
    module2.exports = WebSocketConnection;
    function instrumentSocketForDebugging(connection, socket) {
      if (!connection._debug.enabled) {
        return;
      }
      var originalSocketEmit = socket.emit;
      socket.emit = function(event) {
        connection._debug("||| Socket Event  '%s'", event);
        originalSocketEmit.apply(this, arguments);
      };
      for (var key in socket) {
        if (typeof socket[key] !== "function") {
          continue;
        }
        if (["emit"].indexOf(key) !== -1) {
          continue;
        }
        (function(key2) {
          var original = socket[key2];
          if (key2 === "on") {
            socket[key2] = function proxyMethod__EventEmitter__On() {
              connection._debug("||| Socket method called:  %s (%s)", key2, arguments[0]);
              return original.apply(this, arguments);
            };
            return;
          }
          socket[key2] = function proxyMethod() {
            connection._debug("||| Socket method called:  %s", key2);
            return original.apply(this, arguments);
          };
        })(key);
      }
    }
  }
});

// node_modules/websocket/lib/WebSocketRequest.js
var require_WebSocketRequest = __commonJS({
  "node_modules/websocket/lib/WebSocketRequest.js"(exports, module2) {
    init_shims();
    var crypto = require("crypto");
    var util = require("util");
    var url = require("url");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketConnection = require_WebSocketConnection();
    var headerValueSplitRegExp = /,\s*/;
    var headerParamSplitRegExp = /;\s*/;
    var headerSanitizeRegExp = /[\r\n]/g;
    var xForwardedForSeparatorRegExp = /,\s*/;
    var separators = [
      "(",
      ")",
      "<",
      ">",
      "@",
      ",",
      ";",
      ":",
      "\\",
      '"',
      "/",
      "[",
      "]",
      "?",
      "=",
      "{",
      "}",
      " ",
      String.fromCharCode(9)
    ];
    var controlChars = [String.fromCharCode(127)];
    for (var i = 0; i < 31; i++) {
      controlChars.push(String.fromCharCode(i));
    }
    var cookieNameValidateRegEx = /([\x00-\x20\x22\x28\x29\x2c\x2f\x3a-\x3f\x40\x5b-\x5e\x7b\x7d\x7f])/;
    var cookieValueValidateRegEx = /[^\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]/;
    var cookieValueDQuoteValidateRegEx = /^"[^"]*"$/;
    var controlCharsAndSemicolonRegEx = /[\x00-\x20\x3b]/g;
    var cookieSeparatorRegEx = /[;,] */;
    var httpStatusDescriptions = {
      100: "Continue",
      101: "Switching Protocols",
      200: "OK",
      201: "Created",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      406: "Not Acceptable",
      407: "Proxy Authorization Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Request Entity Too Long",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      426: "Upgrade Required",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported"
    };
    function WebSocketRequest(socket, httpRequest, serverConfig) {
      EventEmitter.call(this);
      this.socket = socket;
      this.httpRequest = httpRequest;
      this.resource = httpRequest.url;
      this.remoteAddress = socket.remoteAddress;
      this.remoteAddresses = [this.remoteAddress];
      this.serverConfig = serverConfig;
      this._socketIsClosing = false;
      this._socketCloseHandler = this._handleSocketCloseBeforeAccept.bind(this);
      this.socket.on("end", this._socketCloseHandler);
      this.socket.on("close", this._socketCloseHandler);
      this._resolved = false;
    }
    util.inherits(WebSocketRequest, EventEmitter);
    WebSocketRequest.prototype.readHandshake = function() {
      var self2 = this;
      var request = this.httpRequest;
      this.resourceURL = url.parse(this.resource, true);
      this.host = request.headers["host"];
      if (!this.host) {
        throw new Error("Client must provide a Host header.");
      }
      this.key = request.headers["sec-websocket-key"];
      if (!this.key) {
        throw new Error("Client must provide a value for Sec-WebSocket-Key.");
      }
      this.webSocketVersion = parseInt(request.headers["sec-websocket-version"], 10);
      if (!this.webSocketVersion || isNaN(this.webSocketVersion)) {
        throw new Error("Client must provide a value for Sec-WebSocket-Version.");
      }
      switch (this.webSocketVersion) {
        case 8:
        case 13:
          break;
        default:
          var e = new Error("Unsupported websocket client version: " + this.webSocketVersion + "Only versions 8 and 13 are supported.");
          e.httpCode = 426;
          e.headers = {
            "Sec-WebSocket-Version": "13"
          };
          throw e;
      }
      if (this.webSocketVersion === 13) {
        this.origin = request.headers["origin"];
      } else if (this.webSocketVersion === 8) {
        this.origin = request.headers["sec-websocket-origin"];
      }
      var protocolString = request.headers["sec-websocket-protocol"];
      this.protocolFullCaseMap = {};
      this.requestedProtocols = [];
      if (protocolString) {
        var requestedProtocolsFullCase = protocolString.split(headerValueSplitRegExp);
        requestedProtocolsFullCase.forEach(function(protocol) {
          var lcProtocol = protocol.toLocaleLowerCase();
          self2.requestedProtocols.push(lcProtocol);
          self2.protocolFullCaseMap[lcProtocol] = protocol;
        });
      }
      if (!this.serverConfig.ignoreXForwardedFor && request.headers["x-forwarded-for"]) {
        var immediatePeerIP = this.remoteAddress;
        this.remoteAddresses = request.headers["x-forwarded-for"].split(xForwardedForSeparatorRegExp);
        this.remoteAddresses.push(immediatePeerIP);
        this.remoteAddress = this.remoteAddresses[0];
      }
      if (this.serverConfig.parseExtensions) {
        var extensionsString = request.headers["sec-websocket-extensions"];
        this.requestedExtensions = this.parseExtensions(extensionsString);
      } else {
        this.requestedExtensions = [];
      }
      if (this.serverConfig.parseCookies) {
        var cookieString = request.headers["cookie"];
        this.cookies = this.parseCookies(cookieString);
      } else {
        this.cookies = [];
      }
    };
    WebSocketRequest.prototype.parseExtensions = function(extensionsString) {
      if (!extensionsString || extensionsString.length === 0) {
        return [];
      }
      var extensions = extensionsString.toLocaleLowerCase().split(headerValueSplitRegExp);
      extensions.forEach(function(extension, index2, array) {
        var params = extension.split(headerParamSplitRegExp);
        var extensionName = params[0];
        var extensionParams = params.slice(1);
        extensionParams.forEach(function(rawParam, index3, array2) {
          var arr = rawParam.split("=");
          var obj2 = {
            name: arr[0],
            value: arr[1]
          };
          array2.splice(index3, 1, obj2);
        });
        var obj = {
          name: extensionName,
          params: extensionParams
        };
        array.splice(index2, 1, obj);
      });
      return extensions;
    };
    WebSocketRequest.prototype.parseCookies = function(str) {
      if (!str || typeof str !== "string") {
        return [];
      }
      var cookies = [];
      var pairs = str.split(cookieSeparatorRegEx);
      pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf("=");
        if (eq_idx === -1) {
          cookies.push({
            name: pair,
            value: null
          });
          return;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        if (val[0] === '"') {
          val = val.slice(1, -1);
        }
        cookies.push({
          name: key,
          value: decodeURIComponent(val)
        });
      });
      return cookies;
    };
    WebSocketRequest.prototype.accept = function(acceptedProtocol, allowedOrigin, cookies) {
      this._verifyResolution();
      var protocolFullCase;
      if (acceptedProtocol) {
        protocolFullCase = this.protocolFullCaseMap[acceptedProtocol.toLocaleLowerCase()];
        if (typeof protocolFullCase === "undefined") {
          protocolFullCase = acceptedProtocol;
        }
      } else {
        protocolFullCase = acceptedProtocol;
      }
      this.protocolFullCaseMap = null;
      var sha1 = crypto.createHash("sha1");
      sha1.update(this.key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
      var acceptKey = sha1.digest("base64");
      var response = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + acceptKey + "\r\n";
      if (protocolFullCase) {
        for (var i2 = 0; i2 < protocolFullCase.length; i2++) {
          var charCode = protocolFullCase.charCodeAt(i2);
          var character = protocolFullCase.charAt(i2);
          if (charCode < 33 || charCode > 126 || separators.indexOf(character) !== -1) {
            this.reject(500);
            throw new Error('Illegal character "' + String.fromCharCode(character) + '" in subprotocol.');
          }
        }
        if (this.requestedProtocols.indexOf(acceptedProtocol) === -1) {
          this.reject(500);
          throw new Error("Specified protocol was not requested by the client.");
        }
        protocolFullCase = protocolFullCase.replace(headerSanitizeRegExp, "");
        response += "Sec-WebSocket-Protocol: " + protocolFullCase + "\r\n";
      }
      this.requestedProtocols = null;
      if (allowedOrigin) {
        allowedOrigin = allowedOrigin.replace(headerSanitizeRegExp, "");
        if (this.webSocketVersion === 13) {
          response += "Origin: " + allowedOrigin + "\r\n";
        } else if (this.webSocketVersion === 8) {
          response += "Sec-WebSocket-Origin: " + allowedOrigin + "\r\n";
        }
      }
      if (cookies) {
        if (!Array.isArray(cookies)) {
          this.reject(500);
          throw new Error('Value supplied for "cookies" argument must be an array.');
        }
        var seenCookies = {};
        cookies.forEach(function(cookie) {
          if (!cookie.name || !cookie.value) {
            this.reject(500);
            throw new Error('Each cookie to set must at least provide a "name" and "value"');
          }
          cookie.name = cookie.name.replace(controlCharsAndSemicolonRegEx, "");
          cookie.value = cookie.value.replace(controlCharsAndSemicolonRegEx, "");
          if (seenCookies[cookie.name]) {
            this.reject(500);
            throw new Error("You may not specify the same cookie name twice.");
          }
          seenCookies[cookie.name] = true;
          var invalidChar = cookie.name.match(cookieNameValidateRegEx);
          if (invalidChar) {
            this.reject(500);
            throw new Error("Illegal character " + invalidChar[0] + " in cookie name");
          }
          if (cookie.value.match(cookieValueDQuoteValidateRegEx)) {
            invalidChar = cookie.value.slice(1, -1).match(cookieValueValidateRegEx);
          } else {
            invalidChar = cookie.value.match(cookieValueValidateRegEx);
          }
          if (invalidChar) {
            this.reject(500);
            throw new Error("Illegal character " + invalidChar[0] + " in cookie value");
          }
          var cookieParts = [cookie.name + "=" + cookie.value];
          if (cookie.path) {
            invalidChar = cookie.path.match(controlCharsAndSemicolonRegEx);
            if (invalidChar) {
              this.reject(500);
              throw new Error("Illegal character " + invalidChar[0] + " in cookie path");
            }
            cookieParts.push("Path=" + cookie.path);
          }
          if (cookie.domain) {
            if (typeof cookie.domain !== "string") {
              this.reject(500);
              throw new Error("Domain must be specified and must be a string.");
            }
            invalidChar = cookie.domain.match(controlCharsAndSemicolonRegEx);
            if (invalidChar) {
              this.reject(500);
              throw new Error("Illegal character " + invalidChar[0] + " in cookie domain");
            }
            cookieParts.push("Domain=" + cookie.domain.toLowerCase());
          }
          if (cookie.expires) {
            if (!(cookie.expires instanceof Date)) {
              this.reject(500);
              throw new Error('Value supplied for cookie "expires" must be a vaild date object');
            }
            cookieParts.push("Expires=" + cookie.expires.toGMTString());
          }
          if (cookie.maxage) {
            var maxage = cookie.maxage;
            if (typeof maxage === "string") {
              maxage = parseInt(maxage, 10);
            }
            if (isNaN(maxage) || maxage <= 0) {
              this.reject(500);
              throw new Error('Value supplied for cookie "maxage" must be a non-zero number');
            }
            maxage = Math.round(maxage);
            cookieParts.push("Max-Age=" + maxage.toString(10));
          }
          if (cookie.secure) {
            if (typeof cookie.secure !== "boolean") {
              this.reject(500);
              throw new Error('Value supplied for cookie "secure" must be of type boolean');
            }
            cookieParts.push("Secure");
          }
          if (cookie.httponly) {
            if (typeof cookie.httponly !== "boolean") {
              this.reject(500);
              throw new Error('Value supplied for cookie "httponly" must be of type boolean');
            }
            cookieParts.push("HttpOnly");
          }
          response += "Set-Cookie: " + cookieParts.join(";") + "\r\n";
        }.bind(this));
      }
      this._resolved = true;
      this.emit("requestResolved", this);
      response += "\r\n";
      var connection = new WebSocketConnection(this.socket, [], acceptedProtocol, false, this.serverConfig);
      connection.webSocketVersion = this.webSocketVersion;
      connection.remoteAddress = this.remoteAddress;
      connection.remoteAddresses = this.remoteAddresses;
      var self2 = this;
      if (this._socketIsClosing) {
        cleanupFailedConnection(connection);
      } else {
        this.socket.write(response, "ascii", function(error2) {
          if (error2) {
            cleanupFailedConnection(connection);
            return;
          }
          self2._removeSocketCloseListeners();
          connection._addSocketEventListeners();
        });
      }
      this.emit("requestAccepted", connection);
      return connection;
    };
    WebSocketRequest.prototype.reject = function(status, reason, extraHeaders) {
      this._verifyResolution();
      this._resolved = true;
      this.emit("requestResolved", this);
      if (typeof status !== "number") {
        status = 403;
      }
      var response = "HTTP/1.1 " + status + " " + httpStatusDescriptions[status] + "\r\nConnection: close\r\n";
      if (reason) {
        reason = reason.replace(headerSanitizeRegExp, "");
        response += "X-WebSocket-Reject-Reason: " + reason + "\r\n";
      }
      if (extraHeaders) {
        for (var key in extraHeaders) {
          var sanitizedValue = extraHeaders[key].toString().replace(headerSanitizeRegExp, "");
          var sanitizedKey = key.replace(headerSanitizeRegExp, "");
          response += sanitizedKey + ": " + sanitizedValue + "\r\n";
        }
      }
      response += "\r\n";
      this.socket.end(response, "ascii");
      this.emit("requestRejected", this);
    };
    WebSocketRequest.prototype._handleSocketCloseBeforeAccept = function() {
      this._socketIsClosing = true;
      this._removeSocketCloseListeners();
    };
    WebSocketRequest.prototype._removeSocketCloseListeners = function() {
      this.socket.removeListener("end", this._socketCloseHandler);
      this.socket.removeListener("close", this._socketCloseHandler);
    };
    WebSocketRequest.prototype._verifyResolution = function() {
      if (this._resolved) {
        throw new Error("WebSocketRequest may only be accepted or rejected one time.");
      }
    };
    function cleanupFailedConnection(connection) {
      process.nextTick(function() {
        connection.drop(1006, "TCP connection lost before handshake completed.", true);
      });
    }
    module2.exports = WebSocketRequest;
  }
});

// node_modules/websocket/lib/WebSocketServer.js
var require_WebSocketServer = __commonJS({
  "node_modules/websocket/lib/WebSocketServer.js"(exports, module2) {
    init_shims();
    var extend = require_utils().extend;
    var utils = require_utils();
    var util = require("util");
    var debug = require_src()("websocket:server");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketRequest = require_WebSocketRequest();
    var WebSocketServer = function WebSocketServer2(config) {
      EventEmitter.call(this);
      this._handlers = {
        upgrade: this.handleUpgrade.bind(this),
        requestAccepted: this.handleRequestAccepted.bind(this),
        requestResolved: this.handleRequestResolved.bind(this)
      };
      this.connections = [];
      this.pendingRequests = [];
      if (config) {
        this.mount(config);
      }
    };
    util.inherits(WebSocketServer, EventEmitter);
    WebSocketServer.prototype.mount = function(config) {
      this.config = {
        httpServer: null,
        maxReceivedFrameSize: 65536,
        maxReceivedMessageSize: 1048576,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 16384,
        keepalive: true,
        keepaliveInterval: 2e4,
        dropConnectionOnKeepaliveTimeout: true,
        keepaliveGracePeriod: 1e4,
        useNativeKeepalive: false,
        assembleFragments: true,
        autoAcceptConnections: false,
        ignoreXForwardedFor: false,
        parseCookies: true,
        parseExtensions: true,
        disableNagleAlgorithm: true,
        closeTimeout: 5e3
      };
      extend(this.config, config);
      if (this.config.httpServer) {
        if (!Array.isArray(this.config.httpServer)) {
          this.config.httpServer = [this.config.httpServer];
        }
        var upgradeHandler = this._handlers.upgrade;
        this.config.httpServer.forEach(function(httpServer) {
          httpServer.on("upgrade", upgradeHandler);
        });
      } else {
        throw new Error("You must specify an httpServer on which to mount the WebSocket server.");
      }
    };
    WebSocketServer.prototype.unmount = function() {
      var upgradeHandler = this._handlers.upgrade;
      this.config.httpServer.forEach(function(httpServer) {
        httpServer.removeListener("upgrade", upgradeHandler);
      });
    };
    WebSocketServer.prototype.closeAllConnections = function() {
      this.connections.forEach(function(connection) {
        connection.close();
      });
      this.pendingRequests.forEach(function(request) {
        process.nextTick(function() {
          request.reject(503);
        });
      });
    };
    WebSocketServer.prototype.broadcast = function(data) {
      if (Buffer.isBuffer(data)) {
        this.broadcastBytes(data);
      } else if (typeof data.toString === "function") {
        this.broadcastUTF(data);
      }
    };
    WebSocketServer.prototype.broadcastUTF = function(utfData) {
      this.connections.forEach(function(connection) {
        connection.sendUTF(utfData);
      });
    };
    WebSocketServer.prototype.broadcastBytes = function(binaryData) {
      this.connections.forEach(function(connection) {
        connection.sendBytes(binaryData);
      });
    };
    WebSocketServer.prototype.shutDown = function() {
      this.unmount();
      this.closeAllConnections();
    };
    WebSocketServer.prototype.handleUpgrade = function(request, socket) {
      var self2 = this;
      var wsRequest = new WebSocketRequest(socket, request, this.config);
      try {
        wsRequest.readHandshake();
      } catch (e) {
        wsRequest.reject(e.httpCode ? e.httpCode : 400, e.message, e.headers);
        debug("Invalid handshake: %s", e.message);
        this.emit("upgradeError", e);
        return;
      }
      this.pendingRequests.push(wsRequest);
      wsRequest.once("requestAccepted", this._handlers.requestAccepted);
      wsRequest.once("requestResolved", this._handlers.requestResolved);
      socket.once("close", function() {
        self2._handlers.requestResolved(wsRequest);
      });
      if (!this.config.autoAcceptConnections && utils.eventEmitterListenerCount(this, "request") > 0) {
        this.emit("request", wsRequest);
      } else if (this.config.autoAcceptConnections) {
        wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin);
      } else {
        wsRequest.reject(404, "No handler is configured to accept the connection.");
      }
    };
    WebSocketServer.prototype.handleRequestAccepted = function(connection) {
      var self2 = this;
      connection.once("close", function(closeReason, description) {
        self2.handleConnectionClose(connection, closeReason, description);
      });
      this.connections.push(connection);
      this.emit("connect", connection);
    };
    WebSocketServer.prototype.handleConnectionClose = function(connection, closeReason, description) {
      var index2 = this.connections.indexOf(connection);
      if (index2 !== -1) {
        this.connections.splice(index2, 1);
      }
      this.emit("close", connection, closeReason, description);
    };
    WebSocketServer.prototype.handleRequestResolved = function(request) {
      var index2 = this.pendingRequests.indexOf(request);
      if (index2 !== -1) {
        this.pendingRequests.splice(index2, 1);
      }
    };
    module2.exports = WebSocketServer;
  }
});

// node_modules/websocket/lib/WebSocketClient.js
var require_WebSocketClient = __commonJS({
  "node_modules/websocket/lib/WebSocketClient.js"(exports, module2) {
    init_shims();
    var utils = require_utils();
    var extend = utils.extend;
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    var http2 = require("http");
    var https2 = require("https");
    var url = require("url");
    var crypto = require("crypto");
    var WebSocketConnection = require_WebSocketConnection();
    var bufferAllocUnsafe = utils.bufferAllocUnsafe;
    var protocolSeparators = [
      "(",
      ")",
      "<",
      ">",
      "@",
      ",",
      ";",
      ":",
      "\\",
      '"',
      "/",
      "[",
      "]",
      "?",
      "=",
      "{",
      "}",
      " ",
      String.fromCharCode(9)
    ];
    var excludedTlsOptions = ["hostname", "port", "method", "path", "headers"];
    function WebSocketClient(config) {
      EventEmitter.call(this);
      this.config = {
        maxReceivedFrameSize: 1048576,
        maxReceivedMessageSize: 8388608,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 16384,
        webSocketVersion: 13,
        assembleFragments: true,
        disableNagleAlgorithm: true,
        closeTimeout: 5e3,
        tlsOptions: {}
      };
      if (config) {
        var tlsOptions;
        if (config.tlsOptions) {
          tlsOptions = config.tlsOptions;
          delete config.tlsOptions;
        } else {
          tlsOptions = {};
        }
        extend(this.config, config);
        extend(this.config.tlsOptions, tlsOptions);
      }
      this._req = null;
      switch (this.config.webSocketVersion) {
        case 8:
        case 13:
          break;
        default:
          throw new Error("Requested webSocketVersion is not supported. Allowed values are 8 and 13.");
      }
    }
    util.inherits(WebSocketClient, EventEmitter);
    WebSocketClient.prototype.connect = function(requestUrl, protocols, origin, headers, extraRequestOptions) {
      var self2 = this;
      if (typeof protocols === "string") {
        if (protocols.length > 0) {
          protocols = [protocols];
        } else {
          protocols = [];
        }
      }
      if (!(protocols instanceof Array)) {
        protocols = [];
      }
      this.protocols = protocols;
      this.origin = origin;
      if (typeof requestUrl === "string") {
        this.url = url.parse(requestUrl);
      } else {
        this.url = requestUrl;
      }
      if (!this.url.protocol) {
        throw new Error("You must specify a full WebSocket URL, including protocol.");
      }
      if (!this.url.host) {
        throw new Error("You must specify a full WebSocket URL, including hostname. Relative URLs are not supported.");
      }
      this.secure = this.url.protocol === "wss:";
      this.protocols.forEach(function(protocol) {
        for (var i2 = 0; i2 < protocol.length; i2++) {
          var charCode = protocol.charCodeAt(i2);
          var character = protocol.charAt(i2);
          if (charCode < 33 || charCode > 126 || protocolSeparators.indexOf(character) !== -1) {
            throw new Error('Protocol list contains invalid character "' + String.fromCharCode(charCode) + '"');
          }
        }
      });
      var defaultPorts = {
        "ws:": "80",
        "wss:": "443"
      };
      if (!this.url.port) {
        this.url.port = defaultPorts[this.url.protocol];
      }
      var nonce = bufferAllocUnsafe(16);
      for (var i = 0; i < 16; i++) {
        nonce[i] = Math.round(Math.random() * 255);
      }
      this.base64nonce = nonce.toString("base64");
      var hostHeaderValue = this.url.hostname;
      if (this.url.protocol === "ws:" && this.url.port !== "80" || this.url.protocol === "wss:" && this.url.port !== "443") {
        hostHeaderValue += ":" + this.url.port;
      }
      var reqHeaders = {};
      if (this.secure && this.config.tlsOptions.hasOwnProperty("headers")) {
        extend(reqHeaders, this.config.tlsOptions.headers);
      }
      if (headers) {
        extend(reqHeaders, headers);
      }
      extend(reqHeaders, {
        "Upgrade": "websocket",
        "Connection": "Upgrade",
        "Sec-WebSocket-Version": this.config.webSocketVersion.toString(10),
        "Sec-WebSocket-Key": this.base64nonce,
        "Host": reqHeaders.Host || hostHeaderValue
      });
      if (this.protocols.length > 0) {
        reqHeaders["Sec-WebSocket-Protocol"] = this.protocols.join(", ");
      }
      if (this.origin) {
        if (this.config.webSocketVersion === 13) {
          reqHeaders["Origin"] = this.origin;
        } else if (this.config.webSocketVersion === 8) {
          reqHeaders["Sec-WebSocket-Origin"] = this.origin;
        }
      }
      var pathAndQuery;
      if (this.url.pathname) {
        pathAndQuery = this.url.path;
      } else if (this.url.path) {
        pathAndQuery = "/" + this.url.path;
      } else {
        pathAndQuery = "/";
      }
      function handleRequestError(error2) {
        self2._req = null;
        self2.emit("connectFailed", error2);
      }
      var requestOptions = {
        agent: false
      };
      if (extraRequestOptions) {
        extend(requestOptions, extraRequestOptions);
      }
      extend(requestOptions, {
        hostname: this.url.hostname,
        port: this.url.port,
        method: "GET",
        path: pathAndQuery,
        headers: reqHeaders
      });
      if (this.secure) {
        var tlsOptions = this.config.tlsOptions;
        for (var key in tlsOptions) {
          if (tlsOptions.hasOwnProperty(key) && excludedTlsOptions.indexOf(key) === -1) {
            requestOptions[key] = tlsOptions[key];
          }
        }
      }
      var req = this._req = (this.secure ? https2 : http2).request(requestOptions);
      req.on("upgrade", function handleRequestUpgrade(response, socket, head) {
        self2._req = null;
        req.removeListener("error", handleRequestError);
        self2.socket = socket;
        self2.response = response;
        self2.firstDataChunk = head;
        self2.validateHandshake();
      });
      req.on("error", handleRequestError);
      req.on("response", function(response) {
        self2._req = null;
        if (utils.eventEmitterListenerCount(self2, "httpResponse") > 0) {
          self2.emit("httpResponse", response, self2);
          if (response.socket) {
            response.socket.end();
          }
        } else {
          var headerDumpParts = [];
          for (var headerName in response.headers) {
            headerDumpParts.push(headerName + ": " + response.headers[headerName]);
          }
          self2.failHandshake("Server responded with a non-101 status: " + response.statusCode + " " + response.statusMessage + "\nResponse Headers Follow:\n" + headerDumpParts.join("\n") + "\n");
        }
      });
      req.end();
    };
    WebSocketClient.prototype.validateHandshake = function() {
      var headers = this.response.headers;
      if (this.protocols.length > 0) {
        this.protocol = headers["sec-websocket-protocol"];
        if (this.protocol) {
          if (this.protocols.indexOf(this.protocol) === -1) {
            this.failHandshake("Server did not respond with a requested protocol.");
            return;
          }
        } else {
          this.failHandshake("Expected a Sec-WebSocket-Protocol header.");
          return;
        }
      }
      if (!(headers["connection"] && headers["connection"].toLocaleLowerCase() === "upgrade")) {
        this.failHandshake("Expected a Connection: Upgrade header from the server");
        return;
      }
      if (!(headers["upgrade"] && headers["upgrade"].toLocaleLowerCase() === "websocket")) {
        this.failHandshake("Expected an Upgrade: websocket header from the server");
        return;
      }
      var sha1 = crypto.createHash("sha1");
      sha1.update(this.base64nonce + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
      var expectedKey = sha1.digest("base64");
      if (!headers["sec-websocket-accept"]) {
        this.failHandshake("Expected Sec-WebSocket-Accept header from server");
        return;
      }
      if (headers["sec-websocket-accept"] !== expectedKey) {
        this.failHandshake("Sec-WebSocket-Accept header from server didn't match expected value of " + expectedKey);
        return;
      }
      this.succeedHandshake();
    };
    WebSocketClient.prototype.failHandshake = function(errorDescription) {
      if (this.socket && this.socket.writable) {
        this.socket.end();
      }
      this.emit("connectFailed", new Error(errorDescription));
    };
    WebSocketClient.prototype.succeedHandshake = function() {
      var connection = new WebSocketConnection(this.socket, [], this.protocol, true, this.config);
      connection.webSocketVersion = this.config.webSocketVersion;
      connection._addSocketEventListeners();
      this.emit("connect", connection);
      if (this.firstDataChunk.length > 0) {
        connection.handleSocketData(this.firstDataChunk);
      }
      this.firstDataChunk = null;
    };
    WebSocketClient.prototype.abort = function() {
      if (this._req) {
        this._req.abort();
      }
    };
    module2.exports = WebSocketClient;
  }
});

// node_modules/websocket/lib/WebSocketRouterRequest.js
var require_WebSocketRouterRequest = __commonJS({
  "node_modules/websocket/lib/WebSocketRouterRequest.js"(exports, module2) {
    init_shims();
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    function WebSocketRouterRequest(webSocketRequest, resolvedProtocol) {
      EventEmitter.call(this);
      this.webSocketRequest = webSocketRequest;
      if (resolvedProtocol === "____no_protocol____") {
        this.protocol = null;
      } else {
        this.protocol = resolvedProtocol;
      }
      this.origin = webSocketRequest.origin;
      this.resource = webSocketRequest.resource;
      this.resourceURL = webSocketRequest.resourceURL;
      this.httpRequest = webSocketRequest.httpRequest;
      this.remoteAddress = webSocketRequest.remoteAddress;
      this.webSocketVersion = webSocketRequest.webSocketVersion;
      this.requestedExtensions = webSocketRequest.requestedExtensions;
      this.cookies = webSocketRequest.cookies;
    }
    util.inherits(WebSocketRouterRequest, EventEmitter);
    WebSocketRouterRequest.prototype.accept = function(origin, cookies) {
      var connection = this.webSocketRequest.accept(this.protocol, origin, cookies);
      this.emit("requestAccepted", connection);
      return connection;
    };
    WebSocketRouterRequest.prototype.reject = function(status, reason, extraHeaders) {
      this.webSocketRequest.reject(status, reason, extraHeaders);
      this.emit("requestRejected", this);
    };
    module2.exports = WebSocketRouterRequest;
  }
});

// node_modules/websocket/lib/WebSocketRouter.js
var require_WebSocketRouter = __commonJS({
  "node_modules/websocket/lib/WebSocketRouter.js"(exports, module2) {
    init_shims();
    var extend = require_utils().extend;
    var util = require("util");
    var EventEmitter = require("events").EventEmitter;
    var WebSocketRouterRequest = require_WebSocketRouterRequest();
    function WebSocketRouter(config) {
      EventEmitter.call(this);
      this.config = {
        server: null
      };
      if (config) {
        extend(this.config, config);
      }
      this.handlers = [];
      this._requestHandler = this.handleRequest.bind(this);
      if (this.config.server) {
        this.attachServer(this.config.server);
      }
    }
    util.inherits(WebSocketRouter, EventEmitter);
    WebSocketRouter.prototype.attachServer = function(server) {
      if (server) {
        this.server = server;
        this.server.on("request", this._requestHandler);
      } else {
        throw new Error("You must specify a WebSocketServer instance to attach to.");
      }
    };
    WebSocketRouter.prototype.detachServer = function() {
      if (this.server) {
        this.server.removeListener("request", this._requestHandler);
        this.server = null;
      } else {
        throw new Error("Cannot detach from server: not attached.");
      }
    };
    WebSocketRouter.prototype.mount = function(path, protocol, callback) {
      if (!path) {
        throw new Error("You must specify a path for this handler.");
      }
      if (!protocol) {
        protocol = "____no_protocol____";
      }
      if (!callback) {
        throw new Error("You must specify a callback for this handler.");
      }
      path = this.pathToRegExp(path);
      if (!(path instanceof RegExp)) {
        throw new Error("Path must be specified as either a string or a RegExp.");
      }
      var pathString = path.toString();
      protocol = protocol.toLocaleLowerCase();
      if (this.findHandlerIndex(pathString, protocol) !== -1) {
        throw new Error("You may only mount one handler per path/protocol combination.");
      }
      this.handlers.push({
        "path": path,
        "pathString": pathString,
        "protocol": protocol,
        "callback": callback
      });
    };
    WebSocketRouter.prototype.unmount = function(path, protocol) {
      var index2 = this.findHandlerIndex(this.pathToRegExp(path).toString(), protocol);
      if (index2 !== -1) {
        this.handlers.splice(index2, 1);
      } else {
        throw new Error("Unable to find a route matching the specified path and protocol.");
      }
    };
    WebSocketRouter.prototype.findHandlerIndex = function(pathString, protocol) {
      protocol = protocol.toLocaleLowerCase();
      for (var i = 0, len = this.handlers.length; i < len; i++) {
        var handler2 = this.handlers[i];
        if (handler2.pathString === pathString && handler2.protocol === protocol) {
          return i;
        }
      }
      return -1;
    };
    WebSocketRouter.prototype.pathToRegExp = function(path) {
      if (typeof path === "string") {
        if (path === "*") {
          path = /^.*$/;
        } else {
          path = path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          path = new RegExp("^" + path + "$");
        }
      }
      return path;
    };
    WebSocketRouter.prototype.handleRequest = function(request) {
      var requestedProtocols = request.requestedProtocols;
      if (requestedProtocols.length === 0) {
        requestedProtocols = ["____no_protocol____"];
      }
      for (var i = 0; i < requestedProtocols.length; i++) {
        var requestedProtocol = requestedProtocols[i].toLocaleLowerCase();
        for (var j = 0, len = this.handlers.length; j < len; j++) {
          var handler2 = this.handlers[j];
          if (handler2.path.test(request.resourceURL.pathname)) {
            if (requestedProtocol === handler2.protocol || handler2.protocol === "*") {
              var routerRequest = new WebSocketRouterRequest(request, requestedProtocol);
              handler2.callback(routerRequest);
              return;
            }
          }
        }
      }
      request.reject(404, "No handler is available for the given request.");
    };
    module2.exports = WebSocketRouter;
  }
});

// node_modules/is-typedarray/index.js
var require_is_typedarray = __commonJS({
  "node_modules/is-typedarray/index.js"(exports, module2) {
    init_shims();
    module2.exports = isTypedArray;
    isTypedArray.strict = isStrictTypedArray;
    isTypedArray.loose = isLooseTypedArray;
    var toString = Object.prototype.toString;
    var names = {
      "[object Int8Array]": true,
      "[object Int16Array]": true,
      "[object Int32Array]": true,
      "[object Uint8Array]": true,
      "[object Uint8ClampedArray]": true,
      "[object Uint16Array]": true,
      "[object Uint32Array]": true,
      "[object Float32Array]": true,
      "[object Float64Array]": true
    };
    function isTypedArray(arr) {
      return isStrictTypedArray(arr) || isLooseTypedArray(arr);
    }
    function isStrictTypedArray(arr) {
      return arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array;
    }
    function isLooseTypedArray(arr) {
      return names[toString.call(arr)];
    }
  }
});

// node_modules/typedarray-to-buffer/index.js
var require_typedarray_to_buffer = __commonJS({
  "node_modules/typedarray-to-buffer/index.js"(exports, module2) {
    init_shims();
    var isTypedArray = require_is_typedarray().strict;
    module2.exports = function typedarrayToBuffer(arr) {
      if (isTypedArray(arr)) {
        var buf = Buffer.from(arr.buffer);
        if (arr.byteLength !== arr.buffer.byteLength) {
          buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
        }
        return buf;
      } else {
        return Buffer.from(arr);
      }
    };
  }
});

// node_modules/yaeti/lib/EventTarget.js
var require_EventTarget = __commonJS({
  "node_modules/yaeti/lib/EventTarget.js"(exports, module2) {
    init_shims();
    module2.exports = _EventTarget;
    function _EventTarget() {
      if (typeof this.addEventListener === "function") {
        return;
      }
      this._listeners = {};
      this.addEventListener = _addEventListener;
      this.removeEventListener = _removeEventListener;
      this.dispatchEvent = _dispatchEvent;
    }
    Object.defineProperties(_EventTarget.prototype, {
      listeners: {
        get: function() {
          return this._listeners;
        }
      }
    });
    function _addEventListener(type, newListener) {
      var listenersType, i, listener;
      if (!type || !newListener) {
        return;
      }
      listenersType = this._listeners[type];
      if (listenersType === void 0) {
        this._listeners[type] = listenersType = [];
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (listener === newListener) {
          return;
        }
      }
      listenersType.push(newListener);
    }
    function _removeEventListener(type, oldListener) {
      var listenersType, i, listener;
      if (!type || !oldListener) {
        return;
      }
      listenersType = this._listeners[type];
      if (listenersType === void 0) {
        return;
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (listener === oldListener) {
          listenersType.splice(i, 1);
          break;
        }
      }
      if (listenersType.length === 0) {
        delete this._listeners[type];
      }
    }
    function _dispatchEvent(event) {
      var type, listenersType, dummyListener, stopImmediatePropagation = false, i, listener;
      if (!event || typeof event.type !== "string") {
        throw new Error("`event` must have a valid `type` property");
      }
      if (event._yaeti) {
        event.target = this;
        event.cancelable = true;
      }
      try {
        event.stopImmediatePropagation = function() {
          stopImmediatePropagation = true;
        };
      } catch (error2) {
      }
      type = event.type;
      listenersType = this._listeners[type] || [];
      dummyListener = this["on" + type];
      if (typeof dummyListener === "function") {
        dummyListener.call(this, event);
      }
      for (i = 0; !!(listener = listenersType[i]); i++) {
        if (stopImmediatePropagation) {
          break;
        }
        listener.call(this, event);
      }
      return !event.defaultPrevented;
    }
  }
});

// node_modules/yaeti/lib/Event.js
var require_Event = __commonJS({
  "node_modules/yaeti/lib/Event.js"(exports, module2) {
    init_shims();
    module2.exports = _Event;
    function _Event(type) {
      this.type = type;
      this.isTrusted = false;
      this._yaeti = true;
    }
  }
});

// node_modules/yaeti/index.js
var require_yaeti = __commonJS({
  "node_modules/yaeti/index.js"(exports, module2) {
    init_shims();
    module2.exports = {
      EventTarget: require_EventTarget(),
      Event: require_Event()
    };
  }
});

// node_modules/websocket/lib/W3CWebSocket.js
var require_W3CWebSocket = __commonJS({
  "node_modules/websocket/lib/W3CWebSocket.js"(exports, module2) {
    init_shims();
    var WebSocketClient = require_WebSocketClient();
    var toBuffer = require_typedarray_to_buffer();
    var yaeti = require_yaeti();
    var CONNECTING = 0;
    var OPEN = 1;
    var CLOSING = 2;
    var CLOSED = 3;
    module2.exports = W3CWebSocket;
    function W3CWebSocket(url, protocols, origin, headers, requestOptions, clientConfig) {
      yaeti.EventTarget.call(this);
      clientConfig = clientConfig || {};
      clientConfig.assembleFragments = true;
      var self2 = this;
      this._url = url;
      this._readyState = CONNECTING;
      this._protocol = void 0;
      this._extensions = "";
      this._bufferedAmount = 0;
      this._binaryType = "arraybuffer";
      this._connection = void 0;
      this._client = new WebSocketClient(clientConfig);
      this._client.on("connect", function(connection) {
        onConnect.call(self2, connection);
      });
      this._client.on("connectFailed", function() {
        onConnectFailed.call(self2);
      });
      this._client.connect(url, protocols, origin, headers, requestOptions);
    }
    Object.defineProperties(W3CWebSocket.prototype, {
      url: { get: function() {
        return this._url;
      } },
      readyState: { get: function() {
        return this._readyState;
      } },
      protocol: { get: function() {
        return this._protocol;
      } },
      extensions: { get: function() {
        return this._extensions;
      } },
      bufferedAmount: { get: function() {
        return this._bufferedAmount;
      } }
    });
    Object.defineProperties(W3CWebSocket.prototype, {
      binaryType: {
        get: function() {
          return this._binaryType;
        },
        set: function(type) {
          if (type !== "arraybuffer") {
            throw new SyntaxError('just "arraybuffer" type allowed for "binaryType" attribute');
          }
          this._binaryType = type;
        }
      }
    });
    [["CONNECTING", CONNECTING], ["OPEN", OPEN], ["CLOSING", CLOSING], ["CLOSED", CLOSED]].forEach(function(property) {
      Object.defineProperty(W3CWebSocket.prototype, property[0], {
        get: function() {
          return property[1];
        }
      });
    });
    [["CONNECTING", CONNECTING], ["OPEN", OPEN], ["CLOSING", CLOSING], ["CLOSED", CLOSED]].forEach(function(property) {
      Object.defineProperty(W3CWebSocket, property[0], {
        get: function() {
          return property[1];
        }
      });
    });
    W3CWebSocket.prototype.send = function(data) {
      if (this._readyState !== OPEN) {
        throw new Error("cannot call send() while not connected");
      }
      if (typeof data === "string" || data instanceof String) {
        this._connection.sendUTF(data);
      } else {
        if (data instanceof Buffer) {
          this._connection.sendBytes(data);
        } else if (data.byteLength || data.byteLength === 0) {
          data = toBuffer(data);
          this._connection.sendBytes(data);
        } else {
          throw new Error("unknown binary data:", data);
        }
      }
    };
    W3CWebSocket.prototype.close = function(code, reason) {
      switch (this._readyState) {
        case CONNECTING:
          onConnectFailed.call(this);
          this._client.on("connect", function(connection) {
            if (code) {
              connection.close(code, reason);
            } else {
              connection.close();
            }
          });
          break;
        case OPEN:
          this._readyState = CLOSING;
          if (code) {
            this._connection.close(code, reason);
          } else {
            this._connection.close();
          }
          break;
        case CLOSING:
        case CLOSED:
          break;
      }
    };
    function createCloseEvent(code, reason) {
      var event = new yaeti.Event("close");
      event.code = code;
      event.reason = reason;
      event.wasClean = typeof code === "undefined" || code === 1e3;
      return event;
    }
    function createMessageEvent(data) {
      var event = new yaeti.Event("message");
      event.data = data;
      return event;
    }
    function onConnect(connection) {
      var self2 = this;
      this._readyState = OPEN;
      this._connection = connection;
      this._protocol = connection.protocol;
      this._extensions = connection.extensions;
      this._connection.on("close", function(code, reason) {
        onClose.call(self2, code, reason);
      });
      this._connection.on("message", function(msg) {
        onMessage.call(self2, msg);
      });
      this.dispatchEvent(new yaeti.Event("open"));
    }
    function onConnectFailed() {
      destroy.call(this);
      this._readyState = CLOSED;
      try {
        this.dispatchEvent(new yaeti.Event("error"));
      } finally {
        this.dispatchEvent(createCloseEvent(1006, "connection failed"));
      }
    }
    function onClose(code, reason) {
      destroy.call(this);
      this._readyState = CLOSED;
      this.dispatchEvent(createCloseEvent(code, reason || ""));
    }
    function onMessage(message) {
      if (message.utf8Data) {
        this.dispatchEvent(createMessageEvent(message.utf8Data));
      } else if (message.binaryData) {
        if (this.binaryType === "arraybuffer") {
          var buffer = message.binaryData;
          var arraybuffer = new ArrayBuffer(buffer.length);
          var view = new Uint8Array(arraybuffer);
          for (var i = 0, len = buffer.length; i < len; ++i) {
            view[i] = buffer[i];
          }
          this.dispatchEvent(createMessageEvent(arraybuffer));
        }
      }
    }
    function destroy() {
      this._client.removeAllListeners();
      if (this._connection) {
        this._connection.removeAllListeners();
      }
    }
  }
});

// node_modules/websocket/lib/Deprecation.js
var require_Deprecation = __commonJS({
  "node_modules/websocket/lib/Deprecation.js"(exports, module2) {
    init_shims();
    var Deprecation = {
      disableWarnings: false,
      deprecationWarningMap: {},
      warn: function(deprecationName) {
        if (!this.disableWarnings && this.deprecationWarningMap[deprecationName]) {
          console.warn("DEPRECATION WARNING: " + this.deprecationWarningMap[deprecationName]);
          this.deprecationWarningMap[deprecationName] = false;
        }
      }
    };
    module2.exports = Deprecation;
  }
});

// node_modules/websocket/package.json
var require_package = __commonJS({
  "node_modules/websocket/package.json"(exports, module2) {
    module2.exports = {
      name: "websocket",
      description: "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
      keywords: [
        "websocket",
        "websockets",
        "socket",
        "networking",
        "comet",
        "push",
        "RFC-6455",
        "realtime",
        "server",
        "client"
      ],
      author: "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",
      contributors: [
        "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
      ],
      version: "1.0.34",
      repository: {
        type: "git",
        url: "https://github.com/theturtle32/WebSocket-Node.git"
      },
      homepage: "https://github.com/theturtle32/WebSocket-Node",
      engines: {
        node: ">=4.0.0"
      },
      dependencies: {
        bufferutil: "^4.0.1",
        debug: "^2.2.0",
        "es5-ext": "^0.10.50",
        "typedarray-to-buffer": "^3.1.5",
        "utf-8-validate": "^5.0.2",
        yaeti: "^0.0.6"
      },
      devDependencies: {
        "buffer-equal": "^1.0.0",
        gulp: "^4.0.2",
        "gulp-jshint": "^2.0.4",
        "jshint-stylish": "^2.2.1",
        jshint: "^2.0.0",
        tape: "^4.9.1"
      },
      config: {
        verbose: false
      },
      scripts: {
        test: "tape test/unit/*.js",
        gulp: "gulp"
      },
      main: "index",
      directories: {
        lib: "./lib"
      },
      browser: "lib/browser.js",
      license: "Apache-2.0"
    };
  }
});

// node_modules/websocket/lib/version.js
var require_version = __commonJS({
  "node_modules/websocket/lib/version.js"(exports, module2) {
    init_shims();
    module2.exports = require_package().version;
  }
});

// node_modules/websocket/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/websocket/lib/websocket.js"(exports, module2) {
    init_shims();
    module2.exports = {
      "server": require_WebSocketServer(),
      "client": require_WebSocketClient(),
      "router": require_WebSocketRouter(),
      "frame": require_WebSocketFrame(),
      "request": require_WebSocketRequest(),
      "connection": require_WebSocketConnection(),
      "w3cwebsocket": require_W3CWebSocket(),
      "deprecation": require_Deprecation(),
      "version": require_version()
    };
  }
});

// node_modules/websocket/index.js
var require_websocket2 = __commonJS({
  "node_modules/websocket/index.js"(exports, module2) {
    init_shims();
    module2.exports = require_websocket();
  }
});

// node_modules/@supabase/realtime-js/dist/main/lib/serializer.js
var require_serializer = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/lib/serializer.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Serializer = class {
      constructor() {
        this.HEADER_LENGTH = 1;
      }
      decode(rawPayload, callback) {
        if (rawPayload.constructor === ArrayBuffer) {
          return callback(this._binaryDecode(rawPayload));
        }
        if (typeof rawPayload === "string") {
          return callback(JSON.parse(rawPayload));
        }
        return callback({});
      }
      _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const decoder = new TextDecoder();
        return this._decodeBroadcast(buffer, view, decoder);
      }
      _decodeBroadcast(buffer, view, decoder) {
        const topicSize = view.getUint8(1);
        const eventSize = view.getUint8(2);
        let offset = this.HEADER_LENGTH + 2;
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const event = decoder.decode(buffer.slice(offset, offset + eventSize));
        offset = offset + eventSize;
        const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
        return { ref: null, topic, event, payload: data };
      }
    };
    exports.default = Serializer;
  }
});

// node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js
var require_RealtimeClient = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var timer_1 = __importDefault(require_timer());
    var RealtimeSubscription_1 = __importDefault(require_RealtimeSubscription());
    var websocket_1 = require_websocket2();
    var serializer_1 = __importDefault(require_serializer());
    var noop2 = () => {
    };
    var RealtimeClient = class {
      constructor(endPoint, options2) {
        this.channels = [];
        this.endPoint = "";
        this.headers = {};
        this.params = {};
        this.timeout = constants_1.DEFAULT_TIMEOUT;
        this.transport = websocket_1.w3cwebsocket;
        this.heartbeatIntervalMs = 3e4;
        this.longpollerTimeout = 2e4;
        this.heartbeatTimer = void 0;
        this.pendingHeartbeatRef = null;
        this.ref = 0;
        this.logger = noop2;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new serializer_1.default();
        this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: []
        };
        this.endPoint = `${endPoint}/${constants_1.TRANSPORTS.websocket}`;
        if (options2 === null || options2 === void 0 ? void 0 : options2.params)
          this.params = options2.params;
        if (options2 === null || options2 === void 0 ? void 0 : options2.headers)
          this.headers = options2.headers;
        if (options2 === null || options2 === void 0 ? void 0 : options2.timeout)
          this.timeout = options2.timeout;
        if (options2 === null || options2 === void 0 ? void 0 : options2.logger)
          this.logger = options2.logger;
        if (options2 === null || options2 === void 0 ? void 0 : options2.transport)
          this.transport = options2.transport;
        if (options2 === null || options2 === void 0 ? void 0 : options2.heartbeatIntervalMs)
          this.heartbeatIntervalMs = options2.heartbeatIntervalMs;
        if (options2 === null || options2 === void 0 ? void 0 : options2.longpollerTimeout)
          this.longpollerTimeout = options2.longpollerTimeout;
        this.reconnectAfterMs = (options2 === null || options2 === void 0 ? void 0 : options2.reconnectAfterMs) ? options2.reconnectAfterMs : (tries) => {
          return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
        };
        this.encode = (options2 === null || options2 === void 0 ? void 0 : options2.encode) ? options2.encode : (payload, callback) => {
          return callback(JSON.stringify(payload));
        };
        this.decode = (options2 === null || options2 === void 0 ? void 0 : options2.decode) ? options2.decode : this.serializer.decode.bind(this.serializer);
        this.reconnectTimer = new timer_1.default(() => __awaiter2(this, void 0, void 0, function* () {
          yield this.disconnect();
          this.connect();
        }), this.reconnectAfterMs);
      }
      connect() {
        if (this.conn) {
          return;
        }
        this.conn = new this.transport(this.endPointURL(), [], null, this.headers);
        if (this.conn) {
          this.conn.binaryType = "arraybuffer";
          this.conn.onopen = () => this._onConnOpen();
          this.conn.onerror = (error2) => this._onConnError(error2);
          this.conn.onmessage = (event) => this.onConnMessage(event);
          this.conn.onclose = (event) => this._onConnClose(event);
        }
      }
      disconnect(code, reason) {
        return new Promise((resolve2, _reject) => {
          try {
            if (this.conn) {
              this.conn.onclose = function() {
              };
              if (code) {
                this.conn.close(code, reason || "");
              } else {
                this.conn.close();
              }
              this.conn = null;
            }
            resolve2({ error: null, data: true });
          } catch (error2) {
            resolve2({ error: error2, data: false });
          }
        });
      }
      log(kind, msg, data) {
        this.logger(kind, msg, data);
      }
      onOpen(callback) {
        this.stateChangeCallbacks.open.push(callback);
      }
      onClose(callback) {
        this.stateChangeCallbacks.close.push(callback);
      }
      onError(callback) {
        this.stateChangeCallbacks.error.push(callback);
      }
      onMessage(callback) {
        this.stateChangeCallbacks.message.push(callback);
      }
      connectionState() {
        switch (this.conn && this.conn.readyState) {
          case constants_1.SOCKET_STATES.connecting:
            return "connecting";
          case constants_1.SOCKET_STATES.open:
            return "open";
          case constants_1.SOCKET_STATES.closing:
            return "closing";
          default:
            return "closed";
        }
      }
      isConnected() {
        return this.connectionState() === "open";
      }
      remove(channel) {
        this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
      }
      channel(topic, chanParams = {}) {
        let chan = new RealtimeSubscription_1.default(topic, chanParams, this);
        this.channels.push(chan);
        return chan;
      }
      push(data) {
        let { topic, event, payload, ref } = data;
        let callback = () => {
          this.encode(data, (result) => {
            var _a;
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
          });
        };
        this.log("push", `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
          callback();
        } else {
          this.sendBuffer.push(callback);
        }
      }
      onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
          let { topic, event, payload, ref } = msg;
          if (ref && ref === this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
          } else if (event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
            this._resetHeartbeat();
          }
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
          this.channels.filter((channel) => channel.isMember(topic)).forEach((channel) => channel.trigger(event, payload, ref));
          this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
        });
      }
      endPointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: constants_1.VSN }));
      }
      makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
          this.ref = 0;
        } else {
          this.ref = newRef;
        }
        return this.ref.toString();
      }
      _onConnOpen() {
        this.log("transport", `connected to ${this.endPointURL()}`);
        this._flushSendBuffer();
        this.reconnectTimer.reset();
        this._resetHeartbeat();
        this.stateChangeCallbacks.open.forEach((callback) => callback());
      }
      _onConnClose(event) {
        this.log("transport", "close", event);
        this._triggerChanError();
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.reconnectTimer.scheduleTimeout();
        this.stateChangeCallbacks.close.forEach((callback) => callback(event));
      }
      _onConnError(error2) {
        this.log("transport", error2.message);
        this._triggerChanError();
        this.stateChangeCallbacks.error.forEach((callback) => callback(error2));
      }
      _triggerChanError() {
        this.channels.forEach((channel) => channel.trigger(constants_1.CHANNEL_EVENTS.error));
      }
      _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
          return url;
        }
        const prefix = url.match(/\?/) ? "&" : "?";
        const query = new URLSearchParams(params);
        return `${url}${prefix}${query}`;
      }
      _flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
          this.sendBuffer.forEach((callback) => callback());
          this.sendBuffer = [];
        }
      }
      _resetHeartbeat() {
        this.pendingHeartbeatRef = null;
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
      }
      _sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
          return;
        }
        if (this.pendingHeartbeatRef) {
          this.pendingHeartbeatRef = null;
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
          (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(constants_1.WS_CLOSE_NORMAL, "hearbeat timeout");
          return;
        }
        this.pendingHeartbeatRef = this.makeRef();
        this.push({
          topic: "phoenix",
          event: "heartbeat",
          payload: {},
          ref: this.pendingHeartbeatRef
        });
      }
    };
    exports.default = RealtimeClient;
  }
});

// node_modules/@supabase/realtime-js/dist/main/index.js
var require_main3 = __commonJS({
  "node_modules/@supabase/realtime-js/dist/main/index.js"(exports) {
    init_shims();
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transformers = exports.RealtimeSubscription = exports.RealtimeClient = void 0;
    var Transformers = __importStar(require_transformers());
    exports.Transformers = Transformers;
    var RealtimeClient_1 = __importDefault(require_RealtimeClient());
    exports.RealtimeClient = RealtimeClient_1.default;
    var RealtimeSubscription_1 = __importDefault(require_RealtimeSubscription());
    exports.RealtimeSubscription = RealtimeSubscription_1.default;
  }
});

// node_modules/@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient.js
var require_SupabaseRealtimeClient = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseRealtimeClient = void 0;
    var realtime_js_1 = require_main3();
    var SupabaseRealtimeClient = class {
      constructor(socket, schema, tableName) {
        const topic = tableName === "*" ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
        this.subscription = socket.channel(topic);
      }
      getPayloadRecords(payload) {
        const records = {
          new: {},
          old: {}
        };
        if (payload.type === "INSERT" || payload.type === "UPDATE") {
          records.new = realtime_js_1.Transformers.convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === "UPDATE" || payload.type === "DELETE") {
          records.old = realtime_js_1.Transformers.convertChangeData(payload.columns, payload.old_record);
        }
        return records;
      }
      on(event, callback) {
        this.subscription.on(event, (payload) => {
          let enrichedPayload = {
            schema: payload.schema,
            table: payload.table,
            commit_timestamp: payload.commit_timestamp,
            eventType: payload.type,
            new: {},
            old: {}
          };
          enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
          callback(enrichedPayload);
        });
        return this;
      }
      subscribe(callback = () => {
      }) {
        this.subscription.onError((e) => callback("SUBSCRIPTION_ERROR", e));
        this.subscription.onClose(() => callback("CLOSED"));
        this.subscription.subscribe().receive("ok", () => callback("SUBSCRIBED")).receive("error", (e) => callback("SUBSCRIPTION_ERROR", e)).receive("timeout", () => callback("RETRYING_AFTER_TIMEOUT"));
        return this.subscription;
      }
    };
    exports.SupabaseRealtimeClient = SupabaseRealtimeClient;
  }
});

// node_modules/@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder.js
var require_SupabaseQueryBuilder = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseQueryBuilder = void 0;
    var postgrest_js_1 = require_main2();
    var SupabaseRealtimeClient_1 = require_SupabaseRealtimeClient();
    var SupabaseQueryBuilder = class extends postgrest_js_1.PostgrestQueryBuilder {
      constructor(url, { headers = {}, schema, realtime, table }) {
        super(url, { headers, schema });
        this._subscription = new SupabaseRealtimeClient_1.SupabaseRealtimeClient(realtime, schema, table);
        this._realtime = realtime;
      }
      on(event, callback) {
        if (!this._realtime.isConnected()) {
          this._realtime.connect();
        }
        return this._subscription.on(event, callback);
      }
    };
    exports.SupabaseQueryBuilder = SupabaseQueryBuilder;
  }
});

// node_modules/@supabase/storage-js/dist/main/lib/fetch.js
var require_fetch2 = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/lib/fetch.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.remove = exports.put = exports.post = exports.get = void 0;
    var cross_fetch_1 = __importDefault(require_node_ponyfill());
    var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    var handleError = (error2, reject) => {
      if (typeof error2.json !== "function") {
        return reject(error2);
      }
      error2.json().then((err) => {
        return reject({
          message: _getErrorMessage(err),
          status: (error2 === null || error2 === void 0 ? void 0 : error2.status) || 500
        });
      });
    };
    var _getRequestParams = (method, options2, parameters, body) => {
      const params = { method, headers: (options2 === null || options2 === void 0 ? void 0 : options2.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "application/json" }, options2 === null || options2 === void 0 ? void 0 : options2.headers);
      params.body = JSON.stringify(body);
      return Object.assign(Object.assign({}, params), parameters);
    };
    function _handleRequest(method, url, options2, parameters, body) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve2, reject) => {
          cross_fetch_1.default(url, _getRequestParams(method, options2, parameters, body)).then((result) => {
            if (!result.ok)
              throw result;
            if (options2 === null || options2 === void 0 ? void 0 : options2.noResolveJson)
              return resolve2(result);
            return result.json();
          }).then((data) => resolve2(data)).catch((error2) => handleError(error2, reject));
        });
      });
    }
    function get2(url, options2, parameters) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("GET", url, options2, parameters);
      });
    }
    exports.get = get2;
    function post(url, body, options2, parameters) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("POST", url, options2, parameters, body);
      });
    }
    exports.post = post;
    function put(url, body, options2, parameters) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("PUT", url, options2, parameters, body);
      });
    }
    exports.put = put;
    function remove(url, body, options2, parameters) {
      return __awaiter2(this, void 0, void 0, function* () {
        return _handleRequest("DELETE", url, options2, parameters, body);
      });
    }
    exports.remove = remove;
  }
});

// node_modules/@supabase/storage-js/dist/main/lib/StorageBucketApi.js
var require_StorageBucketApi = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/lib/StorageBucketApi.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageBucketApi = void 0;
    var fetch_1 = require_fetch2();
    var StorageBucketApi = class {
      constructor(url, headers = {}) {
        this.url = url;
        this.headers = headers;
      }
      listBuckets() {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.get(`${this.url}/bucket`, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      getBucket(id) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.get(`${this.url}/bucket/${id}`, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      createBucket(id, options2 = { public: false }) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.post(`${this.url}/bucket`, { id, name: id, public: options2.public }, { headers: this.headers });
            return { data: data.name, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      updateBucket(id, options2) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.put(`${this.url}/bucket/${id}`, { id, name: id, public: options2.public }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      emptyBucket(id) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.post(`${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      deleteBucket(id) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.remove(`${this.url}/bucket/${id}`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
    };
    exports.StorageBucketApi = StorageBucketApi;
  }
});

// node_modules/@supabase/storage-js/dist/main/lib/StorageFileApi.js
var require_StorageFileApi = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/lib/StorageFileApi.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageFileApi = void 0;
    var fetch_1 = require_fetch2();
    var cross_fetch_1 = __importDefault(require_node_ponyfill());
    var DEFAULT_SEARCH_OPTIONS = {
      limit: 100,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc"
      }
    };
    var DEFAULT_FILE_OPTIONS = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: false
    };
    var StorageFileApi = class {
      constructor(url, headers = {}, bucketId) {
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
      }
      uploadOrUpdate(method, path, fileBody, fileOptions) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let body;
            const options2 = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
            const headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options2.upsert) });
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options2.cacheControl);
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options2.cacheControl);
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options2.cacheControl}`;
              headers["content-type"] = options2.contentType;
            }
            const _path = this._getFinalPath(path);
            const res = yield cross_fetch_1.default(`${this.url}/object/${_path}`, {
              method,
              body,
              headers
            });
            if (res.ok) {
              return { data: { Key: _path }, error: null };
            } else {
              const error2 = yield res.json();
              return { data: null, error: error2 };
            }
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      upload(path, fileBody, fileOptions) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
        });
      }
      update(path, fileBody, fileOptions) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
        });
      }
      move(fromPath, toPath) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.post(`${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      createSignedUrl(path, expiresIn) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const _path = this._getFinalPath(path);
            let data = yield fetch_1.post(`${this.url}/object/sign/${_path}`, { expiresIn }, { headers: this.headers });
            const signedURL = `${this.url}${data.signedURL}`;
            data = { signedURL };
            return { data, error: null, signedURL };
          } catch (error2) {
            return { data: null, error: error2, signedURL: null };
          }
        });
      }
      download(path) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const _path = this._getFinalPath(path);
            const res = yield fetch_1.get(`${this.url}/object/${_path}`, {
              headers: this.headers,
              noResolveJson: true
            });
            const data = yield res.blob();
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      getPublicUrl(path) {
        try {
          const _path = this._getFinalPath(path);
          const publicURL = `${this.url}/object/public/${_path}`;
          const data = { publicURL };
          return { data, error: null, publicURL };
        } catch (error2) {
          return { data: null, error: error2, publicURL: null };
        }
      }
      remove(paths) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield fetch_1.remove(`${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      list(path, options2, parameters) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options2), { prefix: path || "" });
            const data = yield fetch_1.post(`${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error2) {
            return { data: null, error: error2 };
          }
        });
      }
      _getFinalPath(path) {
        return `${this.bucketId}/${path}`;
      }
    };
    exports.StorageFileApi = StorageFileApi;
  }
});

// node_modules/@supabase/storage-js/dist/main/lib/types.js
var require_types3 = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/lib/types.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@supabase/storage-js/dist/main/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/lib/index.js"(exports) {
    init_shims();
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_StorageBucketApi(), exports);
    __exportStar(require_StorageFileApi(), exports);
    __exportStar(require_types3(), exports);
  }
});

// node_modules/@supabase/storage-js/dist/main/SupabaseStorageClient.js
var require_SupabaseStorageClient = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/SupabaseStorageClient.js"(exports) {
    init_shims();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseStorageClient = void 0;
    var lib_1 = require_lib2();
    var SupabaseStorageClient = class extends lib_1.StorageBucketApi {
      constructor(url, headers = {}) {
        super(url, headers);
      }
      from(id) {
        return new lib_1.StorageFileApi(this.url, this.headers, id);
      }
    };
    exports.SupabaseStorageClient = SupabaseStorageClient;
  }
});

// node_modules/@supabase/storage-js/dist/main/index.js
var require_main4 = __commonJS({
  "node_modules/@supabase/storage-js/dist/main/index.js"(exports) {
    init_shims();
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseStorageClient = void 0;
    var SupabaseStorageClient_1 = require_SupabaseStorageClient();
    Object.defineProperty(exports, "SupabaseStorageClient", { enumerable: true, get: function() {
      return SupabaseStorageClient_1.SupabaseStorageClient;
    } });
    __exportStar(require_types3(), exports);
  }
});

// node_modules/@supabase/supabase-js/dist/main/SupabaseClient.js
var require_SupabaseClient = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/SupabaseClient.js"(exports) {
    init_shims();
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require_constants();
    var SupabaseAuthClient_1 = require_SupabaseAuthClient();
    var SupabaseQueryBuilder_1 = require_SupabaseQueryBuilder();
    var storage_js_1 = require_main4();
    var postgrest_js_1 = require_main2();
    var realtime_js_1 = require_main3();
    var DEFAULT_OPTIONS = {
      schema: "public",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      localStorage: globalThis.localStorage,
      headers: constants_1.DEFAULT_HEADERS
    };
    var SupabaseClient = class {
      constructor(supabaseUrl2, supabaseKey, options2) {
        this.supabaseUrl = supabaseUrl2;
        this.supabaseKey = supabaseKey;
        if (!supabaseUrl2)
          throw new Error("supabaseUrl is required.");
        if (!supabaseKey)
          throw new Error("supabaseKey is required.");
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options2);
        this.restUrl = `${supabaseUrl2}/rest/v1`;
        this.realtimeUrl = `${supabaseUrl2}/realtime/v1`.replace("http", "ws");
        this.authUrl = `${supabaseUrl2}/auth/v1`;
        this.storageUrl = `${supabaseUrl2}/storage/v1`;
        this.schema = settings.schema;
        this.auth = this._initSupabaseAuthClient(settings);
        this.realtime = this._initRealtimeClient(settings.realtime);
      }
      get storage() {
        return new storage_js_1.SupabaseStorageClient(this.storageUrl, this._getAuthHeaders());
      }
      from(table) {
        const url = `${this.restUrl}/${table}`;
        return new SupabaseQueryBuilder_1.SupabaseQueryBuilder(url, {
          headers: this._getAuthHeaders(),
          schema: this.schema,
          realtime: this.realtime,
          table
        });
      }
      rpc(fn, params) {
        const rest = this._initPostgRESTClient();
        return rest.rpc(fn, params);
      }
      removeSubscription(subscription) {
        return new Promise((resolve2) => __awaiter2(this, void 0, void 0, function* () {
          try {
            yield this._closeSubscription(subscription);
            const openSubscriptions = this.getSubscriptions().length;
            if (!openSubscriptions) {
              const { error: error2 } = yield this.realtime.disconnect();
              if (error2)
                return resolve2({ error: error2 });
            }
            return resolve2({ error: null, data: { openSubscriptions } });
          } catch (error2) {
            return resolve2({ error: error2 });
          }
        }));
      }
      _closeSubscription(subscription) {
        return __awaiter2(this, void 0, void 0, function* () {
          if (!subscription.isClosed()) {
            yield this._closeChannel(subscription);
          }
        });
      }
      getSubscriptions() {
        return this.realtime.channels;
      }
      _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage: localStorage2 }) {
        return new SupabaseAuthClient_1.SupabaseAuthClient({
          url: this.authUrl,
          headers: {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: `${this.supabaseKey}`
          },
          autoRefreshToken,
          persistSession,
          detectSessionInUrl,
          localStorage: localStorage2
        });
      }
      _initRealtimeClient(options2) {
        return new realtime_js_1.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options2), { params: Object.assign(Object.assign({}, options2 === null || options2 === void 0 ? void 0 : options2.params), { apikey: this.supabaseKey }) }));
      }
      _initPostgRESTClient() {
        return new postgrest_js_1.PostgrestClient(this.restUrl, {
          headers: this._getAuthHeaders(),
          schema: this.schema
        });
      }
      _getAuthHeaders() {
        var _a, _b;
        const headers = {};
        const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
        headers["apikey"] = this.supabaseKey;
        headers["Authorization"] = `Bearer ${authBearer}`;
        return headers;
      }
      _closeChannel(subscription) {
        return new Promise((resolve2, reject) => {
          subscription.unsubscribe().receive("ok", () => {
            this.realtime.remove(subscription);
            return resolve2(true);
          }).receive("error", (e) => reject(e));
        });
      }
    };
    exports.default = SupabaseClient;
  }
});

// node_modules/@supabase/supabase-js/dist/main/index.js
var require_main5 = __commonJS({
  "node_modules/@supabase/supabase-js/dist/main/index.js"(exports) {
    init_shims();
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupabaseClient = exports.createClient = void 0;
    var SupabaseClient_1 = __importDefault(require_SupabaseClient());
    exports.SupabaseClient = SupabaseClient_1.default;
    __exportStar(require_main(), exports);
    __exportStar(require_main3(), exports);
    var createClient2 = (supabaseUrl2, supabaseKey, options2) => {
      return new SupabaseClient_1.default(supabaseUrl2, supabaseKey, options2);
    };
    exports.createClient = createClient2;
  }
});

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});
init_shims();

// .svelte-kit/output/server/app.js
init_shims();
var import_process = __toModule(require("process"));
var import_path = __toModule(require("path"));
var import_util2 = __toModule(require("util"));
var import_fs = __toModule(require("fs"));
var import_supabase_js = __toModule(require_main5());
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
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
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
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue$1.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop$1;
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
  return { set, update, subscribe: subscribe2 };
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
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
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
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
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
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
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
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
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
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
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
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
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
          const search2 = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search2)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
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
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
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
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
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
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
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
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function resolve_option(opt, ctx) {
  if (typeof opt === "function") {
    return await opt(ctx);
  }
  return opt;
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
      context: loaded ? loaded.context : {},
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  const leaf_promise = async () => branch[branch.length - 1].node.module;
  const page_config = {
    ssr: await resolve_option(options2.ssr, { request, page: leaf_promise }),
    router: await resolve_option(options2.router, { request, page: leaf_promise }),
    hydrate: await resolve_option(options2.hydrate, { request, page: leaf_promise }),
    prerender: await resolve_option(options2.prerender, { request, page: leaf_promise })
  };
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
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
  const leaf_promise = options2.load_component(route.a[route.a.length - 1]).then((c) => c.module);
  const page_config = {
    ssr: await resolve_option(options2.ssr, { request, page: leaf_promise }),
    router: await resolve_option(options2.router, { request, page: leaf_promise }),
    hydrate: await resolve_option(options2.hydrate, { request, page: leaf_promise }),
    prerender: await resolve_option(options2.prerender, { request, page: leaf_promise })
  };
  if (state.prerender && !state.prerender.all && !page_config.prerender) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch;
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let nodes;
      try {
        nodes = await Promise.all(route.a.map((id) => options2.load_component(id)));
      } catch (err) {
        const error3 = coalesce_to_error(err);
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
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node,
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
            } else {
              branch.push(loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
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
                } catch (err) {
                  const e = coalesce_to_error(err);
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
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
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
  } catch (err) {
    const error3 = coalesce_to_error(err);
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
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
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
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return error$1("no handler");
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error$1("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return error$1("no response");
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
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
  if (typeof raw === "string") {
    const [type, ...directives] = headers["content-type"].split(/;\s*/);
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
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
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
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
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
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true, prerender: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
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
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
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
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
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
Promise.resolve();
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
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function afterUpdate() {
}
var css$l = {
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
  $$result.css.add(css$l);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\r\n<html lang="en">\r\n	<head>\r\n		<meta charset="utf-8" />\r\n		<link rel="icon" href="/favicon.png" />\r\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\r\n		<link rel="manifest" href="/manifest.json" />\r\n		<title>IFB Tools</title>\r\n		' + head + '\r\n	</head>\r\n	<body>\r\n		<div id="svelte">' + body + "</div>\r\n	</body>\r\n</html>\r\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-7cbf9e47.js",
      css: ["/./_app/assets/start-0826e215.css", "/./_app/assets/vendor-ef494e76.css"],
      js: ["/./_app/start-7cbf9e47.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/preload-helper-08cc8e69.js", "/./_app/chunks/singletons-12a22614.js"]
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
    hydrate: async ({ page: page2 }) => {
      const leaf = await page2;
      return "hydrate" in leaf ? !!leaf.hydrate : true;
    },
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: async ({ page: page2 }) => !!(await page2).prerender,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: async ({ page: page2 }) => {
      const leaf = await page2;
      return "router" in leaf ? !!leaf.router : true;
    },
    ssr: async ({ page: page2 }) => {
      const leaf = await page2;
      return "ssr" in leaf ? !!leaf.ssr : true;
    },
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "manifest.json", "size": 181, "type": "application/json" }],
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
      params: (m) => ({ path: d(m[1]) }),
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
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/sermons/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bible\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/bible/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bible\/search\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/bible/search.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bible\/([^/]+?)\/([^/]+?)\/?$/,
      params: (m) => ({ book: d(m[1]), chapter: d(m[2]) }),
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
      pattern: /^\/api\/bible\/search\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json$1;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/bible\/([^/]+?)\/([^/]+?)\.json$/,
      params: (m) => ({ book: d(m[1]), chapter: d(m[2]) }),
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
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
    return index$2;
  }),
  "src/routes/latest-routes/[path].svelte": () => Promise.resolve().then(function() {
    return _path_;
  }),
  "src/routes/sermons/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/sermons/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  }),
  "src/routes/bible/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/bible/search.svelte": () => Promise.resolve().then(function() {
    return search;
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
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-9f3b0b61.js", "css": ["/./_app/assets/pages/__layout.svelte-4a043d86.css", "/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/__layout.svelte-9f3b0b61.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/Nav-c699035a.js", "/./_app/chunks/db-f571e5c3.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/stores-e7b3f49c.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/NavLink-86930ec1.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-0be1a123.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/error.svelte-0be1a123.js", "/./_app/chunks/vendor-525ea8b3.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-d7869d55.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/index.svelte-d7869d55.js", "/./_app/chunks/vendor-525ea8b3.js"], "styles": [] }, "src/routes/latest-routes/[path].svelte": { "entry": "/./_app/pages/latest-routes/[path].svelte-39e830f6.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/latest-routes/[path].svelte-39e830f6.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/sermons/index.svelte": { "entry": "/./_app/pages/sermons/index.svelte-7cce95e1.js", "css": ["/./_app/assets/vendor-ef494e76.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/sermons/index.svelte-7cce95e1.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/FormField-d772576c.js", "/./_app/chunks/Nav-c699035a.js", "/./_app/chunks/Jumbotron-ccdb5ad5.js", "/./_app/chunks/Modal-8e9c75ad.js", "/./_app/chunks/db-f571e5c3.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/Loader-18a9586e.js"], "styles": [] }, "src/routes/sermons/[id].svelte": { "entry": "/./_app/pages/sermons/[id].svelte-b986acff.js", "css": ["/./_app/assets/pages/sermons/[id].svelte-912a1a5f.css", "/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/sermons/[id].svelte-b986acff.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/Nav-c699035a.js", "/./_app/chunks/NavLink-86930ec1.js", "/./_app/chunks/NavButton-e1b91fa7.js", "/./_app/chunks/Jumbotron-ccdb5ad5.js", "/./_app/chunks/stores-e7b3f49c.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/Loader-18a9586e.js", "/./_app/chunks/preload-helper-08cc8e69.js"], "styles": [] }, "src/routes/bible/index.svelte": { "entry": "/./_app/pages/bible/index.svelte-894be551.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/bible/index.svelte-894be551.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/bible/search.svelte": { "entry": "/./_app/pages/bible/search.svelte-453776c4.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/bible/search.svelte-453776c4.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/Verse-4c954232.js", "/./_app/chunks/NavButton-e1b91fa7.js", "/./_app/chunks/Nav-c699035a.js", "/./_app/chunks/Modal-8e9c75ad.js", "/./_app/chunks/NavLink-86930ec1.js", "/./_app/chunks/Jumbotron-ccdb5ad5.js"], "styles": [] }, "src/routes/bible/[book]/[chapter].svelte": { "entry": "/./_app/pages/bible/[book]/[chapter].svelte-f6e2f6d2.js", "css": ["/./_app/assets/vendor-ef494e76.css"], "js": ["/./_app/pages/bible/[book]/[chapter].svelte-f6e2f6d2.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/Verse-4c954232.js", "/./_app/chunks/NavButton-e1b91fa7.js", "/./_app/chunks/Nav-c699035a.js", "/./_app/chunks/Modal-8e9c75ad.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/NavLink-86930ec1.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/db-f571e5c3.js"], "styles": [] }, "src/routes/auth/sign-in.svelte": { "entry": "/./_app/pages/auth/sign-in.svelte-b66d0b02.js", "css": ["/./_app/assets/vendor-ef494e76.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/auth/sign-in.svelte-b66d0b02.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/db-f571e5c3.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/FormField-d772576c.js"], "styles": [] }, "src/routes/auth/sign-up.svelte": { "entry": "/./_app/pages/auth/sign-up.svelte-774a3741.js", "css": ["/./_app/assets/vendor-ef494e76.css", "/./_app/assets/FormField-c89e6189.css"], "js": ["/./_app/pages/auth/sign-up.svelte-774a3741.js", "/./_app/chunks/vendor-525ea8b3.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js", "/./_app/chunks/db-f571e5c3.js", "/./_app/chunks/supabase-0bc8b715.js", "/./_app/chunks/FormField-d772576c.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function* search$1(verses, options2) {
  options2.text = options2.text.split(" ").filter((i) => i).join(" ");
  for (let verse of verses) {
    if (!options2.exactMatch && !options2.wholeWordsOnly) {
      const verseText = verse.text.toLowerCase();
      const searchWords = options2.text.toLowerCase().split(" ");
      let highlightedText = verse.text;
      let good = true;
      for (let word of searchWords) {
        if (!verseText.includes(word)) {
          good = false;
          break;
        } else {
          highlightedText = highlightedText.replace(new RegExp(`(?<![</])(${escapeRegExp(word)})`, "ig"), '<span class="font-bold">$1</span>');
        }
      }
      if (good) {
        yield { verse, highlightedText };
      }
    } else if (!options2.exactMatch && options2.wholeWordsOnly) {
      const verseText = verse.text.toLowerCase();
      const searchWords = options2.text.toLowerCase().split(" ");
      let highlightedText = verse.text;
      let good = true;
      for (let word of searchWords) {
        if (!verseText.replace(/[,.:;]/g, "").match(new RegExp(`\\b${escapeRegExp(word)}\\b`)) && !verseText.match(new RegExp(`\\b${escapeRegExp(word)}\\b`))) {
          good = false;
          break;
        } else {
          highlightedText = highlightedText.replace(new RegExp(`(?<![</])(\\b[,.:; ]*${escapeRegExp(word)}[,.:; ]*\\b)`, "ig"), '<span class="font-bold">$1</span>');
        }
      }
      if (good) {
        yield { verse, highlightedText };
      }
    } else if (options2.exactMatch && !options2.wholeWordsOnly) {
      if (verse.text.toLowerCase().includes(options2.text.toLowerCase()) || verse.text.toLowerCase().replace(/[,.:;]/g, "").includes(options2.text.toLowerCase())) {
        yield {
          verse,
          highlightedText: verse.text.replace(new RegExp(`(${options2.text.split(" ").map((item) => `[,.:; ]+${escapeRegExp(item)}`).join("")})`, "ig"), '<span class="font-bold">$1</span>')
        };
      }
    } else if (options2.exactMatch && options2.wholeWordsOnly) {
      const verseText = verse.text.toLowerCase();
      const searchText = options2.text.toLowerCase();
      if (verseText.match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`)) || verseText.replace(/[,.;:]/g, "").match(new RegExp(`\\b${escapeRegExp(searchText)}\\b`))) {
        yield {
          verse,
          highlightedText: verse.text.replace(new RegExp(`(\\b[,.:; ]*${options2.text.split(" ").map((item) => `[,.:; ]+${escapeRegExp(item)}`).join("")}[,.:; ]*\\b)`, "ig"), '<span class="font-bold">$1</span>')
        };
      }
    }
  }
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
var readFilePromise = (0, import_util2.promisify)(import_fs.readFile);
async function getBookJSON(book) {
  if (!bookNames.includes(book)) {
    throw new Error(`getBookJSON("${book}") is invalid because ${book} is not a valid Bible book name`);
  }
  try {
    let _book = book.replace("songofsolomon", "SongofSolomon").replace(/^[0-9]?[a-z]/, (m) => m.toUpperCase());
    const bookJSON = JSON.parse(await readFilePromise((0, import_path.join)((0, import_process.cwd)(), "src/data/raw-bible/", `${_book}.json`), "utf8"));
    return {
      ...bookJSON,
      book,
      chapters: bookJSON.chapters.map((chapter) => ({
        ...chapter,
        book,
        chapter: +chapter.chapter,
        verses: chapter.verses.map((verse) => ({
          ...verse,
          verse: +verse.verse,
          chapter: +chapter.chapter,
          book
        }))
      }))
    };
  } catch (e) {
    throw new Error("Invalid Book Name");
  }
}
async function get$1({ params, query }) {
  const text = query.get("text") || "";
  console.log(text);
  let exactMatch;
  let wholeWordsOnly;
  try {
    exactMatch = !!JSON.parse(query.get("exactMatch") || "false");
    wholeWordsOnly = !!JSON.parse(query.get("wholeWordsOnly") || "false");
  } catch (e) {
    exactMatch = exactMatch || false;
    wholeWordsOnly = wholeWordsOnly || false;
  }
  console.log({ exactMatch, wholeWordsOnly });
  const results = (await Promise.all(bookNames.flatMap(async (bookName) => (await getBookJSON(bookName)).chapters.map((chapter) => {
    return [...search$1(chapter.verses, { text, exactMatch, wholeWordsOnly })];
  })))).flat(3);
  return {
    body: { results }
  };
}
var index_json$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
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
    return { ...chapterJSON, next: nextChapterJSON, previous: previousChapterJSON };
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
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
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
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
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
var supabaseUrl = "https://wmyoxynhsoadkiflpshe.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTE0NzA4MCwiZXhwIjoxOTQwNzIzMDgwfQ.1_nlrnWP5YMpUDXqM5Emp4nL4L_so6f_I41q-fXlk3M";
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseAnonKey);
function createAuthStore() {
  const { subscribe: subscribe2, set, update } = writable(supabase.auth.user());
  return {
    subscribe: subscribe2,
    set,
    update,
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
var NavLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href } = $$props;
  let { active = false } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  return `<a${add_attribute("href", href, 0)} class="${[
    "p-4 cursor-pointer active:bg-blue-100 active:text-black duration-200 flex items-center",
    (active ? "bg-blue-100" : "") + " " + (active ? "text-black" : "")
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</a>`;
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pageType;
  let $page, $$unsubscribe_page;
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let links;
  const { page: page2 } = getStores();
  $$unsubscribe_page = subscribe(page2, (value) => $page = value);
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
  pageType = $page.path.split("/")[1];
  $$unsubscribe_page();
  $$unsubscribe_authStore();
  return `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
    default: () => `${validate_component(NavLinks, "NavLinks").$$render($$result, { links }, {}, {})}`
  })}

<main class="${"pt-16 pb-16 h-[100vh] flex flex-col"}">${slots.default ? slots.default({}) : ``}</main>

${validate_component(Nav, "Nav").$$render($$result, { posClasses: "bottom-0" }, {}, {
    default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {
      href: "/latest-routes/sermons",
      active: pageType === "sermons"
    }, {}, {
      default: () => `${validate_component(Pencil, "Pencil").$$render($$result, { class: "h-8" }, {}, {})}`
    })}

	${validate_component(NavLink, "NavLink").$$render($$result, {
      href: "/latest-routes/bible",
      active: pageType === "bible"
    }, {}, {
      default: () => `${validate_component(Book, "Book").$$render($$result, { class: "h-8" }, {}, {})}`
    })}

	${validate_component(NavLink, "NavLink").$$render($$result, {
      href: "/latest-routes/soulwinning",
      active: pageType === "soulwinning"
    }, {}, {
      default: () => `${validate_component(MapMarker, "MapMarker").$$render($$result, { class: "h-8" }, {}, {})}`
    })}

	${validate_component(NavLink, "NavLink").$$render($$result, {
      href: "/latest-routes/memory",
      active: pageType === "memory"
    }, {}, {
      default: () => `${validate_component(Brain, "Brain").$$render($$result, { class: "h-8" }, {}, {})}`
    })}`
  })}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load$3({ error: error2, status }) {
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
  load: load$3
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>Welcome to SvelteKit</h1>

<p>Visit kit.svelte.dev to read the documentation</p>`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
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
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$2({ page: page2, fetch: fetch2, session, context }) {
  return __awaiter$2(this, void 0, void 0, function* () {
    if (["bible", "sermons", "memory", "soulwinning"].includes(page2.params.path)) {
      return { props: { path: page2.params.path } };
    } else {
      return;
    }
  });
}
var U5Bpathu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  return ``;
});
var _path_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bpathu5D,
  load: load$2
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
var css$k = {
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
  $$result.css.add(css$k);
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
var css$j = {
  code: ".circle.svelte-1s8gy0q{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-1s8gy0q-rotate;animation:var(--duration) linear 0s infinite normal none running svelte-1s8gy0q-rotate;border:calc(var(--size)/15) solid var(--color);-o-border-image:initial;border-image:initial;border-radius:50%;border-right:calc(var(--size)/15) solid transparent;height:var(--size);width:var(--size)}@-webkit-keyframes svelte-1s8gy0q-rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes svelte-1s8gy0q-rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Circle.svelte","sources":["Circle.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"0.75s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.circle{-webkit-animation:var(--duration) linear 0s infinite normal none running rotate;animation:var(--duration) linear 0s infinite normal none running rotate;border:calc(var(--size)/15) solid var(--color);-o-border-image:initial;border-image:initial;border-radius:50%;border-right:calc(var(--size)/15) solid transparent;height:var(--size);width:var(--size)}@-webkit-keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"circle\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\" />\\r\\n"],"names":[],"mappings":"AAOO,sBAAO,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAM,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAM,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,gBAAgB,OAAO,CAAC,aAAa,OAAO,CAAC,cAAc,GAAG,CAAC,aAAa,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,KAAK,CAAC,WAAW,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,qBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$j);
  return `<div class="${"circle svelte-1s8gy0q"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}"></div>`;
});
var css$i = {
  code: '.circle.svelte-ojx2e9{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationOuter) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationOuter) linear infinite;border:3px solid transparent;border-radius:50%;border-top:3px solid var(--colorOuter);box-sizing:border-box;height:var(--size);position:relative;width:var(--size)}.circle.svelte-ojx2e9:after,.circle.svelte-ojx2e9:before{border:3px solid transparent;border-radius:50%;box-sizing:border-box;content:"";position:absolute}.circle.svelte-ojx2e9:after{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationInner) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationInner) linear infinite;border-top-color:var(--colorInner);bottom:9px;left:9px;right:9px;top:9px}.circle.svelte-ojx2e9:before{-webkit-animation:svelte-ojx2e9-circleSpin var(--durationCenter) linear infinite;animation:svelte-ojx2e9-circleSpin var(--durationCenter) linear infinite;border-top-color:var(--colorCenter);bottom:3px;left:3px;right:3px;top:3px}@-webkit-keyframes svelte-ojx2e9-circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes svelte-ojx2e9-circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}',
  map: '{"version":3,"file":"Circle2.svelte","sources":["Circle2.svelte"],"sourcesContent":["<script>export let size = \\"60\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let colorOuter = \\"#FF3E00\\";\\r\\nexport let colorCenter = \\"#40B3FF\\";\\r\\nexport let colorInner = \\"#676778\\";\\r\\nexport let durationMultiplier = 1;\\r\\nexport let durationOuter = `${durationMultiplier * 2}s`;\\r\\nexport let durationInner = `${durationMultiplier * 1.5}s`;\\r\\nexport let durationCenter = `${durationMultiplier * 3}s`;\\r\\n<\/script>\\r\\n\\r\\n<style>.circle{-webkit-animation:circleSpin var(--durationOuter) linear infinite;animation:circleSpin var(--durationOuter) linear infinite;border:3px solid transparent;border-radius:50%;border-top:3px solid var(--colorOuter);box-sizing:border-box;height:var(--size);position:relative;width:var(--size)}.circle:after,.circle:before{border:3px solid transparent;border-radius:50%;box-sizing:border-box;content:\\"\\";position:absolute}.circle:after{-webkit-animation:circleSpin var(--durationInner) linear infinite;animation:circleSpin var(--durationInner) linear infinite;border-top-color:var(--colorInner);bottom:9px;left:9px;right:9px;top:9px}.circle:before{-webkit-animation:circleSpin var(--durationCenter) linear infinite;animation:circleSpin var(--durationCenter) linear infinite;border-top-color:var(--colorCenter);bottom:3px;left:3px;right:3px;top:3px}@-webkit-keyframes circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes circleSpin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"circle\\"\\r\\n  style=\\"--size: {size}{unit}; --colorInner: {colorInner}; --colorCenter: {colorCenter}; --colorOuter: {colorOuter}; --durationInner: {durationInner}; --durationCenter: {durationCenter}; --durationOuter: {durationOuter};\\" />\\r\\n"],"names":[],"mappings":"AAWO,qBAAO,CAAC,kBAAkB,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,WAAW,CAAC,cAAc,GAAG,CAAC,WAAW,GAAG,CAAC,KAAK,CAAC,IAAI,YAAY,CAAC,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,MAAM,CAAC,qBAAO,OAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,WAAW,CAAC,cAAc,GAAG,CAAC,WAAW,UAAU,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,qBAAO,MAAM,CAAC,kBAAkB,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,eAAe,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,YAAY,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,GAAG,CAAC,MAAM,GAAG,CAAC,IAAI,GAAG,CAAC,qBAAO,OAAO,CAAC,kBAAkB,wBAAU,CAAC,IAAI,gBAAgB,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,wBAAU,CAAC,IAAI,gBAAgB,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,aAAa,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,GAAG,CAAC,MAAM,GAAG,CAAC,IAAI,GAAG,CAAC,mBAAmB,wBAAU,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,wBAAU,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$i);
  return `<div class="${"circle svelte-ojx2e9"}" style="${"--size: " + escape(size) + escape(unit) + "; --colorInner: " + escape(colorInner) + "; --colorCenter: " + escape(colorCenter) + "; --colorOuter: " + escape(colorOuter) + "; --durationInner: " + escape(durationInner) + "; --durationCenter: " + escape(durationCenter) + "; --durationOuter: " + escape(durationOuter) + ";"}"></div>`;
});
var css$h = {
  code: ".wrapper.svelte-daksnk{align-items:center;box-sizing:border-box;display:flex;height:var(--size);justify-content:center;line-height:0;width:var(--size)}.inner.svelte-daksnk{transform:scale(calc(var(--floatSize)/52))}.ball-container.svelte-daksnk{-webkit-animation:svelte-daksnk-ballTwo var(--duration) infinite;animation:svelte-daksnk-ballTwo var(--duration) infinite;flex-shrink:0;height:44px;position:relative;width:44px}.single-ball.svelte-daksnk{height:44px;position:absolute;width:44px}.ball.svelte-daksnk{-webkit-animation:svelte-daksnk-ballOne var(--duration) infinite ease;animation:svelte-daksnk-ballOne var(--duration) infinite ease;border-radius:50%;height:20px;position:absolute;width:20px}.ball-top-left.svelte-daksnk{background-color:var(--ballTopLeftColor);left:0;top:0}.ball-top-right.svelte-daksnk{background-color:var(--ballTopRightColor);left:24px;top:0}.ball-bottom-left.svelte-daksnk{background-color:var(--ballBottomLeftColor);left:0;top:24px}.ball-bottom-right.svelte-daksnk{background-color:var(--ballBottomRightColor);left:24px;top:24px}@-webkit-keyframes svelte-daksnk-ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@keyframes svelte-daksnk-ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@-webkit-keyframes svelte-daksnk-ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}@keyframes svelte-daksnk-ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}",
  map: '{"version":3,"file":"Circle3.svelte","sources":["Circle3.svelte"],"sourcesContent":["<script>export let size = \\"60\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let ballTopLeft = \\"#FF3E00\\";\\r\\nexport let ballTopRight = \\"#F8B334\\";\\r\\nexport let ballBottomLeft = \\"#40B3FF\\";\\r\\nexport let ballBottomRight = \\"#676778\\";\\r\\nexport let duration = \\"1.5s\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;box-sizing:border-box;display:flex;height:var(--size);justify-content:center;line-height:0;width:var(--size)}.inner{transform:scale(calc(var(--floatSize)/52))}.ball-container{-webkit-animation:ballTwo var(--duration) infinite;animation:ballTwo var(--duration) infinite;flex-shrink:0;height:44px;position:relative;width:44px}.single-ball{height:44px;position:absolute;width:44px}.ball{-webkit-animation:ballOne var(--duration) infinite ease;animation:ballOne var(--duration) infinite ease;border-radius:50%;height:20px;position:absolute;width:20px}.ball-top-left{background-color:var(--ballTopLeftColor);left:0;top:0}.ball-top-right{background-color:var(--ballTopRightColor);left:24px;top:0}.ball-bottom-left{background-color:var(--ballBottomLeftColor);left:0;top:24px}.ball-bottom-right{background-color:var(--ballBottomRightColor);left:24px;top:24px}@-webkit-keyframes ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@keyframes ballOne{0%{position:absolute}50%{left:12px;opacity:.5;position:absolute;top:12px}to{position:absolute}}@-webkit-keyframes ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}@keyframes ballTwo{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(1turn) scale(1.3)}to{transform:rotate(2turn) scale(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --floatSize: {size}; --ballTopLeftColor: {ballTopLeft}; --ballTopRightColor: {ballTopRight}; --ballBottomLeftColor: {ballBottomLeft}; --ballBottomRightColor: {ballBottomRight}; --duration: {duration};\\">\\r\\n  <div class=\\"inner\\">\\r\\n    <div class=\\"ball-container\\">\\r\\n      <div class=\\"single-ball\\">\\r\\n        <div class=\\"ball ball-top-left\\">&nbsp;</div>\\r\\n      </div>\\r\\n      <div class=\\"contener_mixte\\">\\r\\n        <div class=\\"ball ball-top-right\\">&nbsp;</div>\\r\\n      </div>\\r\\n      <div class=\\"contener_mixte\\">\\r\\n        <div class=\\"ball ball-bottom-left\\">&nbsp;</div>\\r\\n      </div>\\r\\n      <div class=\\"contener_mixte\\">\\r\\n        <div class=\\"ball ball-bottom-right\\">&nbsp;</div>\\r\\n      </div>\\r\\n    </div>\\r\\n  </div>\\r\\n</div>\\r\\n"],"names":[],"mappings":"AASO,sBAAQ,CAAC,YAAY,MAAM,CAAC,WAAW,UAAU,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,YAAY,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,oBAAM,CAAC,UAAU,MAAM,KAAK,IAAI,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,6BAAe,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,0BAAY,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,mBAAK,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,cAAc,GAAG,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,4BAAc,CAAC,iBAAiB,IAAI,kBAAkB,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,6BAAe,CAAC,iBAAiB,IAAI,mBAAmB,CAAC,CAAC,KAAK,IAAI,CAAC,IAAI,CAAC,CAAC,+BAAiB,CAAC,iBAAiB,IAAI,qBAAqB,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,IAAI,CAAC,gCAAkB,CAAC,iBAAiB,IAAI,sBAAsB,CAAC,CAAC,KAAK,IAAI,CAAC,IAAI,IAAI,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,CAAC,EAAE,CAAC,SAAS,QAAQ,CAAC,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$h);
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
var css$g = {
  code: ".wrapper.svelte-s0hd3y{position:relative}.circle.svelte-s0hd3y,.wrapper.svelte-s0hd3y{height:var(--size);width:var(--size)}.circle.svelte-s0hd3y{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:svelte-s0hd3y-bounce!important;animation-name:svelte-s0hd3y-bounce!important;background-color:var(--color);border-radius:100%;left:0;opacity:.6;position:absolute;top:0}@-webkit-keyframes svelte-s0hd3y-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes svelte-s0hd3y-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}",
  map: '{"version":3,"file":"DoubleBounce.svelte","sources":["DoubleBounce.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"2.1s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{position:relative}.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:bounce!important;animation-name:bounce!important;background-color:var(--color);border-radius:100%;left:0;opacity:.6;position:absolute;top:0}@-webkit-keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}</style>\\r\\n\\r\\n<div class=\\"wrapper\\" style=\\"--size: {size}{unit}; --color: {color}\\">\\r\\n  {#each range(2, 1) as version}\\r\\n    <div\\r\\n      class=\\"circle\\"\\r\\n      style=\\"animation: {duration} {version === 1 ? `${(durationNum - 0.1) / 2}${durationUnit}` : `0s`} infinite ease-in-out\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,SAAS,QAAQ,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,uBAAuB,oBAAM,UAAU,CAAC,eAAe,oBAAM,UAAU,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,KAAK,CAAC,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$g);
  return `<div class="${"wrapper svelte-s0hd3y"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color)}">${each(range(2, 1), (version) => `<div class="${"circle svelte-s0hd3y"}" style="${"animation: " + escape(duration) + " " + escape(version === 1 ? `${(durationNum - 0.1) / 2}${durationUnit}` : `0s`) + " infinite ease-in-out"}"></div>`)}</div>`;
});
var css$f = {
  code: ".circle.svelte-wwomu7,.wrapper.svelte-wwomu7{height:var(--size);width:var(--size)}.circle.svelte-wwomu7{-webkit-animation-duration:var(--duration);animation-duration:var(--duration);-webkit-animation:svelte-wwomu7-scaleOut var(--duration) ease-in-out infinite;animation:svelte-wwomu7-scaleOut var(--duration) ease-in-out infinite;background-color:var(--color);border-radius:100%;display:inline-block}@-webkit-keyframes svelte-wwomu7-scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}@keyframes svelte-wwomu7-scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"ScaleOut.svelte","sources":["ScaleOut.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-duration:var(--duration);animation-duration:var(--duration);-webkit-animation:scaleOut var(--duration) ease-in-out infinite;animation:scaleOut var(--duration) ease-in-out infinite;background-color:var(--color);border-radius:100%;display:inline-block}@-webkit-keyframes scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}@keyframes scaleOut{0%{transform:scale(0)}to{opacity:0;transform:scale(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}; --duration: {duration};\\">\\r\\n  <div class=\\"circle\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAOO,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,2BAA2B,IAAI,UAAU,CAAC,CAAC,mBAAmB,IAAI,UAAU,CAAC,CAAC,kBAAkB,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,sBAAQ,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,mBAAmB,sBAAQ,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,sBAAQ,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$f);
  return `<div class="${"wrapper svelte-wwomu7"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + "; --duration: " + escape(duration) + ";"}"><div class="${"circle svelte-wwomu7"}"></div></div>`;
});
var css$e = {
  code: ".wrapper.svelte-yshbro{align-items:center;display:flex;justify-content:center;transform:scale(calc(var(--floatSize)/75))}.line.svelte-yshbro,.wrapper.svelte-yshbro{height:var(--stroke);width:var(--size)}.line.svelte-yshbro{-webkit-animation:svelte-yshbro-spineLine var(--duration) ease infinite;animation:svelte-yshbro-spineLine var(--duration) ease infinite;background:var(--color);border-radius:var(--stroke);transform-origin:center center}@-webkit-keyframes svelte-yshbro-spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}@keyframes svelte-yshbro-spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}",
  map: '{"version":3,"file":"SpinLine.svelte","sources":["SpinLine.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"4s\\";\\r\\nexport let size = \\"60\\";\\r\\nexport let stroke = +size / 12 + unit;\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;justify-content:center;transform:scale(calc(var(--floatSize)/75))}.line,.wrapper{height:var(--stroke);width:var(--size)}.line{-webkit-animation:spineLine var(--duration) ease infinite;animation:spineLine var(--duration) ease infinite;background:var(--color);border-radius:var(--stroke);transform-origin:center center}@-webkit-keyframes spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}@keyframes spineLine{0%{height:5px;transform:rotate(-20deg);width:75px}5%{height:5px;width:75px}30%{height:5px;transform:rotate(380deg);width:75px}40%{height:5px;transform:rotate(1turn);width:75px}55%{height:5px;transform:rotate(0deg);width:5px}65%{height:5px;transform:rotate(0deg);width:85px}68%{height:5px;transform:rotate(0deg)}75%{height:5px;transform:rotate(0deg);width:1px}78%{height:5px;width:5px}90%{height:5px;transform:rotate(0deg);width:75px}99%,to{height:5px;transform:rotate(-20deg);width:75px}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --stroke: {stroke}; --floatSize: {size}; --duration: {duration}\\">\\r\\n  <div class=\\"line\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAQO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,UAAU,MAAM,KAAK,IAAI,WAAW,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,OAAO,IAAI,QAAQ,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,kBAAkB,uBAAS,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,UAAU,uBAAS,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,WAAW,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,QAAQ,CAAC,CAAC,iBAAiB,MAAM,CAAC,MAAM,CAAC,mBAAmB,uBAAS,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,CAAC,WAAW,uBAAS,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,MAAM,GAAG,CAAC,GAAG,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,OAAO,GAAG,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,MAAM,IAAI,CAAC,CAAC"}'
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
  $$result.css.add(css$e);
  return `<div class="${"wrapper svelte-yshbro"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --stroke: " + escape(stroke) + "; --floatSize: " + escape(size) + "; --duration: " + escape(duration)}"><div class="${"line svelte-yshbro"}"></div></div>`;
});
var css$d = {
  code: ".wrapper.svelte-4sy8wc{font-size:10px;height:var(--size);text-align:center;width:var(--size)}.rect.svelte-4sy8wc,.wrapper.svelte-4sy8wc{display:inline-block}.rect.svelte-4sy8wc{-webkit-animation:svelte-4sy8wc-stretch var(--duration) ease-in-out infinite;animation:svelte-4sy8wc-stretch var(--duration) ease-in-out infinite;background-color:var(--color);height:100%;margin-right:4px;width:10%}@-webkit-keyframes svelte-4sy8wc-stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}@keyframes svelte-4sy8wc-stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}",
  map: '{"version":3,"file":"Stretch.svelte","sources":["Stretch.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1.2s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{font-size:10px;height:var(--size);text-align:center;width:var(--size)}.rect,.wrapper{display:inline-block}.rect{-webkit-animation:stretch var(--duration) ease-in-out infinite;animation:stretch var(--duration) ease-in-out infinite;background-color:var(--color);height:100%;margin-right:4px;width:10%}@-webkit-keyframes stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}@keyframes stretch{0%,40%,to{transform:scaleY(.4)}20%{transform:scaleY(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\">\\r\\n  {#each range(5, 1) as version}\\r\\n    <div\\r\\n      class=\\"rect\\"\\r\\n      style=\\"animation-delay: {(version - 1) * (+durationNum / 12)}{durationUnit}\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,QAAQ,YAAY,CAAC,mBAAK,CAAC,kBAAkB,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,qBAAO,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,IAAI,CAAC,aAAa,GAAG,CAAC,MAAM,GAAG,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$d);
  return `<div class="${"wrapper svelte-4sy8wc"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}">${each(range(5, 1), (version) => `<div class="${"rect svelte-4sy8wc"}" style="${"animation-delay: " + escape((version - 1) * (+durationNum / 12)) + escape(durationUnit)}"></div>`)}</div>`;
});
var css$c = {
  code: ".wrapper.svelte-ohnl0k{background-clip:padding-box;background-color:var(--rgba);overflow:hidden;position:relative;width:calc(var(--size)*2)}.lines.svelte-ohnl0k,.wrapper.svelte-ohnl0k{height:calc(var(--size)/15)}.lines.svelte-ohnl0k{background-color:var(--color)}.small-lines.svelte-ohnl0k{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;background-clip:padding-box;border-radius:2px;display:block;overflow:hidden;position:absolute;will-change:left,right}.small-lines.\\31.svelte-ohnl0k{-webkit-animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running svelte-ohnl0k-long;animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running svelte-ohnl0k-long}.small-lines.\\32.svelte-ohnl0k{-webkit-animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running svelte-ohnl0k-short;animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running svelte-ohnl0k-short}@-webkit-keyframes svelte-ohnl0k-long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes svelte-ohnl0k-long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@-webkit-keyframes svelte-ohnl0k-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes svelte-ohnl0k-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}",
  map: '{"version":3,"file":"BarLoader.svelte","sources":["BarLoader.svelte"],"sourcesContent":["<script>;\\r\\nimport { calculateRgba, range } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"2.1s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet rgba;\\r\\n$: rgba = calculateRgba(color, 0.2);\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{background-clip:padding-box;background-color:var(--rgba);overflow:hidden;position:relative;width:calc(var(--size)*2)}.lines,.wrapper{height:calc(var(--size)/15)}.lines{background-color:var(--color)}.small-lines{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;background-clip:padding-box;border-radius:2px;display:block;overflow:hidden;position:absolute;will-change:left,right}.small-lines.\\\\31{-webkit-animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running long;animation:var(--duration) cubic-bezier(.65,.815,.735,.395) 0s infinite normal none running long}.small-lines.\\\\32{-webkit-animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running short;animation:var(--duration) cubic-bezier(.165,.84,.44,1) calc(var(--duration)/2 + .05) infinite normal none running short}@-webkit-keyframes long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@-webkit-keyframes short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}</style>\\r\\n\\r\\n<div class=\\"wrapper\\" style=\\"--size: {size}{unit}; --rgba:{rgba}\\">\\r\\n  {#each range(2, 1) as version}\\r\\n    <div\\r\\n      class=\\"lines small-lines {version}\\"\\r\\n      style=\\"--color: {color}; --duration: {duration};\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,gBAAgB,WAAW,CAAC,iBAAiB,IAAI,MAAM,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,oBAAM,CAAC,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,oBAAM,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,0BAAY,CAAC,4BAA4B,QAAQ,CAAC,oBAAoB,QAAQ,CAAC,gBAAgB,WAAW,CAAC,cAAc,GAAG,CAAC,QAAQ,KAAK,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,YAAY,IAAI,CAAC,KAAK,CAAC,YAAY,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,aAAa,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,kBAAI,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,aAAa,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,kBAAI,CAAC,YAAY,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,mBAAK,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,mBAAK,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,mBAAmB,mBAAK,CAAC,EAAE,CAAC,KAAK,KAAK,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,CAAC,WAAW,mBAAK,CAAC,EAAE,CAAC,KAAK,KAAK,CAAC,MAAM,IAAI,CAAC,GAAG,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC,KAAK,IAAI,CAAC,MAAM,GAAG,CAAC,CAAC"}'
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
  $$result.css.add(css$c);
  rgba = calculateRgba(color, 0.2);
  return `<div class="${"wrapper svelte-ohnl0k"}" style="${"--size: " + escape(size) + escape(unit) + "; --rgba:" + escape(rgba)}">${each(range(2, 1), (version) => `<div class="${"lines small-lines " + escape(version) + " svelte-ohnl0k"}" style="${"--color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"></div>`)}</div>`;
});
var css$b = {
  code: ".circle.svelte-f3v7i,.wrapper.svelte-f3v7i{height:var(--size);width:var(--size)}.circle.svelte-f3v7i{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:svelte-f3v7i-bounce var(--duration) linear infinite;animation:svelte-f3v7i-bounce var(--duration) linear infinite;background-color:var(--color);border-radius:100%;opacity:0;position:absolute}@-webkit-keyframes svelte-f3v7i-bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}@keyframes svelte-f3v7i-bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"Jumper.svelte","sources":["Jumper.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.circle,.wrapper{height:var(--size);width:var(--size)}.circle{-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:bounce var(--duration) linear infinite;animation:bounce var(--duration) linear infinite;background-color:var(--color);border-radius:100%;opacity:0;position:absolute}@-webkit-keyframes bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}@keyframes bounce{0%{opacity:0;transform:scale(0)}5%{opacity:1}to{opacity:0;transform:scale(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  {#each range(3, 1) as version}\\r\\n    <div\\r\\n      class=\\"circle\\"\\r\\n      style=\\"animation-delay: {(durationNum / 3) * (version - 1) + durationUnit};\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,oBAAO,CAAC,qBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,oBAAO,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,kBAAkB,mBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,mBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,CAAC,CAAC,SAAS,QAAQ,CAAC,mBAAmB,mBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$b);
  return `<div class="${"wrapper svelte-f3v7i"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(3, 1), (version) => `<div class="${"circle svelte-f3v7i"}" style="${"animation-delay: " + escape(durationNum / 3 * (version - 1) + durationUnit) + ";"}"></div>`)}</div>`;
});
var css$a = {
  code: ".wrapper.svelte-y1k2d4{position:relative}.border.svelte-y1k2d4,.wrapper.svelte-y1k2d4{height:var(--size);width:var(--size)}.border.svelte-y1k2d4{border:6px solid var(--color);-o-border-image:initial;border-image:initial;border-radius:100%;left:0;opacity:.4;perspective:800px;position:absolute;top:0}.border.\\31.svelte-y1k2d4{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringOne;animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringOne}.border.\\32.svelte-y1k2d4{-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringTwo;animation:var(--duration) linear 0s infinite normal none running svelte-y1k2d4-ringTwo}@-webkit-keyframes svelte-y1k2d4-ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@keyframes svelte-y1k2d4-ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@-webkit-keyframes svelte-y1k2d4-ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}@keyframes svelte-y1k2d4-ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}",
  map: '{"version":3,"file":"RingLoader.svelte","sources":["RingLoader.svelte"],"sourcesContent":["<script>;\\r\\nimport { range } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"2s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{position:relative}.border,.wrapper{height:var(--size);width:var(--size)}.border{border:6px solid var(--color);-o-border-image:initial;border-image:initial;border-radius:100%;left:0;opacity:.4;perspective:800px;position:absolute;top:0}.border.\\\\31{-webkit-animation:var(--duration) linear 0s infinite normal none running ringOne;animation:var(--duration) linear 0s infinite normal none running ringOne}.border.\\\\32{-webkit-animation:var(--duration) linear 0s infinite normal none running ringTwo;animation:var(--duration) linear 0s infinite normal none running ringTwo}@-webkit-keyframes ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@keyframes ringOne{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotateY(180deg) rotate(1turn)}}@-webkit-keyframes ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}@keyframes ringTwo{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}to{transform:rotateX(180deg) rotateY(1turn) rotate(1turn)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  {#each range(2, 1) as version}\\r\\n    <div class=\\"border {version}\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAQO,sBAAQ,CAAC,SAAS,QAAQ,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,gBAAgB,OAAO,CAAC,aAAa,OAAO,CAAC,cAAc,IAAI,CAAC,KAAK,CAAC,CAAC,QAAQ,EAAE,CAAC,YAAY,KAAK,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,OAAO,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,OAAO,kBAAI,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAO,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,KAAK,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,mBAAmB,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,KAAK,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,qBAAO,CAAC,EAAE,CAAC,UAAU,QAAQ,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,KAAK,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$a);
  return `<div class="${"wrapper svelte-y1k2d4"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(2, 1), (version) => `<div class="${"border " + escape(version) + " svelte-y1k2d4"}"></div>`)}</div>`;
});
var css$9 = {
  code: ".wrapper.svelte-1lt5stc{align-items:center;display:flex;height:var(--size);justify-content:center;width:var(--size)}.dot.svelte-1lt5stc{-webkit-animation:svelte-1lt5stc-sync var(--duration) ease-in-out infinite alternate both running;animation:svelte-1lt5stc-sync var(--duration) ease-in-out infinite alternate both running;background-color:var(--color);border-radius:100%;display:inline-block;height:var(--dotSize);margin:2px;width:var(--dotSize)}@-webkit-keyframes svelte-1lt5stc-sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}@keyframes svelte-1lt5stc-sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}",
  map: '{"version":3,"file":"SyncLoader.svelte","sources":["SyncLoader.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"0.6s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;width:var(--size)}.dot{-webkit-animation:sync var(--duration) ease-in-out infinite alternate both running;animation:sync var(--duration) ease-in-out infinite alternate both running;background-color:var(--color);border-radius:100%;display:inline-block;height:var(--dotSize);margin:2px;width:var(--dotSize)}@-webkit-keyframes sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}@keyframes sync{33%{transform:translateY(10px)}66%{transform:translateY(-10px)}to{transform:translateY(0)}}</style>\\r\\n\\r\\n<div class=\\"wrapper\\" style=\\"--size:{size}{unit}; --duration: {duration};\\">\\r\\n  {#each range(3, 1) as i}\\r\\n    <div\\r\\n      class=\\"dot\\"\\r\\n      style=\\"--dotSize:{+size * 0.25}{unit}; --color:{color}; animation-delay:  {i * (+durationNum / 10)}{durationUnit};\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,uBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAI,CAAC,kBAAkB,mBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,UAAU,mBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,OAAO,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,SAAS,CAAC,CAAC,mBAAmB,mBAAI,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,KAAK,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAI,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,KAAK,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$9);
  return `<div class="${"wrapper svelte-1lt5stc"}" style="${"--size:" + escape(size) + escape(unit) + "; --duration: " + escape(duration) + ";"}">${each(range(3, 1), (i) => `<div class="${"dot svelte-1lt5stc"}" style="${"--dotSize:" + escape(+size * 0.25) + escape(unit) + "; --color:" + escape(color) + "; animation-delay:  " + escape(i * (+durationNum / 10)) + escape(durationUnit) + ";"}"></div>`)}</div>`;
});
var css$8 = {
  code: ".wrapper.svelte-v1bxxu{height:calc(var(--size)/2);overflow:hidden;width:var(--size)}.rainbow.svelte-v1bxxu{-webkit-animation:var(--duration) ease-in-out 0s infinite normal none running svelte-v1bxxu-rotate;animation:var(--duration) ease-in-out 0s infinite normal none running svelte-v1bxxu-rotate;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:var(--color);border-style:solid;border-top-color:var(--color);box-sizing:border-box;height:var(--size);transform:rotate(-200deg);width:var(--size)}@-webkit-keyframes svelte-v1bxxu-rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}@keyframes svelte-v1bxxu-rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}",
  map: '{"version":3,"file":"Rainbow.svelte","sources":["Rainbow.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"3s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{height:calc(var(--size)/2);overflow:hidden;width:var(--size)}.rainbow{-webkit-animation:var(--duration) ease-in-out 0s infinite normal none running rotate;animation:var(--duration) ease-in-out 0s infinite normal none running rotate;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:var(--color);border-style:solid;border-top-color:var(--color);box-sizing:border-box;height:var(--size);transform:rotate(-200deg);width:var(--size)}@-webkit-keyframes rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}@keyframes rotate{0%{border-width:10px}25%{border-width:3px}50%{border-width:10px;transform:rotate(115deg)}75%{border-width:3px}to{border-width:10px}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  <div class=\\"rainbow\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,SAAS,MAAM,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,sBAAQ,CAAC,kBAAkB,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,oBAAM,CAAC,UAAU,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,oBAAM,CAAC,oBAAoB,WAAW,CAAC,kBAAkB,WAAW,CAAC,cAAc,GAAG,CAAC,mBAAmB,IAAI,OAAO,CAAC,CAAC,aAAa,KAAK,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,UAAU,OAAO,OAAO,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,aAAa,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,aAAa,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,EAAE,CAAC,aAAa,IAAI,CAAC,CAAC"}'
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
  $$result.css.add(css$8);
  return `<div class="${"wrapper svelte-v1bxxu"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"rainbow svelte-v1bxxu"}"></div></div>`;
});
var css$7 = {
  code: ".wrapper.svelte-k0vapq{align-items:center;display:flex;height:var(--size);justify-content:center;overflow:hidden;position:relative;width:calc(var(--size)*2.5)}.bar.svelte-k0vapq{-webkit-animation:svelte-k0vapq-motion var(--duration) ease-in-out infinite;animation:svelte-k0vapq-motion var(--duration) ease-in-out infinite;background-color:var(--color);height:calc(var(--size)/10);margin-top:calc(var(--size) - var(--size)/10);position:absolute;top:calc(var(--size)/10);transform:skewY(0deg);width:calc(var(--size)/5)}@-webkit-keyframes svelte-k0vapq-motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}@keyframes svelte-k0vapq-motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}",
  map: '{"version":3,"file":"Wave.svelte","sources":["Wave.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1.25s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;overflow:hidden;position:relative;width:calc(var(--size)*2.5)}.bar{-webkit-animation:motion var(--duration) ease-in-out infinite;animation:motion var(--duration) ease-in-out infinite;background-color:var(--color);height:calc(var(--size)/10);margin-top:calc(var(--size) - var(--size)/10);position:absolute;top:calc(var(--size)/10);transform:skewY(0deg);width:calc(var(--size)/5)}@-webkit-keyframes motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}@keyframes motion{25%{transform:skewY(25deg)}50%{height:100%;margin-top:0}75%{transform:skewY(-25deg)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  {#each range(10, 0) as version}\\r\\n    <div\\r\\n      class=\\"bar\\"\\r\\n      style=\\"left: {version * (+size / 5 + (+size / 15 - +size / 100)) + unit}; animation-delay: {version * (+durationNum / 8.3)}{durationUnit};\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,kBAAI,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,WAAW,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,UAAU,MAAM,IAAI,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,GAAG,CAAC,UAAU,MAAM,KAAK,CAAC,CAAC,GAAG,CAAC,OAAO,IAAI,CAAC,WAAW,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,MAAM,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,GAAG,CAAC,UAAU,MAAM,KAAK,CAAC,CAAC,GAAG,CAAC,OAAO,IAAI,CAAC,WAAW,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,MAAM,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$7);
  return `<div class="${"wrapper svelte-k0vapq"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}">${each(range(10, 0), (version) => `<div class="${"bar svelte-k0vapq"}" style="${"left: " + escape(version * (+size / 5 + (+size / 15 - +size / 100)) + unit) + "; animation-delay: " + escape(version * (+durationNum / 8.3)) + escape(durationUnit) + ";"}"></div>`)}</div>`;
});
var css$6 = {
  code: ".wrapper.svelte-btdyvu{align-items:center;display:flex;height:calc(var(--size)*1.3);justify-content:center;width:calc(var(--size)*1.3)}.firework.svelte-btdyvu{-webkit-animation:svelte-btdyvu-fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;animation:svelte-btdyvu-fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;border:calc(var(--size)/10) dotted var(--color);border-radius:50%;height:var(--size);width:var(--size)}@-webkit-keyframes svelte-btdyvu-fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}@keyframes svelte-btdyvu-fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}",
  map: '{"version":3,"file":"Firework.svelte","sources":["Firework.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1.25s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;height:calc(var(--size)*1.3);justify-content:center;width:calc(var(--size)*1.3)}.firework{-webkit-animation:fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;animation:fire var(--duration) cubic-bezier(.165,.84,.44,1) infinite;border:calc(var(--size)/10) dotted var(--color);border-radius:50%;height:var(--size);width:var(--size)}@-webkit-keyframes fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}@keyframes fire{0%{opacity:1;transform:scale(.1)}25%{opacity:.85}to{opacity:0;transform:scale(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  <div class=\\"firework\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,gBAAgB,MAAM,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,uBAAS,CAAC,kBAAkB,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,QAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,EAAE,CAAC,CAAC,MAAM,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,GAAG,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,GAAG,CAAC,QAAQ,GAAG,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,GAAG,CAAC,QAAQ,GAAG,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$6);
  return `<div class="${"wrapper svelte-btdyvu"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"firework svelte-btdyvu"}"></div></div>`;
});
var css$5 = {
  code: ".wrapper.svelte-ktwz8c{align-items:center;display:flex;justify-content:center;position:relative;width:var(--size)}.cube.svelte-ktwz8c,.wrapper.svelte-ktwz8c{height:calc(var(--size)/2.5)}.cube.svelte-ktwz8c{-webkit-animation:svelte-ktwz8c-motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;animation:svelte-ktwz8c-motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;background-color:var(--color);position:absolute;top:0;width:calc(var(--size)/5)}@-webkit-keyframes svelte-ktwz8c-motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes svelte-ktwz8c-motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}",
  map: '{"version":3,"file":"Pulse.svelte","sources":["Pulse.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1.5s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;justify-content:center;position:relative;width:var(--size)}.cube,.wrapper{height:calc(var(--size)/2.5)}.cube{-webkit-animation:motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;animation:motion var(--duration) cubic-bezier(.895,.03,.685,.22) infinite;background-color:var(--color);position:absolute;top:0;width:calc(var(--size)/5)}@-webkit-keyframes motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes motion{0%{opacity:1}50%{opacity:0}to{opacity:1}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\">\\r\\n  {#each range(3, 0) as version}\\r\\n    <div\\r\\n      class=\\"cube\\"\\r\\n      style=\\"animation-delay: {version * (+durationNum / 10)}{durationUnit}; left: {version * (+size / 3 + +size / 15) + unit};\\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,GAAG,CAAC,CAAC,mBAAK,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC,QAAQ,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,GAAG,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,GAAG,CAAC,QAAQ,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$5);
  return `<div class="${"wrapper svelte-ktwz8c"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration)}">${each(range(3, 0), (version) => `<div class="${"cube svelte-ktwz8c"}" style="${"animation-delay: " + escape(version * (+durationNum / 10)) + escape(durationUnit) + "; left: " + escape(version * (+size / 3 + +size / 15) + unit) + ";"}"></div>`)}</div>`;
});
var css$4 = {
  code: ".wrapper.svelte-19ad7s{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.ring.svelte-19ad7s{-webkit-animation:svelte-19ad7s-motion var(--duration) ease infinite;animation:svelte-19ad7s-motion var(--duration) ease infinite;background-color:transparent;border:2px solid var(--color);border-radius:50%;position:absolute}@-webkit-keyframes svelte-19ad7s-motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}@keyframes svelte-19ad7s-motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}",
  map: '{"version":3,"file":"Jellyfish.svelte","sources":["Jellyfish.svelte"],"sourcesContent":["<script>;\\r\\nimport { range, durationUnitRegex } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"2.5s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;height:var(--size);justify-content:center;position:relative;width:var(--size)}.ring{-webkit-animation:motion var(--duration) ease infinite;animation:motion var(--duration) ease infinite;background-color:transparent;border:2px solid var(--color);border-radius:50%;position:absolute}@-webkit-keyframes motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}@keyframes motion{0%{transform:translateY(var(--motionOne))}50%{transform:translateY(var(--motionTwo))}to{transform:translateY(var(--motionThree))}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --motionOne: {-size / 5}{unit}; --motionTwo: {+size / 4}{unit}; --motionThree: {-size / 5}{unit}; --duration: {duration};\\">\\r\\n  {#each range(6, 0) as version}\\r\\n    <div\\r\\n      class=\\"ring\\"\\r\\n      style=\\"animation-delay: {version * (durationNum / 25)}{durationUnit}; width: {version * (+size / 6) + unit}; height: {(version * (+size / 6)) / 2 + unit}; \\" />\\r\\n  {/each}\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,gBAAgB,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAK,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,iBAAiB,WAAW,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,GAAG,CAAC,SAAS,QAAQ,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,WAAW,IAAI,WAAW,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,WAAW,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$4);
  return `<div class="${"wrapper svelte-19ad7s"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --motionOne: " + escape(-size / 5) + escape(unit) + "; --motionTwo: " + escape(+size / 4) + escape(unit) + "; --motionThree: " + escape(-size / 5) + escape(unit) + "; --duration: " + escape(duration) + ";"}">${each(range(6, 0), (version) => `<div class="${"ring svelte-19ad7s"}" style="${"animation-delay: " + escape(version * (durationNum / 25)) + escape(durationUnit) + "; width: " + escape(version * (+size / 6) + unit) + "; height: " + escape(version * (+size / 6) / 2 + unit) + "; "}"></div>`)}</div>`;
});
var css$3 = {
  code: ".wrapper.svelte-8eozmp{align-items:center;display:flex;justify-content:center}.spinner.svelte-8eozmp,.wrapper.svelte-8eozmp{height:var(--size);width:var(--size)}.spinner.svelte-8eozmp{-webkit-animation:svelte-8eozmp-rotate var(--duration) infinite linear;animation:svelte-8eozmp-rotate var(--duration) infinite linear}.dot.svelte-8eozmp{-webkit-animation:svelte-8eozmp-bounce var(--duration) infinite ease-in-out;animation:svelte-8eozmp-bounce var(--duration) infinite ease-in-out;background-color:var(--color);border-radius:100%;display:inline-block;height:60%;position:absolute;top:0;width:60%}@-webkit-keyframes svelte-8eozmp-rotate{to{transform:rotate(1turn)}}@keyframes svelte-8eozmp-rotate{to{transform:rotate(1turn)}}@-webkit-keyframes svelte-8eozmp-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes svelte-8eozmp-bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}",
  map: `{"version":3,"file":"Chasing.svelte","sources":["Chasing.svelte"],"sourcesContent":["<script>;\\r\\nimport { durationUnitRegex, range } from \\"./utils\\";\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"2s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet durationUnit = duration.match(durationUnitRegex)[0];\\r\\nlet durationNum = duration.replace(durationUnitRegex, \\"\\");\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;justify-content:center}.spinner,.wrapper{height:var(--size);width:var(--size)}.spinner{-webkit-animation:rotate var(--duration) infinite linear;animation:rotate var(--duration) infinite linear}.dot{-webkit-animation:bounce var(--duration) infinite ease-in-out;animation:bounce var(--duration) infinite ease-in-out;background-color:var(--color);border-radius:100%;display:inline-block;height:60%;position:absolute;top:0;width:60%}@-webkit-keyframes rotate{to{transform:rotate(1turn)}}@keyframes rotate{to{transform:rotate(1turn)}}@-webkit-keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}@keyframes bounce{0%,to{transform:scale(0)}50%{transform:scale(1)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  <div class=\\"spinner\\">\\r\\n    {#each range(2, 0) as version}\\r\\n      <div\\r\\n        class=\\"dot\\"\\r\\n        style=\\"animation-delay: {version === 1 ? \`\${durationNum / 2}\${durationUnit}\` : '0s'}; bottom: {version === 1 ? '0' : ''}; top: {version === 1 ? 'auto' : ''};\\" />\\r\\n    {/each}\\r\\n  </div>\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAUO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,sBAAQ,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,sBAAQ,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,MAAM,CAAC,kBAAI,CAAC,kBAAkB,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,UAAU,oBAAM,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,WAAW,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,QAAQ,YAAY,CAAC,OAAO,GAAG,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,CAAC"}`
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
  $$result.css.add(css$3);
  return `<div class="${"wrapper svelte-8eozmp"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"spinner svelte-8eozmp"}">${each(range(2, 0), (version) => `<div class="${"dot svelte-8eozmp"}" style="${"animation-delay: " + escape(version === 1 ? `${durationNum / 2}${durationUnit}` : "0s") + "; bottom: " + escape(version === 1 ? "0" : "") + "; top: " + escape(version === 1 ? "auto" : "") + ";"}"></div>`)}</div></div>`;
});
var css$2 = {
  code: ".wrapper.svelte-h1e8x4{align-items:center;display:flex;justify-content:center}.shadow.svelte-h1e8x4,.wrapper.svelte-h1e8x4{height:var(--size);position:relative;width:var(--size)}.shadow.svelte-h1e8x4{-webkit-animation:svelte-h1e8x4-load var(--duration) infinite ease,svelte-h1e8x4-round var(--duration) infinite ease;animation:svelte-h1e8x4-load var(--duration) infinite ease,svelte-h1e8x4-round var(--duration) infinite ease;border-radius:50%;color:var(--color);font-size:var(--size);margin:28px auto;overflow:hidden;transform:translateZ(0)}@-webkit-keyframes svelte-h1e8x4-load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes svelte-h1e8x4-load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes svelte-h1e8x4-round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes svelte-h1e8x4-round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Shadow.svelte","sources":["Shadow.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"1.7s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{align-items:center;display:flex;justify-content:center}.shadow,.wrapper{height:var(--size);position:relative;width:var(--size)}.shadow{-webkit-animation:load var(--duration) infinite ease,round var(--duration) infinite ease;animation:load var(--duration) infinite ease,round var(--duration) infinite ease;border-radius:50%;color:var(--color);font-size:var(--size);margin:28px auto;overflow:hidden;transform:translateZ(0)}@-webkit-keyframes load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@keyframes load{0%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}5%,95%{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}10%,59%{box-shadow:0 -.83em 0 -.4em,-.087em -.825em 0 -.42em,-.173em -.812em 0 -.44em,-.256em -.789em 0 -.46em,-.297em -.775em 0 -.477em}20%{box-shadow:0 -.83em 0 -.4em,-.338em -.758em 0 -.42em,-.555em -.617em 0 -.44em,-.671em -.488em 0 -.46em,-.749em -.34em 0 -.477em}38%{box-shadow:0 -.83em 0 -.4em,-.377em -.74em 0 -.42em,-.645em -.522em 0 -.44em,-.775em -.297em 0 -.46em,-.82em -.09em 0 -.477em}to{box-shadow:0 -.83em 0 -.4em,0 -.83em 0 -.42em,0 -.83em 0 -.44em,0 -.83em 0 -.46em,0 -.83em 0 -.477em}}@-webkit-keyframes round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes round{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\">\\r\\n  <div class=\\"shadow\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAOO,sBAAQ,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,gBAAgB,MAAM,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,qBAAO,CAAC,kBAAkB,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,mBAAK,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,kBAAI,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,mBAAK,CAAC,IAAI,UAAU,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,cAAc,GAAG,CAAC,MAAM,IAAI,OAAO,CAAC,CAAC,UAAU,IAAI,MAAM,CAAC,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,SAAS,MAAM,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,mBAAmB,kBAAI,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,kBAAI,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,EAAE,CAAC,WAAW,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,mBAAmB,mBAAK,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,mBAAK,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$2);
  return `<div class="${"wrapper svelte-h1e8x4"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"><div class="${"shadow svelte-h1e8x4"}"></div></div>`;
});
var css$1 = {
  code: ".square.svelte-17enkv8{-webkit-animation:svelte-17enkv8-squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);animation:svelte-17enkv8-squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);-webkit-animation-fill-mode:both;animation-fill-mode:both;background-color:var(--color);display:inline-block;height:var(--size);perspective:100px;width:var(--size)}@-webkit-keyframes svelte-17enkv8-squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}@keyframes svelte-17enkv8-squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}",
  map: '{"version":3,"file":"Square.svelte","sources":["Square.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"3s\\";\\r\\nexport let size = \\"60\\";\\r\\n<\/script>\\r\\n\\r\\n<style>.square{-webkit-animation:squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);animation:squareDelay var(--duration) 0s infinite cubic-bezier(.09,.57,.49,.9);-webkit-animation-fill-mode:both;animation-fill-mode:both;background-color:var(--color);display:inline-block;height:var(--size);perspective:100px;width:var(--size)}@-webkit-keyframes squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}@keyframes squareDelay{25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}to{transform:rotateX(0) rotateY(0)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"square\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration};\\" />\\r\\n"],"names":[],"mappings":"AAOO,sBAAO,CAAC,kBAAkB,0BAAW,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,CAAC,UAAU,0BAAW,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,aAAa,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,CAAC,4BAA4B,IAAI,CAAC,oBAAoB,IAAI,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,QAAQ,YAAY,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,YAAY,KAAK,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,0BAAW,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC,WAAW,0BAAW,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,MAAM,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,MAAM,CAAC,CAAC,EAAE,CAAC,UAAU,QAAQ,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css$1);
  return `<div class="${"square svelte-17enkv8"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --duration: " + escape(duration) + ";"}"></div>`;
});
var css = {
  code: ".wrapper.svelte-bqyz2{height:var(--size);position:relative;width:var(--size)}.circle-one.svelte-bqyz2,.wrapper.svelte-bqyz2{-webkit-animation:svelte-bqyz2-moonStretchDelay var(--duration) 0s infinite linear;animation:svelte-bqyz2-moonStretchDelay var(--duration) 0s infinite linear;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;border-radius:100%}.circle-one.svelte-bqyz2{background-color:var(--color);height:calc(var(--size)/7);opacity:.8;position:absolute;top:var(--moonSize);width:calc(var(--size)/7)}.circle-two.svelte-bqyz2{border:calc(var(--size)/7) solid var(--color);border-radius:100%;box-sizing:border-box;height:var(--size);opacity:.1;width:var(--size)}@-webkit-keyframes svelte-bqyz2-moonStretchDelay{to{transform:rotate(1turn)}}@keyframes svelte-bqyz2-moonStretchDelay{to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Moon.svelte","sources":["Moon.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"0.6s\\";\\r\\nexport let size = \\"60\\";\\r\\nlet moonSize = +size / 7;\\r\\nlet top = +size / 2 - moonSize / 2;\\r\\n<\/script>\\r\\n\\r\\n<style>.wrapper{height:var(--size);position:relative;width:var(--size)}.circle-one,.wrapper{-webkit-animation:moonStretchDelay var(--duration) 0s infinite linear;animation:moonStretchDelay var(--duration) 0s infinite linear;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;border-radius:100%}.circle-one{background-color:var(--color);height:calc(var(--size)/7);opacity:.8;position:absolute;top:var(--moonSize);width:calc(var(--size)/7)}.circle-two{border:calc(var(--size)/7) solid var(--color);border-radius:100%;box-sizing:border-box;height:var(--size);opacity:.1;width:var(--size)}@-webkit-keyframes moonStretchDelay{to{transform:rotate(1turn)}}@keyframes moonStretchDelay{to{transform:rotate(1turn)}}</style>\\r\\n\\r\\n<div\\r\\n  class=\\"wrapper\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --moonSize: {top}{unit}; --duration: {duration};\\">\\r\\n  <div class=\\"circle-one\\" />\\r\\n  <div class=\\"circle-two\\" />\\r\\n</div>\\r\\n"],"names":[],"mappings":"AASO,qBAAQ,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,wBAAW,CAAC,qBAAQ,CAAC,kBAAkB,6BAAgB,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,UAAU,6BAAgB,CAAC,IAAI,UAAU,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,4BAA4B,QAAQ,CAAC,oBAAoB,QAAQ,CAAC,cAAc,IAAI,CAAC,wBAAW,CAAC,iBAAiB,IAAI,OAAO,CAAC,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,QAAQ,EAAE,CAAC,SAAS,QAAQ,CAAC,IAAI,IAAI,UAAU,CAAC,CAAC,MAAM,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,wBAAW,CAAC,OAAO,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,IAAI,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,MAAM,CAAC,CAAC,QAAQ,EAAE,CAAC,MAAM,IAAI,MAAM,CAAC,CAAC,mBAAmB,6BAAgB,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,6BAAgB,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
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
  $$result.css.add(css);
  return `<div class="${"wrapper svelte-bqyz2"}" style="${"--size: " + escape(size) + escape(unit) + "; --color: " + escape(color) + "; --moonSize: " + escape(top) + escape(unit) + "; --duration: " + escape(duration) + ";"}"><div class="${"circle-one svelte-bqyz2"}"></div>
  <div class="${"circle-two svelte-bqyz2"}"></div></div>`;
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
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
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
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sermons
});
var NavButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { grow = false } = $$props;
  let { active = false } = $$props;
  let { extraClasses = "" } = $$props;
  if ($$props.grow === void 0 && $$bindings.grow && grow !== void 0)
    $$bindings.grow(grow);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.extraClasses === void 0 && $$bindings.extraClasses && extraClasses !== void 0)
    $$bindings.extraClasses(extraClasses);
  return `<button class="${[
    "p-4 cursor-pointer active:bg-blue-100 active:text-black duration-200 flex items-center " + escape(extraClasses),
    (active ? "bg-blue-100" : "") + " " + (active ? "text-black" : "") + " " + (grow ? "flex-grow" : "")
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</button>`;
});
var ArrowLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"arrow-left"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"}"></path></svg>`;
});
var SermonEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { initialData } = $$props;
  let { editor = null } = $$props;
  createEventDispatcher();
  let toolbarContainer;
  let editable;
  if ($$props.initialData === void 0 && $$bindings.initialData && initialData !== void 0)
    $$bindings.initialData(initialData);
  if ($$props.editor === void 0 && $$bindings.editor && editor !== void 0)
    $$bindings.editor(editor);
  return `<div class="${"document-editor"}"><div class="${"document-editor__toolbar"}"${add_attribute("this", toolbarContainer, 0)}></div>
	<div class="${"document-editor__editable-container"}"><div class="${"document-editor__editable"}"${add_attribute("this", editable, 0)}>${``}</div></div>
</div>`;
});
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
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
			${``}`
        })}
		${validate_component(SermonEditor, "SermonEditor").$$render($$result, { initialData: sermon.content, editor }, {
          editor: ($$value) => {
            editor = $$value;
            $$settled = false;
          }
        }, {})}`}
`;
      }(__value);
    }(getSermon())}

`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D
});
var Bible = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Bible
});
var Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"search"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}"${add_attribute("class", clazz, 0)}><path fill="${"currentColor"}" d="${"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"}" class="${""}"></path></svg>`;
});
var AngleDown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: clazz = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0)
    $$bindings.class(clazz);
  return `<svg aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"angle-down"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}"${add_attribute("class", clazz, 0)} style="${""}"><path fill="${"currentColor"}" d="${"M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"}"></path></svg>`;
});
var Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let left;
  let { sections } = $$props;
  let { activeSectionId } = $$props;
  let { sizeClasses = "h-96 w-96" } = $$props;
  let scroller;
  if ($$props.sections === void 0 && $$bindings.sections && sections !== void 0)
    $$bindings.sections(sections);
  if ($$props.activeSectionId === void 0 && $$bindings.activeSectionId && activeSectionId !== void 0)
    $$bindings.activeSectionId(activeSectionId);
  if ($$props.sizeClasses === void 0 && $$bindings.sizeClasses && sizeClasses !== void 0)
    $$bindings.sizeClasses(sizeClasses);
  left = activeSectionId === sections[1].id ? "calc(2rem - 100%)" : "0px";
  return `<section class="${"shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden " + escape(sizeClasses)}"${add_attribute("this", scroller, 0)}><div class="${"shadow-lg bg-blue-200 rounded-t-2xl p-4 sticky flex"}">${each(sections, (section) => `<button class="${"flex-grow"}">${escape(section.label)}</button>`)}</div>

	<div class="${"flex-grow p-4 rounded-b-2xl flex relative duration-100"}" style="${"left: " + escape(left) + ";"}">${slots.default ? slots.default({}) : ``}</div></section>`;
});
var TabPane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section class="${"w-full flex-shrink-0"}">${slots.default ? slots.default({}) : ``}</section>`;
});
function formatBookName(book) {
  if (book === "songofsolomon") {
    return "Song of Solomon";
  }
  let result = book;
  if (book.startsWith("1") || book.startsWith("2") || book.startsWith("3")) {
    result = `${result[0]} ${result.slice(1)}`;
  }
  return ` ${result}`.replace(/ ([a-z])/, (v) => v.toUpperCase()).trim();
}
var ChapterSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chapters;
  let { open } = $$props;
  let { initialBook = null } = $$props;
  let { initialChapter = null } = $$props;
  let book;
  let activeSectionId = "book";
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.initialBook === void 0 && $$bindings.initialBook && initialBook !== void 0)
    $$bindings.initialBook(initialBook);
  if ($$props.initialChapter === void 0 && $$bindings.initialChapter && initialChapter !== void 0)
    $$bindings.initialChapter(initialChapter);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        activeSectionId = "book";
      }
    }
    {
      {
        book = initialBook || "genesis";
      }
    }
    {
      {
        console.log(activeSectionId);
      }
    }
    chapters = getChapterNumbers(book);
    $$rendered = `${validate_component(Modal, "Modal").$$render($$result, { open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Tabs, "Tabs").$$render($$result, {
        sizeClasses: "h-full w-full",
        sections: [
          { id: "book", label: formatBookName(book) },
          { id: "chapter", label: "Chapter" }
        ],
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
          default: () => `<div class="${"flex flex-wrap"}">${each(chapters, (chapter) => `<a class="${"w-1/4 p-4 bg-gray-200 text-center"}" href="${"/bible/" + escape(book) + "/" + escape(chapter)}">${escape(chapter)}</a>`)}</div>`
        })}`
      })}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var BibleTopBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectChapterModalOpen = false;
  let searchText = "";
  let { text } = $$props;
  let { chapter = null } = $$props;
  let { showSearch = true } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.chapter === void 0 && $$bindings.chapter && chapter !== void 0)
    $$bindings.chapter(chapter);
  if ($$props.showSearch === void 0 && $$bindings.showSearch && showSearch !== void 0)
    $$bindings.showSearch(showSearch);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
      default: () => `${validate_component(NavButton, "NavButton").$$render($$result, { extraClasses: "mr-auto" }, {}, {
        default: () => `<span class="${"mr-4 whitespace-nowrap"}">${escape(text)}</span>

		${validate_component(AngleDown, "AngleDown").$$render($$result, { class: "h-6 ml-2" }, {}, {})}`
      })}

	${showSearch ? `<form class="${" bg-white hidden xs:flex"}"><input type="${"text"}" class="${"py-2 px-4 rounded-l-full text-black"}" placeholder="${"Search..."}"${add_attribute("value", searchText, 0)}>
			<button type="${"submit"}" class="${"w-8 text-blue-800 p-2"}">${validate_component(Search, "Search").$$render($$result, {}, {}, {})}</button></form>

		<div class="${"contents xs:hidden"}">${validate_component(NavLink, "NavLink").$$render($$result, { href: "/bible/search" }, {}, {
        default: () => `${validate_component(Search, "Search").$$render($$result, { class: "h-8" }, {}, {})}`
      })}</div>` : ``}`
    })}

${validate_component(ChapterSelector, "ChapterSelector").$$render($$result, {
      initialBook: chapter == null ? void 0 : chapter.book,
      initialChapter: chapter == null ? void 0 : chapter.chapter,
      open: selectChapterModalOpen
    }, {
      open: ($$value) => {
        selectChapterModalOpen = $$value;
        $$settled = false;
      }
    }, {})}`;
  } while (!$$settled);
  return $$rendered;
});
var Verse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { verse } = $$props;
  let { active = false } = $$props;
  let { formatting = "" } = $$props;
  let { highlightedText = null } = $$props;
  let { search: search2 = false } = $$props;
  if ($$props.verse === void 0 && $$bindings.verse && verse !== void 0)
    $$bindings.verse(verse);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.formatting === void 0 && $$bindings.formatting && formatting !== void 0)
    $$bindings.formatting(formatting);
  if ($$props.highlightedText === void 0 && $$bindings.highlightedText && highlightedText !== void 0)
    $$bindings.highlightedText(highlightedText);
  if ($$props.search === void 0 && $$bindings.search && search2 !== void 0)
    $$bindings.search(search2);
  return `<article class="${[
    "flex p-4 duration-200 border-2",
    (active ? "border-black" : "") + " " + (active ? "text-gray-600" : "") + " " + (!active ? "border-transparent" : "") + " " + (!search2 ? "gap-4" : "") + " " + (search2 ? "gap-2" : "") + " " + (search2 ? "flex-col" : "")
  ].join(" ").trim()}" style="${escape(formatting) + ";"}"><h2 class="${"p-2 text-xs bg-gray-200 flex items-center cursor-pointer"}">${search2 ? `${escape(formatBookName(verse.book))} ${escape(verse.chapter)}:${escape(verse.verse)}` : `${escape(verse.verse)}`}</h2>
	<p${add_classes([!search2 ? "self-center" : ""].join(" ").trim())}><!-- HTML_TAG_START -->${highlightedText || verse.text}<!-- HTML_TAG_END --></p>

	${search2 ? `<p><button disabled class="${"text-gray-600"}" title="${"Coming Soon"}">Chapter</button>
			|
			<a class="${"text-yellow-700 border-b-2 border-transparent hover:border-yellow-700"}" href="${"/bible/" + escape(verse.book) + "/" + escape(verse.chapter)}">In Bible</a></p>` : ``}</article>`;
});
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
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
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$1({ page: page2, fetch: fetch2, session, context }) {
  return __awaiter$1(this, void 0, void 0, function* () {
    const text = page2.query.get("text") || "";
    let exactMatch;
    let wholeWordsOnly;
    try {
      exactMatch = !!JSON.parse(page2.query.get("exactMatch") || "false");
      wholeWordsOnly = !!JSON.parse(page2.query.get("wholeWordsOnly") || "false");
    } catch (_a) {
      exactMatch = exactMatch || false;
      wholeWordsOnly = wholeWordsOnly || false;
    }
    if (text.trim() === "") {
      return {
        props: { text: "", wholeWordsOnly, exactMatch }
      };
    }
    const url = `/api/bible/search.json?text=${text}&wholeWordsOnly=${wholeWordsOnly}&exactMatch=${exactMatch}`;
    console.log({ url });
    const res = yield fetch2(url);
    if (res.ok) {
      return {
        props: {
          results: (yield res.json()).results,
          text,
          exactMatch,
          wholeWordsOnly
        }
      };
    }
  });
}
var Search_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasChanges;
  let { results = [] } = $$props;
  let { text } = $$props;
  let { wholeWordsOnly } = $$props;
  let { exactMatch } = $$props;
  let tempText = text;
  let tempWholeWordsOnly = wholeWordsOnly;
  let tempExactMatch = exactMatch;
  if ($$props.results === void 0 && $$bindings.results && results !== void 0)
    $$bindings.results(results);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.wholeWordsOnly === void 0 && $$bindings.wholeWordsOnly && wholeWordsOnly !== void 0)
    $$bindings.wholeWordsOnly(wholeWordsOnly);
  if ($$props.exactMatch === void 0 && $$bindings.exactMatch && exactMatch !== void 0)
    $$bindings.exactMatch(exactMatch);
  hasChanges = !(tempText === text && tempWholeWordsOnly === wholeWordsOnly && tempExactMatch === exactMatch);
  return `${validate_component(BibleTopBar, "BibleTopBar").$$render($$result, {
    text: "Browse the Bible",
    showSearch: false
  }, {}, {})}

<form class="${"bg-gray-200"}"><div class="${"bg-white shadow-lg m-4 flex px-2"}"><input type="${"text"}" class="${"text-lg p-2 mr-auto flex-grow bg-transparent"}" placeholder="${"Search..."}"${add_attribute("value", tempText, 0)}>
		<button type="${"submit"}" ${!hasChanges ? "disabled" : ""} class="${[
    "text-black w-8 p-2 duration-200",
    (!hasChanges ? "text-gray-200" : "") + " " + (hasChanges ? "cursor-pointer" : "") + " " + (!hasChanges ? "cursor-default" : "")
  ].join(" ").trim()}">${validate_component(Search, "Search").$$render($$result, {}, {}, {})}</button></div>

	<div class="${"flex m-4 gap-4"}"><div><input type="${"checkbox"}"${add_attribute("checked", tempWholeWordsOnly, 1)}> Whole Words Only
		</div>
		<div><input type="${"checkbox"}"${add_attribute("checked", tempExactMatch, 1)}> Exact Match
		</div></div></form>

${results.length ? `<main class="${"pb-48"}">${each(results, (result) => `${validate_component(Verse, "Verse").$$render($$result, {
    verse: result.verse,
    highlightedText: result.highlightedText,
    search: true
  }, {}, {})}`)}</main>` : `${text.trim() === "" ? `${validate_component(Jumbotron, "Jumbotron").$$render($$result, { title: "No Results" }, {}, { default: () => `Type Your Search Query` })}` : `${validate_component(Jumbotron, "Jumbotron").$$render($$result, { title: "No Results" }, {}, {
    default: () => `Please try something else`
  })}`}`}`;
});
var search = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Search_1,
  load: load$1
});
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
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
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
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
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
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { chapter } = $$props;
  let activeVerses = {};
  const highlightColors = ["#9adab9", "#efc082", "#f2a5c4", "#f3e482", "#8bc5e0"];
  let highlights;
  if ($$props.chapter === void 0 && $$bindings.chapter && chapter !== void 0)
    $$bindings.chapter(chapter);
  {
    {
      activeVerses = {};
    }
  }
  activeVersesArray = Object.entries(activeVerses).filter(([k, v]) => v).map(([k, v]) => +k);
  {
    console.log(highlights);
  }
  $$unsubscribe_authStore();
  return `${validate_component(BibleTopBar, "BibleTopBar").$$render($$result, {
    text: formatBookName(chapter.book) + " " + chapter.chapter,
    chapter
  }, {}, {})}

${activeVersesArray.length > 0 ? `${validate_component(Nav, "Nav").$$render($$result, { posClasses: "top-0" }, {}, {
    default: () => `${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
      default: () => `${validate_component(Times, "Times").$$render($$result, { class: "h-8" }, {}, {})}`
    })}
		${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
      default: () => `${validate_component(Copy, "Copy").$$render($$result, { class: "h-8" }, {}, {})}`
    })}
		<div class="${"overflow-auto flex shadow-inner"}">${each(highlightColors, (color) => `${validate_component(NavButton, "NavButton").$$render($$result, {}, {}, {
      default: () => `<div class="${"h-8 w-8 rounded-full"}" style="${"background: " + escape(color)}"></div>
				`
    })}`)}</div>`
  })}` : ``}

<main class="${"pb-48"}">${each(chapter.verses, (verse) => {
    var _a;
    return `${validate_component(Verse, "Verse").$$render($$result, {
      verse,
      active: activeVerses[verse.verse],
      formatting: (_a = highlights == null ? void 0 : highlights.find((item) => item.verse === verse.verse)) == null ? void 0 : _a.formatting
    }, {}, {})}`;
  })}

	<a class="${"fixed bottom-0 mb-28 left-0 ml-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"}" href="${"/bible/" + escape(chapter.previous.book) + "/" + escape(chapter.previous.chapter)}">${validate_component(AngleLeft, "AngleLeft").$$render($$result, { class: "h-8" }, {}, {})}</a>

	<a class="${"fixed bottom-0 mb-28 right-0 mr-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"}" href="${"/bible/" + escape(chapter.next.book) + "/" + escape(chapter.next.chapter)}">${validate_component(AngleRight, "AngleRight").$$render($$result, { class: "h-8" }, {}, {})}</a></main>`;
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
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
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
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
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

// node_modules/@sveltejs/kit/dist/adapter-utils.js
init_shims();
function isContentTypeTextual2(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const type = headers["content-type"];
  const rawBody = type && isContentTypeTextual2(type) ? isBase64Encoded ? Buffer.from(body, "base64").toString() : body : new TextEncoder("base64").encode(body);
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
