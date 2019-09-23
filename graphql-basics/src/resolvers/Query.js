const Query = {
    comments(parent, args, { db }, info) {
        return db.comments
    },
    posts(parent, args, { db }, info) {
        return args.query ? db.posts.filter((post) => post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())) : db.posts
    },
    users(parent, args, { db }, info) {
        return args.query ? db.users.filter((user) => user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())) : db.users
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

export {Query as default}