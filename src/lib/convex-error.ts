import type { AppErrorData } from '@convex/shared/errors'
import { ConvexError } from 'convex/values'

const FALLBACK_MESSAGE = 'Something went wrong — please try again'

function isAppError(error: unknown): error is ConvexError<AppErrorData> {
  return (
    error instanceof ConvexError &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'code' in error.data &&
    'message' in error.data
  )
}

export function getConvexErrorMessage(error: unknown): string {
  return isAppError(error) ? error.data.message : FALLBACK_MESSAGE
}

// CUSTOMIZE: Add your toast library import and use toastConvexError to show error toasts
// Example:
// export function toastConvexError(error: unknown): string {
//   const message = getConvexErrorMessage(error)
//   toast.error(message)
//   return message
// }
