import { FcOpenedFolder } from 'react-icons/fc'
import { MdOutlineInfo } from 'react-icons/md'
import { Separator } from '@/components/ui/separator'
import { bytesToMegaBytes, readableFileType } from '@/lib/utils'
import { ChangeEvent } from 'react'
import { CONFIG } from '@/app/config'
import { BrowseFilesBtn } from './browse-files-btn'

export function EmptyDropZone({
  handleOnBrowse,
}: {
  handleOnBrowse: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const acceptedFileTypes = CONFIG.FILE_TYPES.ACCEPTED.map((t) =>
    readableFileType(t),
  )
    .map((t) => `.${t}`)
    .toString()
    .replaceAll(',', ', ')
  return (
    <div className="py-10 px-2 flex flex-col items-center">
      <FcOpenedFolder className="text-6xl my-4" />
      <h1 className="text-xl font-semibold">Drag and drop here</h1>
      <Separator className="bg-secondary-foreground my-4 max-w-sm" />
      <BrowseFilesBtn handleOnBrowse={handleOnBrowse} />

      <div className="mt-14">
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Accepted file types: {acceptedFileTypes}
        </p>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Max file size:{' '}
          {bytesToMegaBytes(CONFIG.MAX_FILE_SIZE, true)}
        </p>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <MdOutlineInfo /> Max images per upload: {CONFIG.MAX_FILES_PER_UPLOAD}
        </p>
      </div>
    </div>
  )
}
