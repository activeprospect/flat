#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')
const { flatten } = require('./index.js')

const filepath = process.argv.slice(2)[0]
if (filepath) {
  // Read from file
  const file = path.resolve(process.cwd(), filepath)
  fs.accessSync(file, fs.constants.R_OK) // allow to throw if not readable
  out(JSON.parse(fs.readFileSync(file)))
} else if (process.stdin.isTTY) {
  usage(0)
} else {
  // Read from newline-delimited STDIN
  const lines = []
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
    .on('line', line => lines.push(line))
    .on('close', () => out(JSON.parse(lines.join('\n'))))
}

function out (data) {
  process.stdout.write(JSON.stringify(flatten(data), null, 2))
}

function usage (code) {
  console.log(`
Usage:

flat foo.json
cat foo.json | flat
`)

  process.exit(code || 0)
}
