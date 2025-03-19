// Currently all app state is stored in this one slice. It's primarily
// tracking course and video download state. It's populated on page
// load by examining the local file cache.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  newUserCourse,
  UserCourse,
  UserCourses,
  UserVideos,
  UserVideo,
  VideoQueue,
  VideoQueueItem,
} from "../../types";

export interface UserStore {
  userCourses: UserCourses;
  userVideos: UserVideos;
  videoQueue: VideoQueue;
}

const initialState: UserStore = {
  userCourses: {},
  userVideos: {},
  videoQueue: [],
};

const userStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialCourses: (state, action: PayloadAction<UserCourses>) => {
      state.userCourses = action.payload;
    },
    setInitialVideos: (state, action: PayloadAction<UserVideos>) => {
      state.userVideos = action.payload;
    },
    updateCourse: (
      state,
      action: PayloadAction<{ courseId: string; updates: Partial<UserCourse> }>,
    ) => {
      const { courseId, updates } = action.payload;
      const course = state.userCourses[courseId] || newUserCourse();
      state.userCourses[courseId] = { ...course, ...updates };
    },
    deleteCourse: (state, action: PayloadAction<{ courseId: string }>) => {
      delete state.userCourses[action.payload.courseId];
      delete state.userVideos[action.payload.courseId];
    },
    addToVideoQueue(state, action: PayloadAction<VideoQueue>) {
      state.videoQueue.push(...action.payload);
    },
    updateVideoQueue: (state, action: PayloadAction<VideoQueue>) => {
      state.videoQueue = action.payload;
    },
    updateUserVideo: (
      state,
      action: PayloadAction<{
        courseId: string;
        videoId: string;
        updates: Partial<UserVideo>;
      }>,
    ) => {
      const { courseId, videoId, updates } = action.payload;
      if (!state.userVideos[courseId]) {
        state.userVideos[courseId] = {};
      }
      state.userVideos[courseId][videoId] = { ready: false, ...updates };
    },
    finishVideoDownload: (state, action: PayloadAction<{ success: boolean, item: VideoQueueItem }>) => {
      // the item should be the first in the list, but just in case some other
      // modification has happened to the queue, we do it safely
      const { item, success } = action.payload;
      const index = state.videoQueue.findIndex((item) => item.courseId === action.payload.item.courseId && item.videoId === action.payload.item.videoId);

      if (index !== -1) {
        state.videoQueue.splice(index, 1);
      }

      state.userVideos[item.courseId] ||= {};
      const video = state.userVideos[item.courseId]![item.videoId] ||= { ready: false };
      state.userVideos[item.courseId]![item.videoId] = {...video, ready: success};
    },
    removeCourseVideosFromQueue: (state, action: PayloadAction<string>) => {
      state.videoQueue = state.videoQueue.filter((item) => item.courseId !== action.payload);
    },
  },
});

export default userStore.reducer;
export const {
  setInitialCourses,
  setInitialVideos,
  updateCourse,
  deleteCourse,
  updateVideoQueue,
  updateUserVideo,
} = userStore.actions;

export const userActions = userStore.actions;
