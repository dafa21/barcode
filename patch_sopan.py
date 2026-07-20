import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Update utterance
    old_msg = "Selamat datang Bapak atau Ibu ${data.guest.guestName}, terima kasih atas kehadirannya. Silakan masuk"
    new_msg = "Selamat datang yang terhormat Bapak atau Ibu ${data.guest.guestName}. Suatu kehormatan bagi kami menerima kehadiran Anda hari ini. Silakan memasuki ruangan acara"
    content = content.replace(old_msg, new_msg)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
