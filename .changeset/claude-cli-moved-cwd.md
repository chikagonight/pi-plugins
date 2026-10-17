---
'@pi-plugins/claude-cli': patch
---

Keep working after pi's working directory is moved during a session. Every request
used to fail with "Claude Code CLI not found", because Claude Code was started in the
directory's old path.
