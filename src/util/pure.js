export default function Pure (props, state) {
  for (let p in props) {
    if (this.props[p] !== props[p]) return true
  }

  for (let s in state) {
    if (this.state[s] !== state[s]) return true
  }

  return false
}
