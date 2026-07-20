import sys

def modify_guard(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_catch = """  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }"""

    new_catch = """  } catch (error: any) {
    if (error.name !== 'TokenExpiredError') {
      console.error('Error verifying JWT token:', error);
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }"""

    content = content.replace(old_catch, new_catch)
    
    with open(filepath, "w") as f:
        f.write(content)

modify_guard("src/core/middlewares/jwtAuthGuard.ts")
