import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_event = """  invitationFile?: string | null;
}"""
    new_event = """  invitationFile?: string | null;
  letterBackground?: string | null;
  letterSize?: 'A4' | 'LETTER';
  letterContent?: string | null;
}"""
    content = content.replace(old_event, new_event)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/types.ts")
