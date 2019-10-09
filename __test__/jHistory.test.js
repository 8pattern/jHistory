const JHistory = require('../src').default

describe('functional testing', () => {
  const jHistory = new JHistory()

  beforeEach(() => {
    jHistory.clear()
  })

  test('when push data, the size will increase', () => {
    jHistory.pushState(1)
    expect(jHistory.size).toBe(1)
    jHistory.pushState(2)
    expect(jHistory.size).toBe(2)
  })

  test('when push data beyond maxSize, the last maxSize state will be stored', () => {
    const jHistoryTemp = new JHistory({ maxSize: 2 })
    expect(jHistoryTemp.size).toBe(0)
    jHistoryTemp.pushState(1)
    expect(jHistoryTemp.size).toBe(1)
    jHistoryTemp.pushState(2)
    expect(jHistoryTemp.size).toBe(2)
    jHistoryTemp.pushState(3)
    expect(jHistoryTemp.size).toBe(2)
    expect(jHistoryTemp.current).toBe(3)
    jHistoryTemp.pushState(4)
    expect(jHistoryTemp.size).toBe(2)
    expect(jHistoryTemp.current).toBe(4)
  })

  test('when push data, latter states will be deleted', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    jHistory.pushState(4)
    expect(jHistory.size).toBe(4)

    jHistory.go(-2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)
    expect(jHistory.size).toBe(4)

    jHistory.pushState(4)
    expect(jHistory.index).toBe(2)
    expect(jHistory.current).toBe(4)
    expect(jHistory.size).toBe(3)
  })

  test('when replace data, the size and index will not change, will the current state will change', () => {
    jHistory.pushState(1)
    expect(jHistory.size).toBe(1)
    expect(jHistory.index).toBe(0)

    jHistory.pushState(2)
    expect(jHistory.size).toBe(2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)

    jHistory.replaceState(3)
    expect(jHistory.size).toBe(2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(3)
  })

  test('when replace data, latter states will be deleted', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    jHistory.pushState(4)
    expect(jHistory.size).toBe(4)

    jHistory.go(-2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)
    expect(jHistory.size).toBe(4)

    jHistory.replaceState(4)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(4)
    expect(jHistory.size).toBe(2)
  })

  test('if index removed beyond the range, return false', () => {
    expect(jHistory.removeState(-1)).toBeFalsy()
    expect(jHistory.removeState(jHistory.size)).toBeFalsy()
  })

  test('if index removed in the range, return true, and the state will be removed', () => {
    expect(jHistory.removeState(0)).toBeFalsy()

    jHistory.pushState(1)
    expect(jHistory.size).toBe(1)

    expect(jHistory.removeState(0)).toBeTruthy()
    expect(jHistory.size).toBe(0)
  })

  test('if index removed before the current index, the index will minus 1 but current state will not change', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)
    
    jHistory.removeState(0)
    expect(jHistory.index).toBe(0)
    expect(jHistory.current).toBe(2)
  })

  test('if index removed after the current index, the index and current state will not change', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)

    jHistory.back()
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)

    jHistory.removeState(2)
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)
  })

  test('if index removed is the current index exactly, the index will minus 1 and the current state will become the previous', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)

    jHistory.back()
    expect(jHistory.index).toBe(1)
    expect(jHistory.current).toBe(2)

    jHistory.removeState(1)
    expect(jHistory.index).toBe(0)
    expect(jHistory.current).toBe(1)
  })

  test('the target index will not be beyond the range', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    jHistory.pushState(4)
    
    expect(jHistory.go(-Infinity)).toBeUndefined()
    expect(jHistory.index).toBe(-1)
    expect(jHistory.size).toBe(4)
    expect(jHistory.current).toBeUndefined()

    expect(jHistory.go(Infinity)).toBe(4)
    expect(jHistory.index).toBe(3)
    expect(jHistory.size).toBe(4)
    expect(jHistory.current).toBe(4)
  })

  test('the sequential call back will return right result', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    jHistory.pushState(4)
    jHistory.pushState(5)

    expect(jHistory.current).toBe(5)
    expect(jHistory.back()).toBe(4)
    expect(jHistory.back()).toBe(3)
    expect(jHistory.back()).toBe(2)
    expect(jHistory.back()).toBe(1)
    expect(jHistory.back()).toBeUndefined()
  })

  test('the sequential call forward will return right result', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    jHistory.pushState(4)
    jHistory.pushState(5)

    jHistory.goto(-1)

    expect(jHistory.current).toBeUndefined()
    expect(jHistory.forward()).toBe(1)
    expect(jHistory.forward()).toBe(2)
    expect(jHistory.forward()).toBe(3)
    expect(jHistory.forward()).toBe(4)
    expect(jHistory.forward()).toBe(5)
    expect(jHistory.forward()).toBe(5)
  })

  test('clear works', () => {
    jHistory.pushState(1)
    jHistory.pushState(2)
    jHistory.pushState(3)
    expect(jHistory.index).toBe(2)
    expect(jHistory.size).toBe(3)

    jHistory.clear()
    expect(jHistory.index).toBe(-1)
    expect(jHistory.size).toBe(0)
  })
})

describe('basic type variable can work', () => {
  const jHistory = new JHistory()

  beforeEach(() => {
    jHistory.clear()
  })

  test('when push number, the current will be same as the data', () => {
    const v = Math.round() * 100
    jHistory.pushState(v)
    expect(jHistory.current).toBe(v)

    const v2 = Math.round() * 100
    jHistory.pushState(v2)
    expect(jHistory.current).toBe(v2)

    jHistory.back()
    expect(jHistory.current).toBe(v)
  })

  test('when push string, the current will be same as the data', () => {
    const v = 'Hello world'
    jHistory.pushState(v)
    expect(jHistory.current).toBe(v)

    const v2 = 'Hello World'
    jHistory.pushState(v2)
    expect(jHistory.current).toBe(v2)

    jHistory.back()
    expect(jHistory.current).toBe(v)
  })

  test('when push boolean, the current will be same as the data', () => {
    const v = true
    jHistory.pushState(v)
    expect(jHistory.current).toBe(v)

    const v2 = false
    jHistory.pushState(v2)
    expect(jHistory.current).toBe(v2)

    jHistory.back()
    expect(jHistory.current).toBe(v)
  })

  test('when push pure array, the current will equal to the data', () => {
    const v = [1, 'hello', true]
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    v[1] = 'world'
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    jHistory.back()
    expect(jHistory.current).toEqual([1, 'hello', true])
  })

  test('when push pure object, the current will equal to the data', () => {
    const v = { a: 1, b: 2 }
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    v.b = 123
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    jHistory.back()
    expect(jHistory.current).toEqual({ a: 1, b: 2 })
  })

  test('when push complex array, the current will equal to the data', () => {
    const v = [1, 'hello', true, { a: 1, b: 2 }]
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    v[3].c = '4'
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    jHistory.back()
    expect(jHistory.current).toEqual([1, 'hello', true, { a: 1, b: 2 }])
  })

  test('when push complex object, the current will equal to the data', () => {
    const v = { a: 1, b: [1,2,3,4], c: { t: 123} }
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    v.c.t = '11111111'
    jHistory.pushState(v)
    expect(jHistory.current).toEqual(v)

    jHistory.back()
    expect(jHistory.current).toEqual({ a: 1, b: [1,2,3,4], c: { t: 123} })
  })

  test('when push immutable object, the current will be same as the data', () => {
    const immutable = require('immutable')
    const v = immutable.List([1, 2, 3, {a: 1, b: [123]}])

    jHistory.pushState(v)
    expect(jHistory.current).toBe(v)

    jHistory.pushState(v.update(0, () => '123123'))
    expect(jHistory.current).not.toBe(v)


    jHistory.back()
    expect(jHistory.current).toBe(v)
  })
})