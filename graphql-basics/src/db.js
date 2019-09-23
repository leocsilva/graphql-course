const comments = [
    {
        id: '1',
        text: 'Comment 1',
        author_id: '1',
        post_id: '1'
    },
    {
        id: '2',
        text: 'Comment 2',
        author_id: '1',
        post_id: '1'
    },
    {
        id: '3',
        text: 'Comment 3',
        author_id: '2',
        post_id: '2'
    },
    {
        id: '4',
        text: 'Comment 4',
        author_id: '2',
        post_id: '3'
    },
    {
        id: '5',
        text: 'Comment 5',
        author_id: '1',
        post_id: '4'
    }
]

const posts = [{
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
const users = [{
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

const db = {
    users,
    posts,
    comments
}

export {db as default}