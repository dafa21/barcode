import sys

def modify_scanner(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_success = """      if (res.ok) {
        setStatus('success');
        setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);
        setRecentScans(prev => {"""
    new_success = """      if (res.ok) {
        setStatus('success');
        setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);
        
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100]);
        }
        
        setRecentScans(prev => {"""
    content = content.replace(old_success, new_success)

    old_error1 = """      } else {
        setStatus('error');
        setMessage(data.error || 'Scan failed');
      }"""
    new_error1 = """      } else {
        setStatus('error');
        setMessage(data.error || 'Scan failed');
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        }
      }"""
    content = content.replace(old_error1, new_error1)

    old_error2 = """    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {"""
    new_error2 = """    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } finally {"""
    content = content.replace(old_error2, new_error2)

    # For the visual pulse - Camera scanner
    old_camera_success = """                {status === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <CheckCircle2 className="w-16 h-16 mb-4" />"""
    new_camera_success = """                {status === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <div className="absolute inset-0 bg-emerald-400 opacity-50 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]"></div>
                    <CheckCircle2 className="w-16 h-16 mb-4 animate-[bounce_0.5s_ease-in-out_1]" />"""
    content = content.replace(old_camera_success, new_camera_success)

    # For the visual pulse - Physical scanner
    old_physical_status = """                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-200"></div>
                {status === 'success' ? <CheckCircle2 className="w-24 h-24 text-emerald-500" /> :"""
    new_physical_status = """                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-200"></div>
                {status === 'success' && <div className="absolute inset-0 rounded-3xl border-4 border-emerald-500 opacity-0 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]"></div>}
                {status === 'success' ? <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-[bounce_0.5s_ease-in-out_1]" /> :"""
    content = content.replace(old_physical_status, new_physical_status)

    with open(filepath, "w") as f:
        f.write(content)

modify_scanner("src/components/Scanner.tsx")
