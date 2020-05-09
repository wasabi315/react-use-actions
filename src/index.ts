import { useReducer, useMemo } from 'react'

/*
 * Types
 */
type Action<S, P extends any[]> = (state: S, ...payload: P) => S

type ActionPayload<A extends Action<any, any>> = A extends Action<any, infer P> ? P : never

type ActionRecord<S> = Record<string, Action<S, any>>

type ActionState<T extends ActionRecord<any>> = T extends ActionRecord<infer S> ? S : never

type DispatchRecord<T extends ActionRecord<any>> = {
  [K in keyof T]: (...payload: ActionPayload<T[K]>) => void
}

/*
 * Functions
 */
export function defineActions<S>() {
  return <T extends ActionRecord<S>>(actions: T): T => actions
}

function createDispatchRecord<T extends ActionRecord<any>>(
  actions: T,
  dispatch: (arg: { type: keyof T; payload: unknown[] }) => void
): DispatchRecord<T> {
  const dispatches = new Proxy(
    {},
    {
      get: (_, prop) => {
        if (typeof prop !== 'string' || !(prop in actions)) {
          throw new Error(`Unknown type of action '${String(prop)}' called`)
        }
        return (...payload: unknown[]): void => dispatch({ type: prop, payload })
      },
    }
  )
  return (dispatches as unknown) as DispatchRecord<T>
}

export function useActions<T extends ActionRecord<any>>(
  actions: T,
  initialArg: ActionState<T>
): [ActionState<T>, DispatchRecord<T>]

export function useActions<T extends ActionRecord<any>, I>(
  actions: T,
  initialArg: I,
  initializer: (initialArg: I) => ActionState<T>
): [ActionState<T>, DispatchRecord<T>]

export function useActions<T extends ActionRecord<any>, I>(
  actions: T,
  initialArg: I | ActionState<T>,
  initializer?: (initialArg: I) => ActionState<T>
): [ActionState<T>, DispatchRecord<T>] {
  function reducer(
    state: ActionState<T>,
    action: { type: keyof T; payload: unknown[] }
  ): ActionState<T> {
    return actions[action.type](state, ...action.payload)
  }

  const [state, dispatch] = useReducer(reducer, initialArg, initializer as any)
  const dispatches = useMemo(() => createDispatchRecord(actions, dispatch), [actions])

  return [state, dispatches]
}
