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

    const addText = document.querySelector("h5") as HTMLHeadElement | null;
    if(addText){
        addText.classList.add("d-done");
    }

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

        if(!title){
            alert("Title is required!");
            return;
        }

        const newTodo: TODO = {
            id: generateUniqueIdForTodo(),
            title,
            points,
            description,
            status: "to-do",
        }

        todos.push(newTodo);
     
        renderNewTodo(newTodo);
        form.remove();

        if(addText){
            addText.classList.remove("d-done");
        }
    });

    newItem.appendChild(form);
});

function renderNewTodo (todo: TODO){
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

    item.addEventListener("dragstart", handleItemDragStart);
    item.addEventListener("dragend", handleItemDragEnd);

    column.appendChild(item);


}

let selectedItemElement: HTMLElement | null = null;


// FUNCTION for handingItemDragStart
function handleItemDragStart(event: DragEvent){
    const target = event.target as HTMLElement;
    if(target.classList.contains("item")){
        selectedItemElement = target;
        event.dataTransfer!.setData("text/plain",target.id);
        event.dataTransfer!.effectAllowed = "move";
        setTimeout(() => target.classList.add("dragging"), 0);
    }
}

// FUNCTION for handingItemDragEnd

function handleItemDragEnd(event: DragEvent){
    const target = event.target as HTMLElement;
    if(target.classList.contains("item")){
        target.classList.remove("dragging");
    }

    document.querySelectorAll(`.section.drag-cover`).forEach(s => s.classList.remove('drag-over'));
    selectedItemElement = null;
}

const columnSection = document.querySelectorAll(".section") as NodeListOf<HTMLElement>;


// dragover EVENT FOR ALL SECTION
columnSection.forEach((sectionElement) => {
    sectionElement.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        if(selectedItemElement && e.dataTransfer){
            e.dataTransfer.dropEffect = "move";
        }
    });

    sectionElement.addEventListener("dragenter", (e: DragEvent)=>{
        e.preventDefault();
        if(selectedItemElement){
            sectionElement.classList.add("drag-over");
        }
    });

    sectionElement.addEventListener("dragleave", (e: DragEvent) =>{
        if(e.relatedTarget === null || !sectionElement.contains(e.relatedTarget as Node)){
            sectionElement.classList.remove("drag-over");
        }
    });

    sectionElement.addEventListener("drop", (e: DragEvent)=>{
        e.preventDefault();
        sectionElement.classList.remove("drag-over");

        if(selectedItemElement){
            const targetItemList = sectionElement.querySelector(".items-list") as HTMLElement | null;
            if(targetItemList){
                targetItemList.appendChild(selectedItemElement);
                const todoId = selectedItemElement.id;
                const todo = todos.find((t) => t.id === todoId);
                if(todo){
                    todo.status = sectionElement.id as ToDoStatus;
                }
            }
        }
    })
})