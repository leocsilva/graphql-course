const Comment = {
    author(parent, args, { db }, info) {
        return db.users.find(user => parent.author_id == user.id)
    },
    post(parent, args, { db }, info) {
        return db.posts.find((post) => post.id == parent.post_id)
    }
}

export {Comment as default}