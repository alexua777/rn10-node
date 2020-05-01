export class BaseError extends Error{
    constructor (name, message,status) {
        super(message);
        this.name = name;
        this.status = status;
    }
}

export class NotFound extends BaseError {
    constructor(message) {
        super("NotFoudError", message, 404);

    }
}

