let editor = ace.edit("code_editor");
editor.setOptions({
    fontFamily: "Lucida Console",
    fontSize: "14px",
    cursorStyle: "wide",

    highlightActiveLine: true,
    highlightSelectedWord: true,
    highlightGutterLine: true,
    animatedScroll: true,
    scrollPastEnd: 0.5,
    showGutter: true,
    showLineNumbers: true,
    fixedWidthGutter: true,

    tabSize: 4,
    useSoftTabs: true,
    enableAutoIndent: true,

    newLineMode: "windows",
});

var NousScriptMode = ace.require("ace/mode/nous").Mode;
editor.session.setMode(new NousScriptMode());
initialize_examples_list();

function editor_load_text(text) {
    editor.getSession().setValue(text, -1);
    editor.focus();
    editor.gotoLine(0, 0, false);
    editor.renderer.scrollCursorIntoView({ row: 0, column: 0 }, 0.0);
}

function initialize_examples_list() {
    let examples = [];
    try {
        examples= [
            get_example("Memory arena", example_memory_arena),
            get_example("Self-hosted Nous parser", example_nous_parser),
            get_example("Stack-based virtual machine", example_stack_vm),
            //get_example("test", example_undefined),
        ];   
    } catch (e) {
        console.error("Missing example! Exception: " + e);
    }

    let list_el = document.getElementById("examples_list");
    for (let i = 0; i < examples.length; i++) {
        let example_el = document.createElement("li");
        example_el.classList.add("example_list_element");
        example_el.setAttribute("data-example", examples[i].title);
        example_el.textContent = examples[i].title;
        list_el.appendChild(example_el);
    }

    let previously_clicked_el = null;
    list_el.addEventListener("click", function(event) {
        let example_el = event.target;
        let example_title = example_el.getAttribute("data-example");
        if (example_title) {
            let code = get_example_code_by_title(examples, example_title);
            
            editor_load_text(code);

            if (previously_clicked_el) {
                previously_clicked_el.classList.remove("example_selected");                
            } 
            example_el.classList.add("example_selected");
            previously_clicked_el = example_el;
        }
    });

    function get_example_code_by_title(example_list, title){
        for (let i = 0; i < example_list.length; i++) {
            if (example_list[i].title == title){
                return example_list[i].code;
            }
        }
        return "";
    }

    function get_example(title, code){
        let result = {
            title: title,
            code: remove_batch_file_artifacts(code)
        };
        return result;
    }
}

function remove_batch_file_artifacts(str) {
    let index = str.indexOf("¿");
    if (index !== -1 && index + 1 < str.length) {
        return str.substring(index + 1);
    } else{
        return str;
    }
}