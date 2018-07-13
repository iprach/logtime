const prettyMs = require('pretty-ms')

class Logtime {
  constructor (options = {}) {
    const self = this
    this.ts = new Date(options.timestamp).getTime() || new Date().getTime()
    this.timeout = options.timeout || 60000
    this.tracks = []
    this.countdownLog = setTimeout(() => {
      const str = self.trace().map(t => `\n${t.name}: ${t.readable_time}`)
      if (self.tracks.length > 0) console.log(str.toString())
    }, this.timeout)
  }

  getTime () {
    return this.ts
  }

  getTimeout () {
    return this.timeout
  }

  isTimeout () {
    const t = new Date().getTime()
    return (t - this.ts) > this.timeout
  }

  track (name) {
    const previousTrackIndex = this.tracks.length - 1
    const ts = new Date().getTime()
    this.tracks.push({
      name,
      ts,
      diff_time: null
    })
    if (previousTrackIndex >= 0) {
      const previousTrack = this.tracks[previousTrackIndex]
      previousTrack.diff_time = ts - previousTrack.ts
    }
  }

  trace () {
    const now = new Date().getTime()
    return this.tracks
      .map(t => (
        {
          name: t.name,
          time: t.diff_time === null ? now - t.ts : t.diff_time,
          readable_time: t.diff_time === null ? prettyMs(now - t.ts) : prettyMs(t.diff_time)
        }
      ))
  }

  done () {
    clearTimeout(this.countdownLog)
  }
}

module.exports = Logtime
