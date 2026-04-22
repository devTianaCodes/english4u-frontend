export const HOME_PATH = "/home";

function getSlug(value) {
  if (typeof value === "string") {
    return value;
  }

  return value?.slug ?? value?.quizSlug ?? value?.lessonSlug ?? value?.courseSlug ?? value?.id ?? "";
}

export function buildCoursePath(course) {
  return `/courses/${getSlug(course)}`;
}

export function buildLessonPath(lesson) {
  return `/lessons/${getSlug(lesson)}`;
}

export function buildQuizPath(quiz) {
  return `/quizzes/${getSlug(quiz)}`;
}
