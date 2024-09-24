export class ReturnService<T> {
  correct: boolean
  message: string
  errorCode: number
  object: T

  /**
   * Constructs an instance of the ReturnService class.
   *
   * @param object - The object of type T to be returned.
   * @param correct - A boolean indicating if the operation was correct. Defaults to true.
   * @param message - A message providing additional information. Defaults to an empty string.
   * @param errorCode - An error code associated with the operation. Defaults to 0.
   */
  constructor(object: T, correct = true, message = "", errorCode = 0) {
    this.correct = correct
    this.message = message
    this.errorCode = errorCode
    this.object = object
  }
}
