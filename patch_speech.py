import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Cancel previous speech and shorten the sentence
    old_speech = """if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Selamat datang yang terhormat Bapak atau Ibu ${data.guest.guestName}. Suatu kehormatan bagi kami menerima kehadiran Anda hari ini. Silakan memasuki ruangan acara`);
          utterance.lang = 'id-ID';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }"""
    
    new_speech = """if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel any ongoing speech to avoid delay
          
          // Mempersingkat teks agar lebih cepat diucapkan
          const utterance = new SpeechSynthesisUtterance(`Selamat datang, ${data.guest.guestName}. Silakan masuk.`);
          utterance.lang = 'id-ID';
          utterance.rate = 1.1; // Sedikit lebih cepat
          
          // Coba cari voice bahasa indonesia jika ada untuk mempercepat
          const voices = window.speechSynthesis.getVoices();
          const idVoice = voices.find(v => v.lang.includes('id'));
          if (idVoice) utterance.voice = idVoice;
          
          window.speechSynthesis.speak(utterance);
        }"""
    
    content = content.replace(old_speech, new_speech)

    # Add a warmup in useEffect
    old_useeffect = """useEffect(() => {
    // Keep focus on input for barcode scanner guns if camera is not active"""
    new_useeffect = """useEffect(() => {
    // Warm up speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices(); // Trigger voice loading
      const warmup = new SpeechSynthesisUtterance('');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
    }
    
    // Keep focus on input for barcode scanner guns if camera is not active"""
    content = content.replace(old_useeffect, new_useeffect)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
