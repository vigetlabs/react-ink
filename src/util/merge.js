export function merge(/* args */) {
  let copy = {}

  for (var i = 0; i < arguments.length; i++) {
    let subject = arguments[i]

    if (subject) {
      for (var key in subject) {
        copy[key] = subject[key]
      }
    }
  }

  return copy
}
