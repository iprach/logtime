const Logtime = require('../index')
// let test
// let expect
const defaultOptions = {
  timestamp: new Date().getTime(),
  timeout: 60000
}

test('new instance Logtime', () => {
  expect(new Logtime()).toBeInstanceOf(Logtime)
})

test('get default logtime', () => {
  const timetracker = new Logtime()
  expect(typeof timetracker.getTime()).toBe('number')
  expect(timetracker.getTimeout()).toEqual(defaultOptions.timeout)
})

test('define Logtime options', () => {
  const timestamp = new Date('2018-07-13T05:26:59.283Z').getTime()
  const timeout = 120000
  const timetracker = new Logtime({
    timestamp,
    timeout
  })
  expect(timetracker.getTime()).toEqual(timestamp)
  expect(timetracker.getTimeout()).toEqual(timeout)
})

test('timeout exceed', done => {
  const timeout = 500
  const timetracker = new Logtime({
    timeout
  })
  expect(timetracker.isTimeout()).toBe(false)
  setTimeout(() => {
    expect(timetracker.isTimeout()).toBe(false)
  }, 10)
  setTimeout(() => {
    expect(timetracker.isTimeout()).toBe(true)
    done()
  }, 1000)
})

test('add tracker', () => {
  const timetracker = new Logtime()
  function mockupFn () {
    timetracker.track('mockupFn1')
    return '1'
  }
  function mockupFn2 () {
    timetracker.track('mockupFn2')
    return '2'
  }
  mockupFn()
  mockupFn2()
  const expected = [
    {
      name: 'mockupFn1',
      time: expect.any(Number),
      readable_time: expect.any(String)
    }, {
      name: 'mockupFn2',
      time: expect.any(Number),
      readable_time: expect.any(String)
    }]
  expect(timetracker.trace()).toEqual(expect.arrayContaining(expected))
})

test('log tracker', (done) => {
  const timetracker = new Logtime({
    timeout: 2000
  })
  function mockupFn () {
    timetracker.track('mockupFn1')
    return '1'
  }
  function mockupFn2 () {
    setTimeout(() => timetracker.track('mockupFn2'), 500)
    return '2'
  }
  mockupFn()
  mockupFn2()
  const expected = [
    {
      name: 'mockupFn1',
      time: expect.any(Number),
      readable_time: expect.any(String)
    }, {
      name: 'mockupFn2',
      time: expect.any(Number),
      readable_time: expect.any(String)
    }]
  setTimeout(() => {
    done()
  }, 3000)
})
