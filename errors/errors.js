// eslint-disable-next-line max-classes-per-file
class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  BadRequest, Unauthorized, Forbidden, NotFoundError, Conflict,
};
