import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const Mutation = {

    async login(parent, args, { prisma }, info) {

        const user = await prisma.query.user({ where: { email: args.data.email } })

        if (!user) {
            throw new Error('Login não autorizado')
        }

        if (! await bcrypt.compare(args.data.password, user.password)) {
            throw new Error('Login não autorizado')
        }

        return {
            token: jwt.sign({ userId: user.id }, 'thisisasecret'),
            user: { ...user }
        }

    },

    // USER
    async createUser(parent, args, { prisma }, info) {

        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 character or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)

        const emailTaken = await prisma.exists.User({ email: args.data.email })

        if (emailTaken) {
            throw new Error('Email taken!')
        }

        return prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        }, info)

    },
    updateUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)

    },    

    deleteUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)
        return prisma.mutation.deleteUser({ where: { id: userId } }, info)

    },
    
    // POST
    createPost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const data = {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
                connect: {
                    id: userId
                }
            }
        }

        return prisma.mutation.createPost({ data }, info)

    },
    async updatePost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to update post')
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)

    },
    async deletePost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost({ where: { id: args.id } }, info)

    },

    // COMMENT
    async createComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const published = await prisma.exists.Post({
            id: args.data.postId,
            published: true
        })

        if (! published) {
            throw new Error("This post is not published")
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.postId
                    }
                }
            }
        }, info)

    },    

    async updateComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to update comment')
        }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    async deleteComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({ where: { id: args.id } }, info)

    },    
}

export { Mutation as default }