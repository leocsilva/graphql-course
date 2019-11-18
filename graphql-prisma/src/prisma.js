import { Prisma } from "prisma-binding"
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret : '2c84f254-f2d5-445d-9b78-536f0870d024',
    fragmentReplacements
})

export {prisma as default}