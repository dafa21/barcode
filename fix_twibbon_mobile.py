import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_canvas_wrap = "          <div className=\"relative shadow-2xl rounded-2xl overflow-hidden\" style={{ width: '400px', height: '600px' }}>"
    new_canvas_wrap = "          <div className=\"relative shadow-2xl rounded-2xl overflow-hidden w-full max-w-[400px] aspect-[2/3]\">"
    content = content.replace(old_canvas_wrap, new_canvas_wrap)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/TwibbonConfigurator.tsx")
