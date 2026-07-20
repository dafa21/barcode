import sys

def replace_upload(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_upload = '''                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewEventLogo(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setNewEventLogo(undefined);
                      }
                    }}'''
    
    new_upload = '''                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const img = new Image();
                        const url = URL.createObjectURL(file);
                        img.onload = () => {
                          URL.revokeObjectURL(url);
                          const canvas = document.createElement('canvas');
                          let width = img.width;
                          let height = img.height;
                          const max = 300;
                          if (width > max || height > max) {
                            const ratio = Math.min(max / width, max / height);
                            width = width * ratio;
                            height = height * ratio;
                          }
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          if(ctx) {
                             ctx.drawImage(img, 0, 0, width, height);
                             setNewEventLogo(canvas.toDataURL('image/jpeg', 0.85));
                          }
                        };
                        img.src = url;
                      } else {
                        setNewEventLogo(undefined);
                      }
                    }}'''

    content = content.replace(old_upload, new_upload)

    with open(filepath, "w") as f:
        f.write(content)

replace_upload("src/components/OfficeAdminDashboard.tsx")

