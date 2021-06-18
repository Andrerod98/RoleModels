type AsyncFunction = () => Promise<void>;
class AsyncFunctionQueue {
  _queue: AsyncFunction[] = [];

  push(val: AsyncFunction) {
    if (this.isEmpty()) {
      this._queue.push(val);
    }
  }

  async pop(): Promise<void> {
    await this._queue.shift()();

    this.onFinish();
  }

  onFinish() {
    if (!this.isEmpty) this.pop();
  }

  isEmpty() {
    return this._queue.length;
  }

  clear() {
    this._queue = [];
  }
}
