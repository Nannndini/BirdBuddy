import sys
import re

file_path = sys.argv[1]
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "git-rebase-todo" in file_path:
    content = re.sub(r"^pick ", "reword ", content, flags=re.MULTILINE)
else:
    content = content.replace("🚀", "").replace("✈️", "").strip()
    # Add a newline at the end
    content += "\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
