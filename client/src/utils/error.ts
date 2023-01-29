type Detail = {
  message: string;
  field?: string;
};

export class CustomeError extends Error {
  constructor(public code: number, message: string, public details: Detail[]) {
    super(message);
    Object.setPrototypeOf(this, CustomeError.prototype);
  }
}
