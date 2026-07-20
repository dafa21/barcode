import sys

def replace_draw_image(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_draw = 'ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);'
    
    new_draw = '''    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = canvas.width / canvas.height;
    let sWidth, sHeight, sx, sy;

    if (imgRatio > canvasRatio) {
      sHeight = bgImg.height;
      sWidth = bgImg.height * canvasRatio;
      sy = 0;
      sx = (bgImg.width - sWidth) / 2;
    } else {
      sWidth = bgImg.width;
      sHeight = bgImg.width / canvasRatio;
      sx = 0;
      sy = (bgImg.height - sHeight) / 2;
    }
    ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);'''

    content = content.replace(old_draw, new_draw)

    with open(filepath, "w") as f:
        f.write(content)

replace_draw_image("src/components/TwibbonConfigurator.tsx")
replace_draw_image("src/components/OfficeAdminDashboard.tsx")

