import ToolboxIcon from './svg/toolbox.svg';
import './index.css';

/**
 * Persona Quote Tool for the Editor.js
 */
export default class PersonaQuote {
  /**
   * @param data
   * @param config
   * @param api
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.nodes = {
      wrapper: null,
      selectDefault: null,
      quizPlaceholder: null,
      quizSelect: null
    };

    this.config = {
      quizPlaceholder: config.quizPlaceholder || 'Quiz',
      quizzes: config.quizzes || [],
      selectPlaceholder: config.selectPlaceholder || 'Select'
    };

    this.data = Object.assign({}, data);
  }

  /**
   * @returns {{icon: *, title: string}}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Quiz'
    };
  }

  /**
   * @returns {{input: any, quizSelect: string, quizPlaceholder: string, baseClass: ScrollLogicalPosition, wrapper: string, fields: string, settingsWrapper: string, card: string}}
   * @constructor
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,

      wrapper: 'cdx-persona-quote',
      card: 'cdx-persona-quote__card',
      fields: 'cdx-persona-quote__fields',
      quizPlaceholder: 'cdx-persona-personas__placeholder',
      quizSelect: 'cdx-persona-personas__select',

      settingsWrapper: 'cdx-persona-quote__settings'
    };
  }

  /**
   * @param toolsContent
   * @returns {PersonalityToolData}
   */
  save(toolsContent) {
    return this.data;
  }

  /**
   * @returns {null}
   */
  render() {
    const { quizId } = this.data;

    this.nodes.wrapper = this.make('div', [this.CSS.baseClass, this.CSS.wrapper]);

    this.nodes.quizPlaceholder = this.make('div', this.CSS.quizPlaceholder, {
      contentEditable: false,
      innerHTML: this.config.quizPlaceholder
    });

    this.nodes.wrapper.appendChild(this.nodes.quizPlaceholder);

    this.nodes.quizSelect = this.make('select', this.CSS.quizSelect);

    let selected = {};

    if (!quizId) {
      selected = {
        selected: true
      };
    }

    this.nodes.quizSelect.appendChild(
      this.make('option', null, Object.assign({
        innerHTML: this.config.selectPlaceholder,
        hidden: true
      }, selected))
    );

    this.config.quizzes.forEach((element) => {
      let selectedOption = {};

      if (element.id == quizId) {
        selectedOption = {
          selected: true
        };
      }

      const option = this.make('option', null, {
        innerHTML: element.name
      }, Object.assign({
        value: element.id,
        'data-id': element.id
      }, selectedOption));

      this.nodes.quizSelect.appendChild(option);
    });

    const callbackSelect = (option) => {
      this.data.quizId = option.dataset.id;

      window.dispatchCustomEvent(window, 'changeTune');
    };

    this.nodes.quizSelect.addEventListener('change', function () {
      callbackSelect(this.options[this.selectedIndex]);
    });

    this.nodes.wrapper.appendChild(this.nodes.quizSelect);

    return this.nodes.wrapper;
  }

  /**
   * @param savedData
   * @returns {boolean}
   */
  validate(savedData) {
    return true;
  }

  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @param data
   * @return {HTMLElement}
   */
  make(tagName, classNames = null, attributes = {}, data = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    for (const dataName in data) {
      el.setAttribute(dataName, data[dataName]);
    }

    return el;
  }
}
