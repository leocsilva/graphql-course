import { GraphQLServer, PubSub } from 'graphql-yoga'
import  db from './db'
import Query from './resolvers/Query'
import Post from './resolvers/Post'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'

const pubSub = new PubSub()

const resolvers = {
    Mutation,
    Query,
    Post,
    User,
    Comment,
    Subscription
}

const server = new GraphQLServer({ 
    typeDefs : './src/schema.graphql', 
    resolvers,
    context: {
        db,
        pubSub
    }
})

server.start(() => console.log('The server is up!'))