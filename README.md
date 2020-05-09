# react-use-actions

> Just another style of `useReducer`

In this `react-use-actions` world, we invoke the `dispatch` with method call style

```ts
const onClick = () => dispatch.increment()
```

instead of

```ts
const onClick = () => dispatch({ type: 'INCREMENT' })
```

Since the **dispatch object** is fully typed, this style helps editors' autocompletion :heart_eyes:

## Installation

```sh
$ npm i --save react-use-actions
# or
$ yarn add react-use-actions
```

## Example

```tsx
import React from 'react'
import { render } from 'react-dom'
import { defineActions, useActions } from 'react-use-actions'

interface State {
  count: number
}

const actions = defineActions<State>()({
  decrement: state => ({ count: state.count - 1 }),
  increment: state => ({ count: state.count + 1 }),
})

const App: React.FC = () => {
  const [state, dispatch] = useActions(actions, 0)
  return (
    <div>
      <button onClick={dispatch.decrement}>-</button>
      <span>count = {state.count}</span>
      <button onClick={dispatch.increment}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root))
```

## API

### `defineActions()(actions)`

```ts
interface State {
  ...
}

const actions = defineActions<State>()({
  foo: state => { /* 'state' is typed as 'State' here */ return ... },
  // You can pass arguments to actions
  bar: (state, arg1: T1, arg2: T2) => { return ... },
  // Optional argument and variable length argument is allowed
  baz: (state, arg3: T3, ...arg4: T4[]) => { return ... },
})
```

A no-op behavior-wise function. This function is provided only for type inference.

### `useActions(actions, intialState)`

```tsx
const SomeComponent = () => {
  const [state, dispatch] = useActions(actions, initialState)
  ...
  return (
    <>
      <!-- 'dispatch' is fully typed! -->
      <button onClick={() => dispatch.foo()}>foo</button>
      <button onClick={() => dispatch.bar(arg1, arg2)}>foo</button>
      <button onClick={() => dispatch.foo(arg3, arg41, arg42)}>foo</button>
    </>
  )
}
```

You can create initial state lazily as with the original API of `useReducer`.

```ts
const [state, dispatch] = useActions(actions, initialArg, initializer)
```

## License

MIT
