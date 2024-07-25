import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'node:child_process'
import path, { resolve } from 'path'
import root from './root'

function npmInit(projectPath: string) {
  try {
    const initFile = resolve(__dirname, '../templates/npm-init.json')
    const npmInitContents = readFileSync(initFile, 'utf8')

    const pkg = JSON.parse(npmInitContents)

    pkg.name = root.name(projectPath)

    writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(pkg, null, 2)
    )
    console.log('Initialized a new package.json file.')
  } catch (err) {
    console.error('Error initializing package.json:', err)
    process.exit(1)
  }
}

const installDependencies = (
  projectPath: string,
  { express }: { express: boolean } = { express: false }
) => {
  const devDependenciesList = [
    'nodemon',
    'npm-run-all',
    'prettier',
    'typescript',
    '@types/node',
  ]

  if (express) devDependenciesList.push('@types/express')

  const devDependencies = devDependenciesList.join(' ')

  const dependenciesList = ['dotenv']

  if (express) dependenciesList.push('express')

  const dependencies = dependenciesList.join(' ')

  try {
    console.log('Installing devDependencies...')
    execSync(`npm install --save-dev ${devDependencies}`, {
      cwd: projectPath,
      stdio: 'inherit',
    })

    console.log('Installing dependencies...')
    execSync(`npm install ${dependencies}`, {
      cwd: projectPath,
      stdio: 'inherit',
    })

    console.log('Dependencies installed.')
  } catch (error) {
    console.error('Error installing dependencies:', error)
    process.exit(1)
  }
}

export default { init: npmInit, installDependencies }
