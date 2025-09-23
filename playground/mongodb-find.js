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

        
        //deleteMany
        // await db.collection('Todos').deleteMany({
        //     text: "Something to do"
        // }) .then ((result)=>{
        //     console.log(result)
        // })

        //deleteOne
        // await db.collection('Todos').deleteOne({
        //     text: "study nodejs"
        // }) .then ((result)=>{
        //     console.log(result)
        // })

        await db.collection('Users').deleteMany({
            name: "Amina"
        }) .then ((result)=>{
            console.log(result)
        })

        //findOneAndDelete
        await db.collection('Users').findOneAndDelete({_id: new ObjectId("68d159e942fe3e426446cdfe")}).then ((result)=>{
            console.log(result)
        })


        
    }
    
    finally {
        await client.close();
    }
}

run();
