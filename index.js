var editor = ace.edit("code_editor");
editor.setOptions({
    fontFamily: "Lucida Console",
    fontSize: "16px"
});

function get_example(title, description, code){
    return {
        title: title,
        description: description,
        code: code
    };
}

function get_test_examples(){
    let result = [];
    for(let i = 0; i < 100; i++){
        let title = "example #" + i;
        let description = title + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor molestie dapibus. Sed vel dolor nec tellus condimentum elementum at eu lectus. Duis mollis pellentesque lacus eget eleifend. Ut sit amet ultricies nisl. Nullam pellentesque interdum libero, sit amet rhoncus dui ullamcorper quis. \nFusce non sem malesuada, auctor sem ut, dapibus metus. Ut libero est, vehicula et nisl non, mollis rutrum risus. Maecenas blandit nibh massa, nec porta felis pulvinar sed. Ut congue felis nec enim posuere dictum. Vestibulum a libero sed arcu euismod posuere non in augue. Vivamus efficitur massa nec dictum finibus. Vestibulum lectus enim, maximus nec bibendum eget, posuere feugiat justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";
        let code = "Code for " + title + ": " + description;      
        result.push(get_example(title, description, code));
    }
    return result;
}

let examples = get_test_examples();

function initialize_list(){
    let list = document.getElementById("examples_list");
    for (let i = 0; i < examples.length; i++) {
        let el = document.createElement("li");
        el.setAttribute("data-example", examples[i].title);
        el.setAttribute("data-example-desc", examples[i].description);
        el.setAttribute("data-example-code", examples[i].code);
        el.textContent = examples[i].title;
        list.appendChild(el);
    }
    list.addEventListener("click", function(event) {
        let el = event.target;
        let example = el.getAttribute("data-example");
        if (example){
            console.log("clicked: " + example);
            document.getElementById("example_description").innerHTML = el.getAttribute("data-example-desc");
            editor.getSession().setValue(el.getAttribute("data-example-code"));
        }
    });
}
initialize_list();