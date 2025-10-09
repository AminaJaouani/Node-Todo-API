const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')



const userOneId = new ObjectId()
const userTwoId = new ObjectId()

const users = [{
    _id : userOneId,
    email: "andrew@example.com",
    password: "userOnePass",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
    },{
        _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass'
    }]

const todos = [{
    _id: new ObjectId(),
    text: "First test todo"
}, {
    _id: new ObjectId(),
    text: "Second test todo",
    completed: true,
    completedAt: 2345
}]

const populateTodos = (done)=>{
    Todo.deleteMany({}).then(()=> {
        return Todo.insertMany(todos)
    }).then (()=> done())
}

const populateUsers = (done) => {
  User.deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done())
    .catch(done);
};


module.exports = { todos, populateTodos, users, populateUsers}