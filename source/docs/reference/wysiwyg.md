---
id: wysiwyg-reference
title: WYSIWYG components
---

For a tangible example and explanation, please refer to [Display WYSIWYG content (legacy)](/docs/advanced/theme/wysiwyg-legacy.html) advanced documentation.

Please note that this reference is about the legacy `Wysiwyg` component. The new behavior is fully described in the new [Display WYSIWYG content](/docs/advanced/theme/wysiwyg.html)

## `EnhanceWysiwyg`

### Parameters

- `option`: the first parameter is an object with the following properties

  - `richTextPropName` string (default: `"content"`): the name of the new property which contains the `html` when using the enhanced component.
  - `shortcodes` function: a function that takes the props of your component and that returns the list of shortcodes used in the WYSIWYG. Each shortcode is an object which contains the keys:
    - `regex` RegExp: the regex that allows to match the shortcode within the HTML
    - `replacement` (second argument of [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)): how should the matched string be replaced
  - `transforms` array: the list of transforms that should be applied to your HTML. Each transform is a function with the following signature `(node, convertNodeToElement) => null|ReactElement` where:
    - `node` is a parsed node element as defined in [react-html-parser](https://www.npmjs.com/package/react-html-parser#arguments-1)
    - `convertNodeToElement` allows to parse children of the current `node`
      Usually used like this `node.children.map(convertNodeToElement)`
    - the result is either `null` if the node does not match the current transform or a [React Element](https://reactjs.org/docs/rendering-elements.html) if it matches.

  Splitting your transforms in multiple functions allows you to easily split your code where each function corresponds to a single component.

### Code example

```jsx
import EnhanceWysiwyg from "theme/modules/Wysiwyg/EnhanceWysiwyg";

EnhanceWysiwyg({
  shortcodes: (props) => [
    {
      regex: /{{custom-shortcode}}/gi,
      replacement: "<custom-element></custom-element>",
    },
  ],
  transforms: [
    (node) => {
      if (node.name === "custom-element") {
        return <CustomComponent />;
      }
    },
  ],
})(BaseComponent);
```
