const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.remove({}).then((result)=>{
//     console.log(result)
// })

// Todo.findOneAndDelete()
// Todo.findByIdAndDelete()



Todo.findByIdAndDelete('68d6ed29bc04fd9984ed78f1').then((todo)=>{
    console.log("todo deleted ", todo)
})


