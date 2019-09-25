import uuidv4 from 'uuid/v4'

const Mutation = {
    deleteComment(parent, args, { db, pubSub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found!')
        }

        const deletedComments = db.comments.splice(commentIndex, 1)

        pubSub.publish(`comment ${deletedComments[0].post_id}`,  {
            comment : {
                mutation: 'DELETED',
                data: deletedComments[0]
            }
        })

        return deletedComments[0]

    },          
    deletePost(parent, args, { db, pubSub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post not found!')
        }

        const deletedPosts = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter((comment) => comment.post_id !== args.id)

        pubSub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: deletedPosts[0]
            }
        })

        return deletedPosts[0]

    },        
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error('User not found!')
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                db.comments = db.comments.filter((comment) => comment.post_id !== post.id)
            }

            return !match
        })

        db.comments = db.comments.filter((comment) => comment.author_id !== args.id)

        return deletedUsers[0]

    },
    createComment(parent, args, { db, pubSub }, info) {

        if (!db.users.some((user) => user.id === args.data.authorId)) {
            throw new Error('User not found!')
        }

        if (!db.posts.some((post) => post.id === args.data.postId && post.published)) {
            throw new Error('Post not found or not published!')
        }

        const comment = {
            id: uuidv4(),
            text: args.data.text,
            author_id: args.data.authorId,
            post_id: args.data.postId,
        }

        db.comments.push(comment)
        pubSub.publish(`comment ${args.data.postId}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment

    },
    createUser(parent, args, { db }, info) {

        if (db.users.some((user) => user.email === args.data.email)) {
            throw new Error('Email taken')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user

    },
    createPost(parent, args, { db, pubSub }, info) {

        if (!db.users.some((user) => user.id === args.data.authorId)) {
            throw new Error('User not found!')
        }

        const post = {
            id: uuidv4(),
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: args.data.authorId
        }

        db.posts.push(post)
        pubSub.publish('post', {
            post: {
                mutation: 'CREATED',
                data: post 
            }
        })

        return post
    },
    updateUser(parent, args, { db }, info) {
        const user = db.users.find((user) => user.id === args.id)

        if (!user) {
            throw new Error('User not found!')
        }

        const emailTaken = db.users.some((user) => args.data.email === user.email && user.id !== args.id)

        if (emailTaken) {
            throw new Error('Email taken')
        }

        user.email = args.data.email
        user.name = args.data.name
        user.age = args.data.age

        return user

    },
    updatePost(parent, args, { db, pubSub }, info) {
        const post = db.posts.find((post) => post.id === args.id)

        if (!post) {
            throw new Error('Post not found!')
        }

        post.title = args.data.title
        post.body = args.data.body
        post.published = args.data.published

        pubSub.pubSub('post', {
            post: {
                mutation: 'UPDATED',
                data: post
            }
        })

        return post

    },
    updateComment(parent, args, { db, pubSub }, info) {
        const comment = db.comments.find((comment) => comment.id === args.id)

        if (!comment) {
            throw new Error('Comment not found!')
        }

        comment.text = args.data.text

        pubSub.publish(`comment ${comment.post_id}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export {Mutation as default}