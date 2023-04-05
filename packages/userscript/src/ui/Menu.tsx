import * as HoverCard from '@radix-ui/react-hover-card'
import { useCallback, useMemo, useState } from 'preact/hooks'
import { exportToHtml } from '../exporter/html'
import { exportToPng } from '../exporter/image'
import { exportToJson } from '../exporter/json'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToText } from '../exporter/text'
import { getHistoryDisabled } from '../page'
import { Divider } from './Divider'
import { ExportDialog } from './ExportDialog'
import { FormatProvider, useFormatContext } from './FormatContext'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconJSON, IconMarkdown, IconSetting, IconZip } from './Icons'
import { MenuItem } from './MenuItem'
import { MetaDataProvider, useMetaDataContext } from './MetaContext'
import { SettingDialog } from './SettingDialog'

import '../style.css'
import './Dialog.css'

const disabledTitle = `Exporter is relying on the History API.
But History feature is disabled by OpenAI temporarily.
We all have to wait for them to bring it back.`

function MenuInner({ container }: { container: HTMLDivElement }) {
    const disabled = getHistoryDisabled()

    const [open, setOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const { format } = useFormatContext()
    const { enableMeta, exportMetaList } = useMetaDataContext()
    const metaList = useMemo(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList])

    const onClickText = useCallback(() => exportToText(), [])
    const onClickPng = useCallback(() => exportToPng(format), [format])
    const onClickMarkdown = useCallback(() => exportToMarkdown(format, metaList), [format, metaList])
    const onClickHtml = useCallback(() => exportToHtml(format, metaList), [format, metaList])
    const onClickJSON = useCallback(() => exportToJson(format), [format])

    const isMobile = window.innerWidth < 768
    const Portal = isMobile ? 'div' : HoverCard.Portal

    if (disabled) {
        return (
            <MenuItem
                className="mt-1"
                text="Exporter unavailable"
                icon={IconArrowRightFromBracket}
                title={disabledTitle}
                disabled={true}
            />
        )
    }

    return (
        <>
            {isMobile && open && (
                <div
                    className="dropdown-backdrop animate-fadeIn"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            <HoverCard.Root
                openDelay={0}
                closeDelay={200}
                open={open}
                onOpenChange={setOpen}
            >
                <HoverCard.Trigger>
                    <MenuItem
                        className="mt-1"
                        text="Export"
                        icon={IconArrowRightFromBracket}
                        onClick={() => {
                            setOpen(true)
                            return true
                        }}
                    />
                </HoverCard.Trigger>
                <Portal
                    container={isMobile ? container : document.body}
                    forceMount={open || dialogOpen}
                >
                    <HoverCard.Content
                        className={isMobile
                            ? 'fixed grid grid-cols-2 gap-x-1 px-1.5 py-2 bg-gray-900 shadow-md transition-opacity duration-200 animate-slideUp'
                            : 'grid grid-cols-2 gap-x-1 px-1.5 py-2 pb-0 rounded-md bg-gray-900 shadow-md transition-opacity duration-200 animate-fadeIn'}
                        style={{
                            width: isMobile ? 316 : 268,
                            left: -6,
                            bottom: 'calc(-1 * var(--radix-popper-available-height))',
                        }}
                        sideOffset={8}
                        side={isMobile ? 'bottom' : 'right'}
                        align="start"
                        alignOffset={isMobile ? 0 : -64}
                    >
                        <SettingDialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                        >
                            <div className="row-full">
                                <MenuItem text="Setting" icon={IconSetting} />
                            </div>
                        </SettingDialog>

                        <MenuItem
                            text="Copy Text"
                            successText="Copied!"
                            icon={() => <IconCopy className="w-4 h-4" />}
                            className="row-full"
                            onClick={onClickText}
                        />
                        <MenuItem
                            text="Screenshot"
                            icon={IconCamera}
                            className="row-half"
                            onClick={onClickPng}
                        />
                        <MenuItem
                            text="Markdown"
                            icon={IconMarkdown}
                            className="row-half"
                            onClick={onClickMarkdown}
                        />
                        <MenuItem
                            text="HTML"
                            icon={FileCode}
                            className="row-half"
                            onClick={onClickHtml}
                        />
                        <MenuItem
                            text="JSON"
                            icon={IconJSON}
                            className="row-half"
                            onClick={onClickJSON}
                        />
                        <ExportDialog format={format}>
                            <div className="row-full">
                                <MenuItem
                                    text="Export All"
                                    icon={IconZip}
                                />
                            </div>
                        </ExportDialog>

                        <HoverCard.Arrow width="16" height="8" className="text-gray-900 fill-current" />
                    </HoverCard.Content>
                </Portal>
            </HoverCard.Root>
            <Divider />
        </>
    )
}

export function Menu({ container }: { container: HTMLDivElement }) {
    return (
        <FormatProvider>
            <MetaDataProvider>
                <MenuInner container={container} />
            </MetaDataProvider>
        </FormatProvider>
    )
}