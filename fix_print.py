import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_generate = """  const generateTwibbonImage = async (uid: string, name: string) => {
    setIsGeneratingTwibbon(true);
    try {"""
    
    new_generate = """  const generateTwibbonImage = async (uid: string, name: string) => {
    setIsGeneratingTwibbon(true);
    try {
      const QRCode = (await import("qrcode")).default;"""
      
    # I actually need to make it return the dataUrl.
    # Let's replace the whole generateTwibbonImage function. 
    # But wait, it's quite large. Let's just find and replace the bottom part of it.
    
    old_generate_end = """      setGeneratedTwibbon(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Twibbon generation failed:", error);
    } finally {
      setIsGeneratingTwibbon(false);
    }
  };"""
    
    new_generate_end = """      const dataUrl = canvas.toDataURL("image/png");
      setGeneratedTwibbon(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Twibbon generation failed:", error);
      return null;
    } finally {
      setIsGeneratingTwibbon(false);
    }
  };"""

    content = content.replace(old_generate_end, new_generate_end)

    old_print = """  const handlePrintBarcode = (uid: string, name: string) => {
    if (!generatedTwibbon) return;
    const printWindow = window.open("", "", "width=800,height=800");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Card</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              @page { margin: 0; size: auto; }
              body { background: white; }
            }
          </style>
        </head>
        <body>
          <img src="${generatedTwibbon}" />
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };"""

    new_print = """  const handlePrintBarcode = async (uid: string, name: string) => {
    // Generate twibbon if not already generated for this user
    let imageUrl = generatedTwibbon;
    if (!generatedBarcode || generatedBarcode.uid !== uid) {
      imageUrl = await generateTwibbonImage(uid, name);
    }
    
    if (!imageUrl) return;

    // Use a hidden iframe to print
    let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Print ID Card</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              @page { margin: 0; size: auto; }
              body { background: white; display: block; height: auto; }
              img { max-height: none; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" />
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };"""

    content = content.replace(old_print, new_print)

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/OfficeAdminDashboard.tsx")
