import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteUser(id: ID!): User!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreateCommentInput {
        text: String!
        authorId: ID!
        postId: ID!
    }    

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!,
        authorId: ID!
    }    

    type User  {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
let comments = [
    {
        id: '1',
        text: 'Comment 1',
        author_id: 1,
        post_id: 1
    },
    {
        id: '2',
        text: 'Comment 2',
        author_id: 1,
        post_id: 1
    },
    {
        id: '3',
        text: 'Comment 3',
        author_id: 2,
        post_id: 3
    },
    {
        id: '4',
        text: 'Comment 4',
        author_id: 2,
        post_id: 4
    }
]

let posts = [{
    id: '1',
    title: 'GrahQL course 101',
    body: 'This is a new GraphQL Course 2018',
    published: true,
    author: '1'
},
{
    id: '2',
    title: 'GrahQL course 102',
    body: 'This is a new GraphQL Course 2019',
    published: false,
    author: '1'
},
{
    id: '3',
    title: 'GrahQL course 103',
    body: 'This is a new GraphQL Course 2020',
    published: false,
    author: '2'
},
{
    id: '4',
    title: 'GrahQL course 104',
    body: 'This is a new GraphQL Course 2021',
    published: false,
    author: '2'
}
]
let users = [{
    id: '1',
    name: 'Leonildo',
    email: 'leocsilva@gmail.com',
    age: 40
},
{
    id: '2',
    name: 'Lucelia',
    email: 'lucelia@gmail.com',
    age: 39
}
]

// Resolvers
const resolvers = {
    Mutation: {
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('User not found!')
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    comments = comments.filter((comment) => comment.post_id !== post.id)
                }

                return !match
            })

            comments = comments.filter((comment) => comment.author_id !== args.id)

            return deletedUsers[0]

        },
        createComment(parent, args, ctx, info) {

            if (!users.some((user) => user.id === args.data.authorId)) {
                throw new Error('User not found!')
            }

            if (!posts.some((post) => post.id === args.data.postId && post.published)) {
                throw new Error('Post not found or not published!')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment

        },
        createUser(parent, args, ctx, info) {

            if (users.some((user) => user.email === args.data.email)) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user

        },
        createPost(parent, args, ctx, info) {

            if (!users.some((user) => user.id === args.data.authorId)) {
                throw new Error('User not found!')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        }
    },
    Query: {
        comments(parent, args, ctx, info) {
            return comments
        },
        posts(parent, args, ctx, info) {
            return args.query ? posts.filter((post) => post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())) : posts
        },
        users(parent, args, ctx, info) {
            return args.query ? users.filter((user) => user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())) : users
        },
        me() {
            return {
                id: 'abc',
                name: 'Leonildo',
                email: 'leocsilva@gmail.com',
                age: 40
            }
        },
        post() {
            return {
                id: 'abc',
                title: 'GrahQL course',
                body: 'This is a new GraphQL Course',
                published: true
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => parent.author == user.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post_id == parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => parent.id == post.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => parent.id == comment.author_id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => parent.author_id == user.id)
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id == parent.post_id)
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('The server is up!'))