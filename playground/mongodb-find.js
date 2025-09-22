const { MongoClient, ObjectId} = require('mongodb');

async function run() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Connected');

        const db = client.db('TodoApp');

        // await db.collection('Todos').find({
        //     _id: new ObjectId('68d05f033e4593088da7eb83')
        
        // }).toArray().then((docs)=> {
        //     console.log('Todos'),
        //     console.log(JSON.stringify(docs,undefined,2))
        // },(err) =>{
        //     console.log('Unable to fetch todos', err)
        // })

        await db.collection('Users').find({
            name: 'Amina'
        }).toArray().then((docs)=> {
            console.log('Users'),
            console.log(JSON.stringify(docs,undefined,2))
        },(err) =>{
            console.log('Unable to fetch todos', err)
        })

        await db.collection('Todos').find().count().then((count)=> {
            console.log('Todos count: ', count)
            // console.log(JSON.stringify(docs,undefined,2))
        },(err) =>{
            console.log('Unable to fetch todos', err)
        })

        await db.collection('Todos').countDocuments().then((count)=> {
            console.log('Todos count: ', count)
            // console.log(JSON.stringify(docs,undefined,2))
        },(err) =>{
            console.log('Unable to fetch todos', err)
        })

        
    }
    
    finally {
        await client.close();
    }
}

run();
