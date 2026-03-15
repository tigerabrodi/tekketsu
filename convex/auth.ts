import Google from '@auth/core/providers/google'
import { convexAuth } from '@convex-dev/auth/server'
import type { MutationCtx } from './_generated/server'

// CUSTOMIZE: Add or replace auth providers
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    // CUSTOMIZE: Add post-signup logic
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId }) {
      const user = await ctx.db.get(userId)
      const isDev =
        (
          globalThis as {
            process?: {
              env?: {
                IS_DEV?: string
              }
            }
          }
        ).process?.env?.IS_DEV === 'true'

      if (!user) {
        return
      }

      if (user.isAdmin === undefined) {
        await ctx.db.patch(userId, { isAdmin: isDev })
      }
    },
  },
})
