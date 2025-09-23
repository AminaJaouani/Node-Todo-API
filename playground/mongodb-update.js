const { MongoClient, ObjectId} = require('mongodb');

async function run() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Connected');

        const db = client.db('TodoApp');

        await db.collection('Todos').findOneAndUpdate({
            _id: new ObjectId("68d13e4542fe3e426446cdf5")
        }, {
            $set :{
                completed: false
            }
        },{
            returnOriginal: false
        }
        ).then ((result)=>{
            console.log(result)
        })

        await db.collection('Users').findOneAndUpdate({
            _id: new ObjectId("68d29f50fe61b89878d0ca7b")
        },{
            $set: {
                name: 'Amina',
                
            },
            $inc: {
                age: 1
            }
        },{
            returnOriginal: false
        }).then ((result)=>{
            console.log(result)
        })
    }
    
    finally {
        await client.close();
    }
}

run();
