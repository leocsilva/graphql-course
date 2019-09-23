const Subscription = {
    post: {
        subscribe(parent, { id }, { pubSub, db }, info) {
            return pubSub.asyncIterator('post')
        }
    },
    comment : {
        subscribe(parent, { id }, { pubSub, db }, info) {
            const post = db.posts.find((post) => post.id = id)

            if (!post) {
                throw new Error('Post not found!')
            }

            return pubSub.asyncIterator(`comment ${id}`)
        }
    },
    count: {

        subscribe(parent, args, { pubSub }, info) {
            let count = 0

            setInterval(_ => {
                count++
                pubSub.publish('count', {
                    count
                })
            },1000)

            return pubSub.asyncIterator('count')


        }
    }

}

export { Subscription as default }