const url = "http://localhost:3000/todos";

const dom = {
    input: document.querySelector('input'),
    btn: document.querySelector('.btn'),
    todos: document.querySelector('.todos'),
};


function render(todos) {
    dom.todos.innerHTML = '';
    todos.forEach(todo => {
        dom.todos.innerHTML += `
        <li data-id = "${todo.id}"> ${todo.id}.
        <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.title}</span>
        <span><button id="${todo.id}" todo-title=${todo.title} onclick="completeTodo()"><i class="fa-solid fa-check"></i></button>
        <button id="${todo.id}" onclick="delTodos()"><i class="fa-solid fa-xmark"></i></button></span></li>`
    });
}



function addTodo(todo) {

    todoValue = dom.input.value;

    dom.input.value = '';
    addTodos(url, todoValue);

}

function fetchTodos(url) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            todos = data;
            render(todos);
        });
}

function addTodos(url, title) {
    const newTodo = {
        "title": title,
        "completed": false
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

        .then((response) => response.json())
        .then((data) => {
            todos.push(data);
            window.localStorage.setItem('Added todo', JSON.stringify(todos))
            fetchTodos(url);
        })
}

function completeTodo() {
    const el = event.target;
    const id = el.parentElement.getAttribute("id");
    const title = el.parentElement.getAttribute("todo-title");

    fetch(`${url}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: title,
            completed: true
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

        .then((response) => response.json())
        .then((data) => {
            todos.push(data);
            window.localStorage.setItem('Completed todo', JSON.stringify(todos))
            fetchTodos(url);
        })
}

function delTodos() {

    const el = event.target;
    const id = el.parentElement.getAttribute("id");

    fetch(`${url}/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            fetchTodos(url);
        })
        .catch(e => console.log(`Error:${e}`))
    window.localStorage.setItem('Deleted todo', JSON.stringify(todos))
}

dom.btn.addEventListener('click', addTodo);

fetchTodos(url);
