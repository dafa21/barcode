import sys

def replace_scanner(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Fix QrScanner prop
    old_qr = """<QrScanner
                  onScan={(codes) => { if (codes.length > 0) handleScanValue(codes[0].rawValue) }}
                  onError={(error) => console.log(error?.message)}
                />"""
    new_qr = """<QrScanner
                  onScan={(codes) => { if (codes.length > 0) handleScanValue(codes[0].rawValue) }}
                  onError={(error) => console.log(error?.message)}
                  allowMultiple={true}
                  scanDelay={2000}
                />"""
    content = content.replace(old_qr, new_qr)

    with open(filepath, "w") as f:
        f.write(content)

replace_scanner("src/components/Scanner.tsx")
