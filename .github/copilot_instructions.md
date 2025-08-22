Here’s a first draft for a **`copilot_instructions.md`** file tailored for **TypeScript** and **n8n custom nodes** development:

---

# Copilot Instructions: TypeScript & n8n Custom Nodes

This document provides guidelines for writing, extending, and maintaining **TypeScript** code and **n8n custom nodes** with the help of GitHub Copilot.

---

## 🟦 General TypeScript Guidelines

* **Strict typing:** Always prefer explicit type annotations (`string`, `number`, `boolean`, `unknown`, `any` only as a last resort).
* **Interfaces over types:** Use `interface` for object shapes that are expected to be extended, and `type` for unions or more advanced type constructs.
* **Async/await:** Favor `async/await` instead of `.then()` for readability.
* **Error handling:** Use `try/catch` blocks for async operations, and return meaningful error messages.
* **Imports:** Use ES module syntax (`import … from …`) consistently. Avoid `require`.
* **Linting/formatting:** Follow project ESLint + Prettier rules to ensure consistency.
* **Enums & constants:** Prefer string literal unions or `as const` objects instead of `enum` when possible.

---

## 🟩 n8n Custom Node Development Guidelines

### File & Class Structure

* Each custom node should live in its own file under `nodes/`.
* Node filename: `YourNodeName.node.ts`.
* The class should be named `YourNodeName` and exported as default.

### Node Definition (`INodeType`)

* Must implement `INodeType`.
* Include:

  * `description` → metadata about the node.
  * `defaults` → default node settings (name, color, etc.).
  * `inputs` & `outputs` → specify node connections.
  * `properties` → define parameters (text fields, dropdowns, options, etc.).

### Execution Method (`execute`)

* Always **return an array of `INodeExecutionData[]`**.
* Use `this.getNodeParameter('paramName', index)` to access user input.
* For multiple items, loop over `items`.
* Wrap external API calls in `try/catch`.
* Use `this.helpers.request` or `this.helpers.httpRequest` for HTTP calls.

### Parameter Best Practices

* Provide **clear display names** and **descriptions**.
* Use `default` values wherever possible.
* Group related fields with `options` and `collection` types.
* Use `typeOptions` for validation (`multipleValues`, `minValue`, `maxValue`, etc.).

## n8n Reference

https://docs.n8n.io/integrations/creating-nodes/build/reference/ui-elements/
https://docs.n8n.io/integrations/creating-nodes/build/reference/code-standards/
https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/
---

## 🟨 Copilot Prompts to Use

* "Create an n8n node with parameters for X and Y."
* "Refactor this TypeScript function to use stricter types."
* "Add error handling to this execute method."
* "Write JSDoc comments for this node class."
* "Generate unit tests for this TypeScript function."


