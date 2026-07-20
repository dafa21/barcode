import sys

def replace_draw_image(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_draw = 'ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);'
    
    new_draw = '''      const lRatio = logoImg.width / logoImg.height;
      let lSWidth, lSHeight, lSx, lSy;
      if (lRatio > 1) {
        lSHeight = logoImg.height;
        lSWidth = logoImg.height;
        lSy = 0;
        lSx = (logoImg.width - lSWidth) / 2;
      } else {
        lSWidth = logoImg.width;
        lSHeight = logoImg.width;
        lSx = 0;
        lSy = (logoImg.height - lSHeight) / 2;
      }
      ctx.drawImage(logoImg, lSx, lSy, lSWidth, lSHeight, logoX, logoY, logoSize, logoSize);'''

    content = content.replace(old_draw, new_draw)

    with open(filepath, "w") as f:
        f.write(content)

replace_draw_image("src/components/TwibbonConfigurator.tsx")
replace_draw_image("src/components/OfficeAdminDashboard.tsx")

