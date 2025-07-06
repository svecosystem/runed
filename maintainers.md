# Maintainer's Guide: Shipping & Ownership

## Core Philosophy

At Runed, we believe in empowering maintainers to make meaningful contributions without unnecessary
bureaucracy. This document outlines our approach to shipping features and making decisions.

## Performance and Developer Experience

Finding the right balance between performance and developer experience (DX) is a core responsibility
of every maintainer. We believe that:

- Neither performance nor DX should be sacrificed entirely for the other
- Every feature should be evaluated through both lenses where applicable
- Performance impacts should be measured, not assumed
- DX improvements should be validated with real-world usage
- Complex performance optimizations must be justified by measurable benefits
- "Developer-friendly" shouldn't and doesn't mean "performance-ignorant"

When making decisions, consider:

- Will this make the library easier to use correctly and harder to use incorrectly?
- Does the performance cost justify the DX benefit, or vice versa?
- Can we achieve both good DX and performance through clever API design?
- Are we making assumptions about performance without data to back them up?

## Ownership & Decision Making

As a maintainer, you have full autonomy to ship features, improvements, and fixes that you believe
add value to Runed. What this means in practice is:

- You don't need explicit permission to start working on or ship something
- Your judgement about what's valuable is trusted
- You own the decisions about your contributions
- Other maintainers can (and should) provide feedback, but you decide whether to act on it
- You're empowered to merge your own PRs when you are confident in them

## Shipping Philosophy

Ship early and ship often. As a maintainer, you're empowered to move quickly and make decisions.
What this means in practice is:

- Bug fixes should be released immediately - users shouldn't wait for fixes we've already made just
  to reduce the number of patch releases
- Breaking changes need proper major version bumps and documentation, but not necessarily consensus.
  Use your best judgement if a change is worth breaking compatibility
- Consider the impact on users when making breaking changes, but don't let that paralyze you
- New features can be shipping when you believe they're ready
- Experiment freely with new approaches - we can always iterate based on feedback

Remember: It's often better to ship something good now than to wait for something perfect later.

## Best Practices

To maintain a healthy codebase and team dynamic, we should strive to follow these best practices:

### Document Your Changes

- Write clear and concise PR descriptions
- Update the relevant documentation
- Add inline comments for non-obvious code

### Maintain Quality

- Write tests for new functionality
- Ensure CI passes
- Consider performance implications

### Communicate

- Use PR descriptions to explain your reasoning
- Tag relevant maintainers for awareness
- Respond to feedback, even if you decide not to act on it (it's okay to disagree)
