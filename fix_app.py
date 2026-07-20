import sys

def modify_app(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_effect = """  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);"""

    new_effect = """  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token expired or invalid
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);"""

    content = content.replace(old_effect, new_effect)
    
    with open(filepath, "w") as f:
        f.write(content)

modify_app("src/App.tsx")
