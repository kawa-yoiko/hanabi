import jsCommentRe from 'comment-regex'

// const defaultColors = Array.from(new Array(18), (_, i) => [i * 20, 80, 50])
const defaultColors = [
  [340, 80, 65],
  [200, 80, 45],
  [120, 80, 40],
  [300, 80, 55],
  [260, 80, 60],
  [140, 80, 40],
  [60, 100, 39],
  [0, 75, 65],
  [100, 80, 40],
  [80, 80, 45],
  [240, 80, 70],
  [20, 90, 55],
  [180, 80, 40],
  [280, 80, 55],
  [160, 80, 40],
  [320, 80, 60],
  [220, 80, 55],
  [40, 100, 48]
]

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

const saturate = function (c, rate) {
  return [c[0], c[1] * rate, c[2]]
}

const cssColor = function (c) {
  return `hsl(${c[0]}, ${c[1]}%, ${c[2]}%)`
}

const colorizeComment = function (cm) {
  return `<span style="color: slategray">${escapeHTML(cm)}</span>`
}

const colorizeStrLit = function (cache, str) {
  return `<span style="color: ${cssColor(saturate(cache.forWord(str), 0.4))}">${escapeHTML(str)}</span>`
}

const colorizeWord = function (cache, word) {
  return `<span style="color: ${cssColor(cache.forWord(word))}">${word}</span>`
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
