const {ObjectId} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// var id = '68d6990ac0d54431ffb70dd8'

// if (!ObjectId.isValid(id)){
//     console.log("Id not valid")
// }

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo', todo)
// })

// Todo.findById(id).then((todo)=>{
//     if (!todo){
//         return console.log('Id not found')
//     }
//     console.log('Todo by Id', todo)
// }).catch((e)=> console.log(e))

var id = "68d3d0cbbab1ee875224fa2e"

if (!ObjectId.isValid(id)){
    console.log('Id is not valid ')
}

User.findById(id).then((user) =>{
    if (!user){
        return console.log("Id not found :(")
    }
    console.log("User : ",user)
}).catch((e)=>{
    console.log(e)
})

