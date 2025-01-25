let todos = []

module.exports = (req, res) => {
    if (req.method === 'GET') {
        const searchParams = req.query.searchParams
        const userTodos = todos.filter(todo => todo.userId === req.userId)
        const requestedTodos = searchParams ?
            userTodos.filter(todo => todo.header.includes(searchParams)
                || todo.description.includes(searchParams))
            : userTodos
        res.status(200).json({
            todos: requestedTodos,
            todosCount: requestedTodos.length
        })
    } else if (req.method === 'POST') {
        let userTodos = todos.filter(todo => todo.userId === req.userId)
        const newTodo = {
            id: userTodos.length,
            header: req.body.header,
            description: req.body.description,
            completed: false,
            userId: req.userId
        }
        todos = [...todos, newTodo]
        userTodos = [...userTodos, newTodo]
        res.status(200).json({
            statusCode: 0,
            messages: [],
            data: {
                todo: {
                    id: newTodo.id,
                    header: newTodo.header,
                    description: newTodo.description,
                    completed: false
                },
                todosCount: userTodos.length
            }
        })

    } else if (req.method === 'PUT') {
        let userTodos = todos.filter(todo => todo.userId === req.userId)
        if (req.body.type === 'remove') {
            const taskToDelete = todos.find(todo => todo.userId === req.userId && todo.id === req.body.id)
            todos = todos.filter(todo => todo !== taskToDelete)
            userTodos = userTodos.filter(todo => todo.id !== req.body.id)
            for (let i = req.body.id; i < userTodos.length; i++) {
                userTodos[i].id = i
            }
            res.status(200).json({
                statusCode: 0,
                messages: [],
                data: {
                    todos: userTodos,
                    todosCount: userTodos.length
                }
            })
        } else if (req.body.type === 'edit') {
            userTodos[req.body.id].header = req.body.header
            userTodos[req.body.id].description = req.body.description
            res.status(200).json({
                statusCode: 0,
                messages: [],
                data: userTodos[req.body.id]
            })
        } else if (req.body.type === 'complete') {
            userTodos[req.body.id].completed = !userTodos[req.body.id].completed
            res.status(200).json({
                statusCode: 0,
                messages: [],
                data: {
                    id: req.body.id,
                    completed: userTodos[req.body.id].completed
                }
            })
        }
    }
};