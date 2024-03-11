export function SelectComponent(onSelectCallback) {
  const componentStyles = `
  :host {
        --sc-bg-primary: #fff;
        --sc-bg-secondary: #eee;
        --sc-bg-accent: #ccc;
        --sc-bg-selected: #f5f5f5;
        --sc-color-primary: #333;
        --sc-color-secondary: #999;
        --sc-color-accent: #ccc;
        --sc-color-selected: #999;
        --sc-bg-hover: #eee;
        --sc-color-disabled: #ccc;
        --sc-min-width: 200px;
        --sc-min-height: 200px;

        /* Dark mode variant */
        --sc-bg-primary-dark: #222;
        --sc-bg-secondary-dark: #333;
        --sc-bg-accent-dark: #444;
        --sc-color-primary-dark: #eee;
        --sc-color-secondary-dark: #aaa;
        --sc-color-accent-dark: #777;
        --sc-bg-hover-dark: #444;
        --sc-bg-selected-dark: #555;
        --sc-color-selected-dark: #fff;
        --sc-color-disabled-dark: #777;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        font-family: sans-serif;
        font-size: 1rem;
        line-height: 1.5;
        border: 1px solid var(--sc-bg-accent);
        border-radius: 4px;
        user-select: none;
        min-width: var(--sc-min-width);
      }

      :host(.dark-mode) {
        --sc-bg-primary: var(--sc-bg-primary-dark);
        --sc-bg-secondary: var(--sc-bg-secondary-dark);
        --sc-bg-accent: var(--sc-bg-accent-dark);
        --sc-color-primary: var(--sc-color-primary-dark);
        --sc-color-secondary: var(--sc-color-secondary-dark);
        --sc-color-accent: var(--sc-color-accent-dark);
        --sc-bg-hover: var(--sc-bg-hover-dark);
        --sc-bg-selected: var(--sc-bg-selected-dark);
        --sc-color-disabled: var(--sc-color-disabled-dark);
      }

      /* Update label text color in dark mode */
      :host(.dark-mode) label {
        color: var(--sc-color-primary-dark);
      }

      /* Update selected option text color in dark mode */
      :host(.dark-mode) :host([selected]) {
        color: var(--sc-color-selected-dark);
      }

      label {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding: 8px 12px;
        border: 1px solid var(--sc-bg-accent);
        background-color: var(--sc-bg-secondary);
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      label:hover {
        background-color: var(--sc-bg-secondary);
      }

      .label-text {
        display: inline-block;
      }

      .arrow-icon {
        width: 1px;
        height: 1px;
        margin-left: 8px;
        border: solid var(--sc-color-primary);
        border-width: 0 1px 1px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        transition: transform 0.2s ease;
      }

      :host([open]) .arrow-icon {
        transform: rotate(-135deg);
      }

      #contents {
        display: none;
        position: absolute;
        top: 100%;
        margin-top: 6px;
        z-index: 1;
        width: 100%;
        min-width: calc(var(--sc-min-width) + 26px);
        max-height: var(--sc-min-height);
        overflow-y: auto;
        background-color: var(--sc-bg-primary);
        border: 1px solid var(--sc-bg-secondary);
        border-radius: 4px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      }

      :host([open]) #contents {
        display: block;
      }

      .default-option {
        padding: 8px 12px;
        color: var(--sc-color-secondary);
        cursor: default;
        user-select: none;
      }
    `;

  const optionStyles = `
  :host {
    width: 100%;
    display: block;
    min-width: var(--sc-min-width);
    padding: 8px 12px;
    cursor: pointer;
    color: var(--sc-color-primary);
    background-color: var(--sc-bg-primary);
    transition: background-color 0.2s ease;
  }

  :host(:hover) {
    background-color: var(--sc-bg-hover);
  }

  :host([selected]) {
    background-color: var(--sc-bg-selected);
    color: var(--sc-color-selected);
    font-weight: bold;
  }

  :host([disabled]) {
    color: var(--sc-color-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Dark mode variant */
  :host(.dark-mode) {
    --sc-bg-hover: var(--sc-bg-secondary-dark);
    --sc-bg-selected: var(--sc-bg-selected-dark);
    --sc-color-disabled: var(--sc-color-disabled-dark);
    --sc-color-primary: var(--sc-color-primary-dark);
  }
`;

  class SelectComponent extends HTMLElement {
    constructor() {
      super();
      this.ShadowRoot = this.attachShadow({
        mode: 'open',
        delegatesFocus: true,
      });
      this.onChange = null;
      this.selectedIndex = -1;
      this.darkMode = false;
      this.render();
    }

    static get properties() {
      return {
        darkMode: { type: Boolean, reflect: true },
      };
    }

    static get observedAttributes() {
      return ['dark-mode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'dark-mode') {
        this.darkMode = newValue !== null;
        this.updateDarkMode();
      }
    }

    updateDarkMode() {
      if (this.darkMode) {
        this.classList.add('dark-mode');
      } else {
        this.classList.remove('dark-mode');
      }
    }

    render() {
      const styleElement = document.createElement('style');
      styleElement.textContent = componentStyles;
      this.ShadowRoot.appendChild(styleElement);

      const labelElement = document.createElement('label');
      labelElement.tabIndex = 0; // Make the label focusable
      const labelTextElement = document.createElement('span');
      labelTextElement.className = 'label-text';
      labelTextElement.textContent =
        this.getAttribute('label') || 'Select an option';
      labelElement.appendChild(labelTextElement);

      const arrowIcon = document.createElement('span');
      arrowIcon.className = 'arrow-icon';
      labelElement.appendChild(arrowIcon);

      this.ShadowRoot.appendChild(labelElement);

      const contentsElement = document.createElement('div');
      contentsElement.id = 'contents';
      contentsElement.tabIndex = -1;
      this.ShadowRoot.appendChild(contentsElement);

      const defaultOptionElement = document.createElement('div');
      defaultOptionElement.className = 'default-option';
      defaultOptionElement.textContent =
        this.getAttribute('label') || 'Select an option';
      contentsElement.appendChild(defaultOptionElement);

      const slotElement = document.createElement('slot');
      contentsElement.appendChild(slotElement);

      this.onChange = this.getAttribute('on-change');
      labelElement.addEventListener('click', this.toggle.bind(this));
      labelElement.addEventListener(
        'keydown',
        this.handleLabelKeydown.bind(this)
      );
      this.addEventListener('keydown', this.handleKeydown.bind(this));
      document.addEventListener('click', this.handleOutsideClick.bind(this));

      // Set the default option as the initial value in the select label
      const defaultOption = this.querySelector('select-option[default]');
      if (defaultOption) {
        this.selectedIndex = Array.from(
          this.querySelectorAll('select-option')
        ).indexOf(defaultOption);
        this.updateLabelText(defaultOption.innerText);
      }

      if (this.darkMode) {
        this.classList.add('dark-mode');
      }
    }

    updateLabelText(text) {
      const labelTextElement = this.ShadowRoot.querySelector('.label-text');
      if (labelTextElement) {
        labelTextElement.innerText = text;
      }
    }

    toggle(event) {
      event.stopPropagation();
      this.open = !this.open;
      if (this.open) {
        this.ShadowRoot.querySelector('#contents').focus();
      }
    }

    handleLabelKeydown(event) {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        this.toggle(event);
      }
    }

    handleKeydown(event) {
      const options = this.ShadowRoot.querySelector('slot').assignedElements();

      if (event.key === 'Escape') {
        this.close();
      }

      if (event.key === 'Enter') {
        if (this.selectedIndex !== -1) {
          const selectedOption = options[this.selectedIndex];
          if (!selectedOption.hasAttribute('disabled')) {
            this.triggerOptionSelect(selectedOption);
          }
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex = this.getPreviousEnabledIndex(
          options,
          this.selectedIndex
        );
        this.updateSelectedOption(options);
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex = this.getNextEnabledIndex(
          options,
          this.selectedIndex
        );
        this.updateSelectedOption(options);
      }

      if (event.key === 'Tab') {
        this.close();
      }
    }

    triggerOptionSelect(selectedOption) {
      const options = this.ShadowRoot.querySelector('slot').assignedElements();

      const value = selectedOption.getAttribute('value');
      if (this.onChange) {
        this.onChange(value);
      }
      this.updateLabelText(selectedOption.innerText);
      this.selectedIndex = Array.from(options).indexOf(selectedOption);
      this.updateSelectedOption(options);
      onSelectCallback && onSelectCallback(value);
      this.close();
    }

    getPreviousEnabledIndex(options, currentIndex) {
      let prevIndex = (currentIndex - 1 + options.length) % options.length;
      while (options[prevIndex].hasAttribute('disabled')) {
        prevIndex = (prevIndex - 1 + options.length) % options.length;
      }
      return prevIndex;
    }

    getNextEnabledIndex(options, currentIndex) {
      let nextIndex = (currentIndex + 1) % options.length;
      while (options[nextIndex].hasAttribute('disabled')) {
        nextIndex = (nextIndex + 1) % options.length;
      }
      return nextIndex;
    }

    updateSelectedOption(options) {
      options.forEach((option, index) => {
        option.toggleAttribute('selected', index === this.selectedIndex);
      });
    }

    handleOutsideClick(event) {
      const selectComponent = this.ShadowRoot.host;
      const optionsSlot = this.ShadowRoot.querySelector('#contents slot');
      const clickedOutside =
        !selectComponent.contains(event.target) &&
        !optionsSlot.contains(event.target);

      if (clickedOutside && this.open) {
        this.close();
      }
    }

    close() {
      this.open = false;
      this.selectedIndex = -1;
    }

    get open() {
      return this.hasAttribute('open');
    }

    set open(value) {
      value ? this.setAttribute('open', '') : this.removeAttribute('open');
    }
  }

  class SelectOption extends HTMLElement {
    constructor() {
      super();
      this.ShadowRoot = this.attachShadow({
        mode: 'open',
        delegatesFocus: true,
      });
      this.render();
    }

    render() {
      const styleElement = document.createElement('style');
      styleElement.textContent = optionStyles;
      this.ShadowRoot.appendChild(styleElement);

      const slotElement = document.createElement('slot');
      this.ShadowRoot.appendChild(slotElement);

      this.classList.add('select-option');
      this.addEventListener('click', this.onSelect.bind(this));

      // Add disabled attribute if the option has the `disabled` attribute
      if (this.hasAttribute('disabled')) {
        this.setAttribute('disabled', '');
      }
    }
    onSelect(event) {
      event.stopPropagation();
      const selectComponent = this.closest('select-component');
      if (selectComponent) {
        selectComponent.triggerOptionSelect(this);
      }
    }
  }

  customElements.define('select-component', SelectComponent);
  customElements.define('select-option', SelectOption);

  return {
    SelectComponent,
    SelectOption,
  };
}
