import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_schema = """  twibbonConfig: text('twibbon_config'),
});"""
    new_schema = """  twibbonConfig: text('twibbon_config'),
  invitationFile: text('invitation_file'),
});"""

    content = content.replace(old_schema, new_schema)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/db/schema.ts")
