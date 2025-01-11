import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
    dashboard: {
      loading: false,
      data: {},
    },
    surveys: {
      loading: false,
      links: [],
      data: [],
    },
    currentSurvey: {
      data: {},
      loading: false,
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    notification: {
      show: false,
      type: "success",
      message: "",
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user.token,
    currentUser: (state) => state.user.data,
  },
  actions: {
    // User Registration
    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data.user);
        commit("setToken", data.token);
        return data;
      });
    },

    // User Login
    login({ commit }, user) {
      return axiosClient.post("/login", user).then(({ data }) => {
        commit("setUser", data.user);
        commit("setToken", data.token);
        return data;
      });
    },

    // User Logout
    logout({ commit }) {
      return axiosClient.post("/logout").then(() => {
        commit("logout");
      });
    },

    // Fetch User Data
    getUser({ commit }) {
      return axiosClient.get("/user").then((res) => {
        commit("setUser", res.data);
      });
    },

    // Dashboard Data
    getDashboardData({ commit }) {
      commit("dashboardLoading", true);
      return axiosClient
        .get("/dashboard")
        .then((res) => {
          commit("setDashboardData", res.data);
        })
        .finally(() => {
          commit("dashboardLoading", false);
        });
    },

    // Fetch Surveys
    getSurveys({ commit }, { url = null } = {}) {
      commit("setSurveysLoading", true);
      url = url || "/survey";
      return axiosClient
        .get(url)
        .then((res) => {
          commit("setSurveys", res.data);
        })
        .finally(() => {
          commit("setSurveysLoading", false);
        });
    },

    // Fetch Single Survey
    getSurvey({ commit }, id) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey/${id}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
        })
        .finally(() => {
          commit("setCurrentSurveyLoading", false);
        });
    },

    // Fetch Survey by Slug
    getSurveyBySlug({ commit }, slug) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey-by-slug/${slug}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
        })
        .finally(() => {
          commit("setCurrentSurveyLoading", false);
        });
    },

    // Save Survey (Create or Update)
    saveSurvey({ commit }, survey) {
      delete survey.image_url;

      const request = survey.id
        ? axiosClient.put(`/survey/${survey.id}`, survey)
        : axiosClient.post("/survey", survey);

      return request.then((res) => {
        commit("setCurrentSurvey", res.data);
        return res;
      });
    },

    // Delete Survey
    deleteSurvey({ dispatch }, id) {
      return axiosClient.delete(`/survey/${id}`).then(() => {
        dispatch("getSurveys");
      });
    },

    // Save Survey Answers
    saveSurveyAnswer({ commit }, { surveyId, answers }) {
      return axiosClient.post(`/survey/${surveyId}/answer`, { answers });
    },
  },
  mutations: {
    logout: (state) => {
      state.user.token = null;
      state.user.data = {};
      sessionStorage.removeItem("TOKEN");
    },

    setUser: (state, user) => {
      state.user.data = user;
    },

    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem("TOKEN", token);
    },

    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },

    setDashboardData: (state, data) => {
      state.dashboard.data = data;
    },

    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },

    setSurveys: (state, surveys) => {
      state.surveys.links = surveys.meta.links;
      state.surveys.data = surveys.data;
    },

    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },

    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },

    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
  },
  modules: {},
});

export default store;
