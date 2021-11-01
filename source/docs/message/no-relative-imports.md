

# Import paths should be absolute

### Why This Error Occurred

Absolute import paths are required for the webpack module resolver.

### Possible Ways to Fix It

Change the import from a relative path to an absolute path

```diff
- import Button from '../components/atoms/Button'
+ import Button from 'theme/components/atoms/Button'

const MyComponent = () => (
  <Button>Click Me</Button>
)
```

### Useful links

- [Codemod to transform relative to absolute](/docs/reference/cli#codemod)
