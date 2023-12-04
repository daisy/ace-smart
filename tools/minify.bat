@echo off

for %%f in ("*.js") do (
  echo ^<^<^<^<^<^< %%f ^>^>^>^>^>^>
  java -jar c:\closure-compiler\closure-compiler.jar --js="%%f" --js_output_file="%%f.min"
  move /y "%%f.min" "%%f"
  echo.
)
