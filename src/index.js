import jsCommentRe from 'comment-regex'

const defaultColors = ['23AC69', '91C132', 'F19726', 'E8552D', '1AAB8E', 'E1147F', '2980C1', '1BA1E6', '9FA0A0', 'F19726', 'E30B20', 'E30B20', 'A3338B']

const defaultLanguageOptions = [
  /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/,
  /(?:^|\s)\/\/.+?$|\/\*[\S\s]*?\*\//,
  /"[\S\s]*?"|'[\S\s]*?'/
]

const languageOptions = {
  'js': [null, null, null],
  'html': [null, /<!--[\S\s]*?-->/, null],
  'py': [null, /(?:^|\s)#.+?$/, /'''[\S\s]*?'''|"[\S\s]*?"|'[\S\s]*?'/],
  'go': [null, null, null],
  'hs': [/[\w|']+/, /(?:^|\s)--.+?$|\{-[\S\s]*?-\}/, null]
}

const escapeHTMLChar = function (ch) {
  switch (ch) {
    case '&':
      return '&amp;'
    case '<':
      return '&lt;'
    case '"':
      return '&quot;'
    default:
      return '&#039;'
  }
}

const escapeHTML = function (unsafe) {
  return unsafe.replace(/[&<"']/g, escapeHTMLChar)
}

class ColorCache {
  constructor(arr) {
    this.arr = arr
    this.cache = {}
    this.index = 0
  }

  forWord(word) {
    let ret
    if (this.cache[word]) {
      ret = this.cache[word]
    } else {
      ret = this.arr[this.index]
      this.cache[word] = ret
      this.index = ++this.index % this.arr.length
    }
    return ret
  }
}

const colorizeComment = function (cm) {
  return `<span style="color: slategray">${escapeHTML(cm)}</span>`
}

const colorizeStrLit = function (cache, str) {
  return `<span style="color: mediumslateblue">${escapeHTML(str)}</span>`
}

const colorizeWord = function (cache, word) {
  return `<span style="color: #${cache.forWord(word)}">${word}</span>`
}

export default function (input, {
  language = null,
  colors = defaultColors
} = {}) {
  const optionsAltered = languageOptions[language] || [null, null, null]
  const options = optionsAltered.map((x, id) => x || defaultLanguageOptions[id])

  const wordRe = options[0]
  const commentRe = options[1]
  const stringLitRe = options[2]
  const escapeCharRe = /[&<"']/

  const re = new RegExp(`(${commentRe.source})|(${stringLitRe.source})|(${wordRe.source})|(${escapeCharRe.source})`, 'gmi')

  const cache = new ColorCache(colors)

  return input.replace(re, (_, cm, str, word, esc) => {
    if (cm) {
      return colorizeComment(cm)
    } else if (str) {
      return colorizeStrLit(cache, str)
    } else if (word) {
      return colorizeWord(cache, word)
    } else if (esc) {
      return escapeHTMLChar(esc)
    }
  })
}
