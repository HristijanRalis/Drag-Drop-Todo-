// TODO DRAG&DROP Application
// DEFINE TODO Array
var todos = [];
var formId = "todoForm";
// FUNCTION FOR RANDOM TODO ID
var generateUniqueIdForTodo = function () {
  return "todo-".concat(Math.random().toString(36).substring(2, 9));
};
// CREATING NEW ITEM OF TODO
var newItem = document.getElementById("newItem");
newItem.addEventListener("click", function () {
  if (document.getElementById(formId)) return;
  var form = document.createElement("form");
  form.id = formId;
  form.innerHTML =
    '\n    <input class="form-control" name="title" type="text" placeholder="Title" required />\n    <input class="form-control" name="points" type="number" placeholder="Story Points" required />\n    <textarea class="form-control" name="description" placeholder="Description" required></textarea>\n    <button type="submit" class="btn btn-success">Add Todo</button>\n\n    ';
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    var title = formData.get("title");
    var points = Number(formData.get("points"));
    var description = formData.get("description");
    var newTodo = {
      id: generateUniqueIdForTodo(),
      title: title,
      points: points,
      description: description,
      status: "to-do",
    };
    todos.push(newTodo);
    renderTodo(newTodo);
    form.remove();
  });
  newItem.appendChild(form);
});
function renderTodo(todo) {
  var column = document.querySelector("#".concat(todo.status, " .items-list"));
  if (!column) {
    console.log('Column list for status "'.concat(todo.status, " not found!"));
    return;
  }
  var item = document.createElement("div");
  item.className = "item";
  item.draggable = true;
  item.id = todo.id;
  item.innerHTML = "\n        <h5>"
    .concat(todo.title, " <span> ")
    .concat(todo.points > 0 ? todo.points : "", "</span></h5>\n        ")
    .concat(
      todo.description ? "<p>".concat(todo.description, "</p>") : "",
      '\n        <div class="assignee"><span>'
    )
    .concat(
      todo.title ? todo.title[0].toUpperCase() : "N",
      "</span></div>\n    "
    );
  column.appendChild(item);
}
