const Query = {
    users(parent, args, { prisma }, info) {

        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [
                    {
                        name_contains: args.query
                    },
                    {
                        email_contains: args.query
                    }
                ]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [
                    {
                        title_contains: args.query
                    },
                    {
                        body_contains: args.query
                    }
                ]
            }
        }

        return prisma.query.posts(opArgs, info)
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
}

export { Query as default }