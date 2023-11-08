import { Switch } from '@headlessui/react'

interface ToggleProps {
    label?: string
    checked?: boolean
    onCheckedUpdate?: (checked: boolean) => void
}

/**
 * Mimics the style of OpenAI's toggle switches.
 */
export const Toggle = ({ label, checked = true, onCheckedUpdate }: ToggleProps) => {
    return (
        <div className="inline-flex items-center">
            <Switch
                checked={checked}
                onChange={onCheckedUpdate}
                data-state={checked ? 'checked' : 'unchecked'}
                className="bg-gray-200 radix-state-checked:bg-green-600 relative h-6 w-[42px] cursor-pointer rounded-full shrink-0"
            >
                <span
                    data-state={checked ? 'checked' : 'unchecked'}
                    className="block h-5 w-5 rounded-full translate-x-0.5 transition-transform duration-100 will-change-transform radix-state-checked:translate-x-[19px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                >
                </span>
            </Switch>
            {label && <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>}
        </div>
    )
}
