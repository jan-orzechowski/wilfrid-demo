let editor = ace.edit("code_editor");
editor.setOptions({
    fontFamily: "Lucida Console",
    fontSize: "14px",
    cursorStyle: "wide",

    highlightActiveLine: true,
    highlightSelectedWord: true,
    highlightGutterLine: true,
    animatedScroll: true,
    scrollPastEnd: 0.2,
    showGutter: true,
    showLineNumbers: true,
    fixedWidthGutter: true,

    tabSize: 4,
    useSoftTabs: true,
    enableAutoIndent: true,

    newLineMode: "windows",
});

let WilfridScriptMode = ace.require("ace/mode/wilfrid").Mode;
editor.session.setMode(new WilfridScriptMode());

let output_window = ace.edit("output");
output_window.setOptions({
    fontFamily: "Lucida Console",
    fontSize: "12px",

    readOnly: true,

    highlightActiveLine: false,
    highlightSelectedWord: false,
    animatedScroll: false,
    scrollPastEnd: 0.2,
    showGutter: false,
    showLineNumbers: false,
    newLineMode: "windows",
});

let CScriptMode = ace.require("ace/mode/c_cpp").Mode;

// hide cursor in the output window
output_window.renderer.$cursorLayer.element.style.display = "none";

initialize_examples_list();
initialize_run_button();

function editor_load_text(text) {
    editor.getSession().setValue(text, -1);
    editor.focus();
    editor.gotoLine(0, 0, false);
    editor.renderer.scrollCursorIntoView({ row: 0, column: 0 }, 0.0);
}

function print_to_output(text) {
    if (arguments.length > 1) {
        text = Array.prototype.slice.call(arguments).join(' ');           
    } 
    //console.log(text);
    let session = output_window.getSession();
    session.insert({
        row: session.getLength(),
        column: 0
    }, "\n" + text);

    output_window.renderer.scrollToLine(Number.POSITIVE_INFINITY);
}

function initialize_examples_list() {
    let examples = [];
    try {
        examples= [
            get_example("Memory arena", example_memory_arena),
            get_example("Self-hosted Nous parser", example_nous_parser),
            get_example("Stack-based virtual machine", example_stack_vm),
            get_example("Formatted printing", example_printf),
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

function run_code(options) {        
    let source = editor.getValue();
    FS.writeFile(COMPILER_INPUT_PATH, source);    
    
    output_window.setValue("");
    if (options & COMPILER_OPTION_PRINT_C){
        output_window.session.setMode(new CScriptMode());
    } else {
        output_window.session.setMode();
    }
    
    try {
        Module._compile_input(options);
    } catch (e) {
        Module._reset_memory();
    }
}

function initialize_run_button() {
    let run_button_el = document.getElementById("run_button");
    run_button_el.addEventListener("click", function(e) {
        let options = COMPILER_OPTION_RUN | COMPILER_OPTION_SHOW_AST;
        run_code(options);
    });
}