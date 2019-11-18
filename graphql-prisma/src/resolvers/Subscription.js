const Subscription = {
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    },
    comment: {
        subscribe(parent, { id }, { prisma }, info) {
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id
                        }
                    }
                }
            }, info)
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
            }, 1000)

            return pubSub.asyncIterator('count')


        }
    }

}

export { Subscription as default }