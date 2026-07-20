import sys

def replace_upload(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_upload = '''                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBackground(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}'''
    
    new_upload = '''                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const img = new Image();
                      const url = URL.createObjectURL(file);
                      img.onload = () => {
                        URL.revokeObjectURL(url);
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxW = 800;
                        const maxH = 1200;
                        if (width > maxW || height > maxH) {
                          const ratio = Math.min(maxW / width, maxH / height);
                          width = width * ratio;
                          height = height * ratio;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if(ctx) {
                           ctx.drawImage(img, 0, 0, width, height);
                           setBackground(canvas.toDataURL('image/jpeg', 0.85));
                        }
                      };
                      img.src = url;
                    }
                  }}'''

    content = content.replace(old_upload, new_upload)

    with open(filepath, "w") as f:
        f.write(content)

replace_upload("src/components/TwibbonConfigurator.tsx")

