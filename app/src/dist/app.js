(function () {
  'use strict';

  /* proxy-compat-disable */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  function detect() {
    // Don't apply polyfill when ProxyCompat is enabled.
    if ('getKey' in Proxy) {
      return false;
    }

    const proxy = new Proxy([3, 4], {});
    const res = [1, 2].concat(proxy);
    return res.length !== 4;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    isConcatSpreadable
  } = Symbol;
  const {
    isArray
  } = Array;
  const {
    slice: ArraySlice,
    unshift: ArrayUnshift,
    shift: ArrayShift
  } = Array.prototype;

  function isObject(O) {
    return typeof O === 'object' ? O !== null : typeof O === 'function';
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


  function isSpreadable(O) {
    if (!isObject(O)) {
      return false;
    }

    const spreadable = O[isConcatSpreadable];
    return spreadable !== undefined ? Boolean(spreadable) : isArray(O);
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


  function ArrayConcatPolyfill(..._args) {
    const O = Object(this);
    const A = [];
    let N = 0;
    const items = ArraySlice.call(arguments);
    ArrayUnshift.call(items, O);

    while (items.length) {
      const E = ArrayShift.call(items);

      if (isSpreadable(E)) {
        let k = 0;
        const length = E.length;

        for (k; k < length; k += 1, N += 1) {
          if (k in E) {
            const subElement = E[k];
            A[N] = subElement;
          }
        }
      } else {
        A[N] = E;
        N += 1;
      }
    }

    return A;
  }

  function apply() {
    Array.prototype.concat = ArrayConcatPolyfill;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  if (detect()) {
    apply();
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function detect$1(propName) {
    return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    hasAttribute,
    getAttribute,
    setAttribute,
    setAttributeNS,
    removeAttribute,
    removeAttributeNS
  } = Element.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`

  const ARIA_REGEX = /^aria/;
  const nodeToAriaPropertyValuesMap = new WeakMap();
  const {
    hasOwnProperty
  } = Object.prototype;
  const {
    replace: StringReplace,
    toLowerCase: StringToLowerCase
  } = String.prototype;

  function getAriaPropertyMap(elm) {
    let map = nodeToAriaPropertyValuesMap.get(elm);

    if (map === undefined) {
      map = {};
      nodeToAriaPropertyValuesMap.set(elm, map);
    }

    return map;
  }

  function getNormalizedAriaPropertyValue(value) {
    return value == null ? null : value + '';
  }

  function createAriaPropertyPropertyDescriptor(propName, attrName) {
    return {
      get() {
        const map = getAriaPropertyMap(this);

        if (hasOwnProperty.call(map, propName)) {
          return map[propName];
        } // otherwise just reflect what's in the attribute


        return hasAttribute.call(this, attrName) ? getAttribute.call(this, attrName) : null;
      },

      set(newValue) {
        const normalizedValue = getNormalizedAriaPropertyValue(newValue);
        const map = getAriaPropertyMap(this);
        map[propName] = normalizedValue; // reflect into the corresponding attribute

        if (newValue === null) {
          removeAttribute.call(this, attrName);
        } else {
          setAttribute.call(this, attrName, newValue);
        }
      },

      configurable: true,
      enumerable: true
    };
  }

  function patch(propName) {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const replaced = StringReplace.call(propName, ARIA_REGEX, 'aria-');
    const attrName = StringToLowerCase.call(replaced);
    const descriptor = createAriaPropertyPropertyDescriptor(propName, attrName);
    Object.defineProperty(Element.prototype, propName, descriptor);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // https://wicg.github.io/aom/spec/aria-reflection.html


  const ElementPrototypeAriaPropertyNames = ['ariaAutoComplete', 'ariaChecked', 'ariaCurrent', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaLabel', 'ariaLevel', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPressed', 'ariaReadOnly', 'ariaRequired', 'ariaSelected', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaLive', 'ariaRelevant', 'ariaAtomic', 'ariaBusy', 'ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns', 'ariaPosInSet', 'ariaSetSize', 'ariaColCount', 'ariaColIndex', 'ariaDetails', 'ariaErrorMessage', 'ariaKeyShortcuts', 'ariaModal', 'ariaPlaceholder', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaColSpan', 'role'];
  /**
   * Note: Attributes aria-dropeffect and aria-grabbed were deprecated in
   * ARIA 1.1 and do not have corresponding IDL attributes.
   */

  for (let i = 0, len = ElementPrototypeAriaPropertyNames.length; i < len; i += 1) {
    const propName = ElementPrototypeAriaPropertyNames[i];

    if (detect$1(propName)) {
      patch(propName);
    }
  }
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function invariant(value, msg) {
    if (!value) {
      throw new Error(`Invariant Violation: ${msg}`);
    }
  }

  function isTrue(value, msg) {
    if (!value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function isFalse(value, msg) {
    if (value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function fail(msg) {
    throw new Error(msg);
  }

  var assert = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invariant: invariant,
    isTrue: isTrue,
    isFalse: isFalse,
    fail: fail
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const {
    assign,
    create,
    defineProperties,
    defineProperty,
    freeze,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getPrototypeOf,
    hasOwnProperty: hasOwnProperty$1,
    keys,
    seal,
    setPrototypeOf
  } = Object;
  const {
    isArray: isArray$1
  } = Array;
  const {
    filter: ArrayFilter,
    find: ArrayFind,
    forEach,
    indexOf: ArrayIndexOf,
    join: ArrayJoin,
    map: ArrayMap,
    push: ArrayPush,
    reduce: ArrayReduce,
    reverse: ArrayReverse,
    slice: ArraySlice$1,
    splice: ArraySplice,
    unshift: ArrayUnshift$1
  } = Array.prototype;
  const {
    charCodeAt: StringCharCodeAt,
    replace: StringReplace$1,
    slice: StringSlice,
    toLowerCase: StringToLowerCase$1
  } = String.prototype;

  function isUndefined(obj) {
    return obj === undefined;
  }

  function isNull(obj) {
    return obj === null;
  }

  function isTrue$1(obj) {
    return obj === true;
  }

  function isFalse$1(obj) {
    return obj === false;
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isObject$1(obj) {
    return typeof obj === 'object';
  }

  function isString(obj) {
    return typeof obj === 'string';
  }

  function isNumber(obj) {
    return typeof obj === 'number';
  }

  const OtS = {}.toString;

  function toString(obj) {
    if (obj && obj.toString) {
      // Arrays might hold objects with "null" prototype So using
      // Array.prototype.toString directly will cause an error Iterate through
      // all the items and handle individually.
      if (isArray$1(obj)) {
        return ArrayJoin.call(ArrayMap.call(obj, toString), ',');
      }

      return obj.toString();
    } else if (typeof obj === 'object') {
      return OtS.call(obj);
    } else {
      return obj + emptyString;
    }
  }

  function getPropertyDescriptor(o, p) {
    do {
      const d = getOwnPropertyDescriptor(o, p);

      if (!isUndefined(d)) {
        return d;
      }

      o = getPrototypeOf(o);
    } while (o !== null);
  }

  const emptyString = '';
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */

  const hasNativeSymbolsSupport = Symbol('x').toString() === 'Symbol(x)';

  function createHiddenField(key, namespace) {
    return hasNativeSymbolsSupport ? Symbol(key) : `$$lwc-${namespace}-${key}$$`;
  }

  const hiddenFieldsMap = new WeakMap();

  function setHiddenField(o, field, value) {
    let valuesByField = hiddenFieldsMap.get(o);

    if (isUndefined(valuesByField)) {
      valuesByField = create(null);
      hiddenFieldsMap.set(o, valuesByField);
    }

    valuesByField[field] = value;
  }

  function getHiddenField(o, field) {
    const valuesByField = hiddenFieldsMap.get(o);

    if (!isUndefined(valuesByField)) {
      return valuesByField[field];
    }
  }
  /** version: 1.4.0-alpha3 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    appendChild,
    insertBefore,
    removeChild,
    replaceChild
  } = Node.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const defaultDefHTMLPropertyNames = ['accessKey', 'dir', 'draggable', 'hidden', 'id', 'lang', 'spellcheck', 'tabIndex', 'title']; // Few more exceptions that are using the attribute name to match the property in lowercase.
  // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
  // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
  // Note: this list most be in sync with the compiler as well.

  const HTMLPropertyNamesWithLowercasedReflectiveAttributes = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];

  function offsetPropertyErrorMessage(name) {
    return `Using the \`${name}\` property is an anti-pattern because it rounds the value to an integer. Instead, use the \`getBoundingClientRect\` method to obtain fractional values for the size of an element and its position relative to the viewport.`;
  } // Global HTML Attributes & Properties
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement


  const globalHTMLProperties = assign(create(null), {
    accessKey: {
      attribute: 'accesskey'
    },
    accessKeyLabel: {
      readOnly: true
    },
    className: {
      attribute: 'class',
      error: 'Using the `className` property is an anti-pattern because of slow runtime behavior and potential conflicts with classes provided by the owner element. Use the `classList` API instead.'
    },
    contentEditable: {
      attribute: 'contenteditable'
    },
    dataset: {
      readOnly: true,
      error: "Using the `dataset` property is an anti-pattern because it can't be statically analyzed. Expose each property individually using the `@api` decorator instead."
    },
    dir: {
      attribute: 'dir'
    },
    draggable: {
      attribute: 'draggable'
    },
    dropzone: {
      attribute: 'dropzone',
      readOnly: true
    },
    hidden: {
      attribute: 'hidden'
    },
    id: {
      attribute: 'id'
    },
    inputMode: {
      attribute: 'inputmode'
    },
    lang: {
      attribute: 'lang'
    },
    slot: {
      attribute: 'slot',
      error: 'Using the `slot` property is an anti-pattern.'
    },
    spellcheck: {
      attribute: 'spellcheck'
    },
    style: {
      attribute: 'style'
    },
    tabIndex: {
      attribute: 'tabindex'
    },
    title: {
      attribute: 'title'
    },
    translate: {
      attribute: 'translate'
    },
    // additional "global attributes" that are not present in the link above.
    isContentEditable: {
      readOnly: true
    },
    offsetHeight: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetHeight')
    },
    offsetLeft: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetLeft')
    },
    offsetParent: {
      readOnly: true
    },
    offsetTop: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetTop')
    },
    offsetWidth: {
      readOnly: true,
      error: offsetPropertyErrorMessage('offsetWidth')
    },
    role: {
      attribute: 'role'
    }
  });
  const AttrNameToPropNameMap = create(null);
  const PropNameToAttrNameMap = create(null); // Synthetic creation of all AOM property descriptors for Custom Elements

  forEach.call(ElementPrototypeAriaPropertyNames, propName => {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const attrName = StringToLowerCase$1.call(StringReplace$1.call(propName, /^aria/, 'aria-'));
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });
  forEach.call(defaultDefHTMLPropertyNames, propName => {
    const attrName = StringToLowerCase$1.call(propName);
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });
  forEach.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes, propName => {
    const attrName = StringToLowerCase$1.call(propName);
    AttrNameToPropNameMap[attrName] = propName;
    PropNameToAttrNameMap[propName] = attrName;
  });
  const CAMEL_REGEX = /-([a-z])/g;
  /**
   * This method maps between attribute names
   * and the corresponding property name.
   */

  function getPropNameFromAttrName(attrName) {
    if (isUndefined(AttrNameToPropNameMap[attrName])) {
      AttrNameToPropNameMap[attrName] = StringReplace$1.call(attrName, CAMEL_REGEX, g => g[1].toUpperCase());
    }

    return AttrNameToPropNameMap[attrName];
  }

  const CAPS_REGEX = /[A-Z]/g;
  /**
   * This method maps between property names
   * and the corresponding attribute name.
   */

  function getAttrNameFromPropName(propName) {
    if (isUndefined(PropNameToAttrNameMap[propName])) {
      PropNameToAttrNameMap[propName] = StringReplace$1.call(propName, CAPS_REGEX, match => '-' + match.toLowerCase());
    }

    return PropNameToAttrNameMap[propName];
  }

  let controlledElement = null;
  let controlledAttributeName;

  function isAttributeLocked(elm, attrName) {
    return elm !== controlledElement || attrName !== controlledAttributeName;
  }

  function lockAttribute(_elm, _key) {
    controlledElement = null;
    controlledAttributeName = undefined;
  }

  function unlockAttribute(elm, key) {
    controlledElement = elm;
    controlledAttributeName = key;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function getComponentTag(vm) {
    // Element.prototype.tagName getter might be poisoned. We need to use a try/catch to protect the
    // engine internal when accessing the tagName property.
    try {
      return `<${StringToLowerCase$1.call(vm.elm.tagName)}>`;
    } catch (error) {
      return '<invalid-tag-name>';
    }
  } // TODO [#1695]: Unify getComponentStack and getErrorComponentStack


  function getComponentStack(vm) {
    const stack = [];
    let prefix = '';

    while (!isNull(vm.owner)) {
      ArrayPush.call(stack, prefix + getComponentTag(vm));
      vm = vm.owner;
      prefix += '\t';
    }

    return ArrayJoin.call(stack, '\n');
  }

  function getErrorComponentStack(vm) {
    const wcStack = [];
    let currentVm = vm;

    while (!isNull(currentVm)) {
      ArrayPush.call(wcStack, getComponentTag(currentVm));
      currentVm = currentVm.owner;
    }

    return wcStack.reverse().join('\n\t');
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function logError(message, vm) {
    let msg = `[LWC error]: ${message}`;

    if (!isUndefined(vm)) {
      msg = `${msg}\n${getComponentStack(vm)}`;
    }

    try {
      throw new Error(msg);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  let nextTickCallbackQueue = [];
  const SPACE_CHAR = 32;
  const EmptyObject = seal(create(null));
  const EmptyArray = seal([]);

  function flushCallbackQueue() {
    {
      if (nextTickCallbackQueue.length === 0) {
        throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
      }
    }

    const callbacks = nextTickCallbackQueue;
    nextTickCallbackQueue = []; // reset to a new queue

    for (let i = 0, len = callbacks.length; i < len; i += 1) {
      callbacks[i]();
    }
  }

  function addCallbackToNextTick(callback) {
    {
      if (!isFunction(callback)) {
        throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
      }
    }

    if (nextTickCallbackQueue.length === 0) {
      Promise.resolve().then(flushCallbackQueue);
    }

    ArrayPush.call(nextTickCallbackQueue, callback);
  }

  const useSyntheticShadow = hasOwnProperty$1.call(Element.prototype, '$shadowToken$');
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function handleEvent(event, vnode) {
    const {
      type
    } = event;
    const {
      data: {
        on
      }
    } = vnode;
    const handler = on && on[type]; // call event handler if exists

    if (handler) {
      handler.call(undefined, event);
    }
  }

  function createListener() {
    return function handler(event) {
      handleEvent(event, handler.vnode);
    };
  }

  function updateAllEventListeners(oldVnode, vnode) {
    if (isUndefined(oldVnode.listener)) {
      createAllEventListeners(vnode);
    } else {
      vnode.listener = oldVnode.listener;
      vnode.listener.vnode = vnode;
    }
  }

  function createAllEventListeners(vnode) {
    const {
      data: {
        on
      }
    } = vnode;

    if (isUndefined(on)) {
      return;
    }

    const elm = vnode.elm;
    const listener = vnode.listener = createListener();
    listener.vnode = vnode;
    let name;

    for (name in on) {
      elm.addEventListener(name, listener);
    }
  }

  var modEvents = {
    update: updateAllEventListeners,
    create: createAllEventListeners
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const xmlNS = 'http://www.w3.org/XML/1998/namespace';
  const ColonCharCode = 58;

  function updateAttrs(oldVnode, vnode) {
    const {
      data: {
        attrs
      }
    } = vnode;

    if (isUndefined(attrs)) {
      return;
    }

    let {
      data: {
        attrs: oldAttrs
      }
    } = oldVnode;

    if (oldAttrs === attrs) {
      return;
    }

    {
      assert.invariant(isUndefined(oldAttrs) || keys(oldAttrs).join(',') === keys(attrs).join(','), `vnode.data.attrs cannot change shape.`);
    }

    const elm = vnode.elm;
    let key;
    oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs; // update modified attributes, add new attributes
    // this routine is only useful for data-* attributes in all kind of elements
    // and aria-* in standard elements (custom elements will use props for these)

    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];

      if (old !== cur) {
        unlockAttribute(elm, key);

        if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur);
        } else if (isNull(cur)) {
          elm.removeAttribute(key);
        } else {
          elm.setAttribute(key, cur);
        }

        lockAttribute();
      }
    }
  }

  const emptyVNode = {
    data: {}
  };
  var modAttrs = {
    create: vnode => updateAttrs(emptyVNode, vnode),
    update: updateAttrs
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function isLiveBindingProp(sel, key) {
    // For properties with live bindings, we read values from the DOM element
    // instead of relying on internally tracked values.
    return sel === 'input' && (key === 'value' || key === 'checked');
  }

  function update(oldVnode, vnode) {
    const props = vnode.data.props;

    if (isUndefined(props)) {
      return;
    }

    const oldProps = oldVnode.data.props;

    if (oldProps === props) {
      return;
    }

    {
      assert.invariant(isUndefined(oldProps) || keys(oldProps).join(',') === keys(props).join(','), 'vnode.data.props cannot change shape.');
    }

    const elm = vnode.elm;
    const isFirstPatch = isUndefined(oldProps);
    const {
      sel
    } = vnode;

    for (const key in props) {
      const cur = props[key];

      {
        if (!(key in elm)) {
          // TODO [#1297]: Move this validation to the compiler
          assert.fail(`Unknown public property "${key}" of element <${sel}>. This is likely a typo on the corresponding attribute "${getAttrNameFromPropName(key)}".`);
        }
      } // if it is the first time this element is patched, or the current value is different to the previous value...


      if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? elm[key] : oldProps[key])) {
        elm[key] = cur;
      }
    }
  }

  const emptyVNode$1 = {
    data: {}
  };
  var modProps = {
    create: vnode => update(emptyVNode$1, vnode),
    update
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const classNameToClassMap = create(null);

  function getMapFromClassName(className) {
    // Intentionally using == to match undefined and null values from computed style attribute
    if (className == null) {
      return EmptyObject;
    } // computed class names must be string


    className = isString(className) ? className : className + '';
    let map = classNameToClassMap[className];

    if (map) {
      return map;
    }

    map = create(null);
    let start = 0;
    let o;
    const len = className.length;

    for (o = 0; o < len; o++) {
      if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
        if (o > start) {
          map[StringSlice.call(className, start, o)] = true;
        }

        start = o + 1;
      }
    }

    if (o > start) {
      map[StringSlice.call(className, start, o)] = true;
    }

    classNameToClassMap[className] = map;

    {
      // just to make sure that this object never changes as part of the diffing algo
      freeze(map);
    }

    return map;
  }

  function updateClassAttribute(oldVnode, vnode) {
    const {
      elm,
      data: {
        className: newClass
      }
    } = vnode;
    const {
      data: {
        className: oldClass
      }
    } = oldVnode;

    if (oldClass === newClass) {
      return;
    }

    const {
      classList
    } = elm;
    const newClassMap = getMapFromClassName(newClass);
    const oldClassMap = getMapFromClassName(oldClass);
    let name;

    for (name in oldClassMap) {
      // remove only if it is not in the new class collection and it is not set from within the instance
      if (isUndefined(newClassMap[name])) {
        classList.remove(name);
      }
    }

    for (name in newClassMap) {
      if (isUndefined(oldClassMap[name])) {
        classList.add(name);
      }
    }
  }

  const emptyVNode$2 = {
    data: {}
  };
  var modComputedClassName = {
    create: vnode => updateClassAttribute(emptyVNode$2, vnode),
    update: updateClassAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function updateStyleAttribute(oldVnode, vnode) {
    const {
      style: newStyle
    } = vnode.data;

    if (oldVnode.data.style === newStyle) {
      return;
    }

    const elm = vnode.elm;
    const {
      style
    } = elm;

    if (!isString(newStyle) || newStyle === '') {
      removeAttribute.call(elm, 'style');
    } else {
      style.cssText = newStyle;
    }
  }

  const emptyVNode$3 = {
    data: {}
  };
  var modComputedStyle = {
    create: vnode => updateStyleAttribute(emptyVNode$3, vnode),
    update: updateStyleAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline classnames into an object. It's faster to set the
  // different classnames properties individually instead of via a string.

  function createClassAttribute(vnode) {
    const {
      elm,
      data: {
        classMap
      }
    } = vnode;

    if (isUndefined(classMap)) {
      return;
    }

    const {
      classList
    } = elm;

    for (const name in classMap) {
      classList.add(name);
    }
  }

  var modStaticClassName = {
    create: createClassAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline style into an object. It's faster to set the
  // different style properties individually instead of via a string.

  function createStyleAttribute(vnode) {
    const {
      elm,
      data: {
        styleMap
      }
    } = vnode;

    if (isUndefined(styleMap)) {
      return;
    }

    const {
      style
    } = elm;

    for (const name in styleMap) {
      style[name] = styleMap[name];
    }
  }

  var modStaticStyle = {
    create: createStyleAttribute
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
  @license
  Copyright (c) 2015 Simon Friis Vindum.
  This code may only be used under the MIT License found at
  https://github.com/snabbdom/snabbdom/blob/master/LICENSE
  Code distributed by Snabbdom as part of the Snabbdom project at
  https://github.com/snabbdom/snabbdom/
  */

  function isUndef(s) {
    return s === undefined;
  }

  function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
  }

  function isVNode(vnode) {
    return vnode != null;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    const map = {};
    let j, key, ch; // TODO [#1637]: simplify this by assuming that all vnodes has keys

    for (j = beginIdx; j <= endIdx; ++j) {
      ch = children[j];

      if (isVNode(ch)) {
        key = ch.key;

        if (key !== undefined) {
          map[key] = j;
        }
      }
    }

    return map;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];

      if (isVNode(ch)) {
        ch.hook.create(ch);
        ch.hook.insert(ch, parentElm, before);
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]; // text nodes do not have logic associated to them

      if (isVNode(ch)) {
        ch.hook.remove(ch, parentElm);
      }
    }
  }

  function updateDynamicChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!isVNode(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (!isVNode(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (!isVNode(newStartVnode)) {
        newStartVnode = newCh[++newStartIdx];
      } else if (!isVNode(newEndVnode)) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode);
        newEndVnode.hook.move(oldStartVnode, parentElm, oldEndVnode.elm.nextSibling);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode);
        newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = oldKeyToIdx[newStartVnode.key];

        if (isUndef(idxInOld)) {
          // New element
          newStartVnode.hook.create(newStartVnode);
          newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];

          if (isVNode(elmToMove)) {
            if (elmToMove.sel !== newStartVnode.sel) {
              // New element
              newStartVnode.hook.create(newStartVnode);
              newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
            } else {
              patchVnode(elmToMove, newStartVnode);
              oldCh[idxInOld] = undefined;
              newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
            }
          }

          newStartVnode = newCh[++newStartIdx];
        }
      }
    }

    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        const n = newCh[newEndIdx + 1];
        before = isVNode(n) ? n.elm : null;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  function updateStaticChildren(parentElm, oldCh, newCh) {
    const {
      length
    } = newCh;

    if (oldCh.length === 0) {
      // the old list is empty, we can directly insert anything new
      addVnodes(parentElm, null, newCh, 0, length);
      return;
    } // if the old list is not empty, the new list MUST have the same
    // amount of nodes, that's why we call this static children


    let referenceElm = null;

    for (let i = length - 1; i >= 0; i -= 1) {
      const vnode = newCh[i];
      const oldVNode = oldCh[i];

      if (vnode !== oldVNode) {
        if (isVNode(oldVNode)) {
          if (isVNode(vnode)) {
            // both vnodes must be equivalent, and se just need to patch them
            patchVnode(oldVNode, vnode);
            referenceElm = vnode.elm;
          } else {
            // removing the old vnode since the new one is null
            oldVNode.hook.remove(oldVNode, parentElm);
          }
        } else if (isVNode(vnode)) {
          // this condition is unnecessary
          vnode.hook.create(vnode); // insert the new node one since the old one is null

          vnode.hook.insert(vnode, parentElm, referenceElm);
          referenceElm = vnode.elm;
        }
      }
    }
  }

  function patchVnode(oldVnode, vnode) {
    if (oldVnode !== vnode) {
      vnode.elm = oldVnode.elm;
      vnode.hook.update(oldVnode, vnode);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function generateDataDescriptor(options) {
    return assign({
      configurable: true,
      enumerable: true,
      writable: true
    }, options);
  }

  function generateAccessorDescriptor(options) {
    return assign({
      configurable: true,
      enumerable: true
    }, options);
  }

  let isDomMutationAllowed = false;

  function unlockDomMutation() {

    isDomMutationAllowed = true;
  }

  function lockDomMutation() {

    isDomMutationAllowed = false;
  }

  function portalRestrictionErrorMessage(name, type) {
    return `The \`${name}\` ${type} is available only on elements that use the \`lwc:dom="manual"\` directive.`;
  }

  function getNodeRestrictionsDescriptors(node, options = {}) {
    // and returns the first descriptor for the property


    const originalTextContentDescriptor = getPropertyDescriptor(node, 'textContent');
    const originalNodeValueDescriptor = getPropertyDescriptor(node, 'nodeValue');
    const {
      appendChild,
      insertBefore,
      removeChild,
      replaceChild
    } = node;
    return {
      appendChild: generateDataDescriptor({
        value(aChild) {
          if (this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('appendChild', 'method'));
          }

          return appendChild.call(this, aChild);
        }

      }),
      insertBefore: generateDataDescriptor({
        value(newNode, referenceNode) {
          if (!isDomMutationAllowed && this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('insertBefore', 'method'));
          }

          return insertBefore.call(this, newNode, referenceNode);
        }

      }),
      removeChild: generateDataDescriptor({
        value(aChild) {
          if (!isDomMutationAllowed && this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('removeChild', 'method'));
          }

          return removeChild.call(this, aChild);
        }

      }),
      replaceChild: generateDataDescriptor({
        value(newChild, oldChild) {
          if (this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('replaceChild', 'method'));
          }

          return replaceChild.call(this, newChild, oldChild);
        }

      }),
      nodeValue: generateAccessorDescriptor({
        get() {
          return originalNodeValueDescriptor.get.call(this);
        },

        set(value) {
          if (!isDomMutationAllowed && this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('nodeValue', 'property'));
          }

          originalNodeValueDescriptor.set.call(this, value);
        }

      }),
      textContent: generateAccessorDescriptor({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(value) {
          if (this instanceof Element && isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('textContent', 'property'));
          }

          originalTextContentDescriptor.set.call(this, value);
        }

      })
    };
  }

  function getElementRestrictionsDescriptors(elm, options) {

    const descriptors = getNodeRestrictionsDescriptors(elm, options);
    const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
    const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
    assign(descriptors, {
      innerHTML: generateAccessorDescriptor({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(value) {
          if (isFalse$1(options.isPortal)) {
            logError(portalRestrictionErrorMessage('innerHTML', 'property'), getAssociatedVMIfPresent(this));
          }

          return originalInnerHTMLDescriptor.set.call(this, value);
        }

      }),
      outerHTML: generateAccessorDescriptor({
        get() {
          return originalOuterHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set outerHTML on Element.`);
        }

      })
    });
    return descriptors;
  }

  function getShadowRootRestrictionsDescriptors(sr) {
    // thing when using the real shadow root, because if that's the case,
    // the component will not work when running with synthetic shadow.


    const originalQuerySelector = sr.querySelector;
    const originalQuerySelectorAll = sr.querySelectorAll;
    const originalAddEventListener = sr.addEventListener;
    const descriptors = getNodeRestrictionsDescriptors(sr);
    const originalInnerHTMLDescriptor = getPropertyDescriptor(sr, 'innerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor(sr, 'textContent');
    assign(descriptors, {
      innerHTML: generateAccessorDescriptor({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set innerHTML on ShadowRoot.`);
        }

      }),
      textContent: generateAccessorDescriptor({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set textContent on ShadowRoot.`);
        }

      }),
      addEventListener: generateDataDescriptor({
        value(type, listener, options) {
          const vmBeingRendered = getVMBeingRendered();
          assert.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${toString(sr)} by adding an event listener for "${type}".`);
          assert.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${toString(sr)} by adding an event listener for "${type}".`); // TODO [#420]: this is triggered when the component author attempts to add a listener
          // programmatically into its Component's shadow root

          if (!isUndefined(options)) {
            logError('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent(this));
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalAddEventListener.apply(this, arguments);
        }

      }),
      querySelector: generateDataDescriptor({
        value() {
          const vm = getAssociatedVM(this);
          assert.isFalse(isBeingConstructed(vm), `this.template.querySelector() cannot be called during the construction of the` + `custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch

          return originalQuerySelector.apply(this, arguments);
        }

      }),
      querySelectorAll: generateDataDescriptor({
        value() {
          const vm = getAssociatedVM(this);
          assert.isFalse(isBeingConstructed(vm), `this.template.querySelectorAll() cannot be called during the construction of the` + ` custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch

          return originalQuerySelectorAll.apply(this, arguments);
        }

      })
    });
    const BlockedShadowRootMethods = {
      cloneNode: 0,
      getElementById: 0,
      getSelection: 0,
      elementsFromPoint: 0,
      dispatchEvent: 0
    };
    forEach.call(getOwnPropertyNames(BlockedShadowRootMethods), methodName => {
      const descriptor = generateAccessorDescriptor({
        get() {
          throw new Error(`Disallowed method "${methodName}" in ShadowRoot.`);
        }

      });
      descriptors[methodName] = descriptor;
    });
    return descriptors;
  } // Custom Elements Restrictions:
  // -----------------------------


  function getCustomElementRestrictionsDescriptors(elm) {

    const descriptors = getNodeRestrictionsDescriptors(elm);
    const originalAddEventListener = elm.addEventListener;
    const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
    const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
    return assign(descriptors, {
      innerHTML: generateAccessorDescriptor({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set innerHTML on HTMLElement.`);
        }

      }),
      outerHTML: generateAccessorDescriptor({
        get() {
          return originalOuterHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set outerHTML on HTMLElement.`);
        }

      }),
      textContent: generateAccessorDescriptor({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set textContent on HTMLElement.`);
        }

      }),
      addEventListener: generateDataDescriptor({
        value(type, listener, options) {
          const vmBeingRendered = getVMBeingRendered();
          assert.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${toString(this)} by adding an event listener for "${type}".`);
          assert.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${toString(elm)} by adding an event listener for "${type}".`); // TODO [#420]: this is triggered when the component author attempts to add a listener
          // programmatically into a lighting element node

          if (!isUndefined(options)) {
            logError('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent(this));
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalAddEventListener.apply(this, arguments);
        }

      })
    });
  }

  function getComponentRestrictionsDescriptors() {

    return {
      tagName: generateAccessorDescriptor({
        get() {
          throw new Error(`Usage of property \`tagName\` is disallowed because the component itself does` + ` not know which tagName will be used to create the element, therefore writing` + ` code that check for that value is error prone.`);
        },

        configurable: true,
        enumerable: false
      })
    };
  }

  function getLightningElementPrototypeRestrictionsDescriptors(proto) {

    const originalDispatchEvent = proto.dispatchEvent;
    const originalIsConnectedGetter = getOwnPropertyDescriptor(proto, 'isConnected').get;
    const descriptors = {
      dispatchEvent: generateDataDescriptor({
        value(event) {
          const vm = getAssociatedVM(this);
          assert.isFalse(isBeingConstructed(vm), `this.dispatchEvent() should not be called during the construction of the custom` + ` element for ${getComponentTag(vm)} because no one is listening just yet.`);

          if (!isNull(event) && isObject$1(event)) {
            const {
              type
            } = event;

            if (!/^[a-z][a-z0-9_]*$/.test(type)) {
              logError(`Invalid event type "${type}" dispatched in element ${getComponentTag(vm)}.` + ` Event name must start with a lowercase letter and followed only lowercase` + ` letters, numbers, and underscores`, vm);
            }
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalDispatchEvent.apply(this, arguments);
        }

      }),
      isConnected: generateAccessorDescriptor({
        get() {
          const vm = getAssociatedVM(this);
          const componentTag = getComponentTag(vm);
          assert.isFalse(isBeingConstructed(vm), `this.isConnected should not be accessed during the construction phase of the custom` + ` element ${componentTag}. The value will always be` + ` false for Lightning Web Components constructed using lwc.createElement().`);
          assert.isFalse(isVMBeingRendered(vm), `this.isConnected should not be accessed during the rendering phase of the custom` + ` element ${componentTag}. The value will always be true.`);
          assert.isFalse(isInvokingRenderedCallback(vm), `this.isConnected should not be accessed during the renderedCallback of the custom` + ` element ${componentTag}. The value will always be true.`);
          return originalIsConnectedGetter.call(this);
        }

      })
    };
    forEach.call(getOwnPropertyNames(globalHTMLProperties), propName => {
      if (propName in proto) {
        return; // no need to redefine something that we are already exposing
      }

      descriptors[propName] = generateAccessorDescriptor({
        get() {
          const {
            error,
            attribute
          } = globalHTMLProperties[propName];
          const msg = [];
          msg.push(`Accessing the global HTML property "${propName}" is disabled.`);

          if (error) {
            msg.push(error);
          } else if (attribute) {
            msg.push(`Instead access it via \`this.getAttribute("${attribute}")\`.`);
          }

          logError(msg.join('\n'), getAssociatedVM(this));
        },

        set() {
          const {
            readOnly
          } = globalHTMLProperties[propName];

          if (readOnly) {
            logError(`The global HTML property \`${propName}\` is read-only.`, getAssociatedVM(this));
          }
        }

      });
    });
    return descriptors;
  }

  function patchElementWithRestrictions(elm, options) {
    defineProperties(elm, getElementRestrictionsDescriptors(elm, options));
  } // This routine will prevent access to certain properties on a shadow root instance to guarantee
  // that all components will work fine in IE11 and other browsers without shadow dom support.


  function patchShadowRootWithRestrictions(sr) {
    defineProperties(sr, getShadowRootRestrictionsDescriptors(sr));
  }

  function patchCustomElementWithRestrictions(elm) {
    const restrictionsDescriptors = getCustomElementRestrictionsDescriptors(elm);
    const elmProto = getPrototypeOf(elm);
    setPrototypeOf(elm, create(elmProto, restrictionsDescriptors));
  }

  function patchComponentWithRestrictions(cmp) {
    defineProperties(cmp, getComponentRestrictionsDescriptors());
  }

  function patchLightningElementPrototypeWithRestrictions(proto) {
    defineProperties(proto, getLightningElementPrototypeRestrictionsDescriptors(proto));
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const noop = () => void 0;

  function observeElementChildNodes(elm) {
    elm.$domManual$ = true;
  }

  function setElementShadowToken(elm, token) {
    elm.$shadowToken$ = token;
  }

  function updateNodeHook(oldVnode, vnode) {
    const {
      text
    } = vnode;

    if (oldVnode.text !== text) {
      {
        unlockDomMutation();
      }
      /**
       * Compiler will never produce a text property that is not string
       */


      vnode.elm.nodeValue = text;

      {
        lockDomMutation();
      }
    }
  }

  function insertNodeHook(vnode, parentNode, referenceNode) {
    {
      unlockDomMutation();
    }

    parentNode.insertBefore(vnode.elm, referenceNode);

    {
      lockDomMutation();
    }
  }

  function removeNodeHook(vnode, parentNode) {
    {
      unlockDomMutation();
    }

    parentNode.removeChild(vnode.elm);

    {
      lockDomMutation();
    }
  }

  function createElmHook(vnode) {
    modEvents.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs.create(vnode);
    modProps.create(vnode);
    modStaticClassName.create(vnode);
    modStaticStyle.create(vnode);
    modComputedClassName.create(vnode);
    modComputedStyle.create(vnode);
  }

  var LWCDOMMode;

  (function (LWCDOMMode) {
    LWCDOMMode["manual"] = "manual";
  })(LWCDOMMode || (LWCDOMMode = {}));

  function fallbackElmHook(vnode) {
    const {
      owner
    } = vnode;
    const elm = vnode.elm;

    if (isTrue$1(useSyntheticShadow)) {
      const {
        data: {
          context
        }
      } = vnode;
      const {
        shadowAttribute
      } = owner.context;

      if (!isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual) {
        // this element will now accept any manual content inserted into it
        observeElementChildNodes(elm);
      } // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.


      setElementShadowToken(elm, shadowAttribute);
    }

    {
      const {
        data: {
          context
        }
      } = vnode;
      const isPortal = !isUndefined(context) && !isUndefined(context.lwc) && context.lwc.dom === LWCDOMMode.manual;
      patchElementWithRestrictions(elm, {
        isPortal
      });
    }
  }

  function updateElmHook(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs.update(oldVnode, vnode);
    modProps.update(oldVnode, vnode);
    modComputedClassName.update(oldVnode, vnode);
    modComputedStyle.update(oldVnode, vnode);
  }

  function insertCustomElmHook(vnode) {
    const vm = getAssociatedVM(vnode.elm);
    appendVM(vm);
  }

  function updateChildrenHook(oldVnode, vnode) {
    const {
      children,
      owner
    } = vnode;
    const fn = hasDynamicChildren(children) ? updateDynamicChildren : updateStaticChildren;
    runWithBoundaryProtection(owner, owner.owner, noop, () => {
      fn(vnode.elm, oldVnode.children, children);
    }, noop);
  }

  function allocateChildrenHook(vnode) {
    const vm = getAssociatedVM(vnode.elm);
    const {
      children
    } = vnode;
    vm.aChildren = children;

    if (isTrue$1(useSyntheticShadow)) {
      // slow path
      allocateInSlot(vm, children); // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

      vnode.children = EmptyArray;
    }
  }

  function createViewModelHook(vnode) {
    const elm = vnode.elm;

    if (!isUndefined(getAssociatedVMIfPresent(elm))) {
      // There is a possibility that a custom element is registered under tagName,
      // in which case, the initialization is already carry on, and there is nothing else
      // to do here since this hook is called right after invoking `document.createElement`.
      return;
    }

    const {
      mode,
      ctor,
      owner
    } = vnode;
    const def = getComponentDef(ctor);
    setElementProto(elm, def);

    if (isTrue$1(useSyntheticShadow)) {
      const {
        shadowAttribute
      } = owner.context; // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.

      setElementShadowToken(elm, shadowAttribute);
    }

    createVM(elm, ctor, {
      mode,
      owner
    });

    {
      assert.isTrue(isArray$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
    }
  }

  function createCustomElmHook(vnode) {
    modEvents.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs.create(vnode);
    modProps.create(vnode);
    modStaticClassName.create(vnode);
    modStaticStyle.create(vnode);
    modComputedClassName.create(vnode);
    modComputedStyle.create(vnode);
  }

  function createChildrenHook(vnode) {
    const {
      elm,
      children
    } = vnode;

    for (let j = 0; j < children.length; ++j) {
      const ch = children[j];

      if (ch != null) {
        ch.hook.create(ch);
        ch.hook.insert(ch, elm, null);
      }
    }
  }

  function rerenderCustomElmHook(vnode) {
    const vm = getAssociatedVM(vnode.elm);

    {
      assert.isTrue(isArray$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
    }

    rerenderVM(vm);
  }

  function updateCustomElmHook(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs.update(oldVnode, vnode);
    modProps.update(oldVnode, vnode);
    modComputedClassName.update(oldVnode, vnode);
    modComputedStyle.update(oldVnode, vnode);
  }

  function removeElmHook(vnode) {
    // this method only needs to search on child vnodes from template
    // to trigger the remove hook just in case some of those children
    // are custom elements.
    const {
      children,
      elm
    } = vnode;

    for (let j = 0, len = children.length; j < len; ++j) {
      const ch = children[j];

      if (!isNull(ch)) {
        ch.hook.remove(ch, elm);
      }
    }
  }

  function removeCustomElmHook(vnode) {
    // for custom elements we don't have to go recursively because the removeVM routine
    // will take care of disconnecting any child VM attached to its shadow as well.
    removeVM(getAssociatedVM(vnode.elm));
  } // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


  const FromIteration = new WeakMap(); // dynamic children means it was generated by an iteration
  // in a template, and will require a more complex diffing algo.

  function markAsDynamicChildren(children) {
    FromIteration.set(children, 1);
  }

  function hasDynamicChildren(children) {
    return FromIteration.has(children);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CHAR_S = 115;
  const CHAR_V = 118;
  const CHAR_G = 103;
  const NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
  const SymbolIterator = Symbol.iterator;
  const TextHook = {
    create: vnode => {
      vnode.elm = document.createTextNode(vnode.text);
      linkNodeToShadow(vnode);
    },
    update: updateNodeHook,
    insert: insertNodeHook,
    move: insertNodeHook,
    remove: removeNodeHook
  }; // insert is called after update, which is used somewhere else (via a module)
  // to mark the vm as inserted, that means we cannot use update as the main channel
  // to rehydrate when dirty, because sometimes the element is not inserted just yet,
  // which breaks some invariants. For that reason, we have the following for any
  // Custom Element that is inserted via a template.

  const ElementHook = {
    create: vnode => {
      const {
        data,
        sel,
        clonedElement
      } = vnode;
      const {
        ns
      } = data; // TODO [#1364]: supporting the ability to inject a cloned StyleElement via a vnode this is
      // used for style tags for native shadow

      if (isUndefined(clonedElement)) {
        vnode.elm = isUndefined(ns) ? document.createElement(sel) : document.createElementNS(ns, sel);
      } else {
        vnode.elm = clonedElement;
      }

      linkNodeToShadow(vnode);
      fallbackElmHook(vnode);
      createElmHook(vnode);
    },
    update: (oldVnode, vnode) => {
      updateElmHook(oldVnode, vnode);
      updateChildrenHook(oldVnode, vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
      createChildrenHook(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook(vnode, parentNode);
      removeElmHook(vnode);
    }
  };
  const CustomElementHook = {
    create: vnode => {
      const {
        sel
      } = vnode;
      vnode.elm = document.createElement(sel);
      linkNodeToShadow(vnode);
      createViewModelHook(vnode);
      allocateChildrenHook(vnode);
      createCustomElmHook(vnode);
    },
    update: (oldVnode, vnode) => {
      updateCustomElmHook(oldVnode, vnode); // in fallback mode, the allocation will always set children to
      // empty and delegate the real allocation to the slot elements

      allocateChildrenHook(vnode); // in fallback mode, the children will be always empty, so, nothing
      // will happen, but in native, it does allocate the light dom

      updateChildrenHook(oldVnode, vnode); // this will update the shadowRoot

      rerenderCustomElmHook(vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
      const vm = getAssociatedVM(vnode.elm);

      {
        assert.isTrue(vm.state === VMState.created, `${vm} cannot be recycled.`);
      }

      runConnectedCallback(vm);
      createChildrenHook(vnode);
      insertCustomElmHook(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook(vnode, parentNode);
      removeCustomElmHook(vnode);
    }
  };

  function linkNodeToShadow(vnode) {
    // TODO [#1164]: this should eventually be done by the polyfill directly
    vnode.elm.$shadowResolver$ = vnode.owner.cmpRoot.$shadowResolver$;
  } // TODO [#1136]: this should be done by the compiler, adding ns to every sub-element


  function addNS(vnode) {
    const {
      data,
      children,
      sel
    } = vnode;
    data.ns = NamespaceAttributeForSVG; // TODO [#1275]: review why `sel` equal `foreignObject` should get this `ns`

    if (isArray$1(children) && sel !== 'foreignObject') {
      for (let j = 0, n = children.length; j < n; ++j) {
        const childNode = children[j];

        if (childNode != null && childNode.hook === ElementHook) {
          addNS(childNode);
        }
      }
    }
  }

  function addVNodeToChildLWC(vnode) {
    ArrayPush.call(getVMBeingRendered().velements, vnode);
  } // [h]tml node


  function h(sel, data, children) {
    const vmBeingRendered = getVMBeingRendered();

    {
      assert.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
      assert.isTrue(isObject$1(data), `h() 2nd argument data must be an object.`);
      assert.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
      assert.isTrue('key' in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`); // checking reserved internal data properties

      assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
      assert.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

      if (data.style && !isString(data.style)) {
        logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
      }

      forEach.call(children, childVnode => {
        if (childVnode != null) {
          assert.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
        }
      });
    }

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: ElementHook,
      owner: vmBeingRendered
    };

    if (sel.length === 3 && StringCharCodeAt.call(sel, 0) === CHAR_S && StringCharCodeAt.call(sel, 1) === CHAR_V && StringCharCodeAt.call(sel, 2) === CHAR_G) {
      addNS(vnode);
    }

    return vnode;
  } // [t]ab[i]ndex function


  function ti(value) {
    // if value is greater than 0, we normalize to 0
    // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
    // If value is less than -1, we don't care
    const shouldNormalize = value > 0 && !(isTrue$1(value) || isFalse$1(value));

    {
      const vmBeingRendered = getVMBeingRendered();

      if (shouldNormalize) {
        logError(`Invalid tabindex value \`${toString(value)}\` in template for ${vmBeingRendered}. This attribute must be set to 0 or -1.`, vmBeingRendered);
      }
    }

    return shouldNormalize ? 0 : value;
  } // [s]lot element node


  function s(slotName, data, children, slotset) {
    {
      assert.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
      assert.isTrue(isObject$1(data), `s() 2nd argument data must be an object.`);
      assert.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
    }

    if (!isUndefined(slotset) && !isUndefined(slotset[slotName]) && slotset[slotName].length !== 0) {
      children = slotset[slotName];
    }

    const vnode = h('slot', data, children);

    if (useSyntheticShadow) {
      // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
      sc(children);
    }

    return vnode;
  } // [c]ustom element node


  function c(sel, Ctor, data, children = EmptyArray) {
    const vmBeingRendered = getVMBeingRendered();

    {
      assert.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
      assert.isTrue(isFunction(Ctor), `c() 2nd argument Ctor must be a function.`);
      assert.isTrue(isObject$1(data), `c() 3nd argument data must be an object.`);
      assert.isTrue(arguments.length === 3 || isArray$1(children), `c() 4nd argument data must be an array.`); // checking reserved internal data properties

      assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
      assert.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

      if (data.style && !isString(data.style)) {
        logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
      }

      if (arguments.length === 4) {
        forEach.call(children, childVnode => {
          if (childVnode != null) {
            assert.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
          }
        });
      }
    }

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: CustomElementHook,
      ctor: Ctor,
      owner: vmBeingRendered,
      mode: 'open'
    };
    addVNodeToChildLWC(vnode);
    return vnode;
  } // [i]terable node


  function i(iterable, factory) {
    const list = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc(list);
    const vmBeingRendered = getVMBeingRendered();

    if (isUndefined(iterable) || iterable === null) {
      {
        logError(`Invalid template iteration for value "${toString(iterable)}" in ${vmBeingRendered}. It must be an Array or an iterable Object.`, vmBeingRendered);
      }

      return list;
    }

    {
      assert.isFalse(isUndefined(iterable[SymbolIterator]), `Invalid template iteration for value \`${toString(iterable)}\` in ${vmBeingRendered}. It must be an array-like object and not \`null\` nor \`undefined\`.`);
    }

    const iterator = iterable[SymbolIterator]();

    {
      assert.isTrue(iterator && isFunction(iterator.next), `Invalid iterator function for "${toString(iterable)}" in ${vmBeingRendered}.`);
    }

    let next = iterator.next();
    let j = 0;
    let {
      value,
      done: last
    } = next;
    let keyMap;
    let iterationError;

    {
      keyMap = create(null);
    }

    while (last === false) {
      // implementing a look-back-approach because we need to know if the element is the last
      next = iterator.next();
      last = next.done; // template factory logic based on the previous collected value

      const vnode = factory(value, j, j === 0, last);

      if (isArray$1(vnode)) {
        ArrayPush.apply(list, vnode);
      } else {
        ArrayPush.call(list, vnode);
      }

      {
        const vnodes = isArray$1(vnode) ? vnode : [vnode];
        forEach.call(vnodes, childVnode => {
          if (!isNull(childVnode) && isObject$1(childVnode) && !isUndefined(childVnode.sel)) {
            const {
              key
            } = childVnode;

            if (isString(key) || isNumber(key)) {
              if (keyMap[key] === 1 && isUndefined(iterationError)) {
                iterationError = `Duplicated "key" attribute value for "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. A key with value "${childVnode.key}" appears more than once in the iteration. Key values must be unique numbers or strings.`;
              }

              keyMap[key] = 1;
            } else if (isUndefined(iterationError)) {
              iterationError = `Invalid "key" attribute value in "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Set a unique "key" value on all iterated child elements.`;
            }
          }
        });
      } // preparing next value


      j += 1;
      value = next.value;
    }

    {
      if (!isUndefined(iterationError)) {
        logError(iterationError, vmBeingRendered);
      }
    }

    return list;
  }
  /**
   * [f]lattening
   */


  function f(items) {
    {
      assert.isTrue(isArray$1(items), 'flattening api can only work with arrays.');
    }

    const len = items.length;
    const flattened = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc(flattened);

    for (let j = 0; j < len; j += 1) {
      const item = items[j];

      if (isArray$1(item)) {
        ArrayPush.apply(flattened, item);
      } else {
        ArrayPush.call(flattened, item);
      }
    }

    return flattened;
  } // [t]ext node


  function t(text) {
    const data = EmptyObject;
    let sel, children, key, elm;
    return {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: TextHook,
      owner: getVMBeingRendered()
    };
  } // [d]ynamic value to produce a text vnode


  function d(value) {
    if (value == null) {
      return null;
    }

    return t(value);
  } // [b]ind function


  function b(fn) {
    const vmBeingRendered = getVMBeingRendered();

    if (isNull(vmBeingRendered)) {
      throw new Error();
    }

    const vm = vmBeingRendered;
    return function (event) {
      invokeEventListener(vm, fn, vm.component, event);
    };
  } // [k]ey function


  function k(compilerKey, obj) {
    switch (typeof obj) {
      case 'number':
      case 'string':
        return compilerKey + ':' + obj;

      case 'object':
        {
          assert.fail(`Invalid key value "${obj}" in ${getVMBeingRendered()}. Key must be a string or number.`);
        }

    }
  } // [g]lobal [id] function


  function gid(id) {
    const vmBeingRendered = getVMBeingRendered();

    if (isUndefined(id) || id === '') {
      {
        logError(`Invalid id value "${id}". The id attribute must contain a non-empty string.`, vmBeingRendered);
      }

      return id;
    } // We remove attributes when they are assigned a value of null


    if (isNull(id)) {
      return null;
    }

    return `${id}-${vmBeingRendered.idx}`;
  } // [f]ragment [id] function


  function fid(url) {
    const vmBeingRendered = getVMBeingRendered();

    if (isUndefined(url) || url === '') {
      {
        if (isUndefined(url)) {
          logError(`Undefined url value for "href" or "xlink:href" attribute. Expected a non-empty string.`, vmBeingRendered);
        }
      }

      return url;
    } // We remove attributes when they are assigned a value of null


    if (isNull(url)) {
      return null;
    } // Apply transformation only for fragment-only-urls


    if (/^#/.test(url)) {
      return `${url}-${vmBeingRendered.idx}`;
    }

    return url;
  }
  /**
   * Map to store an index value assigned to any dynamic component reference ingested
   * by dc() api. This allows us to generate a unique unique per template per dynamic
   * component reference to avoid diffing algo mismatches.
   */


  const DynamicImportedComponentMap = new Map();
  let dynamicImportedComponentCounter = 0;
  /**
   * create a dynamic component via `<x-foo lwc:dynamic={Ctor}>`
   */

  function dc(sel, Ctor, data, children) {
    {
      assert.isTrue(isString(sel), `dc() 1st argument sel must be a string.`);
      assert.isTrue(isObject$1(data), `dc() 3nd argument data must be an object.`);
      assert.isTrue(arguments.length === 3 || isArray$1(children), `dc() 4nd argument data must be an array.`);
    } // null or undefined values should produce a null value in the VNodes


    if (Ctor == null) {
      return null;
    }

    if (!isComponentConstructor(Ctor)) {
      throw new Error(`Invalid LWC Constructor ${toString(Ctor)} for custom element <${sel}>.`);
    }

    let idx = DynamicImportedComponentMap.get(Ctor);

    if (isUndefined(idx)) {
      idx = dynamicImportedComponentCounter++;
      DynamicImportedComponentMap.set(Ctor, idx);
    } // the new vnode key is a mix of idx and compiler key, this is required by the diffing algo
    // to identify different constructors as vnodes with different keys to avoid reusing the
    // element used for previous constructors.


    data.key = `dc:${idx}:${data.key}`;
    return c(sel, Ctor, data, children);
  }
  /**
   * slow children collection marking mechanism. this API allows the compiler to signal
   * to the engine that a particular collection of children must be diffed using the slow
   * algo based on keys due to the nature of the list. E.g.:
   *
   *   - slot element's children: the content of the slot has to be dynamic when in synthetic
   *                              shadow mode because the `vnode.children` might be the slotted
   *                              content vs default content, in which case the size and the
   *                              keys are not matching.
   *   - children that contain dynamic components
   *   - children that are produced by iteration
   *
   */


  function sc(vnodes) {
    {
      assert.isTrue(isArray$1(vnodes), 'sc() api can only work with arrays.');
    } // We have to mark the vnodes collection as dynamic so we can later on
    // choose to use the snabbdom virtual dom diffing algo instead of our
    // static dummy algo.


    markAsDynamicChildren(vnodes);
    return vnodes;
  }

  var api = /*#__PURE__*/Object.freeze({
    __proto__: null,
    h: h,
    ti: ti,
    s: s,
    c: c,
    i: i,
    f: f,
    t: t,
    d: d,
    b: b,
    k: k,
    gid: gid,
    fid: fid,
    dc: dc,
    sc: sc
  });
  const signedTemplateSet = new Set();

  function defaultEmptyTemplate() {
    return [];
  }

  signedTemplateSet.add(defaultEmptyTemplate);

  function isTemplateRegistered(tpl) {
    return signedTemplateSet.has(tpl);
  }
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */


  function registerTemplate(tpl) {
    signedTemplateSet.add(tpl); // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation

    return tpl;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CachedStyleFragments = create(null);

  function createStyleElement(styleContent) {
    const elm = document.createElement('style');
    elm.type = 'text/css';
    elm.textContent = styleContent;
    return elm;
  }

  function getCachedStyleElement(styleContent) {
    let fragment = CachedStyleFragments[styleContent];

    if (isUndefined(fragment)) {
      fragment = document.createDocumentFragment();
      const styleElm = createStyleElement(styleContent);
      fragment.appendChild(styleElm);
      CachedStyleFragments[styleContent] = fragment;
    }

    return fragment.cloneNode(true).firstChild;
  }

  const globalStyleParent = document.head || document.body || document;
  const InsertedGlobalStyleContent = create(null);

  function insertGlobalStyle(styleContent) {
    // inserts the global style when needed, otherwise does nothing
    if (isUndefined(InsertedGlobalStyleContent[styleContent])) {
      InsertedGlobalStyleContent[styleContent] = true;
      const elm = createStyleElement(styleContent);
      globalStyleParent.appendChild(elm);
    }
  }

  function createStyleVNode(elm) {
    const vnode = h('style', {
      key: 'style'
    }, EmptyArray); // TODO [#1364]: supporting the ability to inject a cloned StyleElement
    // forcing the diffing algo to use the cloned style for native shadow

    vnode.clonedElement = elm;
    return vnode;
  }
  /**
   * Reset the styling token applied to the host element.
   */


  function resetStyleAttributes(vm) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    const oldHostAttribute = context.hostAttribute;

    if (!isUndefined(oldHostAttribute)) {
      removeAttribute.call(elm, oldHostAttribute);
    } // Reset the scoping attributes associated to the context.


    context.hostAttribute = context.shadowAttribute = undefined;
  }
  /**
   * Apply/Update the styling token applied to the host element.
   */


  function applyStyleAttributes(vm, hostAttribute, shadowAttribute) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    setAttribute.call(elm, hostAttribute, '');
    context.hostAttribute = hostAttribute;
    context.shadowAttribute = shadowAttribute;
  }

  function collectStylesheets(stylesheets, hostSelector, shadowSelector, isNative, aggregatorFn) {
    forEach.call(stylesheets, sheet => {
      if (isArray$1(sheet)) {
        collectStylesheets(sheet, hostSelector, shadowSelector, isNative, aggregatorFn);
      } else {
        aggregatorFn(sheet(hostSelector, shadowSelector, isNative));
      }
    });
  }

  function evaluateCSS(stylesheets, hostAttribute, shadowAttribute) {
    {
      assert.isTrue(isArray$1(stylesheets), `Invalid stylesheets.`);
    }

    if (useSyntheticShadow) {
      const hostSelector = `[${hostAttribute}]`;
      const shadowSelector = `[${shadowAttribute}]`;
      collectStylesheets(stylesheets, hostSelector, shadowSelector, false, textContent => {
        insertGlobalStyle(textContent);
      });
      return null;
    } else {
      // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
      // empty shadow selector since it is not really needed.
      let buffer = '';
      collectStylesheets(stylesheets, emptyString, emptyString, true, textContent => {
        buffer += textContent;
      });
      return createStyleVNode(getCachedStyleElement(buffer));
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  var GlobalMeasurementPhase;

  (function (GlobalMeasurementPhase) {
    GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
    GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
  })(GlobalMeasurementPhase || (GlobalMeasurementPhase = {})); // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
  // JSDom (used in Jest) for example doesn't implement the UserTiming APIs.


  const isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

  function getMarkName(phase, vm) {
    // Adding the VM idx to the mark name creates a unique mark name component instance. This is necessary to produce
    // the right measures for components that are recursive.
    return `${getComponentTag(vm)} - ${phase} - ${vm.idx}`;
  }

  function getMeasureName(phase, vm) {
    return `${getComponentTag(vm)} - ${phase}`;
  }

  function start(markName) {
    performance.mark(markName);
  }

  function end(measureName, markName) {
    performance.measure(measureName, markName); // Clear the created marks and measure to avoid filling the performance entries buffer.
    // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.

    performance.clearMarks(markName);
    performance.clearMarks(measureName);
  }

  function noop$1() {
    /* do nothing */
  }

  const startMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = getMarkName(phase, vm);
    start(markName);
  };
  const endMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = getMarkName(phase, vm);
    const measureName = getMeasureName(phase, vm);
    end(measureName, markName);
  };
  const startGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = isUndefined(vm) ? phase : getMarkName(phase, vm);
    start(markName);
  };
  const endGlobalMeasure = !isUserTimingSupported ? noop$1 : function (phase, vm) {
    const markName = isUndefined(vm) ? phase : getMarkName(phase, vm);
    end(phase, markName);
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  let isUpdatingTemplate = false;
  let vmBeingRendered = null;

  function getVMBeingRendered() {
    return vmBeingRendered;
  }

  function setVMBeingRendered(vm) {
    vmBeingRendered = vm;
  }

  function isVMBeingRendered(vm) {
    return vm === vmBeingRendered;
  }

  const EmptySlots = create(null);

  function validateSlots(vm, html) {

    const {
      cmpSlots = EmptySlots
    } = vm;
    const {
      slots = EmptyArray
    } = html;

    for (const slotName in cmpSlots) {
      // eslint-disable-next-line lwc-internal/no-production-assert
      assert.isTrue(isArray$1(cmpSlots[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots[slotName])} for slot "${slotName}" in ${vm}.`);

      if (slotName !== '' && ArrayIndexOf.call(slots, slotName) === -1) {
        // TODO [#1297]: this should never really happen because the compiler should always validate
        // eslint-disable-next-line lwc-internal/no-production-assert
        logError(`Ignoring unknown provided slot name "${slotName}" in ${vm}. Check for a typo on the slot attribute.`, vm);
      }
    }
  }

  function validateFields(vm, html) {

    const {
      component
    } = vm; // validating identifiers used by template that should be provided by the component

    const {
      ids = []
    } = html;
    forEach.call(ids, propName => {
      if (!(propName in component)) {
        // eslint-disable-next-line lwc-internal/no-production-assert
        logError(`The template rendered by ${vm} references \`this.${propName}\`, which is not declared. Check for a typo in the template.`, vm);
      }
    });
  }

  function evaluateTemplate(vm, html) {
    {
      assert.isTrue(isFunction(html), `evaluateTemplate() second argument must be an imported template instead of ${toString(html)}`);
    }

    const isUpdatingTemplateInception = isUpdatingTemplate;
    const vmOfTemplateBeingUpdatedInception = vmBeingRendered;
    let vnodes = [];
    runWithBoundaryProtection(vm, vm.owner, () => {
      // pre
      vmBeingRendered = vm;

      {
        startMeasure('render', vm);
      }
    }, () => {
      // job
      const {
        component,
        context,
        cmpSlots,
        cmpTemplate,
        tro
      } = vm;
      tro.observe(() => {
        // reset the cache memoizer for template when needed
        if (html !== cmpTemplate) {
          // perf opt: do not reset the shadow root during the first rendering (there is nothing to reset)
          if (!isUndefined(cmpTemplate)) {
            // It is important to reset the content to avoid reusing similar elements generated from a different
            // template, because they could have similar IDs, and snabbdom just rely on the IDs.
            resetShadowRoot(vm);
          } // Check that the template was built by the compiler


          if (isUndefined(html) || !isTemplateRegistered(html)) {
            throw new TypeError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
          }

          vm.cmpTemplate = html; // Populate context with template information

          context.tplCache = create(null);
          resetStyleAttributes(vm);
          const {
            stylesheets,
            stylesheetTokens
          } = html;

          if (isUndefined(stylesheets) || stylesheets.length === 0) {
            context.styleVNode = null;
          } else if (!isUndefined(stylesheetTokens)) {
            const {
              hostAttribute,
              shadowAttribute
            } = stylesheetTokens;
            applyStyleAttributes(vm, hostAttribute, shadowAttribute); // Caching style vnode so it can be reused on every render

            context.styleVNode = evaluateCSS(stylesheets, hostAttribute, shadowAttribute);
          }

          if ("development" !== 'production') {
            // one time operation for any new template returned by render()
            // so we can warn if the template is attempting to use a binding
            // that is not provided by the component instance.
            validateFields(vm, html);
          }
        }

        if ("development" !== 'production') {
          assert.isTrue(isObject$1(context.tplCache), `vm.context.tplCache must be an object associated to ${cmpTemplate}.`); // validating slots in every rendering since the allocated content might change over time

          validateSlots(vm, html);
        } // right before producing the vnodes, we clear up all internal references
        // to custom elements from the template.


        vm.velements = []; // Set the global flag that template is being updated

        isUpdatingTemplate = true;
        vnodes = html.call(undefined, api, component, cmpSlots, context.tplCache);
        const {
          styleVNode
        } = context;

        if (!isNull(styleVNode)) {
          ArrayUnshift$1.call(vnodes, styleVNode);
        }
      });
    }, () => {
      // post
      isUpdatingTemplate = isUpdatingTemplateInception;
      vmBeingRendered = vmOfTemplateBeingUpdatedInception;

      {
        endMeasure('render', vm);
      }
    });

    {
      assert.invariant(isArray$1(vnodes), `Compiler should produce html functions that always return an array.`);
    }

    return vnodes;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  let isInvokingRender = false;
  let vmBeingConstructed = null;

  function isBeingConstructed(vm) {
    return vmBeingConstructed === vm;
  }

  let vmInvokingRenderedCallback = null;

  function isInvokingRenderedCallback(vm) {
    return vmInvokingRenderedCallback === vm;
  }

  const noop$2 = () => void 0;

  function invokeComponentCallback(vm, fn, args) {
    const {
      component,
      callHook,
      owner
    } = vm;
    let result;
    runWithBoundaryProtection(vm, owner, noop$2, () => {
      // job
      result = callHook(component, fn, args);
    }, noop$2);
    return result;
  }

  function invokeComponentConstructor(vm, Ctor) {
    const vmBeingConstructedInception = vmBeingConstructed;
    let error;

    {
      startMeasure('constructor', vm);
    }

    vmBeingConstructed = vm;
    /**
     * Constructors don't need to be wrapped with a boundary because for root elements
     * it should throw, while elements from template are already wrapped by a boundary
     * associated to the diffing algo.
     */

    try {
      // job
      const result = new Ctor(); // Check indirectly if the constructor result is an instance of LightningElement. Using
      // the "instanceof" operator would not work here since Locker Service provides its own
      // implementation of LightningElement, so we indirectly check if the base constructor is
      // invoked by accessing the component on the vm.

      if (vmBeingConstructed.component !== result) {
        throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
      }
    } catch (e) {
      error = Object(e);
    } finally {
      {
        endMeasure('constructor', vm);
      }

      vmBeingConstructed = vmBeingConstructedInception;

      if (!isUndefined(error)) {
        error.wcStack = getErrorComponentStack(vm); // re-throwing the original error annotated after restoring the context

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }
  }

  function invokeComponentRenderMethod(vm) {
    const {
      def: {
        render
      },
      callHook,
      component,
      owner
    } = vm;
    const isRenderBeingInvokedInception = isInvokingRender;
    const vmBeingRenderedInception = getVMBeingRendered();
    let html;
    let renderInvocationSuccessful = false;
    runWithBoundaryProtection(vm, owner, () => {
      // pre
      isInvokingRender = true;
      setVMBeingRendered(vm);
    }, () => {
      // job
      vm.tro.observe(() => {
        html = callHook(component, render);
        renderInvocationSuccessful = true;
      });
    }, () => {
      // post
      isInvokingRender = isRenderBeingInvokedInception;
      setVMBeingRendered(vmBeingRenderedInception);
    }); // If render() invocation failed, process errorCallback in boundary and return an empty template

    return renderInvocationSuccessful ? evaluateTemplate(vm, html) : [];
  }

  function invokeComponentRenderedCallback(vm) {
    const {
      def: {
        renderedCallback
      },
      component,
      callHook,
      owner
    } = vm;

    if (!isUndefined(renderedCallback)) {
      const vmInvokingRenderedCallbackInception = vmInvokingRenderedCallback;
      runWithBoundaryProtection(vm, owner, () => {
        vmInvokingRenderedCallback = vm; // pre

        {
          startMeasure('renderedCallback', vm);
        }
      }, () => {
        // job
        callHook(component, renderedCallback);
      }, () => {
        // post
        {
          endMeasure('renderedCallback', vm);
        }

        vmInvokingRenderedCallback = vmInvokingRenderedCallbackInception;
      });
    }
  }

  function invokeEventListener(vm, fn, thisValue, event) {
    const {
      callHook,
      owner
    } = vm;
    runWithBoundaryProtection(vm, owner, noop$2, () => {
      // job
      if ("development" !== 'production') {
        assert.isTrue(isFunction(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
      }

      callHook(thisValue, fn, [event]);
    }, noop$2);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const Services = create(null);
  const hooks = ['wiring', 'rendered', 'connected', 'disconnected'];
  /**
   * EXPERIMENTAL: This function allows for the registration of "services"
   * in LWC by exposing hooks into the component life-cycle. This API is
   * subject to change or being removed.
   */

  function register(service) {
    {
      assert.isTrue(isObject$1(service), `Invalid service declaration, ${service}: service must be an object`);
    }

    for (let i = 0; i < hooks.length; ++i) {
      const hookName = hooks[i];

      if (hookName in service) {
        let l = Services[hookName];

        if (isUndefined(l)) {
          Services[hookName] = l = [];
        }

        ArrayPush.call(l, service[hookName]);
      }
    }
  }

  function invokeServiceHook(vm, cbs) {
    {
      assert.isTrue(isArray$1(cbs) && cbs.length > 0, `Optimize invokeServiceHook() to be invoked only when needed`);
    }

    const {
      component,
      data,
      def,
      context
    } = vm;

    for (let i = 0, len = cbs.length; i < len; ++i) {
      cbs[i].call(undefined, component, data, def, context);
    }
  }
  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    create: create$1
  } = Object;
  const {
    splice: ArraySplice$1,
    indexOf: ArrayIndexOf$1,
    push: ArrayPush$1
  } = Array.prototype;
  const TargetToReactiveRecordMap = new WeakMap();

  function isUndefined$1(obj) {
    return obj === undefined;
  }

  function getReactiveRecord(target) {
    let reactiveRecord = TargetToReactiveRecordMap.get(target);

    if (isUndefined$1(reactiveRecord)) {
      const newRecord = create$1(null);
      reactiveRecord = newRecord;
      TargetToReactiveRecordMap.set(target, newRecord);
    }

    return reactiveRecord;
  }

  let currentReactiveObserver = null;

  function valueMutated(target, key) {
    const reactiveRecord = TargetToReactiveRecordMap.get(target);

    if (!isUndefined$1(reactiveRecord)) {
      const reactiveObservers = reactiveRecord[key];

      if (!isUndefined$1(reactiveObservers)) {
        for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
          const ro = reactiveObservers[i];
          ro.notify();
        }
      }
    }
  }

  function valueObserved(target, key) {
    // We should determine if an active Observing Record is present to track mutations.
    if (currentReactiveObserver === null) {
      return;
    }

    const ro = currentReactiveObserver;
    const reactiveRecord = getReactiveRecord(target);
    let reactiveObservers = reactiveRecord[key];

    if (isUndefined$1(reactiveObservers)) {
      reactiveObservers = [];
      reactiveRecord[key] = reactiveObservers;
    } else if (reactiveObservers[0] === ro) {
      return; // perf optimization considering that most subscriptions will come from the same record
    }

    if (ArrayIndexOf$1.call(reactiveObservers, ro) === -1) {
      ro.link(reactiveObservers);
    }
  }

  class ReactiveObserver {
    constructor(callback) {
      this.listeners = [];
      this.callback = callback;
    }

    observe(job) {
      const inceptionReactiveRecord = currentReactiveObserver;
      currentReactiveObserver = this;
      let error;

      try {
        job();
      } catch (e) {
        error = Object(e);
      } finally {
        currentReactiveObserver = inceptionReactiveRecord;

        if (error !== undefined) {
          throw error; // eslint-disable-line no-unsafe-finally
        }
      }
    }
    /**
     * This method is responsible for disconnecting the Reactive Observer
     * from any Reactive Record that has a reference to it, to prevent future
     * notifications about previously recorded access.
     */


    reset() {
      const {
        listeners
      } = this;
      const len = listeners.length;

      if (len > 0) {
        for (let i = 0; i < len; i += 1) {
          const set = listeners[i];
          const pos = ArrayIndexOf$1.call(listeners[i], this);
          ArraySplice$1.call(set, pos, 1);
        }

        listeners.length = 0;
      }
    } // friend methods


    notify() {
      this.callback.call(undefined, this);
    }

    link(reactiveObservers) {
      ArrayPush$1.call(reactiveObservers, this); // we keep track of observing records where the observing record was added to so we can do some clean up later on

      ArrayPush$1.call(this.listeners, reactiveObservers);
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedComponentToMetaMap = new Map();
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */

  function registerComponent(Ctor, {
    name,
    tmpl: template
  }) {
    signedComponentToMetaMap.set(Ctor, {
      name,
      template
    }); // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation

    return Ctor;
  }

  function getComponentRegisteredMeta(Ctor) {
    return signedComponentToMetaMap.get(Ctor);
  }

  function createComponent(uninitializedVm, Ctor) {
    // create the component instance
    invokeComponentConstructor(uninitializedVm, Ctor);
    const initializedVm = uninitializedVm;

    if (isUndefined(initializedVm.component)) {
      throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
    }
  }

  function linkComponent(vm) {
    const {
      def: {
        wire
      }
    } = vm;

    if (!isUndefined(wire)) {
      const {
        wiring
      } = Services;

      if (wiring) {
        invokeServiceHook(vm, wiring);
      }
    }
  }

  function getTemplateReactiveObserver(vm) {
    return new ReactiveObserver(() => {
      {
        assert.invariant(!isInvokingRender, `Mutating property is not allowed during the rendering life-cycle of ${getVMBeingRendered()}.`);
        assert.invariant(!isUpdatingTemplate, `Mutating property is not allowed while updating template of ${getVMBeingRendered()}.`);
      }

      const {
        isDirty
      } = vm;

      if (isFalse$1(isDirty)) {
        markComponentAsDirty(vm);
        scheduleRehydration(vm);
      }
    });
  }

  function renderComponent(vm) {
    {
      assert.invariant(vm.isDirty, `${vm} is not dirty.`);
    }

    vm.tro.reset();
    const vnodes = invokeComponentRenderMethod(vm);
    vm.isDirty = false;
    vm.isScheduled = false;

    {
      assert.invariant(isArray$1(vnodes), `${vm}.render() should always return an array of vnodes instead of ${vnodes}`);
    }

    return vnodes;
  }

  function markComponentAsDirty(vm) {
    {
      const vmBeingRendered = getVMBeingRendered();
      assert.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
      assert.isFalse(isInvokingRender, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
      assert.isFalse(isUpdatingTemplate, `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`);
    }

    vm.isDirty = true;
  }

  const cmpEventListenerMap = new WeakMap();

  function getWrappedComponentsListener(vm, listener) {
    if (!isFunction(listener)) {
      throw new TypeError(); // avoiding problems with non-valid listeners
    }

    let wrappedListener = cmpEventListenerMap.get(listener);

    if (isUndefined(wrappedListener)) {
      wrappedListener = function (event) {
        invokeEventListener(vm, listener, undefined, event);
      };

      cmpEventListenerMap.set(listener, wrappedListener);
    }

    return wrappedListener;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function createObservedFieldsDescriptorMap(fields) {
    return ArrayReduce.call(fields, (acc, field) => {
      acc[field] = createObservedFieldPropertyDescriptor(field);
      return acc;
    }, {});
  }

  function createObservedFieldPropertyDescriptor(key) {
    return {
      get() {
        const vm = getAssociatedVM(this);
        valueObserved(this, key);
        return vm.cmpTrack[key];
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        if (newValue !== vm.cmpTrack[key]) {
          vm.cmpTrack[key] = newValue;

          if (isFalse$1(vm.isDirty)) {
            valueMutated(this, key);
          }
        }
      },

      enumerable: true,
      configurable: true
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This is a descriptor map that contains
   * all standard properties that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base HTML Element and
   * Base Lightning Element should support.
   */


  const HTMLElementOriginalDescriptors = create(null);
  forEach.call(ElementPrototypeAriaPropertyNames, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
    const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

    if (!isUndefined(descriptor)) {
      HTMLElementOriginalDescriptors[propName] = descriptor;
    }
  });
  forEach.call(defaultDefHTMLPropertyNames, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
    // this category, so, better to be sure.
    const descriptor = getPropertyDescriptor(HTMLElement.prototype, propName);

    if (!isUndefined(descriptor)) {
      HTMLElementOriginalDescriptors[propName] = descriptor;
    }
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const ShadowRootInnerHTMLSetter = getOwnPropertyDescriptor(ShadowRoot.prototype, 'innerHTML').set;
  const dispatchEvent = 'EventTarget' in window ? EventTarget.prototype.dispatchEvent : Node.prototype.dispatchEvent; // IE11

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This operation is called with a descriptor of an standard html property
   * that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
   * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
   */

  function createBridgeToElementDescriptor(propName, descriptor) {
    const {
      get,
      set,
      enumerable,
      configurable
    } = descriptor;

    if (!isFunction(get)) {
      {
        assert.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
      }

      throw new TypeError();
    }

    if (!isFunction(set)) {
      {
        assert.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
      }

      throw new TypeError();
    }

    return {
      enumerable,
      configurable,

      get() {
        const vm = getAssociatedVM(this);

        if (isBeingConstructed(vm)) {
          {
            const name = vm.elm.constructor.name;
            logError(`\`${name}\` constructor can't read the value of property \`${propName}\` because the owner component hasn't set the value yet. Instead, use the \`${name}\` constructor to set a default value for the property.`, vm);
          }

          return;
        }

        valueObserved(this, propName);
        return get.call(vm.elm);
      },

      set(newValue) {
        const vm = getAssociatedVM(this);

        {
          const vmBeingRendered = getVMBeingRendered();
          assert.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
          assert.invariant(!isUpdatingTemplate, `When updating the template of ${vmBeingRendered}, one of the accessors used by the template has side effects on the state of ${vm}.${propName}`);
          assert.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
          assert.invariant(!isObject$1(newValue) || isNull(newValue), `Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
        }

        if (newValue !== vm.cmpProps[propName]) {
          vm.cmpProps[propName] = newValue;

          if (isFalse$1(vm.isDirty)) {
            // perf optimization to skip this step if not in the DOM
            valueMutated(this, propName);
          }
        }

        return set.call(vm.elm, newValue);
      }

    };
  }

  function getLinkedElement(cmp) {
    return getAssociatedVM(cmp).elm;
  }
  /**
   * This class is the base class for any LWC element.
   * Some elements directly extends this class, others implement it via inheritance.
   **/


  function BaseLightningElementConstructor() {
    // This should be as performant as possible, while any initialization should be done lazily
    if (isNull(vmBeingConstructed)) {
      throw new ReferenceError('Illegal constructor');
    }

    {
      assert.invariant(vmBeingConstructed.elm instanceof HTMLElement, `Component creation requires a DOM element to be associated to ${vmBeingConstructed}.`);
    }

    const vm = vmBeingConstructed;
    const {
      elm,
      mode,
      def: {
        ctor
      }
    } = vm;
    const component = this;
    vm.component = component;
    vm.tro = getTemplateReactiveObserver(vm);
    vm.oar = create(null); // interaction hooks
    // We are intentionally hiding this argument from the formal API of LWCElement because
    // we don't want folks to know about it just yet.

    if (arguments.length === 1) {
      const {
        callHook,
        setHook,
        getHook
      } = arguments[0];
      vm.callHook = callHook;
      vm.setHook = setHook;
      vm.getHook = getHook;
    } // attaching the shadowRoot


    const shadowRootOptions = {
      mode,
      delegatesFocus: !!ctor.delegatesFocus,
      '$$lwc-synthetic-mode$$': true
    };
    const cmpRoot = elm.attachShadow(shadowRootOptions); // linking elm, shadow root and component with the VM

    associateVM(component, vm);
    associateVM(cmpRoot, vm);
    associateVM(elm, vm); // VM is now initialized

    vm.cmpRoot = cmpRoot;

    {
      patchCustomElementWithRestrictions(elm);
      patchComponentWithRestrictions(component);
      patchShadowRootWithRestrictions(cmpRoot);
    }

    return this;
  } // HTML Element - The Good Parts


  BaseLightningElementConstructor.prototype = {
    constructor: BaseLightningElementConstructor,

    dispatchEvent(_event) {
      const elm = getLinkedElement(this); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch;

      return dispatchEvent.apply(elm, arguments);
    },

    addEventListener(type, listener, options) {
      const vm = getAssociatedVM(this);

      {
        const vmBeingRendered = getVMBeingRendered();
        assert.invariant(!isInvokingRender, `${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
        assert.invariant(!isUpdatingTemplate, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm} by adding an event listener for "${type}".`);
        assert.invariant(isFunction(listener), `Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
      }

      const wrappedListener = getWrappedComponentsListener(vm, listener);
      vm.elm.addEventListener(type, wrappedListener, options);
    },

    removeEventListener(type, listener, options) {
      const vm = getAssociatedVM(this);
      const wrappedListener = getWrappedComponentsListener(vm, listener);
      vm.elm.removeEventListener(type, wrappedListener, options);
    },

    setAttributeNS(ns, attrName, _value) {
      const elm = getLinkedElement(this);

      {
        const vm = getAssociatedVM(this);
        assert.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
      }

      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      elm.setAttributeNS.apply(elm, arguments);
      lockAttribute();
    },

    removeAttributeNS(ns, attrName) {
      const elm = getLinkedElement(this);
      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      elm.removeAttributeNS.apply(elm, arguments);
      lockAttribute();
    },

    removeAttribute(attrName) {
      const elm = getLinkedElement(this);
      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      elm.removeAttribute.apply(elm, arguments);
      lockAttribute();
    },

    setAttribute(attrName, _value) {
      const elm = getLinkedElement(this);

      {
        const vm = getAssociatedVM(this);
        assert.isFalse(isBeingConstructed(vm), `Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
      }

      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      elm.setAttribute.apply(elm, arguments);
      lockAttribute();
    },

    getAttribute(attrName) {
      const elm = getLinkedElement(this);
      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      const value = elm.getAttribute.apply(elm, arguments);
      lockAttribute();
      return value;
    },

    getAttributeNS(ns, attrName) {
      const elm = getLinkedElement(this);
      unlockAttribute(elm, attrName); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch

      const value = elm.getAttributeNS.apply(elm, arguments);
      lockAttribute();
      return value;
    },

    getBoundingClientRect() {
      const elm = getLinkedElement(this);

      {
        const vm = getAssociatedVM(this);
        assert.isFalse(isBeingConstructed(vm), `this.getBoundingClientRect() should not be called during the construction of the custom element for ${getComponentTag(vm)} because the element is not yet in the DOM, instead, you can use it in one of the available life-cycle hooks.`);
      }

      return elm.getBoundingClientRect();
    },

    /**
     * Returns the first element that is a descendant of node that
     * matches selectors.
     */
    // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector(selectors) {
      const vm = getAssociatedVM(this);

      {
        assert.isFalse(isBeingConstructed(vm), `this.querySelector() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.querySelector(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match selectors.
     */
    // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
    // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
    querySelectorAll(selectors) {
      const vm = getAssociatedVM(this);

      {
        assert.isFalse(isBeingConstructed(vm), `this.querySelectorAll() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.querySelectorAll(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match the provided tagName.
     */
    getElementsByTagName(tagNameOrWildCard) {
      const vm = getAssociatedVM(this);

      {
        assert.isFalse(isBeingConstructed(vm), `this.getElementsByTagName() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.getElementsByTagName(tagNameOrWildCard);
    },

    /**
     * Returns all element descendants of node that
     * match the provide classnames.
     */
    getElementsByClassName(names) {
      const vm = getAssociatedVM(this);

      {
        assert.isFalse(isBeingConstructed(vm), `this.getElementsByClassName() cannot be called during the construction of the custom element for ${getComponentTag(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.getElementsByClassName(names);
    },

    get isConnected() {
      const vm = getAssociatedVM(this);
      const {
        elm
      } = vm;
      return elm.isConnected;
    },

    get classList() {
      {
        const vm = getAssociatedVM(this); // TODO [#1290]: this still fails in dev but works in production, eventually, we should just throw in all modes

        assert.isFalse(isBeingConstructed(vm), `Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
      }

      return getLinkedElement(this).classList;
    },

    get template() {
      const vm = getAssociatedVM(this);
      return vm.cmpRoot;
    },

    get shadowRoot() {
      // From within the component instance, the shadowRoot is always
      // reported as "closed". Authors should rely on this.template instead.
      return null;
    },

    render() {
      const vm = getAssociatedVM(this);
      return vm.def.template;
    },

    toString() {
      const vm = getAssociatedVM(this);
      return `[object ${vm.def.name}]`;
    }

  };
  const baseDescriptors = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (descriptors, propName) => {
    descriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
    return descriptors;
  }, create(null));
  defineProperties(BaseLightningElementConstructor.prototype, baseDescriptors);

  {
    patchLightningElementPrototypeWithRestrictions(BaseLightningElementConstructor.prototype);
  }

  freeze(BaseLightningElementConstructor);
  seal(BaseLightningElementConstructor.prototype); // @ts-ignore

  const BaseLightningElement = BaseLightningElementConstructor;
  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */

  const {
    isArray: isArray$2
  } = Array;
  const {
    getPrototypeOf: getPrototypeOf$1,
    create: ObjectCreate,
    defineProperty: ObjectDefineProperty,
    defineProperties: ObjectDefineProperties,
    isExtensible,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$1,
    getOwnPropertyNames: getOwnPropertyNames$1,
    getOwnPropertySymbols,
    preventExtensions,
    hasOwnProperty: hasOwnProperty$2
  } = Object;
  const {
    push: ArrayPush$2,
    concat: ArrayConcat,
    map: ArrayMap$1
  } = Array.prototype;
  const OtS$1 = {}.toString;

  function toString$1(obj) {
    if (obj && obj.toString) {
      return obj.toString();
    } else if (typeof obj === 'object') {
      return OtS$1.call(obj);
    } else {
      return obj + '';
    }
  }

  function isUndefined$2(obj) {
    return obj === undefined;
  }

  function isFunction$1(obj) {
    return typeof obj === 'function';
  }

  function isObject$2(obj) {
    return typeof obj === 'object';
  }

  const proxyToValueMap = new WeakMap();

  function registerProxy(proxy, value) {
    proxyToValueMap.set(proxy, value);
  }

  const unwrap = replicaOrAny => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */


  function unwrapDescriptor(descriptor) {
    if (hasOwnProperty$2.call(descriptor, 'value')) {
      descriptor.value = unwrap(descriptor.value);
    }

    return descriptor;
  }

  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
    const targetKeys = ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    targetKeys.forEach(key => {
      let descriptor = getOwnPropertyDescriptor$1(originalTarget, key); // We do not need to wrap the descriptor if configurable
      // Because we can deal with wrapping it when user goes through
      // Get own property descriptor. There is also a chance that this descriptor
      // could change sometime in the future, so we can defer wrapping
      // until we need to

      if (!descriptor.configurable) {
        descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
      }

      ObjectDefineProperty(shadowTarget, key, descriptor);
    });
    preventExtensions(shadowTarget);
  }

  class ReactiveProxyHandler {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getProxy(value);
    }

    set(shadowTarget, key, value) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      const oldValue = originalTarget[key];

      if (oldValue !== value) {
        originalTarget[key] = value;
        valueMutated(originalTarget, key);
      } else if (key === 'length' && isArray$2(originalTarget)) {
        // fix for issue #236: push will add the new index, and by the time length
        // is updated, the internal length is already equal to the new length value
        // therefore, the oldValue is equal to the value. This is the forking logic
        // to support this use case.
        valueMutated(originalTarget, key);
      }

      return true;
    }

    deleteProperty(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      delete originalTarget[key];
      valueMutated(originalTarget, key);
      return true;
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    }

    isExtensible(shadowTarget) {
      const shadowIsExtensible = isExtensible(shadowTarget);

      if (!shadowIsExtensible) {
        return shadowIsExtensible;
      }

      const {
        originalTarget,
        membrane
      } = this;
      const targetIsExtensible = isExtensible(originalTarget);

      if (!targetIsExtensible) {
        lockShadowTarget(membrane, shadowTarget, originalTarget);
      }

      return targetIsExtensible;
    }

    setPrototypeOf(shadowTarget, prototype) {
      {
        throw new Error(`Invalid setPrototypeOf invocation for reactive proxy ${toString$1(this.originalTarget)}. Prototype of reactive objects cannot be changed.`);
      }
    }

    getPrototypeOf(shadowTarget) {
      const {
        originalTarget
      } = this;
      return getPrototypeOf$1(originalTarget);
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = this.membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1(originalTarget, key);

      if (isUndefined$2(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

      if (!isUndefined$2(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value, setter or getter (if available) cannot observe
      // mutations, just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor(membrane, desc, wrapValue);

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {
      const {
        originalTarget,
        membrane
      } = this;
      lockShadowTarget(membrane, shadowTarget, originalTarget);
      preventExtensions(originalTarget);
      return true;
    }

    defineProperty(shadowTarget, key, descriptor) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueMutated
      } = membrane;
      const {
        configurable
      } = descriptor; // We have to check for value in descriptor
      // because Object.freeze(proxy) calls this method
      // with only { configurable: false, writeable: false }
      // Additionally, method will only be called with writeable:false
      // if the descriptor has a value, as opposed to getter/setter
      // So we can just check if writable is present and then see if
      // value is present. This eliminates getter and setter descriptors

      if (hasOwnProperty$2.call(descriptor, 'writable') && !hasOwnProperty$2.call(descriptor, 'value')) {
        const originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
        descriptor.value = originalDescriptor.value;
      }

      ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));

      if (configurable === false) {
        ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
      }

      valueMutated(originalTarget, key);
      return true;
    }

  }

  function wrapReadOnlyValue(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }

  class ReadOnlyHandler {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        membrane,
        originalTarget
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getReadOnlyProxy(value);
    }

    set(shadowTarget, key, value) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot set "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

    deleteProperty(shadowTarget, key) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot delete "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols(originalTarget));
    }

    setPrototypeOf(shadowTarget, prototype) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid prototype mutation: Cannot set prototype on "${originalTarget}". "${originalTarget}" prototype is read-only.`);
      }
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1(originalTarget, key);

      if (isUndefined$2(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);

      if (!isUndefined$2(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value or getter (if available) cannot be observed,
      // just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);

      if (hasOwnProperty$2.call(desc, 'set')) {
        desc.set = undefined; // readOnly membrane does not allow setters
      }

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot preventExtensions on ${originalTarget}". "${originalTarget} is read-only.`);
      }
    }

    defineProperty(shadowTarget, key, descriptor) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot defineProperty "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

  }

  function extract(objectOrArray) {
    if (isArray$2(objectOrArray)) {
      return objectOrArray.map(item => {
        const original = unwrap(item);

        if (original !== item) {
          return extract(original);
        }

        return item;
      });
    }

    const obj = ObjectCreate(getPrototypeOf$1(objectOrArray));
    const names = getOwnPropertyNames$1(objectOrArray);
    return ArrayConcat.call(names, getOwnPropertySymbols(objectOrArray)).reduce((seed, key) => {
      const item = objectOrArray[key];
      const original = unwrap(item);

      if (original !== item) {
        seed[key] = extract(original);
      } else {
        seed[key] = item;
      }

      return seed;
    }, obj);
  }

  const formatter = {
    header: plainOrProxy => {
      const originalTarget = unwrap(plainOrProxy); // if originalTarget is falsy or not unwrappable, exit

      if (!originalTarget || originalTarget === plainOrProxy) {
        return null;
      }

      const obj = extract(plainOrProxy);
      return ['object', {
        object: obj
      }];
    },
    hasBody: () => {
      return false;
    },
    body: () => {
      return null;
    }
  }; // Inspired from paulmillr/es6-shim
  // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L176-L185

  function getGlobal() {
    // the only reliable means to get the global object is `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof globalThis !== 'undefined') {
      return globalThis;
    }

    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    } // Gracefully degrade if not able to locate the global object


    return {};
  }

  function init() {

    const global = getGlobal(); // Custom Formatter for Dev Tools. To enable this, open Chrome Dev Tools
    //  - Go to Settings,
    //  - Under console, select "Enable custom formatters"
    // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview

    const devtoolsFormatters = global.devtoolsFormatters || [];
    ArrayPush$2.call(devtoolsFormatters, formatter);
    global.devtoolsFormatters = devtoolsFormatters;
  }

  {
    init();
  }

  function createShadowTarget(value) {
    let shadowTarget = undefined;

    if (isArray$2(value)) {
      shadowTarget = [];
    } else if (isObject$2(value)) {
      shadowTarget = {};
    }

    return shadowTarget;
  }

  const ObjectDotPrototype = Object.prototype;

  function defaultValueIsObservable(value) {
    // intentionally checking for null
    if (value === null) {
      return false;
    } // treat all non-object types, including undefined, as non-observable values


    if (typeof value !== 'object') {
      return false;
    }

    if (isArray$2(value)) {
      return true;
    }

    const proto = getPrototypeOf$1(value);
    return proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null;
  }

  const defaultValueObserved = (obj, key) => {
    /* do nothing */
  };

  const defaultValueMutated = (obj, key) => {
    /* do nothing */
  };

  const defaultValueDistortion = value => value;

  function wrapDescriptor(membrane, descriptor, getValue) {
    const {
      set,
      get
    } = descriptor;

    if (hasOwnProperty$2.call(descriptor, 'value')) {
      descriptor.value = getValue(membrane, descriptor.value);
    } else {
      if (!isUndefined$2(get)) {
        descriptor.get = function () {
          // invoking the original getter with the original target
          return getValue(membrane, get.call(unwrap(this)));
        };
      }

      if (!isUndefined$2(set)) {
        descriptor.set = function (value) {
          // At this point we don't have a clear indication of whether
          // or not a valid mutation will occur, we don't have the key,
          // and we are not sure why and how they are invoking this setter.
          // Nevertheless we preserve the original semantics by invoking the
          // original setter with the original target and the unwrapped value
          set.call(unwrap(this), membrane.unwrapProxy(value));
        };
      }
    }

    return descriptor;
  }

  class ReactiveMembrane {
    constructor(options) {
      this.valueDistortion = defaultValueDistortion;
      this.valueMutated = defaultValueMutated;
      this.valueObserved = defaultValueObserved;
      this.valueIsObservable = defaultValueIsObservable;
      this.objectGraph = new WeakMap();

      if (!isUndefined$2(options)) {
        const {
          valueDistortion,
          valueMutated,
          valueObserved,
          valueIsObservable
        } = options;
        this.valueDistortion = isFunction$1(valueDistortion) ? valueDistortion : defaultValueDistortion;
        this.valueMutated = isFunction$1(valueMutated) ? valueMutated : defaultValueMutated;
        this.valueObserved = isFunction$1(valueObserved) ? valueObserved : defaultValueObserved;
        this.valueIsObservable = isFunction$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
      }
    }

    getProxy(value) {
      const unwrappedValue = unwrap(value);
      const distorted = this.valueDistortion(unwrappedValue);

      if (this.valueIsObservable(distorted)) {
        const o = this.getReactiveState(unwrappedValue, distorted); // when trying to extract the writable version of a readonly
        // we return the readonly.

        return o.readOnly === value ? value : o.reactive;
      }

      return distorted;
    }

    getReadOnlyProxy(value) {
      value = unwrap(value);
      const distorted = this.valueDistortion(value);

      if (this.valueIsObservable(distorted)) {
        return this.getReactiveState(value, distorted).readOnly;
      }

      return distorted;
    }

    unwrapProxy(p) {
      return unwrap(p);
    }

    getReactiveState(value, distortedValue) {
      const {
        objectGraph
      } = this;
      let reactiveState = objectGraph.get(distortedValue);

      if (reactiveState) {
        return reactiveState;
      }

      const membrane = this;
      reactiveState = {
        get reactive() {
          const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue); // caching the reactive proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
          registerProxy(proxy, value);
          ObjectDefineProperty(this, 'reactive', {
            value: proxy
          });
          return proxy;
        },

        get readOnly() {
          const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue); // caching the readOnly proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
          registerProxy(proxy, value);
          ObjectDefineProperty(this, 'readOnly', {
            value: proxy
          });
          return proxy;
        }

      };
      objectGraph.set(distortedValue, reactiveState);
      return reactiveState;
    }

  }
  /** version: 0.26.0 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function valueDistortion(value) {
    return value;
  }

  const reactiveMembrane = new ReactiveMembrane({
    valueObserved,
    valueMutated,
    valueDistortion
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // from the element instance, and get the value or set a new value on the component.
  // This means that across different elements, similar names can get the exact same
  // descriptor, so we can cache them:


  const cachedGetterByKey = create(null);
  const cachedSetterByKey = create(null);

  function createGetter(key) {
    let fn = cachedGetterByKey[key];

    if (isUndefined(fn)) {
      fn = cachedGetterByKey[key] = function () {
        const vm = getAssociatedVM(this);
        const {
          getHook
        } = vm;
        return getHook(vm.component, key);
      };
    }

    return fn;
  }

  function createSetter(key) {
    let fn = cachedSetterByKey[key];

    if (isUndefined(fn)) {
      fn = cachedSetterByKey[key] = function (newValue) {
        const vm = getAssociatedVM(this);
        const {
          setHook
        } = vm;
        newValue = reactiveMembrane.getReadOnlyProxy(newValue);
        setHook(vm.component, key, newValue);
      };
    }

    return fn;
  }

  function createMethodCaller(methodName) {
    return function () {
      const vm = getAssociatedVM(this);
      const {
        callHook,
        component
      } = vm;
      const fn = component[methodName];
      return callHook(vm.component, fn, ArraySlice$1.call(arguments));
    };
  }

  function HTMLBridgeElementFactory(SuperClass, props, methods) {
    let HTMLBridgeElement;
    /**
     * Modern browsers will have all Native Constructors as regular Classes
     * and must be instantiated with the new keyword. In older browsers,
     * specifically IE11, those are objects with a prototype property defined,
     * since they are not supposed to be extended or instantiated with the
     * new keyword. This forking logic supports both cases, specifically because
     * wc.ts relies on the construction path of the bridges to create new
     * fully qualifying web components.
     */

    if (isFunction(SuperClass)) {
      HTMLBridgeElement = class extends SuperClass {};
    } else {
      HTMLBridgeElement = function () {
        // Bridge classes are not supposed to be instantiated directly in
        // browsers that do not support web components.
        throw new TypeError('Illegal constructor');
      }; // prototype inheritance dance


      setPrototypeOf(HTMLBridgeElement, SuperClass);
      setPrototypeOf(HTMLBridgeElement.prototype, SuperClass.prototype);
      defineProperty(HTMLBridgeElement.prototype, 'constructor', {
        writable: true,
        configurable: true,
        value: HTMLBridgeElement
      });
    }

    const descriptors = create(null); // expose getters and setters for each public props on the new Element Bridge

    for (let i = 0, len = props.length; i < len; i += 1) {
      const propName = props[i];
      descriptors[propName] = {
        get: createGetter(propName),
        set: createSetter(propName),
        enumerable: true,
        configurable: true
      };
    } // expose public methods as props on the new Element Bridge


    for (let i = 0, len = methods.length; i < len; i += 1) {
      const methodName = methods[i];
      descriptors[methodName] = {
        value: createMethodCaller(methodName),
        writable: true,
        configurable: true
      };
    }

    defineProperties(HTMLBridgeElement.prototype, descriptors);
    return HTMLBridgeElement;
  }

  const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElement, getOwnPropertyNames(HTMLElementOriginalDescriptors), []);
  freeze(BaseBridgeElement);
  seal(BaseBridgeElement.prototype);
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    assign: assign$1,
    create: create$2,
    defineProperties: defineProperties$1,
    defineProperty: defineProperty$1,
    freeze: freeze$1,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$2,
    getOwnPropertyNames: getOwnPropertyNames$2,
    getPrototypeOf: getPrototypeOf$2,
    hasOwnProperty: hasOwnProperty$3,
    keys: keys$1,
    seal: seal$1,
    setPrototypeOf: setPrototypeOf$1
  } = Object;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */


  const hasNativeSymbolsSupport$1 = Symbol('x').toString() === 'Symbol(x)';
  /** version: 1.4.0-alpha3 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // Cached reference to globalThis

  let _globalThis;

  if (typeof globalThis === 'object') {
    _globalThis = globalThis;
  }

  function getGlobalThis() {
    if (typeof _globalThis === 'object') {
      return _globalThis;
    }

    try {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Object.prototype, '__magic__', {
        get: function () {
          return this;
        },
        configurable: true
      }); // @ts-ignore
      // __magic__ is undefined in Safari 10 and IE10 and older.
      // eslint-disable-next-line no-undef

      _globalThis = __magic__; // @ts-ignore

      delete Object.prototype.__magic__;
    } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
    } finally {
      // If the magic above fails for some reason we assume that we are in a
      // legacy browser. Assume `window` exists in this case.
      if (typeof _globalThis === 'undefined') {
        _globalThis = window;
      }
    }

    return _globalThis;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const _globalThis$1 = getGlobalThis();

  if (!_globalThis$1.lwcRuntimeFlags) {
    Object.defineProperty(_globalThis$1, 'lwcRuntimeFlags', {
      value: create$2(null)
    });
  }

  const runtimeFlags = _globalThis$1.lwcRuntimeFlags; // This function is not supported for use within components and is meant for
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedDecoratorToMetaMap = new Map();

  function getDecoratorsRegisteredMeta(Ctor) {
    return signedDecoratorToMetaMap.get(Ctor);
  }
  /*
   * Copyright (c) 2020, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function resolveCircularModuleDependency(fn) {
    return fn();
  }

  function isCircularModuleDependency(obj) {
    return isFunction(obj) && hasOwnProperty$1.call(obj, '__circular__');
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CtorToDefMap = new WeakMap();

  function getCtorProto(Ctor, subclassComponentName) {
    let proto = getPrototypeOf(Ctor);

    if (isNull(proto)) {
      throw new ReferenceError(`Invalid prototype chain for ${subclassComponentName}, you must extend LightningElement.`);
    } // covering the cases where the ref is circular in AMD


    if (isCircularModuleDependency(proto)) {
      const p = resolveCircularModuleDependency(proto);

      {
        if (isNull(p)) {
          throw new ReferenceError(`Circular module dependency for ${subclassComponentName}, must resolve to a constructor that extends LightningElement.`);
        }
      } // escape hatch for Locker and other abstractions to provide their own base class instead
      // of our Base class without having to leak it to user-land. If the circular function returns
      // itself, that's the signal that we have hit the end of the proto chain, which must always
      // be base.


      proto = p === proto ? BaseLightningElement : p;
    }

    return proto;
  }

  function createComponentDef(Ctor, meta, subclassComponentName) {
    {
      // local to dev block
      const ctorName = Ctor.name; // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
      // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);

      assert.isTrue(Ctor.constructor, `Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
    }

    const {
      name
    } = meta;
    let {
      template
    } = meta;
    const decoratorsMeta = getDecoratorsRegisteredMeta(Ctor);
    let props = {};
    let methods = {};
    let wire;
    let track = {};
    let fields;

    if (!isUndefined(decoratorsMeta)) {
      props = decoratorsMeta.props;
      methods = decoratorsMeta.methods;
      wire = decoratorsMeta.wire;
      track = decoratorsMeta.track;
      fields = decoratorsMeta.fields;
    }

    const proto = Ctor.prototype;
    let {
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    } = proto;
    const superProto = getCtorProto(Ctor, subclassComponentName);
    const superDef = superProto !== BaseLightningElement ? getComponentDef(superProto, subclassComponentName) : null;
    const SuperBridge = isNull(superDef) ? BaseBridgeElement : superDef.bridge;
    const bridge = HTMLBridgeElementFactory(SuperBridge, getOwnPropertyNames(props), getOwnPropertyNames(methods));

    if (!isNull(superDef)) {
      props = assign(create(null), superDef.props, props);
      methods = assign(create(null), superDef.methods, methods);
      wire = superDef.wire || wire ? assign(create(null), superDef.wire, wire) : undefined;
      track = assign(create(null), superDef.track, track);
      connectedCallback = connectedCallback || superDef.connectedCallback;
      disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
      renderedCallback = renderedCallback || superDef.renderedCallback;
      errorCallback = errorCallback || superDef.errorCallback;
      render = render || superDef.render;
      template = template || superDef.template;
    }

    props = assign(create(null), HTML_PROPS, props);

    if (!isUndefined(fields)) {
      defineProperties(proto, createObservedFieldsDescriptorMap(fields));
    }

    if (isUndefined(template)) {
      // default template
      template = defaultEmptyTemplate;
    }

    const def = {
      ctor: Ctor,
      name,
      wire,
      track,
      props,
      methods,
      bridge,
      template,
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    };

    {
      freeze(Ctor.prototype);
    }

    return def;
  }
  /**
   * EXPERIMENTAL: This function allows for the identification of LWC constructors. This API is
   * subject to change or being removed.
   */


  function isComponentConstructor(ctor) {
    if (!isFunction(ctor)) {
      return false;
    } // Fast path: LightningElement is part of the prototype chain of the constructor.


    if (ctor.prototype instanceof BaseLightningElement) {
      return true;
    } // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
    // climb up the constructor prototype chain to check in case there are circular dependencies
    // to resolve.


    let current = ctor;

    do {
      if (isCircularModuleDependency(current)) {
        const circularResolved = resolveCircularModuleDependency(current); // If the circular function returns itself, that's the signal that we have hit the end
        // of the proto chain, which must always be a valid base constructor.

        if (circularResolved === current) {
          return true;
        }

        current = circularResolved;
      }

      if (current === BaseLightningElement) {
        return true;
      }
    } while (!isNull(current) && (current = getPrototypeOf(current))); // Finally return false if the LightningElement is not part of the prototype chain.


    return false;
  }
  /**
   * EXPERIMENTAL: This function allows for the collection of internal component metadata. This API is
   * subject to change or being removed.
   */


  function getComponentDef(Ctor, name) {
    let def = CtorToDefMap.get(Ctor);

    if (isUndefined(def)) {
      if (isCircularModuleDependency(Ctor)) {
        Ctor = resolveCircularModuleDependency(Ctor);
      }

      if (!isComponentConstructor(Ctor)) {
        throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
      }

      let meta = getComponentRegisteredMeta(Ctor);

      if (isUndefined(meta)) {
        // TODO [#1295]: remove this workaround after refactoring tests
        meta = {
          template: undefined,
          name: Ctor.name
        };
      }

      def = createComponentDef(Ctor, meta, name || Ctor.name);
      CtorToDefMap.set(Ctor, def);
    }

    return def;
  }
  // No DOM Patching occurs here


  function setElementProto(elm, def) {
    setPrototypeOf(elm, def.bridge.prototype);
  }

  const HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(HTMLElementOriginalDescriptors), (props, propName) => {
    const attrName = getAttrNameFromPropName(propName);
    props[propName] = {
      config: 3,
      type: 'any',
      attr: attrName
    };
    return props;
  }, create(null));
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  var VMState;

  (function (VMState) {
    VMState[VMState["created"] = 0] = "created";
    VMState[VMState["connected"] = 1] = "connected";
    VMState[VMState["disconnected"] = 2] = "disconnected";
  })(VMState || (VMState = {}));

  let idx = 0;
  /** The internal slot used to associate different objects the engine manipulates with the VM */

  const ViewModelReflection = createHiddenField('ViewModel', 'engine');

  function callHook(cmp, fn, args = []) {
    return fn.apply(cmp, args);
  }

  function setHook(cmp, prop, newValue) {
    cmp[prop] = newValue;
  }

  function getHook(cmp, prop) {
    return cmp[prop];
  }

  function rerenderVM(vm) {
    rehydrate(vm);
  }

  function connectRootElement(elm) {
    const vm = getAssociatedVM(elm);
    startGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm); // Usually means moving the element from one place to another, which is observable via
    // life-cycle hooks.

    if (vm.state === VMState.connected) {
      disconnectedRootElement(elm);
    }

    runConnectedCallback(vm);
    rehydrate(vm);
    endGlobalMeasure(GlobalMeasurementPhase.HYDRATE, vm);
  }

  function disconnectedRootElement(elm) {
    const vm = getAssociatedVM(elm);
    resetComponentStateWhenRemoved(vm);
  }

  function appendVM(vm) {
    rehydrate(vm);
  } // just in case the component comes back, with this we guarantee re-rendering it
  // while preventing any attempt to rehydration until after reinsertion.


  function resetComponentStateWhenRemoved(vm) {
    const {
      state
    } = vm;

    if (state !== VMState.disconnected) {
      const {
        oar,
        tro
      } = vm; // Making sure that any observing record will not trigger the rehydrated on this vm

      tro.reset(); // Making sure that any observing accessor record will not trigger the setter to be reinvoked

      for (const key in oar) {
        oar[key].reset();
      }

      runDisconnectedCallback(vm); // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)

      runShadowChildNodesDisconnectedCallback(vm);
      runLightChildNodesDisconnectedCallback(vm);
    }
  } // this method is triggered by the diffing algo only when a vnode from the
  // old vnode.children is removed from the DOM.


  function removeVM(vm) {
    {
      assert.isTrue(vm.state === VMState.connected || vm.state === VMState.disconnected, `${vm} must have been connected.`);
    }

    resetComponentStateWhenRemoved(vm);
  }

  function createVM(elm, Ctor, options) {
    {
      assert.invariant(elm instanceof HTMLElement, `VM creation requires a DOM element instead of ${elm}.`);
    }

    const def = getComponentDef(Ctor);
    const {
      isRoot,
      mode,
      owner
    } = options;
    idx += 1;
    const uninitializedVm = {
      // component creation index is defined once, and never reset, it can
      // be preserved from one insertion to another without any issue
      idx,
      state: VMState.created,
      isScheduled: false,
      isDirty: true,
      isRoot: isTrue$1(isRoot),
      mode,
      def,
      owner,
      elm,
      data: EmptyObject,
      context: create(null),
      cmpProps: create(null),
      cmpTrack: create(null),
      cmpSlots: useSyntheticShadow ? create(null) : undefined,
      callHook,
      setHook,
      getHook,
      children: EmptyArray,
      aChildren: EmptyArray,
      velements: EmptyArray,
      // Perf optimization to preserve the shape of this obj
      cmpTemplate: undefined,
      component: undefined,
      cmpRoot: undefined,
      tro: undefined,
      oar: undefined
    };

    {
      uninitializedVm.toString = () => {
        return `[object:vm ${def.name} (${uninitializedVm.idx})]`;
      };
    } // create component instance associated to the vm and the element


    createComponent(uninitializedVm, Ctor); // link component to the wire service

    const initializedVm = uninitializedVm;
    linkComponent(initializedVm);
    return initializedVm;
  }

  function assertIsVM(obj) {
    if (isNull(obj) || !isObject$1(obj) || !('cmpRoot' in obj)) {
      throw new TypeError(`${obj} is not a VM.`);
    }
  }

  function associateVM(obj, vm) {
    setHiddenField(obj, ViewModelReflection, vm);
  }

  function getAssociatedVM(obj) {
    const vm = getHiddenField(obj, ViewModelReflection);

    {
      assertIsVM(vm);
    }

    return vm;
  }

  function getAssociatedVMIfPresent(obj) {
    const maybeVm = getHiddenField(obj, ViewModelReflection);

    {
      if (!isUndefined(maybeVm)) {
        assertIsVM(maybeVm);
      }
    }

    return maybeVm;
  }

  function rehydrate(vm) {
    {
      assert.isTrue(vm.elm instanceof HTMLElement, `rehydration can only happen after ${vm} was patched the first time.`);
    }

    if (isTrue$1(vm.isDirty)) {
      const children = renderComponent(vm);
      patchShadowRoot(vm, children);
    }
  }

  function patchShadowRoot(vm, newCh) {
    const {
      cmpRoot,
      children: oldCh
    } = vm;
    vm.children = newCh; // caching the new children collection

    if (newCh.length > 0 || oldCh.length > 0) {
      // patch function mutates vnodes by adding the element reference,
      // however, if patching fails it contains partial changes.
      if (oldCh !== newCh) {
        const fn = hasDynamicChildren(newCh) ? updateDynamicChildren : updateStaticChildren;
        runWithBoundaryProtection(vm, vm, () => {
          // pre
          {
            startMeasure('patch', vm);
          }
        }, () => {
          // job
          fn(cmpRoot, oldCh, newCh);
        }, () => {
          // post
          {
            endMeasure('patch', vm);
          }
        });
      }
    }

    if (vm.state === VMState.connected) {
      // If the element is connected, that means connectedCallback was already issued, and
      // any successive rendering should finish with the call to renderedCallback, otherwise
      // the connectedCallback will take care of calling it in the right order at the end of
      // the current rehydration process.
      runRenderedCallback(vm);
    }
  }

  function runRenderedCallback(vm) {
    const {
      rendered
    } = Services;

    if (rendered) {
      invokeServiceHook(vm, rendered);
    }

    invokeComponentRenderedCallback(vm);
  }

  let rehydrateQueue = [];

  function flushRehydrationQueue() {
    startGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);

    {
      assert.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
    }

    const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
    rehydrateQueue = []; // reset to a new queue

    for (let i = 0, len = vms.length; i < len; i += 1) {
      const vm = vms[i];

      try {
        rehydrate(vm);
      } catch (error) {
        if (i + 1 < len) {
          // pieces of the queue are still pending to be rehydrated, those should have priority
          if (rehydrateQueue.length === 0) {
            addCallbackToNextTick(flushRehydrationQueue);
          }

          ArrayUnshift$1.apply(rehydrateQueue, ArraySlice$1.call(vms, i + 1));
        } // we need to end the measure before throwing.


        endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE); // re-throwing the original error will break the current tick, but since the next tick is
        // already scheduled, it should continue patching the rest.

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }

    endGlobalMeasure(GlobalMeasurementPhase.REHYDRATE);
  }

  function runConnectedCallback(vm) {
    const {
      state
    } = vm;

    if (state === VMState.connected) {
      return; // nothing to do since it was already connected
    }

    vm.state = VMState.connected; // reporting connection

    const {
      connected
    } = Services;

    if (connected) {
      invokeServiceHook(vm, connected);
    }

    const {
      connectedCallback
    } = vm.def;

    if (!isUndefined(connectedCallback)) {
      {
        startMeasure('connectedCallback', vm);
      }

      invokeComponentCallback(vm, connectedCallback);

      {
        endMeasure('connectedCallback', vm);
      }
    }
  }

  function runDisconnectedCallback(vm) {
    {
      assert.isTrue(vm.state !== VMState.disconnected, `${vm} must be inserted.`);
    }

    if (isFalse$1(vm.isDirty)) {
      // this guarantees that if the component is reused/reinserted,
      // it will be re-rendered because we are disconnecting the reactivity
      // linking, so mutations are not automatically reflected on the state
      // of disconnected components.
      vm.isDirty = true;
    }

    vm.state = VMState.disconnected; // reporting disconnection

    const {
      disconnected
    } = Services;

    if (disconnected) {
      invokeServiceHook(vm, disconnected);
    }

    const {
      disconnectedCallback
    } = vm.def;

    if (!isUndefined(disconnectedCallback)) {
      {
        startMeasure('disconnectedCallback', vm);
      }

      invokeComponentCallback(vm, disconnectedCallback);

      {
        endMeasure('disconnectedCallback', vm);
      }
    }
  }

  function runShadowChildNodesDisconnectedCallback(vm) {
    const {
      velements: vCustomElementCollection
    } = vm; // reporting disconnection for every child in inverse order since they are inserted in reserved order

    for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
      const elm = vCustomElementCollection[i].elm; // There are two cases where the element could be undefined:
      // * when there is an error during the construction phase, and an
      //   error boundary picks it, there is a possibility that the VCustomElement
      //   is not properly initialized, and therefore is should be ignored.
      // * when slotted custom element is not used by the element where it is slotted
      //   into it, as a result, the custom element was never initialized.

      if (!isUndefined(elm)) {
        const childVM = getAssociatedVM(elm);
        resetComponentStateWhenRemoved(childVM);
      }
    }
  }

  function runLightChildNodesDisconnectedCallback(vm) {
    const {
      aChildren: adoptedChildren
    } = vm;
    recursivelyDisconnectChildren(adoptedChildren);
  }
  /**
   * The recursion doesn't need to be a complete traversal of the vnode graph,
   * instead it can be partial, when a custom element vnode is found, we don't
   * need to continue into its children because by attempting to disconnect the
   * custom element itself will trigger the removal of anything slotted or anything
   * defined on its shadow.
   */


  function recursivelyDisconnectChildren(vnodes) {
    for (let i = 0, len = vnodes.length; i < len; i += 1) {
      const vnode = vnodes[i];

      if (!isNull(vnode) && isArray$1(vnode.children) && !isUndefined(vnode.elm)) {
        // vnode is a VElement with children
        if (isUndefined(vnode.ctor)) {
          // it is a VElement, just keep looking (recursively)
          recursivelyDisconnectChildren(vnode.children);
        } else {
          // it is a VCustomElement, disconnect it and ignore its children
          resetComponentStateWhenRemoved(getAssociatedVM(vnode.elm));
        }
      }
    }
  } // This is a super optimized mechanism to remove the content of the shadowRoot
  // without having to go into snabbdom. Especially useful when the reset is a consequence
  // of an error, in which case the children VNodes might not be representing the current
  // state of the DOM


  function resetShadowRoot(vm) {
    vm.children = EmptyArray;
    ShadowRootInnerHTMLSetter.call(vm.cmpRoot, ''); // disconnecting any known custom element inside the shadow of the this vm

    runShadowChildNodesDisconnectedCallback(vm);
  }

  function scheduleRehydration(vm) {
    if (!vm.isScheduled) {
      vm.isScheduled = true;

      if (rehydrateQueue.length === 0) {
        addCallbackToNextTick(flushRehydrationQueue);
      }

      ArrayPush.call(rehydrateQueue, vm);
    }
  }

  function getErrorBoundaryVM(vm) {
    let currentVm = vm;

    while (!isNull(currentVm)) {
      if (!isUndefined(currentVm.def.errorCallback)) {
        return currentVm;
      }

      currentVm = currentVm.owner;
    }
  }
  // NOTE: we should probably more this routine to the synthetic shadow folder
  // and get the allocation to be cached by in the elm instead of in the VM


  function allocateInSlot(vm, children) {
    {
      assert.invariant(isObject$1(vm.cmpSlots), `When doing manual allocation, there must be a cmpSlots object available.`);
    }

    const {
      cmpSlots: oldSlots
    } = vm;
    const cmpSlots = vm.cmpSlots = create(null);

    for (let i = 0, len = children.length; i < len; i += 1) {
      const vnode = children[i];

      if (isNull(vnode)) {
        continue;
      }

      const {
        data
      } = vnode;
      const slotName = data.attrs && data.attrs.slot || '';
      const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
      // which might have similar keys. Each vnode will always have a key that
      // starts with a numeric character from compiler. In this case, we add a unique
      // notation for slotted vnodes keys, e.g.: `@foo:1:1`

      vnode.key = `@${slotName}:${vnode.key}`;
      ArrayPush.call(vnodes, vnode);
    }

    if (isFalse$1(vm.isDirty)) {
      // We need to determine if the old allocation is really different from the new one
      // and mark the vm as dirty
      const oldKeys = keys(oldSlots);

      if (oldKeys.length !== keys(cmpSlots).length) {
        markComponentAsDirty(vm);
        return;
      }

      for (let i = 0, len = oldKeys.length; i < len; i += 1) {
        const key = oldKeys[i];

        if (isUndefined(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
          markComponentAsDirty(vm);
          return;
        }

        const oldVNodes = oldSlots[key];
        const vnodes = cmpSlots[key];

        for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
          if (oldVNodes[j] !== vnodes[j]) {
            markComponentAsDirty(vm);
            return;
          }
        }
      }
    }
  }

  function runWithBoundaryProtection(vm, owner, pre, job, post) {
    let error;
    pre();

    try {
      job();
    } catch (e) {
      error = Object(e);
    } finally {
      post();

      if (!isUndefined(error)) {
        error.wcStack = error.wcStack || getErrorComponentStack(vm);
        const errorBoundaryVm = isNull(owner) ? undefined : getErrorBoundaryVM(owner);

        if (isUndefined(errorBoundaryVm)) {
          throw error; // eslint-disable-line no-unsafe-finally
        }

        resetShadowRoot(vm); // remove offenders

        {
          startMeasure('errorCallback', errorBoundaryVm);
        } // error boundaries must have an ErrorCallback


        const errorCallback = errorBoundaryVm.def.errorCallback;
        invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);

        {
          endMeasure('errorCallback', errorBoundaryVm);
        }
      }
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const ConnectingSlot = createHiddenField('connecting', 'engine');
  const DisconnectingSlot = createHiddenField('disconnecting', 'engine');

  function callNodeSlot(node, slot) {
    {
      assert.isTrue(node, `callNodeSlot() should not be called for a non-object`);
    }

    const fn = getHiddenField(node, slot);

    if (!isUndefined(fn)) {
      fn(node);
    }

    return node; // for convenience
  } // Monkey patching Node methods to be able to detect the insertions and removal of root elements
  // created via createElement.


  assign(Node.prototype, {
    appendChild(newChild) {
      const appendedNode = appendChild.call(this, newChild);
      return callNodeSlot(appendedNode, ConnectingSlot);
    },

    insertBefore(newChild, referenceNode) {
      const insertedNode = insertBefore.call(this, newChild, referenceNode);
      return callNodeSlot(insertedNode, ConnectingSlot);
    },

    removeChild(oldChild) {
      const removedNode = removeChild.call(this, oldChild);
      return callNodeSlot(removedNode, DisconnectingSlot);
    },

    replaceChild(newChild, oldChild) {
      const replacedNode = replaceChild.call(this, newChild, oldChild);
      callNodeSlot(replacedNode, DisconnectingSlot);
      callNodeSlot(newChild, ConnectingSlot);
      return replacedNode;
    }

  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * EXPERIMENTAL: This function builds a Web Component class from a LWC constructor so it can be
   * registered as a new element via customElements.define() at any given time.
   *
   * @example
   * ```
   * import { buildCustomElementConstructor } from 'lwc';
   * import Foo from 'ns/foo';
   * const WC = buildCustomElementConstructor(Foo);
   * customElements.define('x-foo', WC);
   * const elm = document.createElement('x-foo');
   * ```
   */


  function buildCustomElementConstructor(Ctor, options) {
    var _a;

    const {
      props,
      bridge: BaseElement
    } = getComponentDef(Ctor);
    const mode = isUndefined(options) || isUndefined(options.mode) || options.mode !== 'closed' ? 'open' : 'closed';
    return _a = class extends BaseElement {
      constructor() {
        super();
        createVM(this, Ctor, {
          mode,
          isRoot: true,
          owner: null
        });
      }

      connectedCallback() {
        connectRootElement(this);
      }

      disconnectedCallback() {
        disconnectedRootElement(this);
      }

      attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue) {
          // ignoring similar values for better perf
          return;
        }

        const propName = getPropNameFromAttrName(attrName);

        if (isUndefined(props[propName])) {
          // ignoring unknown attributes
          return;
        }

        if (!isAttributeLocked(this, attrName)) {
          // ignoring changes triggered by the engine itself during:
          // * diffing when public props are attempting to reflect to the DOM
          // * component via `this.setAttribute()`, should never update the prop.
          // Both cases, the the setAttribute call is always wrap by the unlocking
          // of the attribute to be changed
          return;
        } // reflect attribute change to the corresponding props when changed
        // from outside.


        this[propName] = newValue;
      }

    }, // collecting all attribute names from all public props to apply
    // the reflection from attributes to props via attributeChangedCallback.
    _a.observedAttributes = ArrayMap.call(getOwnPropertyNames(props), propName => props[propName].attr), _a;
  }
  /** version: 1.4.0-alpha3 */

  /* proxy-compat-disable */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  function detect$2() {
    // Don't apply polyfill when ProxyCompat is enabled.
    if ('getKey' in Proxy) {
      return false;
    }

    const proxy = new Proxy([3, 4], {});
    const res = [1, 2].concat(proxy);
    return res.length !== 4;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    isConcatSpreadable: isConcatSpreadable$1
  } = Symbol;
  const {
    isArray: isArray$3
  } = Array;
  const {
    slice: ArraySlice$2,
    unshift: ArrayUnshift$2,
    shift: ArrayShift$1
  } = Array.prototype;

  function isObject$3(O) {
    return typeof O === 'object' ? O !== null : typeof O === 'function';
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable


  function isSpreadable$1(O) {
    if (!isObject$3(O)) {
      return false;
    }

    const spreadable = O[isConcatSpreadable$1];
    return spreadable !== undefined ? Boolean(spreadable) : isArray$3(O);
  } // https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat


  function ArrayConcatPolyfill$1(..._args) {
    const O = Object(this);
    const A = [];
    let N = 0;
    const items = ArraySlice$2.call(arguments);
    ArrayUnshift$2.call(items, O);

    while (items.length) {
      const E = ArrayShift$1.call(items);

      if (isSpreadable$1(E)) {
        let k = 0;
        const length = E.length;

        for (k; k < length; k += 1, N += 1) {
          if (k in E) {
            const subElement = E[k];
            A[N] = subElement;
          }
        }
      } else {
        A[N] = E;
        N += 1;
      }
    }

    return A;
  }

  function apply$1() {
    Array.prototype.concat = ArrayConcatPolyfill$1;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  if (detect$2()) {
    apply$1();
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function detect$1$1(propName) {
    return Object.getOwnPropertyDescriptor(Element.prototype, propName) === undefined;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    hasAttribute: hasAttribute$1,
    getAttribute: getAttribute$1,
    setAttribute: setAttribute$1,
    setAttributeNS: setAttributeNS$1,
    removeAttribute: removeAttribute$1,
    removeAttributeNS: removeAttributeNS$1
  } = Element.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`

  const ARIA_REGEX$1 = /^aria/;
  const nodeToAriaPropertyValuesMap$1 = new WeakMap();
  const {
    hasOwnProperty: hasOwnProperty$4
  } = Object.prototype;
  const {
    replace: StringReplace$2,
    toLowerCase: StringToLowerCase$2
  } = String.prototype;

  function getAriaPropertyMap$1(elm) {
    let map = nodeToAriaPropertyValuesMap$1.get(elm);

    if (map === undefined) {
      map = {};
      nodeToAriaPropertyValuesMap$1.set(elm, map);
    }

    return map;
  }

  function getNormalizedAriaPropertyValue$1(value) {
    return value == null ? null : value + '';
  }

  function createAriaPropertyPropertyDescriptor$1(propName, attrName) {
    return {
      get() {
        const map = getAriaPropertyMap$1(this);

        if (hasOwnProperty$4.call(map, propName)) {
          return map[propName];
        } // otherwise just reflect what's in the attribute


        return hasAttribute$1.call(this, attrName) ? getAttribute$1.call(this, attrName) : null;
      },

      set(newValue) {
        const normalizedValue = getNormalizedAriaPropertyValue$1(newValue);
        const map = getAriaPropertyMap$1(this);
        map[propName] = normalizedValue; // reflect into the corresponding attribute

        if (newValue === null) {
          removeAttribute$1.call(this, attrName);
        } else {
          setAttribute$1.call(this, attrName, newValue);
        }
      },

      configurable: true,
      enumerable: true
    };
  }

  function patch$1(propName) {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const replaced = StringReplace$2.call(propName, ARIA_REGEX$1, 'aria-');
    const attrName = StringToLowerCase$2.call(replaced);
    const descriptor = createAriaPropertyPropertyDescriptor$1(propName, attrName);
    Object.defineProperty(Element.prototype, propName, descriptor);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // https://wicg.github.io/aom/spec/aria-reflection.html


  const ElementPrototypeAriaPropertyNames$1 = ['ariaAutoComplete', 'ariaChecked', 'ariaCurrent', 'ariaDisabled', 'ariaExpanded', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaLabel', 'ariaLevel', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaPressed', 'ariaReadOnly', 'ariaRequired', 'ariaSelected', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaLive', 'ariaRelevant', 'ariaAtomic', 'ariaBusy', 'ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns', 'ariaPosInSet', 'ariaSetSize', 'ariaColCount', 'ariaColIndex', 'ariaDetails', 'ariaErrorMessage', 'ariaKeyShortcuts', 'ariaModal', 'ariaPlaceholder', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowSpan', 'ariaColSpan', 'role'];
  /**
   * Note: Attributes aria-dropeffect and aria-grabbed were deprecated in
   * ARIA 1.1 and do not have corresponding IDL attributes.
   */

  for (let i = 0, len = ElementPrototypeAriaPropertyNames$1.length; i < len; i += 1) {
    const propName = ElementPrototypeAriaPropertyNames$1[i];

    if (detect$1$1(propName)) {
      patch$1(propName);
    }
  }
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function invariant$1(value, msg) {
    if (!value) {
      throw new Error(`Invariant Violation: ${msg}`);
    }
  }

  function isTrue$2(value, msg) {
    if (!value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function isFalse$2(value, msg) {
    if (value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function fail$1(msg) {
    throw new Error(msg);
  }

  var assert$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invariant: invariant$1,
    isTrue: isTrue$2,
    isFalse: isFalse$2,
    fail: fail$1
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const {
    assign: assign$2,
    create: create$3,
    defineProperties: defineProperties$2,
    defineProperty: defineProperty$2,
    freeze: freeze$2,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$3,
    getOwnPropertyNames: getOwnPropertyNames$3,
    getPrototypeOf: getPrototypeOf$3,
    hasOwnProperty: hasOwnProperty$1$1,
    keys: keys$2,
    seal: seal$2,
    setPrototypeOf: setPrototypeOf$2
  } = Object;
  const {
    isArray: isArray$1$1
  } = Array;
  const {
    filter: ArrayFilter$1,
    find: ArrayFind$1,
    forEach: forEach$1,
    indexOf: ArrayIndexOf$2,
    join: ArrayJoin$1,
    map: ArrayMap$2,
    push: ArrayPush$3,
    reduce: ArrayReduce$1,
    reverse: ArrayReverse$1,
    slice: ArraySlice$1$1,
    splice: ArraySplice$2,
    unshift: ArrayUnshift$1$1
  } = Array.prototype;
  const {
    charCodeAt: StringCharCodeAt$1,
    replace: StringReplace$1$1,
    slice: StringSlice$1,
    toLowerCase: StringToLowerCase$1$1
  } = String.prototype;

  function isUndefined$3(obj) {
    return obj === undefined;
  }

  function isNull$1(obj) {
    return obj === null;
  }

  function isTrue$1$1(obj) {
    return obj === true;
  }

  function isFalse$1$1(obj) {
    return obj === false;
  }

  function isFunction$2(obj) {
    return typeof obj === 'function';
  }

  function isObject$1$1(obj) {
    return typeof obj === 'object';
  }

  function isString$1(obj) {
    return typeof obj === 'string';
  }

  function isNumber$1(obj) {
    return typeof obj === 'number';
  }

  const OtS$2 = {}.toString;

  function toString$2(obj) {
    if (obj && obj.toString) {
      // Arrays might hold objects with "null" prototype So using
      // Array.prototype.toString directly will cause an error Iterate through
      // all the items and handle individually.
      if (isArray$1$1(obj)) {
        return ArrayJoin$1.call(ArrayMap$2.call(obj, toString$2), ',');
      }

      return obj.toString();
    } else if (typeof obj === 'object') {
      return OtS$2.call(obj);
    } else {
      return obj + emptyString$1;
    }
  }

  function getPropertyDescriptor$1(o, p) {
    do {
      const d = getOwnPropertyDescriptor$3(o, p);

      if (!isUndefined$3(d)) {
        return d;
      }

      o = getPrototypeOf$3(o);
    } while (o !== null);
  }

  const emptyString$1 = '';
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */

  const hasNativeSymbolsSupport$2 = Symbol('x').toString() === 'Symbol(x)';

  function createHiddenField$1(key, namespace) {
    return hasNativeSymbolsSupport$2 ? Symbol(key) : `$$lwc-${namespace}-${key}$$`;
  }

  const hiddenFieldsMap$1 = new WeakMap();

  function setHiddenField$1(o, field, value) {
    let valuesByField = hiddenFieldsMap$1.get(o);

    if (isUndefined$3(valuesByField)) {
      valuesByField = create$3(null);
      hiddenFieldsMap$1.set(o, valuesByField);
    }

    valuesByField[field] = value;
  }

  function getHiddenField$1(o, field) {
    const valuesByField = hiddenFieldsMap$1.get(o);

    if (!isUndefined$3(valuesByField)) {
      return valuesByField[field];
    }
  }
  /** version: 1.3.2 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const defaultDefHTMLPropertyNames$1 = ['accessKey', 'dir', 'draggable', 'hidden', 'id', 'lang', 'tabIndex', 'title']; // Few more exceptions that are using the attribute name to match the property in lowercase.
  // this list was compiled from https://msdn.microsoft.com/en-us/library/ms533062(v=vs.85).aspx
  // and https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
  // Note: this list most be in sync with the compiler as well.

  const HTMLPropertyNamesWithLowercasedReflectiveAttributes$1 = ['accessKey', 'readOnly', 'tabIndex', 'bgColor', 'colSpan', 'rowSpan', 'contentEditable', 'dateTime', 'formAction', 'isMap', 'maxLength', 'useMap'];

  function offsetPropertyErrorMessage$1(name) {
    return `Using the \`${name}\` property is an anti-pattern because it rounds the value to an integer. Instead, use the \`getBoundingClientRect\` method to obtain fractional values for the size of an element and its position relative to the viewport.`;
  } // Global HTML Attributes & Properties
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement


  const globalHTMLProperties$1 = assign$2(create$3(null), {
    accessKey: {
      attribute: 'accesskey'
    },
    accessKeyLabel: {
      readOnly: true
    },
    className: {
      attribute: 'class',
      error: 'Using the `className` property is an anti-pattern because of slow runtime behavior and potential conflicts with classes provided by the owner element. Use the `classList` API instead.'
    },
    contentEditable: {
      attribute: 'contenteditable'
    },
    dataset: {
      readOnly: true,
      error: "Using the `dataset` property is an anti-pattern because it can't be statically analyzed. Expose each property individually using the `@api` decorator instead."
    },
    dir: {
      attribute: 'dir'
    },
    draggable: {
      attribute: 'draggable'
    },
    dropzone: {
      attribute: 'dropzone',
      readOnly: true
    },
    hidden: {
      attribute: 'hidden'
    },
    id: {
      attribute: 'id'
    },
    inputMode: {
      attribute: 'inputmode'
    },
    lang: {
      attribute: 'lang'
    },
    slot: {
      attribute: 'slot',
      error: 'Using the `slot` property is an anti-pattern.'
    },
    spellcheck: {
      attribute: 'spellcheck'
    },
    style: {
      attribute: 'style'
    },
    tabIndex: {
      attribute: 'tabindex'
    },
    title: {
      attribute: 'title'
    },
    translate: {
      attribute: 'translate'
    },
    // additional "global attributes" that are not present in the link above.
    isContentEditable: {
      readOnly: true
    },
    offsetHeight: {
      readOnly: true,
      error: offsetPropertyErrorMessage$1('offsetHeight')
    },
    offsetLeft: {
      readOnly: true,
      error: offsetPropertyErrorMessage$1('offsetLeft')
    },
    offsetParent: {
      readOnly: true
    },
    offsetTop: {
      readOnly: true,
      error: offsetPropertyErrorMessage$1('offsetTop')
    },
    offsetWidth: {
      readOnly: true,
      error: offsetPropertyErrorMessage$1('offsetWidth')
    },
    role: {
      attribute: 'role'
    }
  });
  const AttrNameToPropNameMap$1 = create$3(null);
  const PropNameToAttrNameMap$1 = create$3(null); // Synthetic creation of all AOM property descriptors for Custom Elements

  forEach$1.call(ElementPrototypeAriaPropertyNames$1, propName => {
    // Typescript is inferring the wrong function type for this particular
    // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
    // @ts-ignore type-mismatch
    const attrName = StringToLowerCase$1$1.call(StringReplace$1$1.call(propName, /^aria/, 'aria-'));
    AttrNameToPropNameMap$1[attrName] = propName;
    PropNameToAttrNameMap$1[propName] = attrName;
  });
  forEach$1.call(defaultDefHTMLPropertyNames$1, propName => {
    const attrName = StringToLowerCase$1$1.call(propName);
    AttrNameToPropNameMap$1[attrName] = propName;
    PropNameToAttrNameMap$1[propName] = attrName;
  });
  forEach$1.call(HTMLPropertyNamesWithLowercasedReflectiveAttributes$1, propName => {
    const attrName = StringToLowerCase$1$1.call(propName);
    AttrNameToPropNameMap$1[attrName] = propName;
    PropNameToAttrNameMap$1[propName] = attrName;
  });

  const CAPS_REGEX$1 = /[A-Z]/g;
  /**
   * This method maps between property names
   * and the corresponding attribute name.
   */

  function getAttrNameFromPropName$1(propName) {
    if (isUndefined$3(PropNameToAttrNameMap$1[propName])) {
      PropNameToAttrNameMap$1[propName] = StringReplace$1$1.call(propName, CAPS_REGEX$1, match => '-' + match.toLowerCase());
    }

    return PropNameToAttrNameMap$1[propName];
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  let nextTickCallbackQueue$1 = [];
  const SPACE_CHAR$1 = 32;
  const EmptyObject$1 = seal$2(create$3(null));
  const EmptyArray$1 = seal$2([]);

  function flushCallbackQueue$1() {
    {
      if (nextTickCallbackQueue$1.length === 0) {
        throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
      }
    }

    const callbacks = nextTickCallbackQueue$1;
    nextTickCallbackQueue$1 = []; // reset to a new queue

    for (let i = 0, len = callbacks.length; i < len; i += 1) {
      callbacks[i]();
    }
  }

  function addCallbackToNextTick$1(callback) {
    {
      if (!isFunction$2(callback)) {
        throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
      }
    }

    if (nextTickCallbackQueue$1.length === 0) {
      Promise.resolve().then(flushCallbackQueue$1);
    }

    ArrayPush$3.call(nextTickCallbackQueue$1, callback);
  }

  function isCircularModuleDependency$1(value) {
    return hasOwnProperty$1$1.call(value, '__circular__');
  }
  /**
   * When LWC is used in the context of an Aura application, the compiler produces AMD
   * modules, that doesn't resolve properly circular dependencies between modules. In order
   * to circumvent this issue, the module loader returns a factory with a symbol attached
   * to it.
   *
   * This method returns the resolved value if it received a factory as argument. Otherwise
   * it returns the original value.
   */


  function resolveCircularModuleDependency$1(fn) {
    {
      if (!isFunction$2(fn)) {
        throw new TypeError(`Circular module dependency must be a function.`);
      }
    }

    return fn();
  }

  const useSyntheticShadow$1 = hasOwnProperty$1$1.call(Element.prototype, '$shadowToken$');
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function getComponentTag$1(vm) {
    // Element.prototype.tagName getter might be poisoned. We need to use a try/catch to protect the
    // engine internal when accessing the tagName property.
    try {
      return `<${StringToLowerCase$1$1.call(vm.elm.tagName)}>`;
    } catch (error) {
      return '<invalid-tag-name>';
    }
  } // TODO [#1695]: Unify getComponentStack and getErrorComponentStack


  function getComponentStack$1(vm) {
    const stack = [];
    let prefix = '';

    while (!isNull$1(vm.owner)) {
      ArrayPush$3.call(stack, prefix + getComponentTag$1(vm));
      vm = vm.owner;
      prefix += '\t';
    }

    return ArrayJoin$1.call(stack, '\n');
  }

  function getErrorComponentStack$1(vm) {
    const wcStack = [];
    let currentVm = vm;

    while (!isNull$1(currentVm)) {
      ArrayPush$3.call(wcStack, getComponentTag$1(currentVm));
      currentVm = currentVm.owner;
    }

    return wcStack.reverse().join('\n\t');
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function logError$1(message, vm) {
    let msg = `[LWC error]: ${message}`;

    if (!isUndefined$3(vm)) {
      msg = `${msg}\n${getComponentStack$1(vm)}`;
    }

    try {
      throw new Error(msg);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function handleEvent$1(event, vnode) {
    const {
      type
    } = event;
    const {
      data: {
        on
      }
    } = vnode;
    const handler = on && on[type]; // call event handler if exists

    if (handler) {
      handler.call(undefined, event);
    }
  }

  function createListener$1() {
    return function handler(event) {
      handleEvent$1(event, handler.vnode);
    };
  }

  function updateAllEventListeners$1(oldVnode, vnode) {
    if (isUndefined$3(oldVnode.listener)) {
      createAllEventListeners$1(vnode);
    } else {
      vnode.listener = oldVnode.listener;
      vnode.listener.vnode = vnode;
    }
  }

  function createAllEventListeners$1(vnode) {
    const {
      data: {
        on
      }
    } = vnode;

    if (isUndefined$3(on)) {
      return;
    }

    const elm = vnode.elm;
    const listener = vnode.listener = createListener$1();
    listener.vnode = vnode;
    let name;

    for (name in on) {
      elm.addEventListener(name, listener);
    }
  }

  var modEvents$1 = {
    update: updateAllEventListeners$1,
    create: createAllEventListeners$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const xlinkNS$1 = 'http://www.w3.org/1999/xlink';
  const xmlNS$1 = 'http://www.w3.org/XML/1998/namespace';
  const ColonCharCode$1 = 58;

  function updateAttrs$1(oldVnode, vnode) {
    const {
      data: {
        attrs
      }
    } = vnode;

    if (isUndefined$3(attrs)) {
      return;
    }

    let {
      data: {
        attrs: oldAttrs
      }
    } = oldVnode;

    if (oldAttrs === attrs) {
      return;
    }

    {
      assert$1.invariant(isUndefined$3(oldAttrs) || keys$2(oldAttrs).join(',') === keys$2(attrs).join(','), `vnode.data.attrs cannot change shape.`);
    }

    const elm = vnode.elm;
    let key;
    oldAttrs = isUndefined$3(oldAttrs) ? EmptyObject$1 : oldAttrs; // update modified attributes, add new attributes
    // this routine is only useful for data-* attributes in all kind of elements
    // and aria-* in standard elements (custom elements will use props for these)

    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];

      if (old !== cur) {

        if (StringCharCodeAt$1.call(key, 3) === ColonCharCode$1) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS$1, key, cur);
        } else if (StringCharCodeAt$1.call(key, 5) === ColonCharCode$1) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS$1, key, cur);
        } else if (isNull$1(cur)) {
          elm.removeAttribute(key);
        } else {
          elm.setAttribute(key, cur);
        }
      }
    }
  }

  const emptyVNode$4 = {
    data: {}
  };
  var modAttrs$1 = {
    create: vnode => updateAttrs$1(emptyVNode$4, vnode),
    update: updateAttrs$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function isLiveBindingProp$1(sel, key) {
    // For properties with live bindings, we read values from the DOM element
    // instead of relying on internally tracked values.
    return sel === 'input' && (key === 'value' || key === 'checked');
  }

  function update$1(oldVnode, vnode) {
    const props = vnode.data.props;

    if (isUndefined$3(props)) {
      return;
    }

    const oldProps = oldVnode.data.props;

    if (oldProps === props) {
      return;
    }

    {
      assert$1.invariant(isUndefined$3(oldProps) || keys$2(oldProps).join(',') === keys$2(props).join(','), 'vnode.data.props cannot change shape.');
    }

    const elm = vnode.elm;
    const isFirstPatch = isUndefined$3(oldProps);
    const {
      sel
    } = vnode;

    for (const key in props) {
      const cur = props[key];

      {
        if (!(key in elm)) {
          // TODO [#1297]: Move this validation to the compiler
          assert$1.fail(`Unknown public property "${key}" of element <${sel}>. This is likely a typo on the corresponding attribute "${getAttrNameFromPropName$1(key)}".`);
        }
      } // if it is the first time this element is patched, or the current value is different to the previous value...


      if (isFirstPatch || cur !== (isLiveBindingProp$1(sel, key) ? elm[key] : oldProps[key])) {
        elm[key] = cur;
      }
    }
  }

  const emptyVNode$1$1 = {
    data: {}
  };
  var modProps$1 = {
    create: vnode => update$1(emptyVNode$1$1, vnode),
    update: update$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const classNameToClassMap$1 = create$3(null);

  function getMapFromClassName$1(className) {
    // Intentionally using == to match undefined and null values from computed style attribute
    if (className == null) {
      return EmptyObject$1;
    } // computed class names must be string


    className = isString$1(className) ? className : className + '';
    let map = classNameToClassMap$1[className];

    if (map) {
      return map;
    }

    map = create$3(null);
    let start = 0;
    let o;
    const len = className.length;

    for (o = 0; o < len; o++) {
      if (StringCharCodeAt$1.call(className, o) === SPACE_CHAR$1) {
        if (o > start) {
          map[StringSlice$1.call(className, start, o)] = true;
        }

        start = o + 1;
      }
    }

    if (o > start) {
      map[StringSlice$1.call(className, start, o)] = true;
    }

    classNameToClassMap$1[className] = map;

    {
      // just to make sure that this object never changes as part of the diffing algo
      freeze$2(map);
    }

    return map;
  }

  function updateClassAttribute$1(oldVnode, vnode) {
    const {
      elm,
      data: {
        className: newClass
      }
    } = vnode;
    const {
      data: {
        className: oldClass
      }
    } = oldVnode;

    if (oldClass === newClass) {
      return;
    }

    const {
      classList
    } = elm;
    const newClassMap = getMapFromClassName$1(newClass);
    const oldClassMap = getMapFromClassName$1(oldClass);
    let name;

    for (name in oldClassMap) {
      // remove only if it is not in the new class collection and it is not set from within the instance
      if (isUndefined$3(newClassMap[name])) {
        classList.remove(name);
      }
    }

    for (name in newClassMap) {
      if (isUndefined$3(oldClassMap[name])) {
        classList.add(name);
      }
    }
  }

  const emptyVNode$2$1 = {
    data: {}
  };
  var modComputedClassName$1 = {
    create: vnode => updateClassAttribute$1(emptyVNode$2$1, vnode),
    update: updateClassAttribute$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function updateStyleAttribute$1(oldVnode, vnode) {
    const {
      style: newStyle
    } = vnode.data;

    if (oldVnode.data.style === newStyle) {
      return;
    }

    const elm = vnode.elm;
    const {
      style
    } = elm;

    if (!isString$1(newStyle) || newStyle === '') {
      removeAttribute$1.call(elm, 'style');
    } else {
      style.cssText = newStyle;
    }
  }

  const emptyVNode$3$1 = {
    data: {}
  };
  var modComputedStyle$1 = {
    create: vnode => updateStyleAttribute$1(emptyVNode$3$1, vnode),
    update: updateStyleAttribute$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline classnames into an object. It's faster to set the
  // different classnames properties individually instead of via a string.

  function createClassAttribute$1(vnode) {
    const {
      elm,
      data: {
        classMap
      }
    } = vnode;

    if (isUndefined$3(classMap)) {
      return;
    }

    const {
      classList
    } = elm;

    for (const name in classMap) {
      classList.add(name);
    }
  }

  var modStaticClassName$1 = {
    create: createClassAttribute$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // The compiler takes care of transforming the inline style into an object. It's faster to set the
  // different style properties individually instead of via a string.

  function createStyleAttribute$1(vnode) {
    const {
      elm,
      data: {
        styleMap
      }
    } = vnode;

    if (isUndefined$3(styleMap)) {
      return;
    }

    const {
      style
    } = elm;

    for (const name in styleMap) {
      style[name] = styleMap[name];
    }
  }

  var modStaticStyle$1 = {
    create: createStyleAttribute$1
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  function createContext(vnode) {
    const {
      data: {
        context
      }
    } = vnode;

    if (isUndefined$3(context)) {
      return;
    }

    const elm = vnode.elm;
    const vm = getAssociatedVMIfPresent$1(elm);

    if (!isUndefined$3(vm)) {
      assign$2(vm.context, context);
    }
  }

  const contextModule = {
    create: createContext
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
  @license
  Copyright (c) 2015 Simon Friis Vindum.
  This code may only be used under the MIT License found at
  https://github.com/snabbdom/snabbdom/blob/master/LICENSE
  Code distributed by Snabbdom as part of the Snabbdom project at
  https://github.com/snabbdom/snabbdom/
  */

  function isUndef$1(s) {
    return s === undefined;
  }

  function sameVnode$1(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
  }

  function isVNode$1(vnode) {
    return vnode != null;
  }

  function createKeyToOldIdx$1(children, beginIdx, endIdx) {
    const map = {};
    let j, key, ch; // TODO [#1637]: simplify this by assuming that all vnodes has keys

    for (j = beginIdx; j <= endIdx; ++j) {
      ch = children[j];

      if (isVNode$1(ch)) {
        key = ch.key;

        if (key !== undefined) {
          map[key] = j;
        }
      }
    }

    return map;
  }

  function addVnodes$1(parentElm, before, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];

      if (isVNode$1(ch)) {
        ch.hook.create(ch);
        ch.hook.insert(ch, parentElm, before);
      }
    }
  }

  function removeVnodes$1(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]; // text nodes do not have logic associated to them

      if (isVNode$1(ch)) {
        ch.hook.remove(ch, parentElm);
      }
    }
  }

  function updateDynamicChildren$1(parentElm, oldCh, newCh) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!isVNode$1(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (!isVNode$1(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (!isVNode$1(newStartVnode)) {
        newStartVnode = newCh[++newStartIdx];
      } else if (!isVNode$1(newEndVnode)) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode$1(oldStartVnode, newStartVnode)) {
        patchVnode$1(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode$1(oldEndVnode, newEndVnode)) {
        patchVnode$1(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode$1(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode$1(oldStartVnode, newEndVnode);
        newEndVnode.hook.move(oldStartVnode, parentElm, oldEndVnode.elm.nextSibling);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode$1(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode$1(oldEndVnode, newStartVnode);
        newStartVnode.hook.move(oldEndVnode, parentElm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx$1(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = oldKeyToIdx[newStartVnode.key];

        if (isUndef$1(idxInOld)) {
          // New element
          newStartVnode.hook.create(newStartVnode);
          newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];

          if (isVNode$1(elmToMove)) {
            if (elmToMove.sel !== newStartVnode.sel) {
              // New element
              newStartVnode.hook.create(newStartVnode);
              newStartVnode.hook.insert(newStartVnode, parentElm, oldStartVnode.elm);
            } else {
              patchVnode$1(elmToMove, newStartVnode);
              oldCh[idxInOld] = undefined;
              newStartVnode.hook.move(elmToMove, parentElm, oldStartVnode.elm);
            }
          }

          newStartVnode = newCh[++newStartIdx];
        }
      }
    }

    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        const n = newCh[newEndIdx + 1];
        before = isVNode$1(n) ? n.elm : null;
        addVnodes$1(parentElm, before, newCh, newStartIdx, newEndIdx);
      } else {
        removeVnodes$1(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  function updateStaticChildren$1(parentElm, oldCh, newCh) {
    const {
      length
    } = newCh;

    if (oldCh.length === 0) {
      // the old list is empty, we can directly insert anything new
      addVnodes$1(parentElm, null, newCh, 0, length);
      return;
    } // if the old list is not empty, the new list MUST have the same
    // amount of nodes, that's why we call this static children


    let referenceElm = null;

    for (let i = length - 1; i >= 0; i -= 1) {
      const vnode = newCh[i];
      const oldVNode = oldCh[i];

      if (vnode !== oldVNode) {
        if (isVNode$1(oldVNode)) {
          if (isVNode$1(vnode)) {
            // both vnodes must be equivalent, and se just need to patch them
            patchVnode$1(oldVNode, vnode);
            referenceElm = vnode.elm;
          } else {
            // removing the old vnode since the new one is null
            oldVNode.hook.remove(oldVNode, parentElm);
          }
        } else if (isVNode$1(vnode)) {
          // this condition is unnecessary
          vnode.hook.create(vnode); // insert the new node one since the old one is null

          vnode.hook.insert(vnode, parentElm, referenceElm);
          referenceElm = vnode.elm;
        }
      }
    }
  }

  function patchVnode$1(oldVnode, vnode) {
    if (oldVnode !== vnode) {
      vnode.elm = oldVnode.elm;
      vnode.hook.update(oldVnode, vnode);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function generateDataDescriptor$1(options) {
    return assign$2({
      configurable: true,
      enumerable: true,
      writable: true
    }, options);
  }

  function generateAccessorDescriptor$1(options) {
    return assign$2({
      configurable: true,
      enumerable: true
    }, options);
  }

  let isDomMutationAllowed$1 = false;

  function unlockDomMutation$1() {

    isDomMutationAllowed$1 = true;
  }

  function lockDomMutation$1() {

    isDomMutationAllowed$1 = false;
  }

  function portalRestrictionErrorMessage$1(name, type) {
    return `The \`${name}\` ${type} is available only on elements that use the \`lwc:dom="manual"\` directive.`;
  }

  function getNodeRestrictionsDescriptors$1(node, options) {
    // and returns the first descriptor for the property


    const originalTextContentDescriptor = getPropertyDescriptor$1(node, 'textContent');
    const originalNodeValueDescriptor = getPropertyDescriptor$1(node, 'nodeValue');
    const {
      appendChild,
      insertBefore,
      removeChild,
      replaceChild
    } = node;
    return {
      appendChild: generateDataDescriptor$1({
        value(aChild) {
          if (this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('appendChild', 'method'));
          }

          return appendChild.call(this, aChild);
        }

      }),
      insertBefore: generateDataDescriptor$1({
        value(newNode, referenceNode) {
          if (!isDomMutationAllowed$1 && this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('insertBefore', 'method'));
          }

          return insertBefore.call(this, newNode, referenceNode);
        }

      }),
      removeChild: generateDataDescriptor$1({
        value(aChild) {
          if (!isDomMutationAllowed$1 && this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('removeChild', 'method'));
          }

          return removeChild.call(this, aChild);
        }

      }),
      replaceChild: generateDataDescriptor$1({
        value(newChild, oldChild) {
          if (this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('replaceChild', 'method'));
          }

          return replaceChild.call(this, newChild, oldChild);
        }

      }),
      nodeValue: generateAccessorDescriptor$1({
        get() {
          return originalNodeValueDescriptor.get.call(this);
        },

        set(value) {
          if (!isDomMutationAllowed$1 && this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('nodeValue', 'property'));
          }

          originalNodeValueDescriptor.set.call(this, value);
        }

      }),
      textContent: generateAccessorDescriptor$1({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(value) {
          if (this instanceof Element && isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('textContent', 'property'));
          }

          originalTextContentDescriptor.set.call(this, value);
        }

      })
    };
  }

  function getElementRestrictionsDescriptors$1(elm, options) {

    const descriptors = getNodeRestrictionsDescriptors$1(elm, options);
    const originalInnerHTMLDescriptor = getPropertyDescriptor$1(elm, 'innerHTML');
    const originalOuterHTMLDescriptor = getPropertyDescriptor$1(elm, 'outerHTML');
    assign$2(descriptors, {
      innerHTML: generateAccessorDescriptor$1({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(value) {
          if (isFalse$1$1(options.isPortal)) {
            logError$1(portalRestrictionErrorMessage$1('innerHTML', 'property'), getAssociatedVMIfPresent$1(this));
          }

          return originalInnerHTMLDescriptor.set.call(this, value);
        }

      }),
      outerHTML: generateAccessorDescriptor$1({
        get() {
          return originalOuterHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set outerHTML on Element.`);
        }

      })
    });
    return descriptors;
  }

  function getShadowRootRestrictionsDescriptors$1(sr, options) {
    // thing when using the real shadow root, because if that's the case,
    // the component will not work when running with synthetic shadow.


    const originalQuerySelector = sr.querySelector;
    const originalQuerySelectorAll = sr.querySelectorAll;
    const originalAddEventListener = sr.addEventListener;
    const descriptors = getNodeRestrictionsDescriptors$1(sr, options);
    const originalInnerHTMLDescriptor = getPropertyDescriptor$1(sr, 'innerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor$1(sr, 'textContent');
    assign$2(descriptors, {
      innerHTML: generateAccessorDescriptor$1({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set innerHTML on ShadowRoot.`);
        }

      }),
      textContent: generateAccessorDescriptor$1({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set textContent on ShadowRoot.`);
        }

      }),
      addEventListener: generateDataDescriptor$1({
        value(type, listener, options) {
          const vmBeingRendered = getVMBeingRendered$1();
          assert$1.invariant(!isInvokingRender$1, `${vmBeingRendered}.render() method has side effects on the state of ${toString$2(sr)} by adding an event listener for "${type}".`);
          assert$1.invariant(!isUpdatingTemplate$1, `Updating the template of ${vmBeingRendered} has side effects on the state of ${toString$2(sr)} by adding an event listener for "${type}".`); // TODO [#420]: this is triggered when the component author attempts to add a listener
          // programmatically into its Component's shadow root

          if (!isUndefined$3(options)) {
            logError$1('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent$1(this));
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalAddEventListener.apply(this, arguments);
        }

      }),
      querySelector: generateDataDescriptor$1({
        value() {
          const vm = getAssociatedVM$1(this);
          assert$1.isFalse(isBeingConstructed$1(vm), `this.template.querySelector() cannot be called during the construction of the` + `custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch

          return originalQuerySelector.apply(this, arguments);
        }

      }),
      querySelectorAll: generateDataDescriptor$1({
        value() {
          const vm = getAssociatedVM$1(this);
          assert$1.isFalse(isBeingConstructed$1(vm), `this.template.querySelectorAll() cannot be called during the construction of the` + ` custom element for ${vm} because no content has been rendered yet.`); // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch

          return originalQuerySelectorAll.apply(this, arguments);
        }

      })
    });
    const BlockedShadowRootMethods = {
      cloneNode: 0,
      getElementById: 0,
      getSelection: 0,
      elementsFromPoint: 0,
      dispatchEvent: 0
    };
    forEach$1.call(getOwnPropertyNames$3(BlockedShadowRootMethods), methodName => {
      const descriptor = generateAccessorDescriptor$1({
        get() {
          throw new Error(`Disallowed method "${methodName}" in ShadowRoot.`);
        }

      });
      descriptors[methodName] = descriptor;
    });
    return descriptors;
  } // Custom Elements Restrictions:
  // -----------------------------


  function getCustomElementRestrictionsDescriptors$1(elm, options) {

    const descriptors = getNodeRestrictionsDescriptors$1(elm, options);
    const originalAddEventListener = elm.addEventListener;
    const originalInnerHTMLDescriptor = getPropertyDescriptor$1(elm, 'innerHTML');
    const originalOuterHTMLDescriptor = getPropertyDescriptor$1(elm, 'outerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor$1(elm, 'textContent');
    return assign$2(descriptors, {
      innerHTML: generateAccessorDescriptor$1({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set innerHTML on HTMLElement.`);
        }

      }),
      outerHTML: generateAccessorDescriptor$1({
        get() {
          return originalOuterHTMLDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set outerHTML on HTMLElement.`);
        }

      }),
      textContent: generateAccessorDescriptor$1({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },

        set(_value) {
          throw new TypeError(`Invalid attempt to set textContent on HTMLElement.`);
        }

      }),
      addEventListener: generateDataDescriptor$1({
        value(type, listener, options) {
          const vmBeingRendered = getVMBeingRendered$1();
          assert$1.invariant(!isInvokingRender$1, `${vmBeingRendered}.render() method has side effects on the state of ${toString$2(this)} by adding an event listener for "${type}".`);
          assert$1.invariant(!isUpdatingTemplate$1, `Updating the template of ${vmBeingRendered} has side effects on the state of ${toString$2(elm)} by adding an event listener for "${type}".`); // TODO [#420]: this is triggered when the component author attempts to add a listener
          // programmatically into a lighting element node

          if (!isUndefined$3(options)) {
            logError$1('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent$1(this));
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalAddEventListener.apply(this, arguments);
        }

      })
    });
  }

  function getComponentRestrictionsDescriptors$1() {

    return {
      tagName: generateAccessorDescriptor$1({
        get() {
          throw new Error(`Usage of property \`tagName\` is disallowed because the component itself does` + ` not know which tagName will be used to create the element, therefore writing` + ` code that check for that value is error prone.`);
        },

        configurable: true,
        enumerable: false
      })
    };
  }

  function getLightningElementPrototypeRestrictionsDescriptors$1(proto) {

    const originalDispatchEvent = proto.dispatchEvent;
    const originalIsConnectedGetter = getOwnPropertyDescriptor$3(proto, 'isConnected').get;
    const descriptors = {
      dispatchEvent: generateDataDescriptor$1({
        value(event) {
          const vm = getAssociatedVM$1(this);
          assert$1.isFalse(isBeingConstructed$1(vm), `this.dispatchEvent() should not be called during the construction of the custom` + ` element for ${getComponentTag$1(vm)} because no one is listening just yet.`);

          if (!isNull$1(event) && isObject$1$1(event)) {
            const {
              type
            } = event;

            if (!/^[a-z][a-z0-9_]*$/.test(type)) {
              logError$1(`Invalid event type "${type}" dispatched in element ${getComponentTag$1(vm)}.` + ` Event name must start with a lowercase letter and followed only lowercase` + ` letters, numbers, and underscores`, vm);
            }
          } // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-ignore type-mismatch


          return originalDispatchEvent.apply(this, arguments);
        }

      }),
      isConnected: generateAccessorDescriptor$1({
        get() {
          const vm = getAssociatedVM$1(this);
          const componentTag = getComponentTag$1(vm);
          assert$1.isFalse(isBeingConstructed$1(vm), `this.isConnected should not be accessed during the construction phase of the custom` + ` element ${componentTag}. The value will always be` + ` false for Lightning Web Components constructed using lwc.createElement().`);
          assert$1.isFalse(isVMBeingRendered$1(vm), `this.isConnected should not be accessed during the rendering phase of the custom` + ` element ${componentTag}. The value will always be true.`);
          assert$1.isFalse(isInvokingRenderedCallback$1(vm), `this.isConnected should not be accessed during the renderedCallback of the custom` + ` element ${componentTag}. The value will always be true.`);
          return originalIsConnectedGetter.call(this);
        }

      })
    };
    forEach$1.call(getOwnPropertyNames$3(globalHTMLProperties$1), propName => {
      if (propName in proto) {
        return; // no need to redefine something that we are already exposing
      }

      descriptors[propName] = generateAccessorDescriptor$1({
        get() {
          const {
            error,
            attribute
          } = globalHTMLProperties$1[propName];
          const msg = [];
          msg.push(`Accessing the global HTML property "${propName}" is disabled.`);

          if (error) {
            msg.push(error);
          } else if (attribute) {
            msg.push(`Instead access it via \`this.getAttribute("${attribute}")\`.`);
          }

          logError$1(msg.join('\n'), getAssociatedVM$1(this));
        },

        set() {
          const {
            readOnly
          } = globalHTMLProperties$1[propName];

          if (readOnly) {
            logError$1(`The global HTML property \`${propName}\` is read-only.`, getAssociatedVM$1(this));
          }
        }

      });
    });
    return descriptors;
  }

  function markNodeFromVNode(node) {

    node.$fromTemplate$ = true;
  }

  function patchElementWithRestrictions$1(elm, options) {
    defineProperties$2(elm, getElementRestrictionsDescriptors$1(elm, options));
  } // This routine will prevent access to certain properties on a shadow root instance to guarantee
  // that all components will work fine in IE11 and other browsers without shadow dom support.


  function patchShadowRootWithRestrictions$1(sr, options) {
    defineProperties$2(sr, getShadowRootRestrictionsDescriptors$1(sr, options));
  }

  function patchCustomElementWithRestrictions$1(elm, options) {
    const restrictionsDescriptors = getCustomElementRestrictionsDescriptors$1(elm, options);
    const elmProto = getPrototypeOf$3(elm);
    setPrototypeOf$2(elm, create$3(elmProto, restrictionsDescriptors));
  }

  function patchComponentWithRestrictions$1(cmp) {
    defineProperties$2(cmp, getComponentRestrictionsDescriptors$1());
  }

  function patchLightningElementPrototypeWithRestrictions$1(proto) {
    defineProperties$2(proto, getLightningElementPrototypeRestrictionsDescriptors$1(proto));
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const noop$3 = () => void 0;

  function observeElementChildNodes$1(elm) {
    elm.$domManual$ = true;
  }

  function setElementShadowToken$1(elm, token) {
    elm.$shadowToken$ = token;
  }

  function updateNodeHook$1(oldVnode, vnode) {
    const {
      text
    } = vnode;

    if (oldVnode.text !== text) {
      {
        unlockDomMutation$1();
      }
      /**
       * Compiler will never produce a text property that is not string
       */


      vnode.elm.nodeValue = text;

      {
        lockDomMutation$1();
      }
    }
  }

  function insertNodeHook$1(vnode, parentNode, referenceNode) {
    {
      unlockDomMutation$1();
    }

    parentNode.insertBefore(vnode.elm, referenceNode);

    {
      lockDomMutation$1();
    }
  }

  function removeNodeHook$1(vnode, parentNode) {
    {
      unlockDomMutation$1();
    }

    parentNode.removeChild(vnode.elm);

    {
      lockDomMutation$1();
    }
  }

  function createElmHook$1(vnode) {
    modEvents$1.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs$1.create(vnode);
    modProps$1.create(vnode);
    modStaticClassName$1.create(vnode);
    modStaticStyle$1.create(vnode);
    modComputedClassName$1.create(vnode);
    modComputedStyle$1.create(vnode);
    contextModule.create(vnode);
  }

  var LWCDOMMode$1;

  (function (LWCDOMMode) {
    LWCDOMMode["manual"] = "manual";
  })(LWCDOMMode$1 || (LWCDOMMode$1 = {}));

  function fallbackElmHook$1(vnode) {
    const {
      owner
    } = vnode;
    const elm = vnode.elm;

    if (isTrue$1$1(useSyntheticShadow$1)) {
      const {
        data: {
          context
        }
      } = vnode;
      const {
        shadowAttribute
      } = owner.context;

      if (!isUndefined$3(context) && !isUndefined$3(context.lwc) && context.lwc.dom === LWCDOMMode$1.manual) {
        // this element will now accept any manual content inserted into it
        observeElementChildNodes$1(elm);
      } // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.


      setElementShadowToken$1(elm, shadowAttribute);
    }

    {
      const {
        data: {
          context
        }
      } = vnode;
      const isPortal = !isUndefined$3(context) && !isUndefined$3(context.lwc) && context.lwc.dom === LWCDOMMode$1.manual;
      patchElementWithRestrictions$1(elm, {
        isPortal
      });
    }
  }

  function updateElmHook$1(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs$1.update(oldVnode, vnode);
    modProps$1.update(oldVnode, vnode);
    modComputedClassName$1.update(oldVnode, vnode);
    modComputedStyle$1.update(oldVnode, vnode);
  }

  function insertCustomElmHook$1(vnode) {
    const vm = getAssociatedVM$1(vnode.elm);
    appendVM$1(vm);
  }

  function updateChildrenHook$1(oldVnode, vnode) {
    const {
      children,
      owner
    } = vnode;
    const fn = hasDynamicChildren$1(children) ? updateDynamicChildren$1 : updateStaticChildren$1;
    runWithBoundaryProtection$1(owner, owner.owner, noop$3, () => {
      fn(vnode.elm, oldVnode.children, children);
    }, noop$3);
  }

  function allocateChildrenHook$1(vnode) {
    const vm = getAssociatedVM$1(vnode.elm);
    const {
      children
    } = vnode;
    vm.aChildren = children;

    if (isTrue$1$1(useSyntheticShadow$1)) {
      // slow path
      allocateInSlot$1(vm, children); // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!

      vnode.children = EmptyArray$1;
    }
  }

  function createViewModelHook$1(vnode) {
    const elm = vnode.elm;

    if (!isUndefined$3(getAssociatedVMIfPresent$1(elm))) {
      // There is a possibility that a custom element is registered under tagName,
      // in which case, the initialization is already carry on, and there is nothing else
      // to do here since this hook is called right after invoking `document.createElement`.
      return;
    }

    const {
      mode,
      ctor,
      owner
    } = vnode;
    const def = getComponentDef$1(ctor);
    setElementProto$1(elm, def);

    if (isTrue$1$1(useSyntheticShadow$1)) {
      const {
        shadowAttribute
      } = owner.context; // when running in synthetic shadow mode, we need to set the shadowToken value
      // into each element from the template, so they can be styled accordingly.

      setElementShadowToken$1(elm, shadowAttribute);
    }

    createVM$1(elm, ctor, {
      mode,
      owner
    });

    {
      assert$1.isTrue(isArray$1$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
    }

    {
      patchCustomElementWithRestrictions$1(elm, EmptyObject$1);
    }
  }

  function createCustomElmHook$1(vnode) {
    modEvents$1.create(vnode); // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.

    modAttrs$1.create(vnode);
    modProps$1.create(vnode);
    modStaticClassName$1.create(vnode);
    modStaticStyle$1.create(vnode);
    modComputedClassName$1.create(vnode);
    modComputedStyle$1.create(vnode);
    contextModule.create(vnode);
  }

  function createChildrenHook$1(vnode) {
    const {
      elm,
      children
    } = vnode;

    for (let j = 0; j < children.length; ++j) {
      const ch = children[j];

      if (ch != null) {
        ch.hook.create(ch);
        ch.hook.insert(ch, elm, null);
      }
    }
  }

  function rerenderCustomElmHook$1(vnode) {
    const vm = getAssociatedVM$1(vnode.elm);

    {
      assert$1.isTrue(isArray$1$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
    }

    rerenderVM$1(vm);
  }

  function updateCustomElmHook$1(oldVnode, vnode) {
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    modAttrs$1.update(oldVnode, vnode);
    modProps$1.update(oldVnode, vnode);
    modComputedClassName$1.update(oldVnode, vnode);
    modComputedStyle$1.update(oldVnode, vnode);
  }

  function removeElmHook$1(vnode) {
    // this method only needs to search on child vnodes from template
    // to trigger the remove hook just in case some of those children
    // are custom elements.
    const {
      children,
      elm
    } = vnode;

    for (let j = 0, len = children.length; j < len; ++j) {
      const ch = children[j];

      if (!isNull$1(ch)) {
        ch.hook.remove(ch, elm);
      }
    }
  }

  function removeCustomElmHook$1(vnode) {
    // for custom elements we don't have to go recursively because the removeVM routine
    // will take care of disconnecting any child VM attached to its shadow as well.
    removeVM$1(getAssociatedVM$1(vnode.elm));
  } // Using a WeakMap instead of a WeakSet because this one works in IE11 :(


  const FromIteration$1 = new WeakMap(); // dynamic children means it was generated by an iteration
  // in a template, and will require a more complex diffing algo.

  function markAsDynamicChildren$1(children) {
    FromIteration$1.set(children, 1);
  }

  function hasDynamicChildren$1(children) {
    return FromIteration$1.has(children);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const Services$1 = create$3(null);

  function invokeServiceHook$1(vm, cbs) {
    {
      assert$1.isTrue(isArray$1$1(cbs) && cbs.length > 0, `Optimize invokeServiceHook() to be invoked only when needed`);
    }

    const {
      component,
      data,
      def,
      context
    } = vm;

    for (let i = 0, len = cbs.length; i < len; ++i) {
      cbs[i].call(undefined, component, data, def, context);
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CHAR_S$1 = 115;
  const CHAR_V$1 = 118;
  const CHAR_G$1 = 103;
  const NamespaceAttributeForSVG$1 = 'http://www.w3.org/2000/svg';
  const SymbolIterator$1 = Symbol.iterator;
  const TextHook$1 = {
    create: vnode => {
      vnode.elm = document.createTextNode(vnode.text);
      linkNodeToShadow$1(vnode);

      {
        markNodeFromVNode(vnode.elm);
      }
    },
    update: updateNodeHook$1,
    insert: insertNodeHook$1,
    move: insertNodeHook$1,
    remove: removeNodeHook$1
  };
  const CommentHook = {
    create: vnode => {
      vnode.elm = document.createComment(vnode.text);
      linkNodeToShadow$1(vnode);

      {
        markNodeFromVNode(vnode.elm);
      }
    },
    update: updateNodeHook$1,
    insert: insertNodeHook$1,
    move: insertNodeHook$1,
    remove: removeNodeHook$1
  }; // insert is called after update, which is used somewhere else (via a module)
  // to mark the vm as inserted, that means we cannot use update as the main channel
  // to rehydrate when dirty, because sometimes the element is not inserted just yet,
  // which breaks some invariants. For that reason, we have the following for any
  // Custom Element that is inserted via a template.

  const ElementHook$1 = {
    create: vnode => {
      const {
        data,
        sel,
        clonedElement
      } = vnode;
      const {
        ns
      } = data; // TODO [#1364]: supporting the ability to inject a cloned StyleElement via a vnode this is
      // used for style tags for native shadow

      if (isUndefined$3(clonedElement)) {
        vnode.elm = isUndefined$3(ns) ? document.createElement(sel) : document.createElementNS(ns, sel);
      } else {
        vnode.elm = clonedElement;
      }

      linkNodeToShadow$1(vnode);

      {
        markNodeFromVNode(vnode.elm);
      }

      fallbackElmHook$1(vnode);
      createElmHook$1(vnode);
    },
    update: (oldVnode, vnode) => {
      updateElmHook$1(oldVnode, vnode);
      updateChildrenHook$1(oldVnode, vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook$1(vnode, parentNode, referenceNode);
      createChildrenHook$1(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook$1(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook$1(vnode, parentNode);
      removeElmHook$1(vnode);
    }
  };
  const CustomElementHook$1 = {
    create: vnode => {
      const {
        sel
      } = vnode;
      vnode.elm = document.createElement(sel);
      linkNodeToShadow$1(vnode);

      {
        markNodeFromVNode(vnode.elm);
      }

      createViewModelHook$1(vnode);
      allocateChildrenHook$1(vnode);
      createCustomElmHook$1(vnode);
    },
    update: (oldVnode, vnode) => {
      updateCustomElmHook$1(oldVnode, vnode); // in fallback mode, the allocation will always set children to
      // empty and delegate the real allocation to the slot elements

      allocateChildrenHook$1(vnode); // in fallback mode, the children will be always empty, so, nothing
      // will happen, but in native, it does allocate the light dom

      updateChildrenHook$1(oldVnode, vnode); // this will update the shadowRoot

      rerenderCustomElmHook$1(vnode);
    },
    insert: (vnode, parentNode, referenceNode) => {
      insertNodeHook$1(vnode, parentNode, referenceNode);
      const vm = getAssociatedVM$1(vnode.elm);

      {
        assert$1.isTrue(vm.state === VMState$1.created, `${vm} cannot be recycled.`);
      }

      runConnectedCallback$1(vm);
      createChildrenHook$1(vnode);
      insertCustomElmHook$1(vnode);
    },
    move: (vnode, parentNode, referenceNode) => {
      insertNodeHook$1(vnode, parentNode, referenceNode);
    },
    remove: (vnode, parentNode) => {
      removeNodeHook$1(vnode, parentNode);
      removeCustomElmHook$1(vnode);
    }
  };

  function linkNodeToShadow$1(vnode) {
    // TODO [#1164]: this should eventually be done by the polyfill directly
    vnode.elm.$shadowResolver$ = vnode.owner.cmpRoot.$shadowResolver$;
  } // TODO [#1136]: this should be done by the compiler, adding ns to every sub-element


  function addNS$1(vnode) {
    const {
      data,
      children,
      sel
    } = vnode;
    data.ns = NamespaceAttributeForSVG$1; // TODO [#1275]: review why `sel` equal `foreignObject` should get this `ns`

    if (isArray$1$1(children) && sel !== 'foreignObject') {
      for (let j = 0, n = children.length; j < n; ++j) {
        const childNode = children[j];

        if (childNode != null && childNode.hook === ElementHook$1) {
          addNS$1(childNode);
        }
      }
    }
  }

  function addVNodeToChildLWC$1(vnode) {
    ArrayPush$3.call(getVMBeingRendered$1().velements, vnode);
  } // [h]tml node


  function h$1(sel, data, children) {
    const vmBeingRendered = getVMBeingRendered$1();

    {
      assert$1.isTrue(isString$1(sel), `h() 1st argument sel must be a string.`);
      assert$1.isTrue(isObject$1$1(data), `h() 2nd argument data must be an object.`);
      assert$1.isTrue(isArray$1$1(children), `h() 3rd argument children must be an array.`);
      assert$1.isTrue('key' in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`); // checking reserved internal data properties

      assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
      assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

      if (data.style && !isString$1(data.style)) {
        logError$1(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
      }

      forEach$1.call(children, childVnode => {
        if (childVnode != null) {
          assert$1.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
        }
      });
    }

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: ElementHook$1,
      owner: vmBeingRendered
    };

    if (sel.length === 3 && StringCharCodeAt$1.call(sel, 0) === CHAR_S$1 && StringCharCodeAt$1.call(sel, 1) === CHAR_V$1 && StringCharCodeAt$1.call(sel, 2) === CHAR_G$1) {
      addNS$1(vnode);
    }

    return vnode;
  } // [t]ab[i]ndex function


  function ti$1(value) {
    // if value is greater than 0, we normalize to 0
    // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
    // If value is less than -1, we don't care
    const shouldNormalize = value > 0 && !(isTrue$1$1(value) || isFalse$1$1(value));

    {
      const vmBeingRendered = getVMBeingRendered$1();

      if (shouldNormalize) {
        logError$1(`Invalid tabindex value \`${toString$2(value)}\` in template for ${vmBeingRendered}. This attribute must be set to 0 or -1.`, vmBeingRendered);
      }
    }

    return shouldNormalize ? 0 : value;
  } // [s]lot element node


  function s$1(slotName, data, children, slotset) {
    {
      assert$1.isTrue(isString$1(slotName), `s() 1st argument slotName must be a string.`);
      assert$1.isTrue(isObject$1$1(data), `s() 2nd argument data must be an object.`);
      assert$1.isTrue(isArray$1$1(children), `h() 3rd argument children must be an array.`);
    }

    if (!isUndefined$3(slotset) && !isUndefined$3(slotset[slotName]) && slotset[slotName].length !== 0) {
      children = slotset[slotName];
    }

    const vnode = h$1('slot', data, children);

    if (useSyntheticShadow$1) {
      // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
      sc$1(children);
    }

    return vnode;
  } // [c]ustom element node


  function c$1(sel, Ctor, data, children = EmptyArray$1) {
    if (isCircularModuleDependency$1(Ctor)) {
      Ctor = resolveCircularModuleDependency$1(Ctor);
    }

    const vmBeingRendered = getVMBeingRendered$1();

    {
      assert$1.isTrue(isString$1(sel), `c() 1st argument sel must be a string.`);
      assert$1.isTrue(isFunction$2(Ctor), `c() 2nd argument Ctor must be a function.`);
      assert$1.isTrue(isObject$1$1(data), `c() 3nd argument data must be an object.`);
      assert$1.isTrue(arguments.length === 3 || isArray$1$1(children), `c() 4nd argument data must be an array.`); // checking reserved internal data properties

      assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
      assert$1.isFalse(data.styleMap && data.style, `vnode.data.styleMap and vnode.data.style ambiguous declaration.`);

      if (data.style && !isString$1(data.style)) {
        logError$1(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
      }

      if (arguments.length === 4) {
        forEach$1.call(children, childVnode => {
          if (childVnode != null) {
            assert$1.isTrue(childVnode && 'sel' in childVnode && 'data' in childVnode && 'children' in childVnode && 'text' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
          }
        });
      }
    }

    const {
      key
    } = data;
    let text, elm;
    const vnode = {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: CustomElementHook$1,
      ctor: Ctor,
      owner: vmBeingRendered,
      mode: 'open'
    };
    addVNodeToChildLWC$1(vnode);
    return vnode;
  } // [i]terable node


  function i$1(iterable, factory) {
    const list = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc$1(list);
    const vmBeingRendered = getVMBeingRendered$1();

    if (isUndefined$3(iterable) || iterable === null) {
      {
        logError$1(`Invalid template iteration for value "${toString$2(iterable)}" in ${vmBeingRendered}. It must be an Array or an iterable Object.`, vmBeingRendered);
      }

      return list;
    }

    {
      assert$1.isFalse(isUndefined$3(iterable[SymbolIterator$1]), `Invalid template iteration for value \`${toString$2(iterable)}\` in ${vmBeingRendered}. It must be an array-like object and not \`null\` nor \`undefined\`.`);
    }

    const iterator = iterable[SymbolIterator$1]();

    {
      assert$1.isTrue(iterator && isFunction$2(iterator.next), `Invalid iterator function for "${toString$2(iterable)}" in ${vmBeingRendered}.`);
    }

    let next = iterator.next();
    let j = 0;
    let {
      value,
      done: last
    } = next;
    let keyMap;
    let iterationError;

    {
      keyMap = create$3(null);
    }

    while (last === false) {
      // implementing a look-back-approach because we need to know if the element is the last
      next = iterator.next();
      last = next.done; // template factory logic based on the previous collected value

      const vnode = factory(value, j, j === 0, last);

      if (isArray$1$1(vnode)) {
        ArrayPush$3.apply(list, vnode);
      } else {
        ArrayPush$3.call(list, vnode);
      }

      {
        const vnodes = isArray$1$1(vnode) ? vnode : [vnode];
        forEach$1.call(vnodes, childVnode => {
          if (!isNull$1(childVnode) && isObject$1$1(childVnode) && !isUndefined$3(childVnode.sel)) {
            const {
              key
            } = childVnode;

            if (isString$1(key) || isNumber$1(key)) {
              if (keyMap[key] === 1 && isUndefined$3(iterationError)) {
                iterationError = `Duplicated "key" attribute value for "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. A key with value "${childVnode.key}" appears more than once in the iteration. Key values must be unique numbers or strings.`;
              }

              keyMap[key] = 1;
            } else if (isUndefined$3(iterationError)) {
              iterationError = `Invalid "key" attribute value in "<${childVnode.sel}>" in ${vmBeingRendered} for item number ${j}. Set a unique "key" value on all iterated child elements.`;
            }
          }
        });
      } // preparing next value


      j += 1;
      value = next.value;
    }

    {
      if (!isUndefined$3(iterationError)) {
        logError$1(iterationError, vmBeingRendered);
      }
    }

    return list;
  }
  /**
   * [f]lattening
   */


  function f$1(items) {
    {
      assert$1.isTrue(isArray$1$1(items), 'flattening api can only work with arrays.');
    }

    const len = items.length;
    const flattened = []; // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic

    sc$1(flattened);

    for (let j = 0; j < len; j += 1) {
      const item = items[j];

      if (isArray$1$1(item)) {
        ArrayPush$3.apply(flattened, item);
      } else {
        ArrayPush$3.call(flattened, item);
      }
    }

    return flattened;
  } // [t]ext node


  function t$1(text) {
    const data = EmptyObject$1;
    let sel, children, key, elm;
    return {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: TextHook$1,
      owner: getVMBeingRendered$1()
    };
  } // comment node


  function p(text) {
    const data = EmptyObject$1;
    const sel = '!';
    let children, key, elm;
    return {
      sel,
      data,
      children,
      text,
      elm,
      key,
      hook: CommentHook,
      owner: getVMBeingRendered$1()
    };
  } // [d]ynamic value to produce a text vnode


  function d$1(value) {
    if (value == null) {
      return null;
    }

    return t$1(value);
  } // [b]ind function


  function b$1(fn) {
    const vmBeingRendered = getVMBeingRendered$1();

    if (isNull$1(vmBeingRendered)) {
      throw new Error();
    }

    const vm = vmBeingRendered;
    return function (event) {
      invokeEventListener$1(vm, fn, vm.component, event);
    };
  } // [f]unction_[b]ind


  function fb(fn) {
    const vmBeingRendered = getVMBeingRendered$1();

    if (isNull$1(vmBeingRendered)) {
      throw new Error();
    }

    const vm = vmBeingRendered;
    return function () {
      return invokeComponentCallback$1(vm, fn, ArraySlice$1$1.call(arguments));
    };
  } // [l]ocator_[l]istener function


  function ll(originalHandler, id, context) {
    const vm = getVMBeingRendered$1();

    if (isNull$1(vm)) {
      throw new Error();
    } // bind the original handler with b() so we can call it
    // after resolving the locator


    const eventListener = b$1(originalHandler); // create a wrapping handler to resolve locator, and
    // then invoke the original handler.

    return function (event) {
      // located service for the locator metadata
      const {
        context: {
          locator
        }
      } = vm;

      if (!isUndefined$3(locator)) {
        const {
          locator: locatorService
        } = Services$1;

        if (locatorService) {
          locator.resolved = {
            target: id,
            host: locator.id,
            targetContext: isFunction$2(context) && context(),
            hostContext: isFunction$2(locator.context) && locator.context()
          }; // a registered `locator` service will be invoked with
          // access to the context.locator.resolved, which will contain:
          // outer id, outer context, inner id, and inner context

          invokeServiceHook$1(vm, locatorService);
        }
      } // invoke original event listener via b()


      eventListener(event);
    };
  } // [k]ey function


  function k$1(compilerKey, obj) {
    switch (typeof obj) {
      case 'number':
      case 'string':
        return compilerKey + ':' + obj;

      case 'object':
        {
          assert$1.fail(`Invalid key value "${obj}" in ${getVMBeingRendered$1()}. Key must be a string or number.`);
        }

    }
  } // [g]lobal [id] function


  function gid$1(id) {
    const vmBeingRendered = getVMBeingRendered$1();

    if (isUndefined$3(id) || id === '') {
      {
        logError$1(`Invalid id value "${id}". The id attribute must contain a non-empty string.`, vmBeingRendered);
      }

      return id;
    } // We remove attributes when they are assigned a value of null


    if (isNull$1(id)) {
      return null;
    }

    return `${id}-${vmBeingRendered.idx}`;
  } // [f]ragment [id] function


  function fid$1(url) {
    const vmBeingRendered = getVMBeingRendered$1();

    if (isUndefined$3(url) || url === '') {
      {
        if (isUndefined$3(url)) {
          logError$1(`Undefined url value for "href" or "xlink:href" attribute. Expected a non-empty string.`, vmBeingRendered);
        }
      }

      return url;
    } // We remove attributes when they are assigned a value of null


    if (isNull$1(url)) {
      return null;
    } // Apply transformation only for fragment-only-urls


    if (/^#/.test(url)) {
      return `${url}-${vmBeingRendered.idx}`;
    }

    return url;
  }
  /**
   * Map to store an index value assigned to any dynamic component reference ingested
   * by dc() api. This allows us to generate a unique unique per template per dynamic
   * component reference to avoid diffing algo mismatches.
   */


  const DynamicImportedComponentMap$1 = new Map();
  let dynamicImportedComponentCounter$1 = 0;
  /**
   * create a dynamic component via `<x-foo lwc:dynamic={Ctor}>`
   */

  function dc$1(sel, Ctor, data, children) {
    {
      assert$1.isTrue(isString$1(sel), `dc() 1st argument sel must be a string.`);
      assert$1.isTrue(isObject$1$1(data), `dc() 3nd argument data must be an object.`);
      assert$1.isTrue(arguments.length === 3 || isArray$1$1(children), `dc() 4nd argument data must be an array.`);
    } // null or undefined values should produce a null value in the VNodes


    if (Ctor == null) {
      return null;
    }

    if (!isComponentConstructor$1(Ctor)) {
      throw new Error(`Invalid LWC Constructor ${toString$2(Ctor)} for custom element <${sel}>.`);
    }

    let idx = DynamicImportedComponentMap$1.get(Ctor);

    if (isUndefined$3(idx)) {
      idx = dynamicImportedComponentCounter$1++;
      DynamicImportedComponentMap$1.set(Ctor, idx);
    } // the new vnode key is a mix of idx and compiler key, this is required by the diffing algo
    // to identify different constructors as vnodes with different keys to avoid reusing the
    // element used for previous constructors.


    data.key = `dc:${idx}:${data.key}`;
    return c$1(sel, Ctor, data, children);
  }
  /**
   * slow children collection marking mechanism. this API allows the compiler to signal
   * to the engine that a particular collection of children must be diffed using the slow
   * algo based on keys due to the nature of the list. E.g.:
   *
   *   - slot element's children: the content of the slot has to be dynamic when in synthetic
   *                              shadow mode because the `vnode.children` might be the slotted
   *                              content vs default content, in which case the size and the
   *                              keys are not matching.
   *   - children that contain dynamic components
   *   - children that are produced by iteration
   *
   */


  function sc$1(vnodes) {
    {
      assert$1.isTrue(isArray$1$1(vnodes), 'sc() api can only work with arrays.');
    } // We have to mark the vnodes collection as dynamic so we can later on
    // choose to use the snabbdom virtual dom diffing algo instead of our
    // static dummy algo.


    markAsDynamicChildren$1(vnodes);
    return vnodes;
  }

  var api$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    h: h$1,
    ti: ti$1,
    s: s$1,
    c: c$1,
    i: i$1,
    f: f$1,
    t: t$1,
    p: p,
    d: d$1,
    b: b$1,
    fb: fb,
    ll: ll,
    k: k$1,
    gid: gid$1,
    fid: fid$1,
    dc: dc$1,
    sc: sc$1
  });
  const signedTemplateSet$1 = new Set();

  function defaultEmptyTemplate$1() {
    return [];
  }

  signedTemplateSet$1.add(defaultEmptyTemplate$1);

  function isTemplateRegistered$1(tpl) {
    return signedTemplateSet$1.has(tpl);
  }
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */


  function registerTemplate$1(tpl) {
    signedTemplateSet$1.add(tpl); // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation

    return tpl;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CachedStyleFragments$1 = create$3(null);

  function createStyleElement$1(styleContent) {
    const elm = document.createElement('style');
    elm.type = 'text/css';
    elm.textContent = styleContent;
    return elm;
  }

  function getCachedStyleElement$1(styleContent) {
    let fragment = CachedStyleFragments$1[styleContent];

    if (isUndefined$3(fragment)) {
      fragment = document.createDocumentFragment();
      const styleElm = createStyleElement$1(styleContent);
      fragment.appendChild(styleElm);
      CachedStyleFragments$1[styleContent] = fragment;
    }

    return fragment.cloneNode(true).firstChild;
  }

  const globalStyleParent$1 = document.head || document.body || document;
  const InsertedGlobalStyleContent$1 = create$3(null);

  function insertGlobalStyle$1(styleContent) {
    // inserts the global style when needed, otherwise does nothing
    if (isUndefined$3(InsertedGlobalStyleContent$1[styleContent])) {
      InsertedGlobalStyleContent$1[styleContent] = true;
      const elm = createStyleElement$1(styleContent);
      globalStyleParent$1.appendChild(elm);
    }
  }

  function createStyleVNode$1(elm) {
    const vnode = h$1('style', {
      key: 'style'
    }, EmptyArray$1); // TODO [#1364]: supporting the ability to inject a cloned StyleElement
    // forcing the diffing algo to use the cloned style for native shadow

    vnode.clonedElement = elm;
    return vnode;
  }
  /**
   * Reset the styling token applied to the host element.
   */


  function resetStyleAttributes$1(vm) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    const oldHostAttribute = context.hostAttribute;

    if (!isUndefined$3(oldHostAttribute)) {
      removeAttribute$1.call(elm, oldHostAttribute);
    } // Reset the scoping attributes associated to the context.


    context.hostAttribute = context.shadowAttribute = undefined;
  }
  /**
   * Apply/Update the styling token applied to the host element.
   */


  function applyStyleAttributes$1(vm, hostAttribute, shadowAttribute) {
    const {
      context,
      elm
    } = vm; // Remove the style attribute currently applied to the host element.

    setAttribute$1.call(elm, hostAttribute, '');
    context.hostAttribute = hostAttribute;
    context.shadowAttribute = shadowAttribute;
  }

  function collectStylesheets$1(stylesheets, hostSelector, shadowSelector, isNative, aggregatorFn) {
    forEach$1.call(stylesheets, sheet => {
      if (isArray$1$1(sheet)) {
        collectStylesheets$1(sheet, hostSelector, shadowSelector, isNative, aggregatorFn);
      } else {
        aggregatorFn(sheet(hostSelector, shadowSelector, isNative));
      }
    });
  }

  function evaluateCSS$1(stylesheets, hostAttribute, shadowAttribute) {
    {
      assert$1.isTrue(isArray$1$1(stylesheets), `Invalid stylesheets.`);
    }

    if (useSyntheticShadow$1) {
      const hostSelector = `[${hostAttribute}]`;
      const shadowSelector = `[${shadowAttribute}]`;
      collectStylesheets$1(stylesheets, hostSelector, shadowSelector, false, textContent => {
        insertGlobalStyle$1(textContent);
      });
      return null;
    } else {
      // Native shadow in place, we need to act accordingly by using the `:host` selector, and an
      // empty shadow selector since it is not really needed.
      let buffer = '';
      collectStylesheets$1(stylesheets, emptyString$1, emptyString$1, true, textContent => {
        buffer += textContent;
      });
      return createStyleVNode$1(getCachedStyleElement$1(buffer));
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  var GlobalMeasurementPhase$1;

  (function (GlobalMeasurementPhase) {
    GlobalMeasurementPhase["REHYDRATE"] = "lwc-rehydrate";
    GlobalMeasurementPhase["HYDRATE"] = "lwc-hydrate";
  })(GlobalMeasurementPhase$1 || (GlobalMeasurementPhase$1 = {})); // Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
  // JSDom (used in Jest) for example doesn't implement the UserTiming APIs.


  const isUserTimingSupported$1 = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

  function getMarkName$1(phase, vm) {
    // Adding the VM idx to the mark name creates a unique mark name component instance. This is necessary to produce
    // the right measures for components that are recursive.
    return `${getComponentTag$1(vm)} - ${phase} - ${vm.idx}`;
  }

  function getMeasureName$1(phase, vm) {
    return `${getComponentTag$1(vm)} - ${phase}`;
  }

  function start$1(markName) {
    performance.mark(markName);
  }

  function end$1(measureName, markName) {
    performance.measure(measureName, markName); // Clear the created marks and measure to avoid filling the performance entries buffer.
    // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.

    performance.clearMarks(markName);
    performance.clearMarks(measureName);
  }

  function noop$1$1() {
    /* do nothing */
  }

  const startMeasure$1 = !isUserTimingSupported$1 ? noop$1$1 : function (phase, vm) {
    const markName = getMarkName$1(phase, vm);
    start$1(markName);
  };
  const endMeasure$1 = !isUserTimingSupported$1 ? noop$1$1 : function (phase, vm) {
    const markName = getMarkName$1(phase, vm);
    const measureName = getMeasureName$1(phase, vm);
    end$1(measureName, markName);
  };
  const startGlobalMeasure$1 = !isUserTimingSupported$1 ? noop$1$1 : function (phase, vm) {
    const markName = isUndefined$3(vm) ? phase : getMarkName$1(phase, vm);
    start$1(markName);
  };
  const endGlobalMeasure$1 = !isUserTimingSupported$1 ? noop$1$1 : function (phase, vm) {
    const markName = isUndefined$3(vm) ? phase : getMarkName$1(phase, vm);
    end$1(phase, markName);
  };
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  let isUpdatingTemplate$1 = false;
  let vmBeingRendered$1 = null;

  function getVMBeingRendered$1() {
    return vmBeingRendered$1;
  }

  function setVMBeingRendered$1(vm) {
    vmBeingRendered$1 = vm;
  }

  function isVMBeingRendered$1(vm) {
    return vm === vmBeingRendered$1;
  }

  const EmptySlots$1 = create$3(null);

  function validateSlots$1(vm, html) {

    const {
      cmpSlots = EmptySlots$1
    } = vm;
    const {
      slots = EmptyArray$1
    } = html;

    for (const slotName in cmpSlots) {
      // eslint-disable-next-line lwc-internal/no-production-assert
      assert$1.isTrue(isArray$1$1(cmpSlots[slotName]), `Slots can only be set to an array, instead received ${toString$2(cmpSlots[slotName])} for slot "${slotName}" in ${vm}.`);

      if (slotName !== '' && ArrayIndexOf$2.call(slots, slotName) === -1) {
        // TODO [#1297]: this should never really happen because the compiler should always validate
        // eslint-disable-next-line lwc-internal/no-production-assert
        logError$1(`Ignoring unknown provided slot name "${slotName}" in ${vm}. Check for a typo on the slot attribute.`, vm);
      }
    }
  }

  function validateFields$1(vm, html) {

    const {
      component
    } = vm; // validating identifiers used by template that should be provided by the component

    const {
      ids = []
    } = html;
    forEach$1.call(ids, propName => {
      if (!(propName in component)) {
        // eslint-disable-next-line lwc-internal/no-production-assert
        logError$1(`The template rendered by ${vm} references \`this.${propName}\`, which is not declared. Check for a typo in the template.`, vm);
      }
    });
  }

  function evaluateTemplate$1(vm, html) {
    {
      assert$1.isTrue(isFunction$2(html), `evaluateTemplate() second argument must be an imported template instead of ${toString$2(html)}`);
    }

    const isUpdatingTemplateInception = isUpdatingTemplate$1;
    const vmOfTemplateBeingUpdatedInception = vmBeingRendered$1;
    let vnodes = [];
    runWithBoundaryProtection$1(vm, vm.owner, () => {
      // pre
      vmBeingRendered$1 = vm;

      {
        startMeasure$1('render', vm);
      }
    }, () => {
      // job
      const {
        component,
        context,
        cmpSlots,
        cmpTemplate,
        tro
      } = vm;
      tro.observe(() => {
        // reset the cache memoizer for template when needed
        if (html !== cmpTemplate) {
          // perf opt: do not reset the shadow root during the first rendering (there is nothing to reset)
          if (!isUndefined$3(cmpTemplate)) {
            // It is important to reset the content to avoid reusing similar elements generated from a different
            // template, because they could have similar IDs, and snabbdom just rely on the IDs.
            resetShadowRoot$1(vm);
          } // Check that the template was built by the compiler


          if (isUndefined$3(html) || !isTemplateRegistered$1(html)) {
            throw new TypeError(`Invalid template returned by the render() method on ${vm}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString$2(html)}.`);
          }

          vm.cmpTemplate = html; // Populate context with template information

          context.tplCache = create$3(null);
          resetStyleAttributes$1(vm);
          const {
            stylesheets,
            stylesheetTokens
          } = html;

          if (isUndefined$3(stylesheets) || stylesheets.length === 0) {
            context.styleVNode = null;
          } else if (!isUndefined$3(stylesheetTokens)) {
            const {
              hostAttribute,
              shadowAttribute
            } = stylesheetTokens;
            applyStyleAttributes$1(vm, hostAttribute, shadowAttribute); // Caching style vnode so it can be reused on every render

            context.styleVNode = evaluateCSS$1(stylesheets, hostAttribute, shadowAttribute);
          }

          if ("development" !== 'production') {
            // one time operation for any new template returned by render()
            // so we can warn if the template is attempting to use a binding
            // that is not provided by the component instance.
            validateFields$1(vm, html);
          }
        }

        if ("development" !== 'production') {
          assert$1.isTrue(isObject$1$1(context.tplCache), `vm.context.tplCache must be an object associated to ${cmpTemplate}.`); // validating slots in every rendering since the allocated content might change over time

          validateSlots$1(vm, html);
        } // right before producing the vnodes, we clear up all internal references
        // to custom elements from the template.


        vm.velements = []; // Set the global flag that template is being updated

        isUpdatingTemplate$1 = true;
        vnodes = html.call(undefined, api$1, component, cmpSlots, context.tplCache);
        const {
          styleVNode
        } = context;

        if (!isNull$1(styleVNode)) {
          ArrayUnshift$1$1.call(vnodes, styleVNode);
        }
      });
    }, () => {
      // post
      isUpdatingTemplate$1 = isUpdatingTemplateInception;
      vmBeingRendered$1 = vmOfTemplateBeingUpdatedInception;

      {
        endMeasure$1('render', vm);
      }
    });

    {
      assert$1.invariant(isArray$1$1(vnodes), `Compiler should produce html functions that always return an array.`);
    }

    return vnodes;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  let isInvokingRender$1 = false;
  let vmBeingConstructed$1 = null;

  function isBeingConstructed$1(vm) {
    return vmBeingConstructed$1 === vm;
  }

  let vmInvokingRenderedCallback$1 = null;

  function isInvokingRenderedCallback$1(vm) {
    return vmInvokingRenderedCallback$1 === vm;
  }

  const noop$2$1 = () => void 0;

  function invokeComponentCallback$1(vm, fn, args) {
    const {
      component,
      callHook,
      owner
    } = vm;
    let result;
    runWithBoundaryProtection$1(vm, owner, noop$2$1, () => {
      // job
      result = callHook(component, fn, args);
    }, noop$2$1);
    return result;
  }

  function invokeComponentConstructor$1(vm, Ctor) {
    const vmBeingConstructedInception = vmBeingConstructed$1;
    let error;

    {
      startMeasure$1('constructor', vm);
    }

    vmBeingConstructed$1 = vm;
    /**
     * Constructors don't need to be wrapped with a boundary because for root elements
     * it should throw, while elements from template are already wrapped by a boundary
     * associated to the diffing algo.
     */

    try {
      // job
      const result = new Ctor(); // Check indirectly if the constructor result is an instance of LightningElement. Using
      // the "instanceof" operator would not work here since Locker Service provides its own
      // implementation of LightningElement, so we indirectly check if the base constructor is
      // invoked by accessing the component on the vm.

      if (vmBeingConstructed$1.component !== result) {
        throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
      }
    } catch (e) {
      error = Object(e);
    } finally {
      {
        endMeasure$1('constructor', vm);
      }

      vmBeingConstructed$1 = vmBeingConstructedInception;

      if (!isUndefined$3(error)) {
        error.wcStack = getErrorComponentStack$1(vm); // re-throwing the original error annotated after restoring the context

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }
  }

  function invokeComponentRenderMethod$1(vm) {
    const {
      def: {
        render
      },
      callHook,
      component,
      owner
    } = vm;
    const isRenderBeingInvokedInception = isInvokingRender$1;
    const vmBeingRenderedInception = getVMBeingRendered$1();
    let html;
    let renderInvocationSuccessful = false;
    runWithBoundaryProtection$1(vm, owner, () => {
      // pre
      isInvokingRender$1 = true;
      setVMBeingRendered$1(vm);
    }, () => {
      // job
      vm.tro.observe(() => {
        html = callHook(component, render);
        renderInvocationSuccessful = true;
      });
    }, () => {
      // post
      isInvokingRender$1 = isRenderBeingInvokedInception;
      setVMBeingRendered$1(vmBeingRenderedInception);
    }); // If render() invocation failed, process errorCallback in boundary and return an empty template

    return renderInvocationSuccessful ? evaluateTemplate$1(vm, html) : [];
  }

  function invokeComponentRenderedCallback$1(vm) {
    const {
      def: {
        renderedCallback
      },
      component,
      callHook,
      owner
    } = vm;

    if (!isUndefined$3(renderedCallback)) {
      const vmInvokingRenderedCallbackInception = vmInvokingRenderedCallback$1;
      runWithBoundaryProtection$1(vm, owner, () => {
        vmInvokingRenderedCallback$1 = vm; // pre

        {
          startMeasure$1('renderedCallback', vm);
        }
      }, () => {
        // job
        callHook(component, renderedCallback);
      }, () => {
        // post
        {
          endMeasure$1('renderedCallback', vm);
        }

        vmInvokingRenderedCallback$1 = vmInvokingRenderedCallbackInception;
      });
    }
  }

  function invokeEventListener$1(vm, fn, thisValue, event) {
    const {
      callHook,
      owner
    } = vm;
    runWithBoundaryProtection$1(vm, owner, noop$2$1, () => {
      // job
      if ("development" !== 'production') {
        assert$1.isTrue(isFunction$2(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
      }

      callHook(thisValue, fn, [event]);
    }, noop$2$1);
  }
  /*
   * Copyright (c) 2019, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    create: create$1$1
  } = Object;
  const {
    splice: ArraySplice$1$1,
    indexOf: ArrayIndexOf$1$1,
    push: ArrayPush$1$1
  } = Array.prototype;
  const TargetToReactiveRecordMap$1 = new WeakMap();

  function isUndefined$1$1(obj) {
    return obj === undefined;
  }

  function getReactiveRecord$1(target) {
    let reactiveRecord = TargetToReactiveRecordMap$1.get(target);

    if (isUndefined$1$1(reactiveRecord)) {
      const newRecord = create$1$1(null);
      reactiveRecord = newRecord;
      TargetToReactiveRecordMap$1.set(target, newRecord);
    }

    return reactiveRecord;
  }

  let currentReactiveObserver$1 = null;

  function valueMutated$1(target, key) {
    const reactiveRecord = TargetToReactiveRecordMap$1.get(target);

    if (!isUndefined$1$1(reactiveRecord)) {
      const reactiveObservers = reactiveRecord[key];

      if (!isUndefined$1$1(reactiveObservers)) {
        for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
          const ro = reactiveObservers[i];
          ro.notify();
        }
      }
    }
  }

  function valueObserved$1(target, key) {
    // We should determine if an active Observing Record is present to track mutations.
    if (currentReactiveObserver$1 === null) {
      return;
    }

    const ro = currentReactiveObserver$1;
    const reactiveRecord = getReactiveRecord$1(target);
    let reactiveObservers = reactiveRecord[key];

    if (isUndefined$1$1(reactiveObservers)) {
      reactiveObservers = [];
      reactiveRecord[key] = reactiveObservers;
    } else if (reactiveObservers[0] === ro) {
      return; // perf optimization considering that most subscriptions will come from the same record
    }

    if (ArrayIndexOf$1$1.call(reactiveObservers, ro) === -1) {
      ro.link(reactiveObservers);
    }
  }

  class ReactiveObserver$1 {
    constructor(callback) {
      this.listeners = [];
      this.callback = callback;
    }

    observe(job) {
      const inceptionReactiveRecord = currentReactiveObserver$1;
      currentReactiveObserver$1 = this;
      let error;

      try {
        job();
      } catch (e) {
        error = Object(e);
      } finally {
        currentReactiveObserver$1 = inceptionReactiveRecord;

        if (error !== undefined) {
          throw error; // eslint-disable-line no-unsafe-finally
        }
      }
    }
    /**
     * This method is responsible for disconnecting the Reactive Observer
     * from any Reactive Record that has a reference to it, to prevent future
     * notifications about previously recorded access.
     */


    reset() {
      const {
        listeners
      } = this;
      const len = listeners.length;

      if (len > 0) {
        for (let i = 0; i < len; i += 1) {
          const set = listeners[i];
          const pos = ArrayIndexOf$1$1.call(listeners[i], this);
          ArraySplice$1$1.call(set, pos, 1);
        }

        listeners.length = 0;
      }
    } // friend methods


    notify() {
      this.callback.call(undefined, this);
    }

    link(reactiveObservers) {
      ArrayPush$1$1.call(reactiveObservers, this); // we keep track of observing records where the observing record was added to so we can do some clean up later on

      ArrayPush$1$1.call(this.listeners, reactiveObservers);
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedComponentToMetaMap$1 = new Map();
  /**
   * INTERNAL: This function can only be invoked by compiled code. The compiler
   * will prevent this function from being imported by userland code.
   */

  function registerComponent$1(Ctor, {
    name,
    tmpl: template
  }) {
    signedComponentToMetaMap$1.set(Ctor, {
      name,
      template
    }); // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation

    return Ctor;
  }

  function getComponentRegisteredMeta$1(Ctor) {
    return signedComponentToMetaMap$1.get(Ctor);
  }

  function createComponent$1(uninitializedVm, Ctor) {
    // create the component instance
    invokeComponentConstructor$1(uninitializedVm, Ctor);
    const initializedVm = uninitializedVm;

    if (isUndefined$3(initializedVm.component)) {
      throw new ReferenceError(`Invalid construction for ${Ctor}, you must extend LightningElement.`);
    }
  }

  function linkComponent$1(vm) {
    const {
      def: {
        wire
      }
    } = vm;

    if (!isUndefined$3(wire)) {
      const {
        wiring
      } = Services$1;

      if (wiring) {
        invokeServiceHook$1(vm, wiring);
      }
    }
  }

  function getTemplateReactiveObserver$1(vm) {
    return new ReactiveObserver$1(() => {
      {
        assert$1.invariant(!isInvokingRender$1, `Mutating property is not allowed during the rendering life-cycle of ${getVMBeingRendered$1()}.`);
        assert$1.invariant(!isUpdatingTemplate$1, `Mutating property is not allowed while updating template of ${getVMBeingRendered$1()}.`);
      }

      const {
        isDirty
      } = vm;

      if (isFalse$1$1(isDirty)) {
        markComponentAsDirty$1(vm);
        scheduleRehydration$1(vm);
      }
    });
  }

  function renderComponent$1(vm) {
    {
      assert$1.invariant(vm.isDirty, `${vm} is not dirty.`);
    }

    vm.tro.reset();
    const vnodes = invokeComponentRenderMethod$1(vm);
    vm.isDirty = false;
    vm.isScheduled = false;

    {
      assert$1.invariant(isArray$1$1(vnodes), `${vm}.render() should always return an array of vnodes instead of ${vnodes}`);
    }

    return vnodes;
  }

  function markComponentAsDirty$1(vm) {
    {
      const vmBeingRendered = getVMBeingRendered$1();
      assert$1.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
      assert$1.isFalse(isInvokingRender$1, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
      assert$1.isFalse(isUpdatingTemplate$1, `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`);
    }

    vm.isDirty = true;
  }

  const cmpEventListenerMap$1 = new WeakMap();

  function getWrappedComponentsListener$1(vm, listener) {
    if (!isFunction$2(listener)) {
      throw new TypeError(); // avoiding problems with non-valid listeners
    }

    let wrappedListener = cmpEventListenerMap$1.get(listener);

    if (isUndefined$3(wrappedListener)) {
      wrappedListener = function (event) {
        invokeEventListener$1(vm, listener, undefined, event);
      };

      cmpEventListenerMap$1.set(listener, wrappedListener);
    }

    return wrappedListener;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function createObservedFieldsDescriptorMap$1(fields) {
    return ArrayReduce$1.call(fields, (acc, field) => {
      acc[field] = createObservedFieldPropertyDescriptor$1(field);
      return acc;
    }, {});
  }

  function createObservedFieldPropertyDescriptor$1(key) {
    return {
      get() {
        const vm = getAssociatedVM$1(this);
        valueObserved$1(this, key);
        return vm.cmpTrack[key];
      },

      set(newValue) {
        const vm = getAssociatedVM$1(this);

        if (newValue !== vm.cmpTrack[key]) {
          vm.cmpTrack[key] = newValue;

          if (isFalse$1$1(vm.isDirty)) {
            valueMutated$1(this, key);
          }
        }
      },

      enumerable: true,
      configurable: true
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This is a descriptor map that contains
   * all standard properties that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base HTML Element and
   * Base Lightning Element should support.
   */


  const HTMLElementOriginalDescriptors$1 = create$3(null);
  forEach$1.call(ElementPrototypeAriaPropertyNames$1, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
    const descriptor = getPropertyDescriptor$1(HTMLElement.prototype, propName);

    if (!isUndefined$3(descriptor)) {
      HTMLElementOriginalDescriptors$1[propName] = descriptor;
    }
  });
  forEach$1.call(defaultDefHTMLPropertyNames$1, propName => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
    // this category, so, better to be sure.
    const descriptor = getPropertyDescriptor$1(HTMLElement.prototype, propName);

    if (!isUndefined$3(descriptor)) {
      HTMLElementOriginalDescriptors$1[propName] = descriptor;
    }
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const ShadowRootInnerHTMLSetter$1 = getOwnPropertyDescriptor$3(ShadowRoot.prototype, 'innerHTML').set;
  const dispatchEvent$1 = 'EventTarget' in window ? EventTarget.prototype.dispatchEvent : Node.prototype.dispatchEvent; // IE11

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /**
   * This operation is called with a descriptor of an standard html property
   * that a Custom Element can support (including AOM properties), which
   * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
   * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
   */

  function createBridgeToElementDescriptor$1(propName, descriptor) {
    const {
      get,
      set,
      enumerable,
      configurable
    } = descriptor;

    if (!isFunction$2(get)) {
      {
        assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
      }

      throw new TypeError();
    }

    if (!isFunction$2(set)) {
      {
        assert$1.fail(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
      }

      throw new TypeError();
    }

    return {
      enumerable,
      configurable,

      get() {
        const vm = getAssociatedVM$1(this);

        if (isBeingConstructed$1(vm)) {
          {
            const name = vm.elm.constructor.name;
            logError$1(`\`${name}\` constructor can't read the value of property \`${propName}\` because the owner component hasn't set the value yet. Instead, use the \`${name}\` constructor to set a default value for the property.`, vm);
          }

          return;
        }

        valueObserved$1(this, propName);
        return get.call(vm.elm);
      },

      set(newValue) {
        const vm = getAssociatedVM$1(this);

        {
          const vmBeingRendered = getVMBeingRendered$1();
          assert$1.invariant(!isInvokingRender$1, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
          assert$1.invariant(!isUpdatingTemplate$1, `When updating the template of ${vmBeingRendered}, one of the accessors used by the template has side effects on the state of ${vm}.${propName}`);
          assert$1.isFalse(isBeingConstructed$1(vm), `Failed to construct '${getComponentTag$1(vm)}': The result must not have attributes.`);
          assert$1.invariant(!isObject$1$1(newValue) || isNull$1(newValue), `Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
        }

        if (newValue !== vm.cmpProps[propName]) {
          vm.cmpProps[propName] = newValue;

          if (isFalse$1$1(vm.isDirty)) {
            // perf optimization to skip this step if not in the DOM
            valueMutated$1(this, propName);
          }
        }

        return set.call(vm.elm, newValue);
      }

    };
  }

  function getLinkedElement$1(cmp) {
    return getAssociatedVM$1(cmp).elm;
  }
  /**
   * This class is the base class for any LWC element.
   * Some elements directly extends this class, others implement it via inheritance.
   **/


  function BaseLightningElementConstructor$1() {
    // This should be as performant as possible, while any initialization should be done lazily
    if (isNull$1(vmBeingConstructed$1)) {
      throw new ReferenceError('Illegal constructor');
    }

    {
      assert$1.invariant(vmBeingConstructed$1.elm instanceof HTMLElement, `Component creation requires a DOM element to be associated to ${vmBeingConstructed$1}.`);
    }

    const vm = vmBeingConstructed$1;
    const {
      elm,
      mode,
      def: {
        ctor
      }
    } = vm;
    const component = this;
    vm.component = component;
    vm.tro = getTemplateReactiveObserver$1(vm);
    vm.oar = create$3(null); // interaction hooks
    // We are intentionally hiding this argument from the formal API of LWCElement because
    // we don't want folks to know about it just yet.

    if (arguments.length === 1) {
      const {
        callHook,
        setHook,
        getHook
      } = arguments[0];
      vm.callHook = callHook;
      vm.setHook = setHook;
      vm.getHook = getHook;
    } // attaching the shadowRoot


    const shadowRootOptions = {
      mode,
      delegatesFocus: !!ctor.delegatesFocus,
      '$$lwc-synthetic-mode$$': true
    };
    const cmpRoot = elm.attachShadow(shadowRootOptions); // linking elm, shadow root and component with the VM

    associateVM$1(component, vm);
    associateVM$1(cmpRoot, vm);
    associateVM$1(elm, vm); // VM is now initialized

    vm.cmpRoot = cmpRoot;

    {
      patchComponentWithRestrictions$1(component);
      patchShadowRootWithRestrictions$1(cmpRoot, EmptyObject$1);
    }

    return this;
  } // HTML Element - The Good Parts


  BaseLightningElementConstructor$1.prototype = {
    constructor: BaseLightningElementConstructor$1,

    dispatchEvent(_event) {
      const elm = getLinkedElement$1(this); // Typescript does not like it when you treat the `arguments` object as an array
      // @ts-ignore type-mismatch;

      return dispatchEvent$1.apply(elm, arguments);
    },

    addEventListener(type, listener, options) {
      const vm = getAssociatedVM$1(this);

      {
        const vmBeingRendered = getVMBeingRendered$1();
        assert$1.invariant(!isInvokingRender$1, `${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
        assert$1.invariant(!isUpdatingTemplate$1, `Updating the template of ${vmBeingRendered} has side effects on the state of ${vm} by adding an event listener for "${type}".`);
        assert$1.invariant(isFunction$2(listener), `Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
      }

      const wrappedListener = getWrappedComponentsListener$1(vm, listener);
      vm.elm.addEventListener(type, wrappedListener, options);
    },

    removeEventListener(type, listener, options) {
      const vm = getAssociatedVM$1(this);
      const wrappedListener = getWrappedComponentsListener$1(vm, listener);
      vm.elm.removeEventListener(type, wrappedListener, options);
    },

    setAttributeNS(ns, attrName, _value) {
      const elm = getLinkedElement$1(this);

      {
        const vm = getAssociatedVM$1(this);
        assert$1.isFalse(isBeingConstructed$1(vm), `Failed to construct '${getComponentTag$1(vm)}': The result must not have attributes.`);
      }
      // @ts-ignore type-mismatch

      elm.setAttributeNS.apply(elm, arguments);
    },

    removeAttributeNS(ns, attrName) {
      const elm = getLinkedElement$1(this);
      // @ts-ignore type-mismatch

      elm.removeAttributeNS.apply(elm, arguments);
    },

    removeAttribute(attrName) {
      const elm = getLinkedElement$1(this);
      // @ts-ignore type-mismatch

      elm.removeAttribute.apply(elm, arguments);
    },

    setAttribute(attrName, _value) {
      const elm = getLinkedElement$1(this);

      {
        const vm = getAssociatedVM$1(this);
        assert$1.isFalse(isBeingConstructed$1(vm), `Failed to construct '${getComponentTag$1(vm)}': The result must not have attributes.`);
      }
      // @ts-ignore type-mismatch

      elm.setAttribute.apply(elm, arguments);
    },

    getAttribute(attrName) {
      const elm = getLinkedElement$1(this);
      // @ts-ignore type-mismatch

      const value = elm.getAttribute.apply(elm, arguments);
      return value;
    },

    getAttributeNS(ns, attrName) {
      const elm = getLinkedElement$1(this);
      // @ts-ignore type-mismatch

      const value = elm.getAttributeNS.apply(elm, arguments);
      return value;
    },

    getBoundingClientRect() {
      const elm = getLinkedElement$1(this);

      {
        const vm = getAssociatedVM$1(this);
        assert$1.isFalse(isBeingConstructed$1(vm), `this.getBoundingClientRect() should not be called during the construction of the custom element for ${getComponentTag$1(vm)} because the element is not yet in the DOM, instead, you can use it in one of the available life-cycle hooks.`);
      }

      return elm.getBoundingClientRect();
    },

    /**
     * Returns the first element that is a descendant of node that
     * matches selectors.
     */
    // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector(selectors) {
      const vm = getAssociatedVM$1(this);

      {
        assert$1.isFalse(isBeingConstructed$1(vm), `this.querySelector() cannot be called during the construction of the custom element for ${getComponentTag$1(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.querySelector(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match selectors.
     */
    // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>,
    // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>,
    querySelectorAll(selectors) {
      const vm = getAssociatedVM$1(this);

      {
        assert$1.isFalse(isBeingConstructed$1(vm), `this.querySelectorAll() cannot be called during the construction of the custom element for ${getComponentTag$1(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.querySelectorAll(selectors);
    },

    /**
     * Returns all element descendants of node that
     * match the provided tagName.
     */
    getElementsByTagName(tagNameOrWildCard) {
      const vm = getAssociatedVM$1(this);

      {
        assert$1.isFalse(isBeingConstructed$1(vm), `this.getElementsByTagName() cannot be called during the construction of the custom element for ${getComponentTag$1(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.getElementsByTagName(tagNameOrWildCard);
    },

    /**
     * Returns all element descendants of node that
     * match the provide classnames.
     */
    getElementsByClassName(names) {
      const vm = getAssociatedVM$1(this);

      {
        assert$1.isFalse(isBeingConstructed$1(vm), `this.getElementsByClassName() cannot be called during the construction of the custom element for ${getComponentTag$1(vm)} because no children has been added to this element yet.`);
      }

      const {
        elm
      } = vm;
      return elm.getElementsByClassName(names);
    },

    get isConnected() {
      const vm = getAssociatedVM$1(this);
      const {
        elm
      } = vm;
      return elm.isConnected;
    },

    get classList() {
      {
        const vm = getAssociatedVM$1(this); // TODO [#1290]: this still fails in dev but works in production, eventually, we should just throw in all modes

        assert$1.isFalse(isBeingConstructed$1(vm), `Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
      }

      return getLinkedElement$1(this).classList;
    },

    get template() {
      const vm = getAssociatedVM$1(this);
      return vm.cmpRoot;
    },

    get shadowRoot() {
      // From within the component instance, the shadowRoot is always
      // reported as "closed". Authors should rely on this.template instead.
      return null;
    },

    render() {
      const vm = getAssociatedVM$1(this);
      return vm.def.template;
    },

    toString() {
      const vm = getAssociatedVM$1(this);
      return `[object ${vm.def.name}]`;
    }

  }; // Typescript is inferring the wrong function type for this particular
  // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch

  const baseDescriptors$1 = ArrayReduce$1.call(getOwnPropertyNames$3(HTMLElementOriginalDescriptors$1), (descriptors, propName) => {
    descriptors[propName] = createBridgeToElementDescriptor$1(propName, HTMLElementOriginalDescriptors$1[propName]);
    return descriptors;
  }, create$3(null));
  defineProperties$2(BaseLightningElementConstructor$1.prototype, baseDescriptors$1);

  {
    patchLightningElementPrototypeWithRestrictions$1(BaseLightningElementConstructor$1.prototype);
  }

  freeze$2(BaseLightningElementConstructor$1);
  seal$2(BaseLightningElementConstructor$1.prototype); // @ts-ignore

  const BaseLightningElement$1 = BaseLightningElementConstructor$1;
  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */

  const {
    isArray: isArray$2$1
  } = Array;
  const {
    getPrototypeOf: getPrototypeOf$1$1,
    create: ObjectCreate$1,
    defineProperty: ObjectDefineProperty$1,
    defineProperties: ObjectDefineProperties$1,
    isExtensible: isExtensible$1,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$1$1,
    getOwnPropertyNames: getOwnPropertyNames$1$1,
    getOwnPropertySymbols: getOwnPropertySymbols$1,
    preventExtensions: preventExtensions$1,
    hasOwnProperty: hasOwnProperty$2$1
  } = Object;
  const {
    push: ArrayPush$2$1,
    concat: ArrayConcat$1,
    map: ArrayMap$1$1
  } = Array.prototype;
  const OtS$1$1 = {}.toString;

  function toString$1$1(obj) {
    if (obj && obj.toString) {
      return obj.toString();
    } else if (typeof obj === 'object') {
      return OtS$1$1.call(obj);
    } else {
      return obj + '';
    }
  }

  function isUndefined$2$1(obj) {
    return obj === undefined;
  }

  function isFunction$1$1(obj) {
    return typeof obj === 'function';
  }

  function isObject$2$1(obj) {
    return typeof obj === 'object';
  }

  const proxyToValueMap$1 = new WeakMap();

  function registerProxy$1(proxy, value) {
    proxyToValueMap$1.set(proxy, value);
  }

  const unwrap$1 = replicaOrAny => proxyToValueMap$1.get(replicaOrAny) || replicaOrAny;

  function wrapValue$1(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */


  function unwrapDescriptor$1(descriptor) {
    if (hasOwnProperty$2$1.call(descriptor, 'value')) {
      descriptor.value = unwrap$1(descriptor.value);
    }

    return descriptor;
  }

  function lockShadowTarget$1(membrane, shadowTarget, originalTarget) {
    const targetKeys = ArrayConcat$1.call(getOwnPropertyNames$1$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
    targetKeys.forEach(key => {
      let descriptor = getOwnPropertyDescriptor$1$1(originalTarget, key); // We do not need to wrap the descriptor if configurable
      // Because we can deal with wrapping it when user goes through
      // Get own property descriptor. There is also a chance that this descriptor
      // could change sometime in the future, so we can defer wrapping
      // until we need to

      if (!descriptor.configurable) {
        descriptor = wrapDescriptor$1(membrane, descriptor, wrapValue$1);
      }

      ObjectDefineProperty$1(shadowTarget, key, descriptor);
    });
    preventExtensions$1(shadowTarget);
  }

  class ReactiveProxyHandler$1 {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getProxy(value);
    }

    set(shadowTarget, key, value) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      const oldValue = originalTarget[key];

      if (oldValue !== value) {
        originalTarget[key] = value;
        valueMutated(originalTarget, key);
      } else if (key === 'length' && isArray$2$1(originalTarget)) {
        // fix for issue #236: push will add the new index, and by the time length
        // is updated, the internal length is already equal to the new length value
        // therefore, the oldValue is equal to the value. This is the forking logic
        // to support this use case.
        valueMutated(originalTarget, key);
      }

      return true;
    }

    deleteProperty(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueMutated
        }
      } = this;
      delete originalTarget[key];
      valueMutated(originalTarget, key);
      return true;
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat$1.call(getOwnPropertyNames$1$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
    }

    isExtensible(shadowTarget) {
      const shadowIsExtensible = isExtensible$1(shadowTarget);

      if (!shadowIsExtensible) {
        return shadowIsExtensible;
      }

      const {
        originalTarget,
        membrane
      } = this;
      const targetIsExtensible = isExtensible$1(originalTarget);

      if (!targetIsExtensible) {
        lockShadowTarget$1(membrane, shadowTarget, originalTarget);
      }

      return targetIsExtensible;
    }

    setPrototypeOf(shadowTarget, prototype) {
      {
        throw new Error(`Invalid setPrototypeOf invocation for reactive proxy ${toString$1$1(this.originalTarget)}. Prototype of reactive objects cannot be changed.`);
      }
    }

    getPrototypeOf(shadowTarget) {
      const {
        originalTarget
      } = this;
      return getPrototypeOf$1$1(originalTarget);
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = this.membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1$1(originalTarget, key);

      if (isUndefined$2$1(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1$1(shadowTarget, key);

      if (!isUndefined$2$1(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value, setter or getter (if available) cannot observe
      // mutations, just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor$1(membrane, desc, wrapValue$1);

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty$1(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {
      const {
        originalTarget,
        membrane
      } = this;
      lockShadowTarget$1(membrane, shadowTarget, originalTarget);
      preventExtensions$1(originalTarget);
      return true;
    }

    defineProperty(shadowTarget, key, descriptor) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueMutated
      } = membrane;
      const {
        configurable
      } = descriptor; // We have to check for value in descriptor
      // because Object.freeze(proxy) calls this method
      // with only { configurable: false, writeable: false }
      // Additionally, method will only be called with writeable:false
      // if the descriptor has a value, as opposed to getter/setter
      // So we can just check if writable is present and then see if
      // value is present. This eliminates getter and setter descriptors

      if (hasOwnProperty$2$1.call(descriptor, 'writable') && !hasOwnProperty$2$1.call(descriptor, 'value')) {
        const originalDescriptor = getOwnPropertyDescriptor$1$1(originalTarget, key);
        descriptor.value = originalDescriptor.value;
      }

      ObjectDefineProperty$1(originalTarget, key, unwrapDescriptor$1(descriptor));

      if (configurable === false) {
        ObjectDefineProperty$1(shadowTarget, key, wrapDescriptor$1(membrane, descriptor, wrapValue$1));
      }

      valueMutated(originalTarget, key);
      return true;
    }

  }

  function wrapReadOnlyValue$1(membrane, value) {
    return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }

  class ReadOnlyHandler$1 {
    constructor(membrane, value) {
      this.originalTarget = value;
      this.membrane = membrane;
    }

    get(shadowTarget, key) {
      const {
        membrane,
        originalTarget
      } = this;
      const value = originalTarget[key];
      const {
        valueObserved
      } = membrane;
      valueObserved(originalTarget, key);
      return membrane.getReadOnlyProxy(value);
    }

    set(shadowTarget, key, value) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot set "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

    deleteProperty(shadowTarget, key) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot delete "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

    apply(shadowTarget, thisArg, argArray) {
      /* No op */
    }

    construct(target, argArray, newTarget) {
      /* No op */
    }

    has(shadowTarget, key) {
      const {
        originalTarget,
        membrane: {
          valueObserved
        }
      } = this;
      valueObserved(originalTarget, key);
      return key in originalTarget;
    }

    ownKeys(shadowTarget) {
      const {
        originalTarget
      } = this;
      return ArrayConcat$1.call(getOwnPropertyNames$1$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
    }

    setPrototypeOf(shadowTarget, prototype) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid prototype mutation: Cannot set prototype on "${originalTarget}". "${originalTarget}" prototype is read-only.`);
      }
    }

    getOwnPropertyDescriptor(shadowTarget, key) {
      const {
        originalTarget,
        membrane
      } = this;
      const {
        valueObserved
      } = membrane; // keys looked up via hasOwnProperty need to be reactive

      valueObserved(originalTarget, key);
      let desc = getOwnPropertyDescriptor$1$1(originalTarget, key);

      if (isUndefined$2$1(desc)) {
        return desc;
      }

      const shadowDescriptor = getOwnPropertyDescriptor$1$1(shadowTarget, key);

      if (!isUndefined$2$1(shadowDescriptor)) {
        return shadowDescriptor;
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value or getter (if available) cannot be observed,
      // just like regular methods, in which case we just do nothing.


      desc = wrapDescriptor$1(membrane, desc, wrapReadOnlyValue$1);

      if (hasOwnProperty$2$1.call(desc, 'set')) {
        desc.set = undefined; // readOnly membrane does not allow setters
      }

      if (!desc.configurable) {
        // If descriptor from original target is not configurable,
        // We must copy the wrapped descriptor over to the shadow target.
        // Otherwise, proxy will throw an invariant error.
        // This is our last chance to lock the value.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
        ObjectDefineProperty$1(shadowTarget, key, desc);
      }

      return desc;
    }

    preventExtensions(shadowTarget) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot preventExtensions on ${originalTarget}". "${originalTarget} is read-only.`);
      }
    }

    defineProperty(shadowTarget, key, descriptor) {
      {
        const {
          originalTarget
        } = this;
        throw new Error(`Invalid mutation: Cannot defineProperty "${key.toString()}" on "${originalTarget}". "${originalTarget}" is read-only.`);
      }
    }

  }

  function extract$1(objectOrArray) {
    if (isArray$2$1(objectOrArray)) {
      return objectOrArray.map(item => {
        const original = unwrap$1(item);

        if (original !== item) {
          return extract$1(original);
        }

        return item;
      });
    }

    const obj = ObjectCreate$1(getPrototypeOf$1$1(objectOrArray));
    const names = getOwnPropertyNames$1$1(objectOrArray);
    return ArrayConcat$1.call(names, getOwnPropertySymbols$1(objectOrArray)).reduce((seed, key) => {
      const item = objectOrArray[key];
      const original = unwrap$1(item);

      if (original !== item) {
        seed[key] = extract$1(original);
      } else {
        seed[key] = item;
      }

      return seed;
    }, obj);
  }

  const formatter$1 = {
    header: plainOrProxy => {
      const originalTarget = unwrap$1(plainOrProxy); // if originalTarget is falsy or not unwrappable, exit

      if (!originalTarget || originalTarget === plainOrProxy) {
        return null;
      }

      const obj = extract$1(plainOrProxy);
      return ['object', {
        object: obj
      }];
    },
    hasBody: () => {
      return false;
    },
    body: () => {
      return null;
    }
  }; // Inspired from paulmillr/es6-shim
  // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L176-L185

  function getGlobal$1() {
    // the only reliable means to get the global object is `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof globalThis !== 'undefined') {
      return globalThis;
    }

    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    } // Gracefully degrade if not able to locate the global object


    return {};
  }

  function init$1() {

    const global = getGlobal$1(); // Custom Formatter for Dev Tools. To enable this, open Chrome Dev Tools
    //  - Go to Settings,
    //  - Under console, select "Enable custom formatters"
    // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview

    const devtoolsFormatters = global.devtoolsFormatters || [];
    ArrayPush$2$1.call(devtoolsFormatters, formatter$1);
    global.devtoolsFormatters = devtoolsFormatters;
  }

  {
    init$1();
  }

  function createShadowTarget$1(value) {
    let shadowTarget = undefined;

    if (isArray$2$1(value)) {
      shadowTarget = [];
    } else if (isObject$2$1(value)) {
      shadowTarget = {};
    }

    return shadowTarget;
  }

  const ObjectDotPrototype$1 = Object.prototype;

  function defaultValueIsObservable$1(value) {
    // intentionally checking for null
    if (value === null) {
      return false;
    } // treat all non-object types, including undefined, as non-observable values


    if (typeof value !== 'object') {
      return false;
    }

    if (isArray$2$1(value)) {
      return true;
    }

    const proto = getPrototypeOf$1$1(value);
    return proto === ObjectDotPrototype$1 || proto === null || getPrototypeOf$1$1(proto) === null;
  }

  const defaultValueObserved$1 = (obj, key) => {
    /* do nothing */
  };

  const defaultValueMutated$1 = (obj, key) => {
    /* do nothing */
  };

  const defaultValueDistortion$1 = value => value;

  function wrapDescriptor$1(membrane, descriptor, getValue) {
    const {
      set,
      get
    } = descriptor;

    if (hasOwnProperty$2$1.call(descriptor, 'value')) {
      descriptor.value = getValue(membrane, descriptor.value);
    } else {
      if (!isUndefined$2$1(get)) {
        descriptor.get = function () {
          // invoking the original getter with the original target
          return getValue(membrane, get.call(unwrap$1(this)));
        };
      }

      if (!isUndefined$2$1(set)) {
        descriptor.set = function (value) {
          // At this point we don't have a clear indication of whether
          // or not a valid mutation will occur, we don't have the key,
          // and we are not sure why and how they are invoking this setter.
          // Nevertheless we preserve the original semantics by invoking the
          // original setter with the original target and the unwrapped value
          set.call(unwrap$1(this), membrane.unwrapProxy(value));
        };
      }
    }

    return descriptor;
  }

  class ReactiveMembrane$1 {
    constructor(options) {
      this.valueDistortion = defaultValueDistortion$1;
      this.valueMutated = defaultValueMutated$1;
      this.valueObserved = defaultValueObserved$1;
      this.valueIsObservable = defaultValueIsObservable$1;
      this.objectGraph = new WeakMap();

      if (!isUndefined$2$1(options)) {
        const {
          valueDistortion,
          valueMutated,
          valueObserved,
          valueIsObservable
        } = options;
        this.valueDistortion = isFunction$1$1(valueDistortion) ? valueDistortion : defaultValueDistortion$1;
        this.valueMutated = isFunction$1$1(valueMutated) ? valueMutated : defaultValueMutated$1;
        this.valueObserved = isFunction$1$1(valueObserved) ? valueObserved : defaultValueObserved$1;
        this.valueIsObservable = isFunction$1$1(valueIsObservable) ? valueIsObservable : defaultValueIsObservable$1;
      }
    }

    getProxy(value) {
      const unwrappedValue = unwrap$1(value);
      const distorted = this.valueDistortion(unwrappedValue);

      if (this.valueIsObservable(distorted)) {
        const o = this.getReactiveState(unwrappedValue, distorted); // when trying to extract the writable version of a readonly
        // we return the readonly.

        return o.readOnly === value ? value : o.reactive;
      }

      return distorted;
    }

    getReadOnlyProxy(value) {
      value = unwrap$1(value);
      const distorted = this.valueDistortion(value);

      if (this.valueIsObservable(distorted)) {
        return this.getReactiveState(value, distorted).readOnly;
      }

      return distorted;
    }

    unwrapProxy(p) {
      return unwrap$1(p);
    }

    getReactiveState(value, distortedValue) {
      const {
        objectGraph
      } = this;
      let reactiveState = objectGraph.get(distortedValue);

      if (reactiveState) {
        return reactiveState;
      }

      const membrane = this;
      reactiveState = {
        get reactive() {
          const reactiveHandler = new ReactiveProxyHandler$1(membrane, distortedValue); // caching the reactive proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget$1(distortedValue), reactiveHandler);
          registerProxy$1(proxy, value);
          ObjectDefineProperty$1(this, 'reactive', {
            value: proxy
          });
          return proxy;
        },

        get readOnly() {
          const readOnlyHandler = new ReadOnlyHandler$1(membrane, distortedValue); // caching the readOnly proxy after the first time it is accessed

          const proxy = new Proxy(createShadowTarget$1(distortedValue), readOnlyHandler);
          registerProxy$1(proxy, value);
          ObjectDefineProperty$1(this, 'readOnly', {
            value: proxy
          });
          return proxy;
        }

      };
      objectGraph.set(distortedValue, reactiveState);
      return reactiveState;
    }

  }
  /** version: 0.26.0 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function valueDistortion$1(value) {
    return value;
  }

  const reactiveMembrane$1 = new ReactiveMembrane$1({
    valueObserved: valueObserved$1,
    valueMutated: valueMutated$1,
    valueDistortion: valueDistortion$1
  });
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // from the element instance, and get the value or set a new value on the component.
  // This means that across different elements, similar names can get the exact same
  // descriptor, so we can cache them:


  const cachedGetterByKey$1 = create$3(null);
  const cachedSetterByKey$1 = create$3(null);

  function createGetter$1(key) {
    let fn = cachedGetterByKey$1[key];

    if (isUndefined$3(fn)) {
      fn = cachedGetterByKey$1[key] = function () {
        const vm = getAssociatedVM$1(this);
        const {
          getHook
        } = vm;
        return getHook(vm.component, key);
      };
    }

    return fn;
  }

  function createSetter$1(key) {
    let fn = cachedSetterByKey$1[key];

    if (isUndefined$3(fn)) {
      fn = cachedSetterByKey$1[key] = function (newValue) {
        const vm = getAssociatedVM$1(this);
        const {
          setHook
        } = vm;
        newValue = reactiveMembrane$1.getReadOnlyProxy(newValue);
        setHook(vm.component, key, newValue);
      };
    }

    return fn;
  }

  function createMethodCaller$1(methodName) {
    return function () {
      const vm = getAssociatedVM$1(this);
      const {
        callHook,
        component
      } = vm;
      const fn = component[methodName];
      return callHook(vm.component, fn, ArraySlice$1$1.call(arguments));
    };
  }

  function HTMLBridgeElementFactory$1(SuperClass, props, methods) {
    let HTMLBridgeElement;
    /**
     * Modern browsers will have all Native Constructors as regular Classes
     * and must be instantiated with the new keyword. In older browsers,
     * specifically IE11, those are objects with a prototype property defined,
     * since they are not supposed to be extended or instantiated with the
     * new keyword. This forking logic supports both cases, specifically because
     * wc.ts relies on the construction path of the bridges to create new
     * fully qualifying web components.
     */

    if (isFunction$2(SuperClass)) {
      HTMLBridgeElement = class extends SuperClass {};
    } else {
      HTMLBridgeElement = function () {
        // Bridge classes are not supposed to be instantiated directly in
        // browsers that do not support web components.
        throw new TypeError('Illegal constructor');
      }; // prototype inheritance dance


      setPrototypeOf$2(HTMLBridgeElement, SuperClass);
      setPrototypeOf$2(HTMLBridgeElement.prototype, SuperClass.prototype);
      defineProperty$2(HTMLBridgeElement.prototype, 'constructor', {
        writable: true,
        configurable: true,
        value: HTMLBridgeElement
      });
    }

    const descriptors = create$3(null); // expose getters and setters for each public props on the new Element Bridge

    for (let i = 0, len = props.length; i < len; i += 1) {
      const propName = props[i];
      descriptors[propName] = {
        get: createGetter$1(propName),
        set: createSetter$1(propName),
        enumerable: true,
        configurable: true
      };
    } // expose public methods as props on the new Element Bridge


    for (let i = 0, len = methods.length; i < len; i += 1) {
      const methodName = methods[i];
      descriptors[methodName] = {
        value: createMethodCaller$1(methodName),
        writable: true,
        configurable: true
      };
    }

    defineProperties$2(HTMLBridgeElement.prototype, descriptors);
    return HTMLBridgeElement;
  }

  const BaseBridgeElement$1 = HTMLBridgeElementFactory$1(HTMLElement, getOwnPropertyNames$3(HTMLElementOriginalDescriptors$1), []);
  freeze$2(BaseBridgeElement$1);
  seal$2(BaseBridgeElement$1.prototype);
  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    assign: assign$1$1,
    create: create$2$1,
    defineProperties: defineProperties$1$1,
    defineProperty: defineProperty$1$1,
    freeze: freeze$1$1,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor$2$1,
    getOwnPropertyNames: getOwnPropertyNames$2$1,
    getPrototypeOf: getPrototypeOf$2$1,
    hasOwnProperty: hasOwnProperty$3$1,
    keys: keys$1$1,
    seal: seal$1$1,
    setPrototypeOf: setPrototypeOf$1$1
  } = Object;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */


  const hasNativeSymbolsSupport$1$1 = Symbol('x').toString() === 'Symbol(x)';
  /** version: 1.3.2 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // Cached reference to globalThis

  let _globalThis$2;

  if (typeof globalThis === 'object') {
    _globalThis$2 = globalThis;
  }

  function getGlobalThis$1() {
    if (typeof _globalThis$2 === 'object') {
      return _globalThis$2;
    }

    try {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Object.prototype, '__magic__', {
        get: function () {
          return this;
        },
        configurable: true
      }); // @ts-ignore
      // __magic__ is undefined in Safari 10 and IE10 and older.
      // eslint-disable-next-line no-undef

      _globalThis$2 = __magic__; // @ts-ignore

      delete Object.prototype.__magic__;
    } catch (ex) {// In IE8, Object.defineProperty only works on DOM objects.
    } finally {
      // If the magic above fails for some reason we assume that we are in a
      // legacy browser. Assume `window` exists in this case.
      if (typeof _globalThis$2 === 'undefined') {
        _globalThis$2 = window;
      }
    }

    return _globalThis$2;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const _globalThis$1$1 = getGlobalThis$1();

  if (!_globalThis$1$1.lwcRuntimeFlags) {
    Object.defineProperty(_globalThis$1$1, 'lwcRuntimeFlags', {
      value: create$2$1(null)
    });
  }

  const runtimeFlags$1 = _globalThis$1$1.lwcRuntimeFlags; // This function is not supported for use within components and is meant for
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const signedDecoratorToMetaMap$1 = new Map();

  function getDecoratorsRegisteredMeta$1(Ctor) {
    return signedDecoratorToMetaMap$1.get(Ctor);
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const CtorToDefMap$1 = new WeakMap();

  function getCtorProto$1(Ctor, subclassComponentName) {
    let proto = getPrototypeOf$3(Ctor);

    if (isNull$1(proto)) {
      throw new ReferenceError(`Invalid prototype chain for ${subclassComponentName}, you must extend LightningElement.`);
    } // covering the cases where the ref is circular in AMD


    if (isCircularModuleDependency$1(proto)) {
      const p = resolveCircularModuleDependency$1(proto);

      {
        if (isNull$1(p)) {
          throw new ReferenceError(`Circular module dependency for ${subclassComponentName}, must resolve to a constructor that extends LightningElement.`);
        }
      } // escape hatch for Locker and other abstractions to provide their own base class instead
      // of our Base class without having to leak it to user-land. If the circular function returns
      // itself, that's the signal that we have hit the end of the proto chain, which must always
      // be base.


      proto = p === proto ? BaseLightningElement$1 : p;
    }

    return proto;
  }

  function createComponentDef$1(Ctor, meta, subclassComponentName) {
    {
      // local to dev block
      const ctorName = Ctor.name; // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
      // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);

      assert$1.isTrue(Ctor.constructor, `Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
    }

    const {
      name
    } = meta;
    let {
      template
    } = meta;
    const decoratorsMeta = getDecoratorsRegisteredMeta$1(Ctor);
    let props = {};
    let methods = {};
    let wire;
    let track = {};
    let fields;

    if (!isUndefined$3(decoratorsMeta)) {
      props = decoratorsMeta.props;
      methods = decoratorsMeta.methods;
      wire = decoratorsMeta.wire;
      track = decoratorsMeta.track;
      fields = decoratorsMeta.fields;
    }

    const proto = Ctor.prototype;
    let {
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    } = proto;
    const superProto = getCtorProto$1(Ctor, subclassComponentName);
    const superDef = superProto !== BaseLightningElement$1 ? getComponentDef$1(superProto, subclassComponentName) : null;
    const SuperBridge = isNull$1(superDef) ? BaseBridgeElement$1 : superDef.bridge;
    const bridge = HTMLBridgeElementFactory$1(SuperBridge, getOwnPropertyNames$3(props), getOwnPropertyNames$3(methods));

    if (!isNull$1(superDef)) {
      props = assign$2(create$3(null), superDef.props, props);
      methods = assign$2(create$3(null), superDef.methods, methods);
      wire = superDef.wire || wire ? assign$2(create$3(null), superDef.wire, wire) : undefined;
      track = assign$2(create$3(null), superDef.track, track);
      connectedCallback = connectedCallback || superDef.connectedCallback;
      disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
      renderedCallback = renderedCallback || superDef.renderedCallback;
      errorCallback = errorCallback || superDef.errorCallback;
      render = render || superDef.render;
      template = template || superDef.template;
    }

    props = assign$2(create$3(null), HTML_PROPS$1, props);

    if (!isUndefined$3(fields)) {
      defineProperties$2(proto, createObservedFieldsDescriptorMap$1(fields));
    }

    if (isUndefined$3(template)) {
      // default template
      template = defaultEmptyTemplate$1;
    }

    const def = {
      ctor: Ctor,
      name,
      wire,
      track,
      props,
      methods,
      bridge,
      template,
      connectedCallback,
      disconnectedCallback,
      renderedCallback,
      errorCallback,
      render
    };

    {
      freeze$2(Ctor.prototype);
    }

    return def;
  }
  /**
   * EXPERIMENTAL: This function allows for the identification of LWC
   * constructors. This API is subject to change or being removed.
   */


  function isComponentConstructor$1(ctor) {
    if (!isFunction$2(ctor)) {
      return false;
    } // Fast path: LightningElement is part of the prototype chain of the constructor.


    if (ctor.prototype instanceof BaseLightningElement$1) {
      return true;
    } // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
    // climb up the constructor prototype chain to check in case there are circular dependencies
    // to resolve.


    let current = ctor;

    do {
      if (isCircularModuleDependency$1(current)) {
        const circularResolved = resolveCircularModuleDependency$1(current); // If the circular function returns itself, that's the signal that we have hit the end of the proto chain,
        // which must always be a valid base constructor.

        if (circularResolved === current) {
          return true;
        }

        current = circularResolved;
      }

      if (current === BaseLightningElement$1) {
        return true;
      }
    } while (!isNull$1(current) && (current = getPrototypeOf$3(current))); // Finally return false if the LightningElement is not part of the prototype chain.


    return false;
  }
  /**
   * EXPERIMENTAL: This function allows for the collection of internal
   * component metadata. This API is subject to change or being removed.
   */


  function getComponentDef$1(Ctor, subclassComponentName) {
    let def = CtorToDefMap$1.get(Ctor);

    if (isUndefined$3(def)) {
      if (!isComponentConstructor$1(Ctor)) {
        throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
      }

      let meta = getComponentRegisteredMeta$1(Ctor);

      if (isUndefined$3(meta)) {
        // TODO [#1295]: remove this workaround after refactoring tests
        meta = {
          template: undefined,
          name: Ctor.name
        };
      }

      def = createComponentDef$1(Ctor, meta, subclassComponentName || Ctor.name);
      CtorToDefMap$1.set(Ctor, def);
    }

    return def;
  }
  // No DOM Patching occurs here


  function setElementProto$1(elm, def) {
    setPrototypeOf$2(elm, def.bridge.prototype);
  } // Typescript is inferring the wrong function type for this particular
  // overloaded method: https://github.com/Microsoft/TypeScript/issues/27972
  // @ts-ignore type-mismatch


  const HTML_PROPS$1 = ArrayReduce$1.call(getOwnPropertyNames$3(HTMLElementOriginalDescriptors$1), (props, propName) => {
    const attrName = getAttrNameFromPropName$1(propName);
    props[propName] = {
      config: 3,
      type: 'any',
      attr: attrName
    };
    return props;
  }, create$3(null));
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  var VMState$1;

  (function (VMState) {
    VMState[VMState["created"] = 0] = "created";
    VMState[VMState["connected"] = 1] = "connected";
    VMState[VMState["disconnected"] = 2] = "disconnected";
  })(VMState$1 || (VMState$1 = {}));

  let idx$1 = 0;
  /** The internal slot used to associate different objects the engine manipulates with the VM */

  const ViewModelReflection$1 = createHiddenField$1('ViewModel', 'engine');

  function callHook$1(cmp, fn, args = []) {
    return fn.apply(cmp, args);
  }

  function setHook$1(cmp, prop, newValue) {
    cmp[prop] = newValue;
  }

  function getHook$1(cmp, prop) {
    return cmp[prop];
  }

  function rerenderVM$1(vm) {
    rehydrate$1(vm);
  }

  function appendVM$1(vm) {
    rehydrate$1(vm);
  } // just in case the component comes back, with this we guarantee re-rendering it
  // while preventing any attempt to rehydration until after reinsertion.


  function resetComponentStateWhenRemoved$1(vm) {
    const {
      state
    } = vm;

    if (state !== VMState$1.disconnected) {
      const {
        oar,
        tro
      } = vm; // Making sure that any observing record will not trigger the rehydrated on this vm

      tro.reset(); // Making sure that any observing accessor record will not trigger the setter to be reinvoked

      for (const key in oar) {
        oar[key].reset();
      }

      runDisconnectedCallback$1(vm); // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)

      runShadowChildNodesDisconnectedCallback$1(vm);
      runLightChildNodesDisconnectedCallback$1(vm);
    }
  } // this method is triggered by the diffing algo only when a vnode from the
  // old vnode.children is removed from the DOM.


  function removeVM$1(vm) {
    {
      assert$1.isTrue(vm.state === VMState$1.connected || vm.state === VMState$1.disconnected, `${vm} must have been connected.`);
    }

    resetComponentStateWhenRemoved$1(vm);
  } // this method is triggered by the removal of a root element from the DOM.

  function createVM$1(elm, Ctor, options) {
    {
      assert$1.invariant(elm instanceof HTMLElement, `VM creation requires a DOM element instead of ${elm}.`);
    }

    const def = getComponentDef$1(Ctor);
    const {
      isRoot,
      mode,
      owner
    } = options;
    idx$1 += 1;
    const uninitializedVm = {
      // component creation index is defined once, and never reset, it can
      // be preserved from one insertion to another without any issue
      idx: idx$1,
      state: VMState$1.created,
      isScheduled: false,
      isDirty: true,
      isRoot: isTrue$1$1(isRoot),
      mode,
      def,
      owner,
      elm,
      data: EmptyObject$1,
      context: create$3(null),
      cmpProps: create$3(null),
      cmpTrack: create$3(null),
      cmpSlots: useSyntheticShadow$1 ? create$3(null) : undefined,
      callHook: callHook$1,
      setHook: setHook$1,
      getHook: getHook$1,
      children: EmptyArray$1,
      aChildren: EmptyArray$1,
      velements: EmptyArray$1,
      // Perf optimization to preserve the shape of this obj
      cmpTemplate: undefined,
      component: undefined,
      cmpRoot: undefined,
      tro: undefined,
      oar: undefined
    };

    {
      uninitializedVm.toString = () => {
        return `[object:vm ${def.name} (${uninitializedVm.idx})]`;
      };
    } // create component instance associated to the vm and the element


    createComponent$1(uninitializedVm, Ctor); // link component to the wire service

    const initializedVm = uninitializedVm;
    linkComponent$1(initializedVm);
  }

  function assertIsVM$1(obj) {
    if (isNull$1(obj) || !isObject$1$1(obj) || !('cmpRoot' in obj)) {
      throw new TypeError(`${obj} is not a VM.`);
    }
  }

  function associateVM$1(obj, vm) {
    setHiddenField$1(obj, ViewModelReflection$1, vm);
  }

  function getAssociatedVM$1(obj) {
    const vm = getHiddenField$1(obj, ViewModelReflection$1);

    {
      assertIsVM$1(vm);
    }

    return vm;
  }

  function getAssociatedVMIfPresent$1(obj) {
    const maybeVm = getHiddenField$1(obj, ViewModelReflection$1);

    {
      if (!isUndefined$3(maybeVm)) {
        assertIsVM$1(maybeVm);
      }
    }

    return maybeVm;
  }

  function rehydrate$1(vm) {
    {
      assert$1.isTrue(vm.elm instanceof HTMLElement, `rehydration can only happen after ${vm} was patched the first time.`);
    }

    if (isTrue$1$1(vm.isDirty)) {
      const children = renderComponent$1(vm);
      patchShadowRoot$1(vm, children);
    }
  }

  function patchShadowRoot$1(vm, newCh) {
    const {
      cmpRoot,
      children: oldCh
    } = vm;
    vm.children = newCh; // caching the new children collection

    if (newCh.length > 0 || oldCh.length > 0) {
      // patch function mutates vnodes by adding the element reference,
      // however, if patching fails it contains partial changes.
      if (oldCh !== newCh) {
        const fn = hasDynamicChildren$1(newCh) ? updateDynamicChildren$1 : updateStaticChildren$1;
        runWithBoundaryProtection$1(vm, vm, () => {
          // pre
          {
            startMeasure$1('patch', vm);
          }
        }, () => {
          // job
          fn(cmpRoot, oldCh, newCh);
        }, () => {
          // post
          {
            endMeasure$1('patch', vm);
          }
        });
      }
    }

    if (vm.state === VMState$1.connected) {
      // If the element is connected, that means connectedCallback was already issued, and
      // any successive rendering should finish with the call to renderedCallback, otherwise
      // the connectedCallback will take care of calling it in the right order at the end of
      // the current rehydration process.
      runRenderedCallback$1(vm);
    }
  }

  function runRenderedCallback$1(vm) {
    const {
      rendered
    } = Services$1;

    if (rendered) {
      invokeServiceHook$1(vm, rendered);
    }

    invokeComponentRenderedCallback$1(vm);
  }

  let rehydrateQueue$1 = [];

  function flushRehydrationQueue$1() {
    startGlobalMeasure$1(GlobalMeasurementPhase$1.REHYDRATE);

    {
      assert$1.invariant(rehydrateQueue$1.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue$1}.`);
    }

    const vms = rehydrateQueue$1.sort((a, b) => a.idx - b.idx);
    rehydrateQueue$1 = []; // reset to a new queue

    for (let i = 0, len = vms.length; i < len; i += 1) {
      const vm = vms[i];

      try {
        rehydrate$1(vm);
      } catch (error) {
        if (i + 1 < len) {
          // pieces of the queue are still pending to be rehydrated, those should have priority
          if (rehydrateQueue$1.length === 0) {
            addCallbackToNextTick$1(flushRehydrationQueue$1);
          }

          ArrayUnshift$1$1.apply(rehydrateQueue$1, ArraySlice$1$1.call(vms, i + 1));
        } // we need to end the measure before throwing.


        endGlobalMeasure$1(GlobalMeasurementPhase$1.REHYDRATE); // re-throwing the original error will break the current tick, but since the next tick is
        // already scheduled, it should continue patching the rest.

        throw error; // eslint-disable-line no-unsafe-finally
      }
    }

    endGlobalMeasure$1(GlobalMeasurementPhase$1.REHYDRATE);
  }

  function runConnectedCallback$1(vm) {
    const {
      state
    } = vm;

    if (state === VMState$1.connected) {
      return; // nothing to do since it was already connected
    }

    vm.state = VMState$1.connected; // reporting connection

    const {
      connected
    } = Services$1;

    if (connected) {
      invokeServiceHook$1(vm, connected);
    }

    const {
      connectedCallback
    } = vm.def;

    if (!isUndefined$3(connectedCallback)) {
      {
        startMeasure$1('connectedCallback', vm);
      }

      invokeComponentCallback$1(vm, connectedCallback);

      {
        endMeasure$1('connectedCallback', vm);
      }
    }
  }

  function runDisconnectedCallback$1(vm) {
    {
      assert$1.isTrue(vm.state !== VMState$1.disconnected, `${vm} must be inserted.`);
    }

    if (isFalse$1$1(vm.isDirty)) {
      // this guarantees that if the component is reused/reinserted,
      // it will be re-rendered because we are disconnecting the reactivity
      // linking, so mutations are not automatically reflected on the state
      // of disconnected components.
      vm.isDirty = true;
    }

    vm.state = VMState$1.disconnected; // reporting disconnection

    const {
      disconnected
    } = Services$1;

    if (disconnected) {
      invokeServiceHook$1(vm, disconnected);
    }

    const {
      disconnectedCallback
    } = vm.def;

    if (!isUndefined$3(disconnectedCallback)) {
      {
        startMeasure$1('disconnectedCallback', vm);
      }

      invokeComponentCallback$1(vm, disconnectedCallback);

      {
        endMeasure$1('disconnectedCallback', vm);
      }
    }
  }

  function runShadowChildNodesDisconnectedCallback$1(vm) {
    const {
      velements: vCustomElementCollection
    } = vm; // reporting disconnection for every child in inverse order since they are inserted in reserved order

    for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
      const elm = vCustomElementCollection[i].elm; // There are two cases where the element could be undefined:
      // * when there is an error during the construction phase, and an
      //   error boundary picks it, there is a possibility that the VCustomElement
      //   is not properly initialized, and therefore is should be ignored.
      // * when slotted custom element is not used by the element where it is slotted
      //   into it, as a result, the custom element was never initialized.

      if (!isUndefined$3(elm)) {
        const childVM = getAssociatedVM$1(elm);
        resetComponentStateWhenRemoved$1(childVM);
      }
    }
  }

  function runLightChildNodesDisconnectedCallback$1(vm) {
    const {
      aChildren: adoptedChildren
    } = vm;
    recursivelyDisconnectChildren$1(adoptedChildren);
  }
  /**
   * The recursion doesn't need to be a complete traversal of the vnode graph,
   * instead it can be partial, when a custom element vnode is found, we don't
   * need to continue into its children because by attempting to disconnect the
   * custom element itself will trigger the removal of anything slotted or anything
   * defined on its shadow.
   */


  function recursivelyDisconnectChildren$1(vnodes) {
    for (let i = 0, len = vnodes.length; i < len; i += 1) {
      const vnode = vnodes[i];

      if (!isNull$1(vnode) && isArray$1$1(vnode.children) && !isUndefined$3(vnode.elm)) {
        // vnode is a VElement with children
        if (isUndefined$3(vnode.ctor)) {
          // it is a VElement, just keep looking (recursively)
          recursivelyDisconnectChildren$1(vnode.children);
        } else {
          // it is a VCustomElement, disconnect it and ignore its children
          resetComponentStateWhenRemoved$1(getAssociatedVM$1(vnode.elm));
        }
      }
    }
  } // This is a super optimized mechanism to remove the content of the shadowRoot
  // without having to go into snabbdom. Especially useful when the reset is a consequence
  // of an error, in which case the children VNodes might not be representing the current
  // state of the DOM


  function resetShadowRoot$1(vm) {
    vm.children = EmptyArray$1;
    ShadowRootInnerHTMLSetter$1.call(vm.cmpRoot, ''); // disconnecting any known custom element inside the shadow of the this vm

    runShadowChildNodesDisconnectedCallback$1(vm);
  }

  function scheduleRehydration$1(vm) {
    if (!vm.isScheduled) {
      vm.isScheduled = true;

      if (rehydrateQueue$1.length === 0) {
        addCallbackToNextTick$1(flushRehydrationQueue$1);
      }

      ArrayPush$3.call(rehydrateQueue$1, vm);
    }
  }

  function getErrorBoundaryVM$1(vm) {
    let currentVm = vm;

    while (!isNull$1(currentVm)) {
      if (!isUndefined$3(currentVm.def.errorCallback)) {
        return currentVm;
      }

      currentVm = currentVm.owner;
    }
  }
  // NOTE: we should probably more this routine to the synthetic shadow folder
  // and get the allocation to be cached by in the elm instead of in the VM


  function allocateInSlot$1(vm, children) {
    {
      assert$1.invariant(isObject$1$1(vm.cmpSlots), `When doing manual allocation, there must be a cmpSlots object available.`);
    }

    const {
      cmpSlots: oldSlots
    } = vm;
    const cmpSlots = vm.cmpSlots = create$3(null);

    for (let i = 0, len = children.length; i < len; i += 1) {
      const vnode = children[i];

      if (isNull$1(vnode)) {
        continue;
      }

      const {
        data
      } = vnode;
      const slotName = data.attrs && data.attrs.slot || '';
      const vnodes = cmpSlots[slotName] = cmpSlots[slotName] || []; // re-keying the vnodes is necessary to avoid conflicts with default content for the slot
      // which might have similar keys. Each vnode will always have a key that
      // starts with a numeric character from compiler. In this case, we add a unique
      // notation for slotted vnodes keys, e.g.: `@foo:1:1`

      vnode.key = `@${slotName}:${vnode.key}`;
      ArrayPush$3.call(vnodes, vnode);
    }

    if (isFalse$1$1(vm.isDirty)) {
      // We need to determine if the old allocation is really different from the new one
      // and mark the vm as dirty
      const oldKeys = keys$2(oldSlots);

      if (oldKeys.length !== keys$2(cmpSlots).length) {
        markComponentAsDirty$1(vm);
        return;
      }

      for (let i = 0, len = oldKeys.length; i < len; i += 1) {
        const key = oldKeys[i];

        if (isUndefined$3(cmpSlots[key]) || oldSlots[key].length !== cmpSlots[key].length) {
          markComponentAsDirty$1(vm);
          return;
        }

        const oldVNodes = oldSlots[key];
        const vnodes = cmpSlots[key];

        for (let j = 0, a = cmpSlots[key].length; j < a; j += 1) {
          if (oldVNodes[j] !== vnodes[j]) {
            markComponentAsDirty$1(vm);
            return;
          }
        }
      }
    }
  }

  function runWithBoundaryProtection$1(vm, owner, pre, job, post) {
    let error;
    pre();

    try {
      job();
    } catch (e) {
      error = Object(e);
    } finally {
      post();

      if (!isUndefined$3(error)) {
        error.wcStack = error.wcStack || getErrorComponentStack$1(vm);
        const errorBoundaryVm = isNull$1(owner) ? undefined : getErrorBoundaryVM$1(owner);

        if (isUndefined$3(errorBoundaryVm)) {
          throw error; // eslint-disable-line no-unsafe-finally
        }

        resetShadowRoot$1(vm); // remove offenders

        {
          startMeasure$1('errorCallback', errorBoundaryVm);
        } // error boundaries must have an ErrorCallback


        const errorCallback = errorBoundaryVm.def.errorCallback;
        invokeComponentCallback$1(errorBoundaryVm, errorCallback, [error, error.wcStack]);

        {
          endMeasure$1('errorCallback', errorBoundaryVm);
        }
      }
    }
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const {
    appendChild: appendChild$1,
    insertBefore: insertBefore$1,
    removeChild: removeChild$1,
    replaceChild: replaceChild$1
  } = Node.prototype;
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  const ConnectingSlot$1 = createHiddenField$1('connecting', 'engine');
  const DisconnectingSlot$1 = createHiddenField$1('disconnecting', 'engine');

  function callNodeSlot$1(node, slot) {
    {
      assert$1.isTrue(node, `callNodeSlot() should not be called for a non-object`);
    }

    const fn = getHiddenField$1(node, slot);

    if (!isUndefined$3(fn)) {
      fn();
    }

    return node; // for convenience
  } // monkey patching Node methods to be able to detect the insertions and removal of
  // root elements created via createElement.


  assign$2(Node.prototype, {
    appendChild(newChild) {
      const appendedNode = appendChild$1.call(this, newChild);
      return callNodeSlot$1(appendedNode, ConnectingSlot$1);
    },

    insertBefore(newChild, referenceNode) {
      const insertedNode = insertBefore$1.call(this, newChild, referenceNode);
      return callNodeSlot$1(insertedNode, ConnectingSlot$1);
    },

    removeChild(oldChild) {
      const removedNode = removeChild$1.call(this, oldChild);
      return callNodeSlot$1(removedNode, DisconnectingSlot$1);
    },

    replaceChild(newChild, oldChild) {
      const replacedNode = replaceChild$1.call(this, newChild, oldChild);
      callNodeSlot$1(replacedNode, DisconnectingSlot$1);
      callNodeSlot$1(newChild, ConnectingSlot$1);
      return replacedNode;
    }

  });

  function tmpl($api, $cmp, $slotset, $ctx) {
    const {
      s: api_slot,
      h: api_element
    } = $api;
    return [api_element("b", {
      key: 1
    }, [api_slot("", {
      key: 0
    }, [], $slotset)])];
  }

  var _tmpl = registerTemplate$1(tmpl);
  tmpl.slots = [""];
  tmpl.stylesheets = [];
  tmpl.stylesheetTokens = {
    hostAttribute: "rootdir-example-my-dependency_dependency-host",
    shadowAttribute: "rootdir-example-my-dependency_dependency"
  };

  class App extends BaseLightningElement$1 {}

  var _myDependency = registerComponent$1(App, {
    tmpl: _tmpl
  });

  function tmpl$1($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      c: api_custom_element
    } = $api;
    return [api_custom_element("my-dependency", _myDependency, {
      key: 0
    }, [api_text("Hi")])];
  }

  var _tmpl$1 = registerTemplate(tmpl$1);
  tmpl$1.stylesheets = [];
  tmpl$1.stylesheetTokens = {
    hostAttribute: "my-app_app-host",
    shadowAttribute: "my-app_app"
  };

  class App$1 extends BaseLightningElement {}

  var MyApp = registerComponent(App$1, {
    tmpl: _tmpl$1
  });

  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /**
   * Copyright (C) 2018 salesforce.com, inc.
   */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  function invariant$2(value, msg) {
    if (!value) {
      throw new Error(`Invariant Violation: ${msg}`);
    }
  }

  function isTrue$3(value, msg) {
    if (!value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function isFalse$3(value, msg) {
    if (value) {
      throw new Error(`Assert Violation: ${msg}`);
    }
  }

  function fail$2(msg) {
    throw new Error(msg);
  }

  var assert$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invariant: invariant$2,
    isTrue: isTrue$3,
    isFalse: isFalse$3,
    fail: fail$2
  });

  function isUndefined$4(obj) {
    return obj === undefined;
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * In IE11, symbols are expensive.
   * Due to the nature of the symbol polyfill. This method abstract the
   * creation of symbols, so we can fallback to string when native symbols
   * are not supported. Note that we can't use typeof since it will fail when transpiling.
   */


  const hasNativeSymbolsSupport$3 = Symbol('x').toString() === 'Symbol(x)';
  /** version: 1.4.0-alpha3 */

  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // key in engine service context for wire service context

  const CONTEXT_ID = '@wire'; // key in wire service context for updated listener metadata

  const CONTEXT_UPDATED = 'updated'; // key in wire service context for connected listener metadata

  const CONTEXT_CONNECTED = 'connected'; // key in wire service context for disconnected listener metadata

  const CONTEXT_DISCONNECTED = 'disconnected'; // wire event target life cycle connectedCallback hook event type

  const CONNECT = 'connect'; // wire event target life cycle disconnectedCallback hook event type

  const DISCONNECT = 'disconnect'; // wire event target life cycle config changed hook event type

  const CONFIG = 'config';
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */

  /*
   * Detects property changes by installing setter/getter overrides on the component
   * instance.
   */

  /**
   * Invokes the provided change listeners with the resolved component properties.
   * @param configListenerMetadatas List of config listener metadata (config listeners and their context)
   * @param paramValues Values for all wire adapter config params
   */

  function invokeConfigListeners(configListenerMetadatas, paramValues) {
    configListenerMetadatas.forEach(metadata => {
      const {
        listener,
        statics,
        reactives
      } = metadata;
      const reactiveValues = Object.create(null);

      if (reactives) {
        const keys = Object.keys(reactives);

        for (let j = 0, jlen = keys.length; j < jlen; j++) {
          const key = keys[j];
          const value = paramValues[reactives[key]];
          reactiveValues[key] = value;
        }
      } // TODO [#1634]: consider read-only membrane to enforce invariant of immutable config


      const config = Object.assign({}, statics, reactiveValues);
      listener.call(undefined, config);
    });
  }
  /**
   * Marks a reactive parameter as having changed.
   * @param cmp The component
   * @param reactiveParameters Reactive parameters that has changed
   * @param configContext The service context
   */


  function updated(cmp, reactiveParameters, configContext) {
    if (!configContext.mutated) {
      configContext.mutated = new Set(reactiveParameters); // collect all prop changes via a microtask

      Promise.resolve().then(updatedFuture.bind(undefined, cmp, configContext));
    } else {
      for (let i = 0, n = reactiveParameters.length; i < n; i++) {
        configContext.mutated.add(reactiveParameters[i]);
      }
    }
  }

  function updatedFuture(cmp, configContext) {
    const uniqueListeners = new Set(); // configContext.mutated must be set prior to invoking this function

    const mutated = configContext.mutated;
    delete configContext.mutated;
    mutated.forEach(reactiveParameter => {
      const value = getReactiveParameterValue(cmp, reactiveParameter);

      if (configContext.values[reactiveParameter.reference] === value) {
        return;
      }

      configContext.values[reactiveParameter.reference] = value;
      const listeners = configContext.listeners[reactiveParameter.head];

      for (let i = 0, len = listeners.length; i < len; i++) {
        uniqueListeners.add(listeners[i]);
      }
    });
    invokeConfigListeners(uniqueListeners, configContext.values);
  }
  /**
   * Gets the value of an @wire reactive parameter.
   * @param cmp The component
   * @param reactiveParameter The parameter to get
   */


  function getReactiveParameterValue(cmp, reactiveParameter) {
    let value = cmp[reactiveParameter.head];

    if (!reactiveParameter.tail) {
      return value;
    }

    const segments = reactiveParameter.tail;

    for (let i = 0, len = segments.length; i < len && value != null; i++) {
      const segment = segments[i];

      if (typeof value !== 'object' || !(segment in value)) {
        return undefined;
      }

      value = value[segment];
    }

    return value;
  }
  /**
   * Installs setter override to trap changes to a property, triggering the config listeners.
   * @param cmp The component
   * @param reactiveParametersHead The common head of the reactiveParameters
   * @param reactiveParameters Reactive parameters with the same head, that defines the property to monitor
   * @param configContext The service context
   */


  function installTrap(cmp, reactiveParametersHead, reactiveParameters, configContext) {
    const callback = updated.bind(undefined, cmp, reactiveParameters, configContext);
    const newDescriptor = getOverrideDescriptor(cmp, reactiveParametersHead, callback);
    Object.defineProperty(cmp, reactiveParametersHead, newDescriptor);
  }
  /**
   * Finds the descriptor of the named property on the prototype chain
   * @param target The target instance/constructor function
   * @param propName Name of property to find
   * @param protoSet Prototypes searched (to avoid circular prototype chains)
   */


  function findDescriptor(target, propName, protoSet) {
    protoSet = protoSet || [];

    if (!target || protoSet.indexOf(target) > -1) {
      return null; // null, undefined, or circular prototype definition
    }

    const descriptor = Object.getOwnPropertyDescriptor(target, propName);

    if (descriptor) {
      return descriptor;
    }

    const proto = Object.getPrototypeOf(target);

    if (!proto) {
      return null;
    }

    protoSet.push(target);
    return findDescriptor(proto, propName, protoSet);
  }
  /**
   * Gets a property descriptor that monitors the provided property for changes
   * @param cmp The component
   * @param prop The name of the property to be monitored
   * @param callback A function to invoke when the prop's value changes
   * @return A property descriptor
   */


  function getOverrideDescriptor(cmp, prop, callback) {
    const descriptor = findDescriptor(cmp, prop);
    let enumerable;
    let get;
    let set; // This does not cover the override of existing descriptors at the instance level
    // and that's ok because eventually we will not need to do any of these :)

    if (descriptor === null || descriptor.get === undefined && descriptor.set === undefined) {
      let value = cmp[prop];
      enumerable = true;

      get = function () {
        return value;
      };

      set = function (newValue) {
        value = newValue;
        callback();
      };
    } else {
      const {
        set: originalSet,
        get: originalGet
      } = descriptor;
      enumerable = descriptor.enumerable;

      set = function (newValue) {
        if (originalSet) {
          originalSet.call(cmp, newValue);
        }

        callback();
      };

      get = function () {
        return originalGet ? originalGet.call(cmp) : undefined;
      };
    }

    return {
      set,
      get,
      enumerable,
      configurable: true
    };
  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const ValueChangedEventType = 'ValueChangedEvent';
  /**
   * Event fired by wire adapters to emit a new value.
   */

  class ValueChangedEvent {
    constructor(value) {
      this.type = ValueChangedEventType;
      this.value = value;
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  const LinkContextEventType = 'LinkContextEvent';
  /**
   * Event fired by wire adapters to link to a context provider
   */

  class LinkContextEvent {
    constructor(uid, callback) {
      this.type = LinkContextEventType;
      this.uid = uid;
      this.callback = callback;
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */


  function removeListener(listeners, toRemove) {
    const idx = listeners.indexOf(toRemove);

    if (idx > -1) {
      listeners.splice(idx, 1);
    }
  }

  function removeConfigListener(configListenerMetadatas, toRemove) {
    for (let i = 0, len = configListenerMetadatas.length; i < len; i++) {
      if (configListenerMetadatas[i].listener === toRemove) {
        configListenerMetadatas.splice(i, 1);
        return;
      }
    }
  }

  function buildReactiveParameter(reference) {
    if (!reference.includes('.')) {
      return {
        reference,
        head: reference
      };
    }

    const segments = reference.split('.');
    return {
      reference,
      head: segments.shift(),
      tail: segments
    };
  }

  class WireEventTarget {
    constructor(cmp, def, context, wireDef, wireTarget) {
      this._cmp = cmp;
      this._def = def;
      this._context = context;
      this._wireDef = wireDef;
      this._wireTarget = wireTarget;
    }

    addEventListener(type, listener) {
      switch (type) {
        case CONNECT:
          {
            const connectedListeners = this._context[CONTEXT_ID][CONTEXT_CONNECTED];

            {
              assert$2.isFalse(connectedListeners.includes(listener), 'must not call addEventListener("connect") with the same listener');
            }

            connectedListeners.push(listener);
            break;
          }

        case DISCONNECT:
          {
            const disconnectedListeners = this._context[CONTEXT_ID][CONTEXT_DISCONNECTED];

            {
              assert$2.isFalse(disconnectedListeners.includes(listener), 'must not call addEventListener("disconnect") with the same listener');
            }

            disconnectedListeners.push(listener);
            break;
          }

        case CONFIG:
          {
            const reactives = this._wireDef.params;
            const statics = this._wireDef.static;
            let reactiveKeys; // no reactive parameters. fire config once with static parameters (if present).

            if (!reactives || (reactiveKeys = Object.keys(reactives)).length === 0) {
              const config = statics || Object.create(null);
              listener.call(undefined, config);
              return;
            }

            const configListenerMetadata = {
              listener,
              statics,
              reactives
            }; // setup listeners for all reactive parameters

            const configContext = this._context[CONTEXT_ID][CONTEXT_UPDATED];
            const reactiveParametersGroupByHead = {};
            reactiveKeys.forEach(key => {
              const reactiveParameter = buildReactiveParameter(reactives[key]);
              const reactiveParameterHead = reactiveParameter.head;
              let configListenerMetadatas = configContext.listeners[reactiveParameterHead];
              let reactiveParametersWithSameHead = reactiveParametersGroupByHead[reactiveParameterHead];

              if (isUndefined$4(reactiveParametersWithSameHead)) {
                reactiveParametersWithSameHead = [];
                reactiveParametersGroupByHead[reactiveParameterHead] = reactiveParametersWithSameHead;
              }

              reactiveParametersWithSameHead.push(reactiveParameter);

              if (!configListenerMetadatas) {
                configListenerMetadatas = [configListenerMetadata];
                configContext.listeners[reactiveParameterHead] = configListenerMetadatas;
                installTrap(this._cmp, reactiveParameterHead, reactiveParametersWithSameHead, configContext);
              } else {
                configListenerMetadatas.push(configListenerMetadata);
              }
            }); // enqueue to pickup default values

            Object.keys(reactiveParametersGroupByHead).forEach(head => {
              updated(this._cmp, reactiveParametersGroupByHead[head], configContext);
            });
            break;
          }

        default:
          throw new Error(`unsupported event type ${type}`);
      }
    }

    removeEventListener(type, listener) {
      switch (type) {
        case CONNECT:
          {
            const connectedListeners = this._context[CONTEXT_ID][CONTEXT_CONNECTED];
            removeListener(connectedListeners, listener);
            break;
          }

        case DISCONNECT:
          {
            const disconnectedListeners = this._context[CONTEXT_ID][CONTEXT_DISCONNECTED];
            removeListener(disconnectedListeners, listener);
            break;
          }

        case CONFIG:
          {
            const paramToConfigListenerMetadata = this._context[CONTEXT_ID][CONTEXT_UPDATED].listeners;
            const reactives = this._wireDef.params;

            if (reactives) {
              Object.keys(reactives).forEach(key => {
                const reactiveParameter = buildReactiveParameter(reactives[key]);
                const configListenerMetadatas = paramToConfigListenerMetadata[reactiveParameter.head];

                if (configListenerMetadatas) {
                  removeConfigListener(configListenerMetadatas, listener);
                }
              });
            }

            break;
          }

        default:
          throw new Error(`unsupported event type ${type}`);
      }
    }

    dispatchEvent(evt) {
      if (evt instanceof ValueChangedEvent) {
        const value = evt.value;

        if (this._wireDef.method) {
          this._cmp[this._wireTarget](value);
        } else {
          this._cmp[this._wireTarget] = value;
        }

        return false; // canceling signal since we don't want this to propagate
      } else if (evt instanceof LinkContextEvent) {
        const {
          uid,
          callback
        } = evt; // This event is responsible for connecting the host element with another
        // element in the composed path that is providing contextual data. The provider
        // must be listening for a special dom event with the name corresponding to `uid`,
        // which must remain secret, to guarantee that the linkage is only possible via
        // the corresponding wire adapter.

        const internalDomEvent = new CustomEvent(uid, {
          bubbles: true,
          composed: true,

          // avoid leaking the callback function directly to prevent a side channel
          // during the linking phase to the context provider.
          detail(...args) {
            callback(...args);
          }

        });

        this._cmp.dispatchEvent(internalDomEvent);

        return false; // canceling signal since we don't want this to propagate
      } else if (evt.type === 'wirecontextevent') {
        // TODO [#1357]: remove this branch
        return this._cmp.dispatchEvent(evt);
      } else {
        throw new Error(`Invalid event ${evt}.`);
      }
    }

  }
  /*
   * Copyright (c) 2018, salesforce.com, inc.
   * All rights reserved.
   * SPDX-License-Identifier: MIT
   * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
   */
  // wire adapters: wire adapter id => adapter ctor


  const adapterFactories = new Map();
  /**
   * Invokes the specified callbacks.
   * @param listeners functions to call
   */

  function invokeListener(listeners) {
    for (let i = 0, len = listeners.length; i < len; ++i) {
      listeners[i].call(undefined);
    }
  }
  /**
   * The wire service.
   *
   * This service is registered with the engine's service API. It connects service
   * callbacks to wire adapter lifecycle events.
   */


  const wireService = {
    wiring: (cmp, data, def, context) => {
      const wireContext = context[CONTEXT_ID] = Object.create(null);
      wireContext[CONTEXT_CONNECTED] = [];
      wireContext[CONTEXT_DISCONNECTED] = [];
      wireContext[CONTEXT_UPDATED] = {
        listeners: {},
        values: {}
      }; // engine guarantees invocation only if def.wire is defined

      const wireStaticDef = def.wire;
      const wireTargets = Object.keys(wireStaticDef);

      for (let i = 0, len = wireTargets.length; i < len; i++) {
        const wireTarget = wireTargets[i];
        const wireDef = wireStaticDef[wireTarget];
        const adapterFactory = adapterFactories.get(wireDef.adapter);

        {
          assert$2.isTrue(wireDef.adapter, `@wire on "${wireTarget}": adapter id must be truthy`);
          assert$2.isTrue(adapterFactory, `@wire on "${wireTarget}": unknown adapter id: ${String(wireDef.adapter)}`); // enforce restrictions of reactive parameters

          if (wireDef.params) {
            Object.keys(wireDef.params).forEach(param => {
              const prop = wireDef.params[param];
              const segments = prop.split('.');
              segments.forEach(segment => {
                assert$2.isTrue(segment.length > 0, `@wire on "${wireTarget}": reactive parameters must not be empty`);
              });
              assert$2.isTrue(segments[0] !== wireTarget, `@wire on "${wireTarget}": reactive parameter "${segments[0]}" must not refer to self`); // restriction for dot-notation reactive parameters

              if (segments.length > 1) {
                // @wire emits a stream of immutable values. an emit sets the target property; it does not mutate a previously emitted value.
                // restricting dot-notation reactive parameters to reference other @wire targets makes trapping the 'head' of the parameter
                // sufficient to observe the value change.
                assert$2.isTrue(wireTargets.includes(segments[0]) && wireStaticDef[segments[0]].method !== 1, `@wire on "${wireTarget}": dot-notation reactive parameter "${prop}" must refer to a @wire property`);
              }
            });
          }
        }

        if (adapterFactory) {
          const wireEventTarget = new WireEventTarget(cmp, def, context, wireDef, wireTarget);
          adapterFactory({
            dispatchEvent: wireEventTarget.dispatchEvent.bind(wireEventTarget),
            addEventListener: wireEventTarget.addEventListener.bind(wireEventTarget),
            removeEventListener: wireEventTarget.removeEventListener.bind(wireEventTarget)
          });
        }
      }
    },
    connected: (cmp, data, def, context) => {
      let listeners;

      {
        assert$2.isTrue(!def.wire || context[CONTEXT_ID], 'wire service was not initialized prior to component creation:  "connected" service hook invoked without necessary context');
      }

      if (!def.wire || !(listeners = context[CONTEXT_ID][CONTEXT_CONNECTED])) {
        return;
      }

      invokeListener(listeners);
    },
    disconnected: (cmp, data, def, context) => {
      let listeners;

      {
        assert$2.isTrue(!def.wire || context[CONTEXT_ID], 'wire service was not initialized prior to component creation:  "disconnected" service hook invoked without necessary context');
      }

      if (!def.wire || !(listeners = context[CONTEXT_ID][CONTEXT_DISCONNECTED])) {
        return;
      }

      invokeListener(listeners);
    }
  };
  /**
   * Registers the wire service.
   */

  function registerWireService(registerService) {
    registerService(wireService);
  }
  /** version: 1.4.0-alpha3 */

  registerWireService(register);
  customElements.define('my-app', buildCustomElementConstructor(MyApp));

}());
