import { Prisma } from "prisma-binding"

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})



const users1 = prisma.query.comments(null, '{id text author {id name}}').then((data)=>{

    console.log(data);
})
