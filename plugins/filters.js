import Vue from 'vue'
// Defining custom filters

// This filters capitalizes each word in the sentence
Vue.filter('capitalize', (value) => {
  if (!value) {
    return ''
  }
  const splitValue = value.toString().split(' ')
  const capitalizedArr = splitValue.map((val) => {
    return val[0].toUpperCase() + val.slice(1)
  })
  return capitalizedArr.join(' ')
})
