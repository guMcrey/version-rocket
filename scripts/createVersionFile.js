#!/usr/bin/env node

/**
 * Gets the version in package.json and writes it to the dist directory of the application
 * usage: Add the shortcut command "generate-version-file" to the required place.
 */

const fs = require('fs');
const path = require('path');
const outputDir = process.argv.length > 2 ? process.argv.splice(2) : ['dist']

const getExternal = () => {
  const external = process.env.EXTERNAL || ''
  try {
    JSON.parse(external)
    return external
  } catch (error) {
    return `"${external.trim()}"`
  }
}

outputDir.forEach((val) => {
  const outputVersionPath = path.join(process.cwd(), `${val}/version.json`);
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  fs.writeFile(outputVersionPath, `{ "version": "${process.env.VERSION || packageJsonObject.version}", "external": ${getExternal()} }`, () => {
    console.log(`created ${val}/version file`, process.env.VERSION || packageJsonObject.version);
  })
})