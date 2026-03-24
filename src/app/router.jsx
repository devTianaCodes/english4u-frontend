import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import AdminCollectionPage from "../pages/AdminCollectionPage.jsx";
import AdminHomePage from "../pages/AdminHomePage.jsx";
import CourseDetailPage from "../pages/CourseDetailPage.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import LessonPage from "../pages/LessonPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import OnboardingPage from "../pages/OnboardingPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import QuizPage from "../pages/QuizPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:courseId", element: <CourseDetailPage /> },
      { path: "lessons/:lessonId", element: <LessonPage /> },
      { path: "quizzes/:quizId", element: <QuizPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "admin", element: <AdminHomePage /> },
      {
        path: "admin/courses",
        element: <AdminCollectionPage title="Courses" description="Manage public learning paths and publishing state." />
      },
      {
        path: "admin/levels",
        element: <AdminCollectionPage title="Levels" description="Organize CEFR-style progression and prerequisites." />
      },
      {
        path: "admin/units",
        element: <AdminCollectionPage title="Units" description="Group lessons into teachable, trackable milestones." />
      },
      {
        path: "admin/lessons",
        element: <AdminCollectionPage title="Lessons" description="Author reading, grammar, vocabulary, and practice loops." />
      },
      {
        path: "admin/quizzes",
        element: <AdminCollectionPage title="Quizzes" description="Define assessment rules, questions, and answer options." />
      },
      {
        path: "admin/users",
        element: <AdminCollectionPage title="Users" description="Review learner progress, access, and completion trends." />
      }
    ]
  }
]);
