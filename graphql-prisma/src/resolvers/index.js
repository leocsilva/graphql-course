import { extractFragmentReplacements } from 'prisma-binding'

import Query from './Query'
import Post from './Post'
import Mutation from './Mutation'
import User from './User'
import Comment from './Comment'
import Subscription from './Subscription'

const resolvers = {
    Mutation,
    Query,
    Post,
    User,
    Comment,
    Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }