#!/usr/bin/env node

import * as prompts from '@clack/prompts'
import { Command } from 'commander'
import packageMetadata from '../package.json' with { type: 'json' }
import { showMenu } from './menu.js'
import { printLogo } from './ui.js'

const program = new Command()
    .name('calv')
    .description('CLI personale interattiva')
    .version(packageMetadata.version)
    .action(showMenu)

await printLogo()

try {
    await program.parseAsync(process.argv)
} catch (error) {
    prompts.cancel(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
}
