// TODO DRAG&DROP Application

// Creating structure with interface

interface TODO {
    id: string;
    title: string;
    points: number;
    description: string;
    status: ToDoStatus;
}

type ToDoStatus = "to-do" | "in-progress" | "in-testing" | "done";

// DEFINE TODO Array

const todos: TODO [] = [];

const formId = "todoForm";

// FUNCTION FOR RANDOM TODO ID
const  generateUniqueIdForTodo = () => `todo-${Math.random().toString(36).substring(2, 9)}`;


// CREATING NEW ITEM OF TODO
const newItem = document.getElementById("newItem") as HTMLDivElement;

newItem.addEventListener("click", ()=>{
    if(document.getElementById(formId)) return;

    const form = document.createElement('form');

    form.id = formId;
    form.innerHTML = `
    <input class="form-control" name="title" type="text" placeholder="Title" required />
    <input class="form-control" name="points" type="number" placeholder="Story Points" required />
    <textarea class="form-control" name="description" placeholder="Description" required></textarea>
    <button type="submit" class="btn btn-success">Add Todo</button>

    `;

    form.addEventListener("submit", (e: SubmitEvent) =>{
        e.preventDefault();

        const formData = new FormData(form);

        const title = formData.get("title") as string;
        const points = Number(formData.get("points"));
        const description = formData.get("description") as string;

        const newTodo: TODO = {
            id: generateUniqueIdForTodo(),
            title,
            points,
            description,
            status: "to-do",
        }

        todos.push(newTodo);
        renderTodo(newTodo);
        form.remove();
    });

    newItem.appendChild(form);
});

function renderTodo (todo: TODO){
    const column = document.querySelector(`#${todo.status} .items-list`) as HTMLElement  | null;

    if(!column) {
        console.log(`Column list for status "${todo.status} not found!`);
        return;
    }

    const item = document.createElement("div");
    item.className ="item";
    item.draggable = true;
    item.id = todo.id;

    item.innerHTML = `
        <h5>${todo.title} <span> ${todo.points > 0 ? todo.points : ''}</span></h5>
        ${todo.description ? `<p>${todo.description}</p>` : ''}
        <div class="assignee"><span>${todo.title ? todo.title[0].toUpperCase() : 'N'}</span></div>
    `;

    column.appendChild(item);


}