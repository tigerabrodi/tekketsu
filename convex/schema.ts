import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
    // CUSTOMIZE: Add app-specific user fields (e.g., hasPaid, plan)
    isAdmin: v.optional(v.boolean()),
  })
    .index('email', ['email'])
    .index('phone', ['phone']),
  // CUSTOMIZE: Add your app-specific tables below
})

export default schema
