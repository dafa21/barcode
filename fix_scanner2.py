import sys

def replace_scanner(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Fix QrScanner prop
    old_qr = """<QrScanner
                  onDecode={(result) => handleScanValue(result)}
                  onError={(error) => console.log(error?.message)}
                />"""
    new_qr = """<QrScanner
                  onScan={(codes) => { if (codes.length > 0) handleScanValue(codes[0].rawValue) }}
                  onError={(error) => console.log(error?.message)}
                />"""
    content = content.replace(old_qr, new_qr)

    # Fix form submission to use ref to avoid async state issues with rapid typing from physical scanner
    old_form = """  const handleScanForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleScanValue(barcode);
  };"""
    new_form = """  const handleScanForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleScanValue(inputRef.current?.value || barcode);
  };"""
    content = content.replace(old_form, new_form)

    with open(filepath, "w") as f:
        f.write(content)

replace_scanner("src/components/Scanner.tsx")
