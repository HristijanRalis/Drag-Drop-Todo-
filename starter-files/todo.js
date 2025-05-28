// TODO DRAG&DROP Application
// DEFINE TODO Array
var todos = [];
var formId = "todoForm";
// FUNCTION FOR RANDOM TODO ID
var generateUniqueIdForTodo = function () { return "todo-".concat(Math.random().toString(36).substring(2, 9)); };
// CREATING NEW ITEM OF TODO
var newItem = document.getElementById("newItem");
newItem.addEventListener("click", function () {
    if (document.getElementById(formId))
        return;
    var addText = document.querySelector("h5");
    if (addText) {
        addText.classList.add("d-done");
    }
    var form = document.createElement('form');
    form.id = formId;
    form.innerHTML = "\n    <input class=\"form-control\" name=\"title\" type=\"text\" placeholder=\"Title\" required />\n    <input class=\"form-control\" name=\"points\" type=\"number\" placeholder=\"Story Points\" required />\n    <textarea class=\"form-control\" name=\"description\" placeholder=\"Description\" required></textarea>\n    <button type=\"submit\" class=\"btn btn-success\">Add Todo</button>\n\n    ";
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(form);
        var title = formData.get("title");
        var points = Number(formData.get("points"));
        var description = formData.get("description");
        if (!title) {
            alert("Title is required!");
            return;
        }
        var newTodo = {
            id: generateUniqueIdForTodo(),
            title: title,
            points: points,
            description: description,
            status: "to-do",
        };
        todos.push(newTodo);
        console.log("Todo created:", newTodo);
        console.log("Current todos array:", todos);
        renderNewTodo(newTodo);
        form.remove();
        if (addText) {
            addText.classList.remove("d-done");
        }
    });
    newItem.appendChild(form);
});
function renderNewTodo(todo) {
    var column = document.querySelector("#".concat(todo.status, " .items-list"));
    if (!column) {
        console.log("Column list for status \"".concat(todo.status, " not found!"));
        return;
    }
    var item = document.createElement("div");
    item.className = "item";
    item.draggable = true;
    item.id = todo.id;
    item.innerHTML = "\n        <h5>".concat(todo.title, " <span> ").concat(todo.points > 0 ? todo.points : '', "</span></h5>\n        ").concat(todo.description ? "<p>".concat(todo.description, "</p>") : '', "\n        <div class=\"assignee\"><span>").concat(todo.title ? todo.title[0].toUpperCase() : 'N', "</span></div>\n    ");
    item.addEventListener("dragstart", handleItemDragStart);
    item.addEventListener("dragend", handleItemDragEnd);
    column.appendChild(item);
}
var selectedItemElement = null;
// FUNCTION for handingItemDragStart
function handleItemDragStart(event) {
    var target = event.target;
    if (target.classList.contains("item")) {
        selectedItemElement = target;
        event.dataTransfer.setData("text/plain", target.id);
        event.dataTransfer.effectAllowed = "move";
        setTimeout(function () { return target.classList.add("dragging"); }, 0);
    }
}
// FUNCTION for handingItemDragEnd
function handleItemDragEnd(event) {
    var target = event.target;
    if (target.classList.contains("item")) {
        target.classList.remove("dragging");
    }
    document.querySelectorAll(".section.drag-cover").forEach(function (s) { return s.classList.remove('drag-over'); });
    selectedItemElement = null;
}
var columnSection = document.querySelectorAll(".section");
// dragover EVENT FOR ALL SECTION
columnSection.forEach(function (sectionElement) {
    sectionElement.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (selectedItemElement && e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
    });
    sectionElement.addEventListener("dragenter", function (e) {
        e.preventDefault();
        if (selectedItemElement) {
            sectionElement.classList.add("drag-over");
        }
    });
    sectionElement.addEventListener("dragleave", function (e) {
        if (e.relatedTarget === null || !sectionElement.contains(e.relatedTarget)) {
            sectionElement.classList.remove("drag-over");
        }
    });
    sectionElement.addEventListener("drop", function (e) {
        e.preventDefault();
        sectionElement.classList.remove("drag-over");
        if (selectedItemElement) {
            var targetItemList = sectionElement.querySelector(".items-list");
            if (targetItemList) {
                targetItemList.appendChild(selectedItemElement);
                var todoId_1 = selectedItemElement.id;
                var todo = todos.find(function (t) { return t.id === todoId_1; });
                console.log("All todo IDs:", todos.map(function (t) { return t.id; }));
                if (todo) {
                    todo.status = sectionElement.id;
                }
            }
        }
    });
});
