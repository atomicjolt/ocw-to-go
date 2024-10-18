import { Course } from "../types";

const ASSET_HOST = "https://mit-ocw-courses.atomicjoltdevapps.com";

// video_galleries/vecture-videos/data.json
// resources/[video-name]/data.json
export const ALL_COURSES: Course[] = [
  {
    id: "course-10",
    name: "Introduction to CS and Programming using Python",
    file: ASSET_HOST+"/intro-to-cs-01.zip",
    status: "",
    ready: false,
    videos: [
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-1-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-2-multi-version-4_1_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-3-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-4-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-5-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-6-multi-version-3_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-7-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-8-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-9-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-10-version-3_1_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-11-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-12-multi-version-4_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-13-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-14-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-15-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-16-multi-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-17-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-18-multi-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-19-multi-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-20-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-21-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-22-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-23-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-24-version-2_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-25-multi_360p_16_9.mp4",
      ASSET_HOST+"/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/6100l-lecture-26-multi_360p_16_9.mp4",
    ],
  },
  {
    id: "course-11",
    name: "Kanji Learning Any Time, Any Place for Japanese V",
    file: ASSET_HOST+"/japanese-5.zip",
    status: "",
    ready: false,
    videos: [],
  },
  {
    id: "course-12",
    name: "Kanji Learning Any Time, Any Place for Japanese VI",
    file: ASSET_HOST+"/japanese-6.zip",
    status: "",
    ready: false,
    videos: [],
  },
  {
    id: "course-13",
    name: "Linear Algebra",
    file: ASSET_HOST+"/linear-algebra.zip",
    status: "",
    ready: false,
    videos: [],
  },
  {
    id: "course-14",
    name: "Introduction to Computer Science and Programming in Python",
    file: ASSET_HOST+"/intro-to-cs-2.zip",
    status: "",
    ready: false,
    videos: [],
  },
  {
    id: "course-15",
    name: "Creole Languages and Caribbean Identities",
    file: ASSET_HOST+"/creole.zip",
    status: "",
    ready: false,
    videos: [],
  },
]

export default async function getInitialCourseList(): Promise<Course[]> {
  const cacheKeys = await window.caches.keys();

  const courses: Course[] = [];

  for await (const course of ALL_COURSES) {
    const ready = cacheKeys.includes(`course-${course.id}`);
    course.ready = ready;

    courses.push(course);
  }

  return courses;
}
