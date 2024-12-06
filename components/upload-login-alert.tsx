import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FaInfoCircle } from 'react-icons/fa'

export function UploadLoginAlert({ classes }: { classes?: string }) {
  return (
    <Alert className={classes}>
      <FaInfoCircle className="h-4 w-4" />
      <AlertTitle>Login alert</AlertTitle>
      <AlertDescription>
        Login to save your images in your account and access them later.
      </AlertDescription>
    </Alert>
  )
}
