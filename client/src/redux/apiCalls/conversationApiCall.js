import { toast } from "react-toastify";
import request from "../../utils/request";
import { conversationActions } from "../slices/conversationSlice";
import { refreshToken } from "./authApiCall";

export function createConversation(conversationInfo) {
  return async (dispatch, getState) => {
    try {
      await request.post("/api/conversations/", conversationInfo, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
    } catch (error) {
      if (error.response.status === 401) {
        await dispatch(refreshToken())
        await dispatch(createConversation(conversationInfo));
        return;

      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

export function fetchOtherUserData(userId, type) {
  return async (dispatch, getState) => {
    try {
      if (type === "user") {
        const { data } = await request.get(`/api/user/profile/${userId}`, {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        });
        dispatch(conversationActions.setOtherUser(data));
      } else {
        const { data } = await request.get(`/api/mechanic/${userId}`, {
          headers: {
            Cookie: document.cookie.i18next,
          },
          withCredentials: true,
        });
        dispatch(conversationActions.setOtherUser(data));
      }
    } catch (error) {
      if (error.response.status === 401) {
        await dispatch(refreshToken())
        await dispatch(fetchOtherUserData(userId, type));
        return;

      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };
}

export function fetchUserConversations(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(conversationActions.setLoading());
      const { data } = await request.get(`/api/conversations/${userId}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          Cookie: document.cookie.i18next,
        },
        withCredentials: true,
      });
      dispatch(conversationActions.setConversations(data));
      dispatch(conversationActions.clearLoading());
    } catch (error) {
      if (error.response.status === 401) {
        await dispatch(refreshToken())
        await dispatch(fetchUserConversations(userId));
        return;
      }
      else {
        console.log(error);
        toast.error(error.response.data.message);
      }

    } finally {
      dispatch(conversationActions.clearLoading());
    }

  };
}
