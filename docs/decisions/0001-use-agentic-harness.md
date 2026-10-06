# Use Agentic Development Harness

Date: 2026\-10\-06
Status: Accepted

## Context

This project should support agentic coding without losing quality, context, or review discipline.

## Decision

Use a small harness built around durable plans/PRDs, isolated worktrees, deterministic verification, Ralph-compatible execution, review passes, and memory promotion.

## Consequences

- Most non-trivial work starts with a plan or PRD.
- Agents run real scripts rather than simulating workflow steps.
- Project learnings can be promoted upward when they generalize.
