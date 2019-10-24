export const state = () => ({
  students: []
})

export const mutations = {
  updateStudent(state, payload) {
    state.students = payload
  }
}

export const actions = {
  updateStudent({ commit }, payload) {
    commit('updateStudent', payload)
  }
}