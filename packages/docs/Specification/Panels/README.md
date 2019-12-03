Panels are user interfaces which perform execution tasks.

<mockup here>

A panel display a single button to execute all the tasks and obtain the result.
It may also have user [input fields](../Inputs) to pass input arguments to the
[execution tasks](../Execs).

## Structure

```js
{
  ...,
  "groups": [
    {
      ...,
      "panels": [
        {
          "id": "...",
          "title": "...",
          "inputs": [ ... ],
          "execs": [ ... ],
          "outputs": [ ... ]
        }
      ]
    }
  ]
}
```

## Reference

**id**

This should be a human-readable and identifier for the panel, e.g. `deploy-token`. The supported characters are: `A-Z`, `a-z`, `0-9` and `-`. It must be between 3 and 32 characters in length.

This id must be unique amongst all the other panels in the parent group.

Example:

```js
{
  "id": "create-token",
}
```

**title**

A user-friendly title for the panel.  It must be between 3 and 256 characters in length.

Example:

```js
{
  "title": "Create new token",
}
```

**inputs** _(optional)_

User [input fields](../Inputs) which define input arguments to pass to the
[execution tasks](../Execs).

```js
{
  "inputs": [
    { ... },
    { ... },
    ...,
  ]
}
```

**execs**

The [execution tasks](../Execs) to perform the when the panel gets executed.

The tasks are executed in sequence, one after another. This allows for earlier
tasks' outputs to be re-used as later tasks' inputs.

```js
{
  "execs": [
    { ... },
    { ... },
    ...,
  ]
}
```

**outputs** _(optional)_

The [outputs](../Outputs) to display to the user once panel tasks are successfully
executed.

Each output refers to the result of an [execution task](../Execs).

```js
{
  "outputs": [
    { ... },
    { ... },
    ...,
  ]
}
```
