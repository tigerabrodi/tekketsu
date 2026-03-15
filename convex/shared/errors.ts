import { ConvexError } from 'convex/values'

type AppErrorCode = 'NOT_AUTHENTICATED' | 'NOT_AUTHORIZED' | 'NOT_FOUND'

type AppErrorData = {
  code: AppErrorCode
  message: string
}

export function appError({
  code,
  message,
}: {
  code: AppErrorCode
  message: string
}): ConvexError<AppErrorData> {
  return new ConvexError({ code, message })
}

export type { AppErrorCode, AppErrorData }
