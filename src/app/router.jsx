import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import AdminCollectionPage from "../pages/AdminCollectionPage.jsx";
import AdminHomePage from "../pages/AdminHomePage.jsx";
import CourseDetailPage from "../pages/CourseDetailPage.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
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
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        )
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        )
      },
      {
        path: "onboarding",
        element: (
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        )
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:courseId", element: <CourseDetailPage /> },
      {
        path: "lessons/:lessonId",
        element: (
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        )
      },
      {
        path: "quizzes/:quizId",
        element: (
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminHomePage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/courses",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Courses" description="Manage public learning paths and publishing state." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/levels",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Levels" description="Organize CEFR-style progression and prerequisites." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/units",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Units" description="Group lessons into teachable, trackable milestones." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/lessons",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Lessons" description="Author reading, grammar, vocabulary, and practice loops." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/quizzes",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Quizzes" description="Define assessment rules, questions, and answer options." />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminCollectionPage title="Users" description="Review learner progress, access, and completion trends." />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
