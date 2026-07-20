import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We need to replace the FileReader logic with a canvas compression logic
    # Find the Promise logic inside the onChange of the file input

    old_logic = """
                              return new Promise((resolve) => {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB");
                                  resolve(null);
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  resolve(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              });
"""

    new_logic = """
                              return new Promise((resolve) => {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("Ukuran gambar maksimal 5MB per file");
                                  resolve(null);
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    let width = img.width;
                                    let height = img.height;
                                    const maxDim = 800;
                                    if (width > height && width > maxDim) {
                                      height *= maxDim / width;
                                      width = maxDim;
                                    } else if (height > maxDim) {
                                      width *= maxDim / height;
                                      height = maxDim;
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      resolve(canvas.toDataURL('image/jpeg', 0.7));
                                    } else {
                                      resolve(reader.result as string);
                                    }
                                  };
                                  img.src = reader.result as string;
                                };
                                reader.readAsDataURL(file);
                              });
"""

    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(filepath, "w") as f:
            f.write(content)
        print("Patched successfully")
    else:
        print("Could not find old logic in " + filepath)

patch("src/components/OfficeAdminDashboard.tsx")
