import { lazy, Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import RouteFallback from "../components/ui/RouteFallback.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import { HOME_PATH } from "../services/paths.js";

const AdminCollectionPage = lazy(() => import("../pages/AdminCollectionPage.jsx"));
const AdminHomePage = lazy(() => import("../pages/AdminHomePage.jsx"));
const CourseDetailPage = lazy(() => import("../pages/CourseDetailPage.jsx"));
const CoursesPage = lazy(() => import("../pages/CoursesPage.jsx"));
const CertificatesPage = lazy(() => import("../pages/CertificatesPage.jsx"));
const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const GrammarPage = lazy(() => import("../pages/GrammarPage.jsx"));
const JournalPage = lazy(() => import("../pages/JournalPage.jsx"));
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const LessonPage = lazy(() => import("../pages/LessonPage.jsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const OnboardingPage = lazy(() => import("../pages/OnboardingPage.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));
const QuizPage = lazy(() => import("../pages/QuizPage.jsx"));
const ReviewPage = lazy(() => import("../pages/ReviewPage.jsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.jsx"));
const SettingsPage = lazy(() => import("../pages/SettingsPage.jsx"));
const StudyPlanPage = lazy(() => import("../pages/StudyPlanPage.jsx"));

function withSuspense(element) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={HOME_PATH} replace /> },
      { path: "home", element: withSuspense(<LandingPage />) },
      {
        path: "login",
        element: (
          <GuestRoute>
            {withSuspense(<LoginPage />)}
          </GuestRoute>
        )
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            {withSuspense(<RegisterPage />)}
          </GuestRoute>
        )
      },
      {
        path: "onboarding",
        element: (
          <ProtectedRoute>
            {withSuspense(<OnboardingPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "journal",
        element: withSuspense(<JournalPage />)
      },
      {
        path: "grammar",
        element: withSuspense(<GrammarPage />)
      },
      {
        path: "grammar/:topicId",
        element: withSuspense(<GrammarPage />)
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            {withSuspense(<DashboardPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "certificates",
        element: (
          <ProtectedRoute>
            {withSuspense(<CertificatesPage />)}
          </ProtectedRoute>
        )
      },
      { path: "courses", element: withSuspense(<CoursesPage />) },
      { path: "courses/:courseId", element: withSuspense(<CourseDetailPage />) },
      {
        path: "lessons/:lessonId",
        element: (
          <ProtectedRoute>
            {withSuspense(<LessonPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "quizzes/:quizId",
        element: (
          <ProtectedRoute>
            {withSuspense(<QuizPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            {withSuspense(<ProfilePage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "study-plan",
        element: (
          <ProtectedRoute>
            {withSuspense(<StudyPlanPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            {withSuspense(<SettingsPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "review",
        element: (
          <ProtectedRoute>
            {withSuspense(<ReviewPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "review/:mode",
        element: (
          <ProtectedRoute>
            {withSuspense(<ReviewPage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminHomePage />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/courses",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="courses"
              title="Courses"
              description="Manage public learning paths and publishing state."
            />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/levels",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="levels"
              title="Levels"
              description="Organize CEFR-style progression and prerequisites."
            />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/units",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="units"
              title="Units"
              description="Group lessons into teachable, trackable milestones."
            />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/lessons",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="lessons"
              title="Lessons"
              description="Author reading, grammar, vocabulary, and practice loops."
            />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/quizzes",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="quizzes"
              title="Quizzes"
              description="Define assessment rules, questions, and answer options."
            />)}
          </ProtectedRoute>
        )
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            {withSuspense(<AdminCollectionPage
              collectionKey="users"
              title="Users"
              description="Review learner progress, access, and completion trends."
            />)}
          </ProtectedRoute>
        )
      }
    ]
  }
]);
