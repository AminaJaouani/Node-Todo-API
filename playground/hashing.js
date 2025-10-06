const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

var data = {
    id: 10
}

var token = jwt.sign(data, '123ABC')
console.log(token)
var decoded = jwt.verify(token, '123ABC')
console.log(decoded)

// var message = 'I am user'
// var hash= SHA256(message).toString()

// console.log(`Message : ${message}`)
// console.log(`Hash : ${hash}`)

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) +'somesecret').toString()


