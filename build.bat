if not exist build mkdir build
del build /Q

xcopy /s ace "build/ace" /E /I /Y
xcopy /s ace_custom "build/ace_custom" /E /I /Y
xcopy /s wasm "build/wasm" /E /I /Y

copy index.html "build/index.html" 
copy index.js "build/index.js"
copy style.css "build/style.css"

pause