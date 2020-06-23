import axios from 'axios'

export default { // eslint-disable-next-line no-unused-vars
    namespaced: true,
    state: {
        data: {
            token: "",
            username: "",
            detail: { email: "", avatar: "", name: "" },
            submission: [],
            questions: [],
            codeSession: []
        }
    },

    // eslint-disable-next-line no-unused-vars
    getters: {
        getSubmission: state => {
            var data = state.data
            if (data.submission.length) {
                let arr = JSON.parse(JSON.stringify(data.submission))
                for (let i = 0; i < arr.length; i++) {
                    arr[i].i_d = i + 1;
                    var q = data.questions.filter(el => {
                        return el.id == arr[i].questionId
                    }).slice()
                    if (q[0]) {
                        let key = ["title", "rank", "finished", "id"]
                        key.forEach(key => {
                            arr[i][key] = q[0][key]
                        })
                    }
                }
                return arr.slice()
            }
            return []
        },
        getToken: state => {
            return state.data.token
        },
        getQuestions: (state) => {
            //   var sub = JSON.parse(JSON.stringify(state.data.submission))
            // var que = JSON.parse(JSON.stringify(state.data.questions))
            // sub.forEach(el => {
            //     el.userPassed = true
            //     if (el.result)
            //         for (let i = 0; i < el.result.length; i++) {
            //             if (el.result.charAt(i) != 'P') {
            //                 el.userPassed = false
            //                 break
            //             }
            //         }
            //     else {
            //         el.userPassed = false
            //     }
            //     que.forEach(e => {
            //         if (e.id == el.questionId) {
            //             e.userPassed = el.userPassed
            //         }
            //     })
            // })
            // return que
            return state.data.questions
        },
        getLastSubmission: (state) => (id) => {
            var data = state.data
            if (data.submission) {
                for (let i = data.submission.length - 1; i > -1; --i) {
                    if (data.submission[i].questionId == id) {
                        return data.submission[i]
                    }
                }
                return []
            } else return []

        },
        getSessionCode: (state) => (id) => {
            if (state[id])
                return state[id].code
            else return ""
        }
    },

    // eslint-disable-next-line no-unused-vars
    mutations: {
        setApiToken(state, token) {
            state.data.token = token
        },
        set(state, data) {
            state.data = data
        },
        setQuestions(state, data) {
            state.data.questions = data
        },
        setSubmission(state, data) {
            state.data.submission = data
        },
        changeImage(state, url) {
            state.data.detail.avatar = url
        },
        changeName(state, name) {
            state.data.detail.name = name
        },
        clear(state) {
            state.data = {
                token: "",
                username: "",
                detail: { email: "", avatar: "", name: "" },
                submission: [],
                questions: []
            }
        },
        addSessionCode(state, data) {
            var body = {}
            body[data.id] = true
            body['code'] = data.code
            console.log(body)
                //      state.data.codeSession.push(data)
        }

    },
    // eslint-disable-next-line no-unused-vars
    actions: {
        updateQuestion({ state, commit, rootState }) {
            var tok = state.data.token
            axios.get(rootState.api + "/api/v1/questions").then(res => {
                var allQuestion = res.data.data
                for (var i = 0; i < allQuestion.length; i++) {
                    allQuestion[i].i_d = i + 1;
                }
                commit('setQuestions', allQuestion)
            }).catch(err => {
                console.log(err)
            })
            axios.post(rootState.api + '/api/v1/list_submission', {
                token: tok
            }).then(response => {
                var submission = response.data.data
                if (!submission) submission = []
                commit('setSubmission', submission)
            })
        },
        // autoSave({ state, commit }) {

        // }
    }
}