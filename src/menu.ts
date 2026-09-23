import * as prompts from '@clack/prompts'

export const showMenu = async (): Promise<void> => {
    prompts.intro('CALV-CLI')

    const choice = await prompts.select({
        message: 'Seleziona un’opzione',
        options: [{ value: 'work-in-progress', label: 'WORK IN PROGRESS' }],
    })

    if (prompts.isCancel(choice)) {
        prompts.cancel('Operazione annullata')
        return
    }

    prompts.outro('WORK IN PROGRESS')
}
