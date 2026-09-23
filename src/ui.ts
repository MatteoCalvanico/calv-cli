const GLYPHS: Record<string, readonly string[]> = {
    C: [' ####', '#    ', '#    ', '#    ', ' ####'],
    A: [' ### ', '#   #', '#####', '#   #', '#   #'],
    L: ['#    ', '#    ', '#    ', '#    ', '#####'],
    V: ['#   #', '#   #', '#   #', ' # # ', '  #  '],
    '-': ['     ', '     ', '#####', '     ', '     '],
    I: ['#####', '  #  ', '  #  ', '  #  ', '#####'],
}

const NAME = 'CALV-CLI'
const LOGO = Array.from({ length: 5 }, (_, row) =>
    [...NAME].map((letter) => GLYPHS[letter][row]).join(' ')
)

const RESET = '\u001B[0m'
const BOLD = '\u001B[1m'
const DIM = '\u001B[2m'
const BLUE = 33
const FADE_COLORS = [17, 18, 19, 20, 21, 27, BLUE]
const CLEAR_SCREEN = '\u001B[2J\u001B[H'
const ENTER_SCREEN = '\u001B[?1049h\u001B[?25l'
const LEAVE_SCREEN = '\u001B[?25h\u001B[?1049l'
const TOOLTIP = '[ESC] Salta intro'

const supportsColor = (): boolean =>
    Boolean(process.stdout.isTTY && !('NO_COLOR' in process.env) && process.env.FORCE_COLOR !== '0')

const supportsAnimation = (): boolean =>
    Boolean(supportsColor() && process.stdin.isTTY && !('CI' in process.env))

const wait = async (durationMs: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, durationMs))

const center = (line: string, width: number): string =>
    `${' '.repeat(Math.max(0, Math.floor((width - line.length) / 2)))}${line}`

const renderFrame = (lines: readonly string[], color: number): string => {
    const columns = process.stdout.columns ?? 80
    const rows = process.stdout.rows ?? 24
    const top = '\n'.repeat(Math.max(0, Math.floor((rows - lines.length - 2) / 2)))
    const body = lines.map((line) => center(line, columns)).join('\n')
    return `${CLEAR_SCREEN}${top}\u001B[38;5;${color}m${BOLD}${body}${RESET}\n\n\u001B[38;5;245m${DIM}${center(TOOLTIP, columns)}${RESET}`
}

const explosionFrames = (): readonly (readonly string[])[] => {
    const width = LOGO[0].length
    const burst = LOGO.map((line, row) =>
        row === 2 ? `* ${line} *` : `  ${line}  `
    )
    const scattered = Array.from({ length: 5 }, (_, row) =>
        [...NAME].map((letter, index) =>
            `${' '.repeat((index * 7 + row * 3) % 6)}${letter}`
        ).join('    ').padEnd(width)
    )
    const particles = [
        '  .                 +          *',
        '          *                    .',
        '    +            .       *',
        '              *             +',
        '  *                    .',
    ]
    return [burst, scattered, particles]
}

const playIntro = async (): Promise<void> => {
    const wasPaused = process.stdin.isPaused()
    const wasRaw = process.stdin.isRaw
    let skipped = false
    const skipOnEscape = (input: Buffer | string): void => {
        if (input.toString() === '\u001B') skipped = true
    }

    try {
        if (!wasRaw) process.stdin.setRawMode(true)
        process.stdin.resume()
        process.stdin.on('data', skipOnEscape)
        process.stdout.write(ENTER_SCREEN)

        for (const color of FADE_COLORS) {
            if (skipped) break
            process.stdout.write(renderFrame(LOGO, color))
            await wait(110)
        }

        if (!skipped) {
            process.stdout.write(renderFrame(LOGO, 15))
            await wait(85)
            for (const frame of explosionFrames()) {
                if (skipped) break
                process.stdout.write(renderFrame(frame, BLUE))
                await wait(170)
            }
        }
    } finally {
        process.stdin.removeListener('data', skipOnEscape)
        if (!wasRaw) process.stdin.setRawMode(false)
        if (wasPaused) process.stdin.pause()
        process.stdout.write(LEAVE_SCREEN)
    }
}

export const printLogo = async (): Promise<void> => {
    if (supportsAnimation()) await playIntro()

    const color = supportsColor()
    const logo = LOGO.map((line) =>
        color ? `\u001B[38;5;${BLUE}m${BOLD}${line}${RESET}` : line
    ).join('\n')
    const subtitle = 'CALV-CLI · CLI personale'
    process.stdout.write(`\n${logo}\n\n${color ? `${DIM}${subtitle}${RESET}` : subtitle}\n`)
}
