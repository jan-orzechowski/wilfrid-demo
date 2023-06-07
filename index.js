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
    let examples;
    let introductions;
    try {
        introductions = [
            get_example("Hello, world!", example_hello_world),
            get_example("Variables", example_variables),
            get_example("Functions and methods", example_functions_and_methods),
            get_example("Structs, unions, and enums", example_structs_and_unions),
            get_example("Control flow", example_control_flow),
            get_example("Pointers", example_pointers),
            get_example("Operators", example_operators),
            get_example("Memory management", example_memory_management),                      
            get_example("Dynamic arrays", example_dynamic_lists),
        ];   
        examples = [
            get_example("Linked list", example_linked_list),
            get_example("Binary tree", example_binary_tree),
            get_example("Hash table", example_hashmap),
            get_example("Stack allocator", example_memory_arena),
            get_example("Basic virtual machine", example_stack_vm),            
            get_example("XML parser", example_xml_parser),            
        ];
    } catch (e) {
        console.error("Missing example! Exception: " + e);
    }

    let list_intro_el = document.getElementById("examples_introduction_list");
    create_buttons_for_examples(introductions, list_intro_el);
    
    let list_el = document.getElementById("examples_list");
    create_buttons_for_examples(examples, list_el);

    let previously_clicked_el = null;

    let lists_parent = document.getElementById("examples_list_panel");
    lists_parent.addEventListener("click", function(event) {
        let example_el = event.target;
        let example_title = example_el.getAttribute("data-example");
        if (example_title) {
            let code = get_example_code_by_title(examples, example_title);
            if (code === ""){
                code = get_example_code_by_title(introductions, example_title);
            }

            editor_load_text(code);

            if (previously_clicked_el) {
                previously_clicked_el.classList.remove("example_selected");                
            } 
            example_el.classList.add("example_selected");
            previously_clicked_el = example_el;
        }
    });
    
    list_el.children[0].click();

    function create_buttons_for_examples(list, list_el) {
        for (let i = 0; i < list.length; i++) {
            let example_el = document.createElement("li");
            example_el.classList.add("example_list_element");
            example_el.setAttribute("data-example", list[i].title);
            example_el.textContent = list[i].title;
            list_el.appendChild(example_el);
        }
    }

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

var parent = document.getElementById("code_and_output_panels");
var left = document.getElementById("code_panel");
var right = document.getElementById("output_panel");
var bar = document.getElementById("dragbar_right");

let dragbar = document.getElementById("dragbar_right");
let is_dragging = false;

document.addEventListener("mousedown", function(e) {
    if (e.target === dragbar) {
        is_dragging = true;
    }
});
  
document.addEventListener("mousemove", function(e) {
    if (false === is_dragging) {
        return false;
    }
    
    if (document.selection) {
        document.selection.empty()
    } else {
        window.getSelection().removeAllRanges();
    }
   
    var container_offset_left = parent.offsetLeft;
    var pointer_relative_x = e.clientX - container_offset_left;
    var min_width_px = 300;

    left.style.flexGrow = 0;
    left.style.width = (Math.max(min_width_px, pointer_relative_x)) + 'px';
});
  
document.addEventListener("mouseup", function(e) {
    is_dragging = false;
    editor.resize();
    editor.renderer.updateFull();
    output_window.resize();
    output_window.renderer.updateFull();
});