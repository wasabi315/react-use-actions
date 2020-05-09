import { renderHook, act } from '@testing-library/react-hooks'
import { defineActions, useActions } from '../.'

const actions = defineActions<number>()({
  add: (count, ...nums: number[]) => nums.reduce((n, m) => n + m, count),
  reset: () => 0,
})

test('State changes when action called', () => {
  const { result } = renderHook(() => useActions(actions, 0))

  act(() => void result.current[1].add(1))
  expect(result.current[0]).toBe(1)

  act(() => void result.current[1].reset())
  expect(result.current[0]).toBe(0)

  act(() => void result.current[1].add(1, 2, 3))
  expect(result.current[0]).toBe(6)
})
