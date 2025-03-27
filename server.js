const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/Schema');
const cors = require('cors');
const Todo = require('./models/TodoSchema');

//this is sample branch

app.use(express.json()); // Middleware to parse incoming requests
app.use(cors()); // Middleware to allow cross-origin requests

mongoose.connect("mongodb+srv://app:app@appdevelopemt.tnaco.mongodb.net/?retryWrites=true&w=majority&appName=appdevelopemt").then(() => console.log('Connected to MongoDB')).catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello World!'); // Send a response to the client
});

app.post('/addtodo', async (req, res) => {
    try {
        const { todo, status } = req.body;
        const newTodo = new Todo({
            todo,
            status
        });
        await newTodo.save();
        res.status(200).json(await Todo.find());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/gettodos', async (req, res) => {
    try {
        res.status(200).json(await Todo.find());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete('/deletetodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Todo.findByIdAndDelete(id);
        res.status(200).json(await Todo.find());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/updatetodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);
        todo.status = !todo.status;
        await todo.save();
        res.status(200).json(await Todo.find());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/edittodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { todo } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { todo }, { new: true });
        if (updatedTodo) {
            res.status(200).json(await Todo.find());
        } else {
            res.status(404).json('Todo not found');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, email, mobileNumber } = req.body;
        const user = new User({
            username,
            password,
            email,
            mobileNumber
        });
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            user.password === password ? res.status(200).json(user) : res.status(400).json('Wrong credentials');
        } else {
            res.status(404).json('User not found');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }); // uername: soemthing
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json('User not found');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/update/:username', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.params.username }, req.body);
        if (user) {
            res.status(200).json("update sucessfully");
        } else {
            res.status(404).json('User not found');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}
);

app.delete('/delete/:username', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ username: req.params.username });
        if (user) {
            res.status(200).json("delete sucessfully");
        } else {
            res.status(404).json('User not found');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}
);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

//curd operations
//create    - post
//update    - put
//read      - get
//delete    - delete