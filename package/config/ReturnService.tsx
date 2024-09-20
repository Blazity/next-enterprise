export class ReturnService<T> {
  correct: boolean
  message: string
  errorCode: number
  object: T

  constructor(object: T, correct = true, message = "", errorCode = 0) {
    this.correct = correct
    this.message = message
    this.errorCode = errorCode
    this.object = object
  }
}
