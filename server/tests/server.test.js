const { expect } = require('expect');
const request = require('supertest')
const {ObjectId} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos,populateTodos, populateUsers, users} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos)

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err, res)=>{
                if (err){
                    return done(err)
                }

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e)=>  done (e))
            })
    })

    it('should not create todo with invalid body data', (done)=>{
        var text ="h"

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if (err){
                    return done(err)
                }
            })

            Todo.find().then((todos) =>{
                expect(todos.length).toBe(2)
                done()
            }).catch((e)=> done(e))
    })
})

describe('GET /todos', ()=>{
    it("Should get all todos", (done)=>{
        request(app)
        .get("/todos")
        .expect(200)
        .expect((res) =>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done)
    })
})

describe('GET /todos/:id', ()=>{
    it('Should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('Should return 404 if todo is not found', (done)=>{
        var id = new ObjectId()

        request(app)
        .get(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done)
    })

    it('Should return 404 for non-object ids', (done)=>{
        var id = 123

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done)
    })
})

describe('DELETE /todos/:id', ()=>{
    it('Should return the deleted doc', (done)=>{
        var id = todos[0]._id.toHexString()

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(id)
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }

            Todo.findById(id).then((todo)=>{
                expect(todo).toBeFalsy();
                done()
            }).catch((e)=>{
                done(e)
            })
        })
    })

    it('Should return 404 if todo not found', (done)=>{
        var id = new ObjectId()

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done)
    })

    it('Should return 404 for non-object ids', (done)=>{
        var id = 123

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done)
    })
})

describe("PATCH /todos/:id", ()=>{
    it("should update the todo", (done)=>{
        var id = todos[0]._id.toHexString()
        var text = "The test update"

        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(typeof res.body.todo.completedAt).toBe('number'); 
        }).end(done)
    })

    it("should clear completedAt when todo is not completed", (done)=>{
        var id = todos[1]._id.toHexString()

        var text = "New modifications on the second todo object"

        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toBeNull()
        })
        .end(done)
    })
})

describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })
    it('should return 401 if not authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done)
        //expect 401
        //no need for x auth
        //body empty object
        //toEqual

    })
})

describe('POST /users', ()=>{
    it('should create a user ', (done)=>{
        var email = 'example@example.com';
        var password = "123ABC!"

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.header['x-auth']).toBeDefined()
            expect(res.body._id).toBeDefined()
            expect(res.body.email).toBe(email)
        })
        .end((err)=>{
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user)=>{
                expect(user).toBeDefined()
                expect(user.password).toNotBe(password) 
                done();
            })
        })
        done()

    })
    it('should return validation errors if request invalid ', (done)=>{
        var email = "@"
        var password = "abc"

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done)
        
        //invalid email & invalid password
        //400

        
    })
    it('should not create a user if email in use', (done)=>{
        var email = users[0].email
        var password = "password 5"

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)
        // use email already in use 400
    })
})
