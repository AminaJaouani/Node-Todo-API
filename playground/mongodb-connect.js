const { MongoClient, ObjectId} = require('mongodb');


async function run() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        // 3️⃣ Connect
        await client.connect();
        console.log('Connected');

        const db = client.db('TodoApp');

        // 4️⃣ Insert (no callback; use await)
        const result = await db.collection('Users').insertOne({
            name: 'Amina',
            age: 24,
            location: 'Paris'
        });

        // // 5️⃣ Log the inserted id
        // console.log('Inserted todo with id:', JSON.stringify(result, undefined, 2));

    //     const result = await db.collection('Users').insertOne({
            
    //         name: 'Amina',
    //         age: 22,
    //         location: 'Paris'
    //     })
    //     console.log('Inserted todo with id:', JSON.stringify(result.insertedId.getTimestamp(), undefined, 2));


    // } catch (err) {
    //     console.error('Unable to insert todo', err);
    // } 
    }
    
    finally {
        // 6️⃣ Close after everything finishes
        await client.close();
    }
}

run();
