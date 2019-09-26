import { Prisma } from "prisma-binding"

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

prisma.mutation.updatePost({
    data : {
        body: "Corpo alterado",
        published: true,
    },
    where: {
        id: "ck111wut1003s0725lrovx3ie"
    }

}, '{id title body published}').then((data)=>{
    console.log(data);
    
})