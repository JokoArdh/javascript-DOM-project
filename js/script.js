const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function() {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addTodo();
    });


});

document.addEventListener(RENDER_EVENT, function() {
    //console.log(todos);  ini untuk mengecek apakah elemen bisa tampil di konsole browser

    //ketika belum selesai dilakukan
    const uncompletedTodoList = document.getElementById("todos");
    uncompletedTodoList.innerHTML = "";

    //ketika sudah dilakukan
    const completedTodeList = document.getElementById("completed-todos");
    completedTodeList.innerHTML = "";

    for (todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        //uncompletedTodoList.append(todoElement);  --> ada percabngan untuk yg selesai dikerjkn db belum 

        if (todoItem.isComplet == false) {
            uncompletedTodoList.append(todoElement);
        } else {
            completedTodeList.append(todoElement);
        }
    }
});

function generateId() {
    return +new Date();
}

function generateTodoObject(id, task, timedate, isComplet) {
    return {
        id,
        task,
        timedate,
        isComplet
    }
}

function addTodo() {
    const textTodo = document.getElementById("title").value;
    const timedate = document.getElementById("date").value;

    const generatedID = generateId();

    const todoOBject = generateTodoObject(generatedID, textTodo, timedate, false);
    todos.push(todoOBject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}


//FUNGSI INI UNTUK MENAMPILKAN HASIL INPUTAN  mari kita edit agar hasil yang diinginkan seperti update delete
function makeTodo(todoOBject) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = todoOBject.task;

    const textTimedate = document.createElement("p");
    textTimedate.innerText = todoOBject.timedate;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimedate);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoOBject.id}`);

    //membuat percabangan jika todo telak dilakukakan maka ada tanda centang
    if (todoOBject.isComplet) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function() {
            undoTaskComplet(todoOBject.id);
        });

        const transButton = document.createElement("button");
        transButton.classList.add("trash-button");
        transButton.addEventListener("click", function() {
            removeTaskComplet(todoOBject.id);
        });

        container.append(undoButton, transButton);
    } else {

        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function() {
            addTaskComplet(todoOBject.id);
        });

        container.append(checkButton);
    }

    return container;
}

//fungsi addTaskComplet
function addTaskComplet(todoId) {

    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isComplet = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}
//fungsi findTodo
function findTodo(todoId) {
    for (todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}
//membuat fungsi removeTaskComplet
function removeTaskComplet(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
}
//membuat undotascomplet
function undoTaskComplet(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isComplet = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

}

//membuat findTodoIndex
function findTodoIndex(todoId) {
    for (index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}