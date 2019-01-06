<template>
  <div id="app">
    <select @change="handleChangeExample">
      <option value="vue">Choose another example</option>
      <option value="preact">Preact</option>
      <option value="next">Next.js</option>
      <option value="python">Python</option>
      <option value="golang">Golang</option>
    </select>
    <pre><code v-html="code"></code></pre>
    <pre><code v-html="footer"></code></pre>
  </div>
</template>

<script>
  import hanabi from '../src'
  import code from '!raw-loader!./examples/vue.js'

  export default {
    data() {
      return {
        active: 'vue',
        footer: hanabi(`---\n\n<!-- haha, this looks hilarious -->\n<!-- flower and fire, such a highlighter, https://github.com/egoist/hanabi -->`, {language: 'html'}),
        examples: {
          vue: [hanabi(code), 'js'],
          preact: [import('!raw-loader!./examples/preact'), 'js'],
          next: [import('!raw-loader!./examples/next'), 'js'],
          python: [import('!raw-loader!./examples/python.py'), 'py'],
          golang: [import('!raw-loader!./examples/golang.go'), 'go']
        }
      }
    },
    created() {
      this.changeExample('vue')
    },
    computed: {
      code() {
        return this.examples[this.active][0]
      }
    },
    methods: {
      handleChangeExample({target: {value}}) {
        this.changeExample(value)
      },
      changeExample(type) {
        const example = this.examples[type][0]
        if (typeof example === 'string') {
          this.active = type
        } else {
          example.then(code => {
            this.examples[type][0] = hanabi(code, {
              language: this.examples[type][1]
            })
            this.active = type
          })
        }
      }
    }
  }
</script>

<style scoped>
  pre {
    width: 100%;
    overflow: auto;
  }
</style>
