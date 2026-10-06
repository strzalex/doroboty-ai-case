bootstrap:
    ./scripts/bootstrap

verify:
    ./scripts/verify

task name:
    ./scripts/agent/new-task {{name}}

ralph-new name:
    ./scripts/agent/new-ralph-run {{name}}

ralph name tool="claude" iterations="5":
    ./scripts/agent/run-ralph {{name}} {{tool}} {{iterations}}

memory-review:
    ./scripts/agent/memory-review

review base="origin/main":
    git diff --stat {{base}}...HEAD
    git diff {{base}}...HEAD
