# SelectComponent

The SelectComponent is a lightweight and customizable web component that provides a simple dropdown menu for selecting options. It is designed to be flexible, easy to use, and adaptable to various styling preferences, including support for dark mode.
Features

- Custom Styling: Easily customize the appearance with CSS variables.
- Dark Mode Support: Seamlessly switch between light and dark modes.
- Accessibility: Supports keyboard navigation for improved accessibility.
- Event Handling: Responsive to user interactions, including click and keyboard input.
- Slot Element: Insert custom content within the dropdown.

``` html
<select-component id="my-select" label="Select A Fruit">
  <select-option value="apple" default>Apple</select-option>
  <select-option value="mango">Mango</select-option>
  <select-option value="orange">Orange</select-option>
  <select-option value="cucumber" disabled>Cucumber</select-option>
</select-component>
```

and in js

```js
import { SelectComponent } from './select-component.js';

SelectComponent((value) => console.log('selected:', value));
```

and can customize

```css
#my-select {
  --sc-min-width: 120px;
  --sc-bg-primary: #fff;
  --sc-bg-secondary: #fff;
  --sc-bg-accent: rgb(94 234 212);
  --sc-color-primary: rgb(31 41 55);
  --sc-color-secondary: rgb(156 163 175);
  --sc-color-accent: rgb(156 163 175);
  --sc-bg-selected: rgb(204 251 241);
  --sc-color-selected: rgb(20 184 166);
  --sc-bg-hover: rgb(240 253 250);
  --sc-color-disabled: #ccc;
}
```
