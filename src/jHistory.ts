import immutable from 'immutable'

interface Option {
  maxSize: number;
}

interface State {
  value: immutable.List<any> | immutable.Map<string | number, any> | string | number | boolean;
  type: string;
}

export default class JHistory {
  private option: Option
  private stack: immutable.List<any>
  private index: number

  constructor(option?: object) {
    this.option = {
      maxSize: 100,
      ...option,
    }
    this.stack = immutable.List()
    this.index = -1
  }

  get size(): number {
    return this.stack.size
  }

  get current(): any {
    return this.go(0)
  }

  private data2state(data: any): State {
    if (data instanceof immutable.Collection) {
      return {
        value: immutable.fromJS(data),
        type: 'immutable',
      }
    }
    return {
      value: immutable.fromJS(data),
      type: typeof data,
    }
  }
  
  private state2data({ value, type }: State): any {
    if (type === 'immutable') {
      return value
    }
    if(value instanceof immutable.Collection) {
      return (value as immutable.Collection<any, any>).toJS()
    }
    return value
  }

  private sliceStack(index: number = this.index): immutable.List<any> {
    return this.stack.slice(0, index + 1)
  }

  private checkStackSize(): void {
    const { maxSize } = this.option
    if (this.size >= maxSize) {
      this.stack = this.stack.slice(-maxSize)
      this.index = maxSize - 1
    }
  }
  
  pushState(data: any): void {
    this.stack = this.sliceStack(this.index).push(this.data2state(data))
    this.index += 1
    this.checkStackSize()
  }

  replaceState(data: any): void {
    if (this.index < 0) {
      this.pushState(data)
    } else {
      this.stack = this.sliceStack(this.index).splice(this.index, 1, this.data2state(data))
    }
  }

  removeState(index: number): boolean {
    if (index < 0 || index >= this.size) {
      return false
    }
    this.stack = this.stack.splice(index, 1)
    if (this.index >= index) {
      this.index -= 1
    }
    return true
  }

  goto(targetIndex: number): any {
    this.index = Math.min(Math.max(-1, targetIndex), this.size - 1)
    if (this.index < 0) {
      return undefined
    }
    const state = this.stack.get(this.index)
    return this.state2data(state)
  }

  go(offsetIndex: number): any {
    return this.goto(this.index + offsetIndex)
  }

  back(): any {
    return this.go(-1)
  }

  forward(): any {
    return this.go(+1)
  }

  clear(): void {
    this.stack = immutable.List()
    this.index = -1
  }
}
