import jsCommentRe from 'comment-regex'

const defaultColors = ['23AC69', '91C132', 'F19726', 'E8552D', '1AAB8E', 'E1147F', '2980C1', '1BA1E6', '9FA0A0', 'F19726', 'E30B20', 'E30B20', 'A3338B']

const defaultLanguageOptions = [
  /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/,
  /(?:(?:^|\s)\/\/.+?$)|(?:\/\*[\S\s]*?\*\/)/,
  /".*"|'.*'/
]

const languageOptions = {
  'js': [null, null, null],
  'html': [null, /(?:<!--[\S\s]*?-->)/, null],
  'py': [null, /(?:(?:^|\s)#.+?$)/, null],
  'go': [null, null, null]
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

export default function (input, {
  language = null,
  colors = defaultColors
} = {}) {
  let index = 0
  const cache = {}
  const optionsAltered = languageOptions[language] || [null, null, null]
  const options = optionsAltered.map((x, id) => x || defaultLanguageOptions[id])
  const wordRe = options[0]
  const commentRe = options[1]
  const stringLitRe = options[2]
  const escapeCharRe = /[&<"']/

  const re = new RegExp(`(${commentRe.source})|(${wordRe.source})|(${escapeCharRe.source})`, 'gmi')
  console.log(re)
  return input
  .replace(re, (m, cm, word, esc) => {
    if (cm) {
      return toComment(cm)
    }

    if (esc) {
      return escapeHTMLChar(esc)
    }

    let color
    if (cache[word]) {
      color = cache[word]
    } else {
      color = colors[index]
      cache[word] = color
    }

    const out = `<span style="color: #${color}">${word}</span>`
    index = ++index % colors.length
    return out
  })
}

function toComment(cm) {
  return `<span style="color: slategray">${escapeHTML(cm)}</span>`
}
