const STATUS_CODES = {
  302: "Client version missing or invalid",
  310: "Illegal input or access denied",
  404: "Not Found",
  500: "Banned",
  504: "Gateway Timeout",
  998: "Anime ID missing or invalid",
  999: "Other",
};

module.exports = class HttpError extends Error {
  constructor(message, code) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.code = code;
    this.status = STATUS_CODES[code];
  }

  toString() {
    return this.message;
  }

  toJSON() {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
    };
  }
};
