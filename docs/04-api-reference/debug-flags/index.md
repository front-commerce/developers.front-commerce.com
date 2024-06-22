# Debug flags

Use `DEBUG=xxxx` to add debug flags.

Available flags are detailed below.

:::warning

This is verbose, please don't use in production

import flags from "./debug-flags.json"

```mdx-code-block
export const  JSONList = () => {
  return Object.entries(flags).map(([key, value]) => (
<>
  <h2><code>{key}</code></h2>
  <p>{value}</p>
</>
))};
```

<JSONList />
