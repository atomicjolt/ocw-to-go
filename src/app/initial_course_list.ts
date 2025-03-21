import { CourseData, newUserCourse, UserCourses } from "../types";

const ASSET_HOST = "https://mit-ocw-courses.atomicjoltdevapps.com";

export const ALL_COURSES: CourseData[] = [
  {
    id: "course-10",
    name: "Introduction to CS and Programming using Python",
    file: ASSET_HOST + "/intro-to-cs-01.zip",
    cardImg: "/images/intro-to-cs.jpg",
    imgAltText: "close up of a sunflower",
    courseLevel: "6.100L | Undergraduate",
    instructors: ["Dr. Ana Bell"],
    topics: ["Engineering", "Computer Science", "Programming Languages"],
  },
  //{
  //  id: "course-11",
  //  name: "Kanji Learning Any Time, Any Place for Japanese V",
  //  file: ASSET_HOST + "/japanese-5.zip",
  //  cardImg: "/images/kanji-v.jpg",
  //  imgAltText: "kanji of island next to a drawing of an island",
  //  courseLevel: "RES.21G-505 | Undergraduate",
  //  instructors: ["Dr. Takako Aikawa", "Dr. Meghan Perdue"],
  //  topics: ["Humanities", "Language", "Japanese"],
  //},
  //{
  //  id: "course-12",
  //  name: "Kanji Learning Any Time, Any Place for Japanese VI",
  //  file: ASSET_HOST + "/japanese-6.zip",
  //  cardImg: "/images/kanji-vi.jpg",
  //  imgAltText: "kanji of fruit next to a drawing of a fruit tree",
  //  courseLevel: "RES.21G-506 | Undergraduate",
  //  instructors: ["Dr. Takako Aikawa", "Dr. Meghan Perdue"],
  //  topics: ["Humanities", "Language", "Japanese"],
  //},
  {
    id: "course-13",
    name: "Linear Algebra",
    file: ASSET_HOST + "/linear-algebra.zip",
    cardImg: "/images/linear-algebra.jpg",
    imgAltText: "a red, green, blue tesselated pattern",
    courseLevel: "18.06SC | Undergraduate",
    instructors: ["Prof. Gilbert Strang"],
    topics: ["Mathematics", "Linear Algebra"],
  },
  {
    id: "course-14",
    name: "Introduction to Computer Science and Programming in Python",
    file: ASSET_HOST + "/intro-to-cs-2.zip",
    cardImg: "/images/intro-to-cs2.jpg",
    imgAltText: "close up of a laptop keyboard",
    courseLevel: "6.0001 | Undergraduate",
    instructors: ["Dr. Ana Bell", "Prof. Eric Grimson", "Prof. John Guttag"],
    topics: ["Engineering", "Computer Science", "Programming Languages"],
  },
  {
    id: "course-15",
    name: "Creole Languages and Caribbean Identities",
    file: ASSET_HOST + "/creole.zip",
    cardImg: "/images/creole.jpg",
    imgAltText: "a chalkboard",
    courseLevel: "24.908 | Undergraduate",
    instructors: ["Prof. Michel DeGraff"],
    topics: ["Humanities", "Linguistics", "Society"],
  },
];

export const COURSES_BY_ID = ALL_COURSES.reduce<Record<string, CourseData>>(
  (acc, course) => {
    acc[course.id] = course;
    return acc;
  },
  {},
);

export default async function getInitialUserCourses(): Promise<UserCourses> {
  const cacheKeys = await window.caches.keys();

  const courses: UserCourses = {};

  for await (const course of ALL_COURSES) {
    const ready = cacheKeys.includes(`course-${course.id}`);
    if (ready) {
      courses[course.id] = newUserCourse(course.id, { ready: true });
    }
  }

  return courses;
}
