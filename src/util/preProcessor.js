import stringEscape from "js-string-escape"

export default class {
  static safeEscape(string) {
    return stringEscape(string)
  }

  static checkForWord(string) {
    return /^\w+$/.test(string)
  }
}
