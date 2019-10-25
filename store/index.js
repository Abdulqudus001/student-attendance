export const state = () => ({
  students: [],
  courses: []
})

export const mutations = {
  updateStudents (state, payload) {
    state.students = payload
  },
  updateCourses (state, payload) {
    state.courses = payload
  }
}

export const actions = {
  updateStudent ({ commit }, payload) {
    commit('updateStudents', payload)
  },
  updateCourses ({ commit }, payload) {
    commit('updateCourses', payload)
  }
}
