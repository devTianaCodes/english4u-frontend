import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { apiRequest, endpoints } from "../services/api.js";
import { buildCoursePath, buildLessonPath } from "../services/paths.js";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    let isCancelled = false;

    async function loadCourses() {
      try {
        const [coursesResponse, dashboardResponse] = await Promise.all([
          apiRequest(endpoints.courses),
          user ? apiRequest(endpoints.dashboard).catch(() => null) : Promise.resolve(null)
        ]);

        if (!isCancelled) {
          setCourses(coursesResponse?.items ?? []);
          setDashboard(dashboardResponse);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadCourses();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const levels = Array.from(new Set(courses.map((course) => course.level))).sort();
  const recommendedCourseId = courses.find((course) => course.level === dashboard?.currentLevel)?.id ?? null;
  const currentCourseId = courses.find((course) => course.title === dashboard?.currentCourse)?.id ?? recommendedCourseId;

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        !search ||
        [course.title, course.summary, course.intensity, course.level].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);

      return matchesSearch && matchesLevel;
    })
    .sort((left, right) => {
      if (sortBy === "recommended") {
        const leftRank = left.id === currentCourseId ? 0 : left.id === recommendedCourseId ? 1 : 2;
        const rightRank = right.id === currentCourseId ? 0 : right.id === recommendedCourseId ? 1 : 2;

        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }
      }

      if (sortBy === "level") {
        return left.level.localeCompare(right.level);
      }

      if (sortBy === "duration") {
        return (left.estimatedWeeks ?? 0) - (right.estimatedWeeks ?? 0);
      }

      return (right.lessonCount ?? 0) - (left.lessonCount ?? 0);
    });

  function toggleLevel(level) {
    setSelectedLevels((current) => (current.includes(level) ? current.filter((item) => item !== level) : [...current, level]));
  }

  return (
    <div className="stack-lg">
      <section className="catalog-hero">
        <div className="catalog-hero-copy">
          <p className="eyebrow">Course catalog</p>
          <h1>Professional English paths by level</h1>
          <p>
            Explore structured courses with short units, visible milestones, and clear next actions for self-paced learners.
          </p>
        </div>
        <div className="catalog-hero-stats">
          <div className="catalog-stat-card">
            <strong>{courses.length}</strong>
            <span>guided tracks</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{courses.reduce((total, course) => total + (course.lessonCount ?? 0), 0)}</strong>
            <span>short lessons</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{levels.join(" / ") || "A1 / A2"}</strong>
            <span>current levels</span>
          </div>
          {dashboard ? (
            <div className="catalog-stat-card">
              <strong>{dashboard.currentLevel}</strong>
              <span>your active level</span>
            </div>
          ) : null}
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {!error && courses.length === 0 ? (
        <div className="grid grid-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line-short" />
            </div>
          ))}
        </div>
      ) : null}

      <section className="catalog-layout">
        <aside className="filters-panel">
          <div className="stack-sm">
            <p className="eyebrow">Filter courses</p>
            <h2>Find the right path</h2>
            <p className="support-copy">Refine by level, then sort by pace or course size.</p>
          </div>

          <label className="filter-field">
            Search
            <input onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." type="search" value={search} />
          </label>

          <div className="filter-group">
            <span className="metric-label">Level</span>
            <div className="filter-choice-list">
              {levels.map((level) => (
                <label key={level} className={`filter-chip ${selectedLevels.includes(level) ? "filter-chip-active" : ""}`}>
                  <input checked={selectedLevels.includes(level)} onChange={() => toggleLevel(level)} type="checkbox" />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="filter-field">
            Sort by
            <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              <option value="recommended">Recommended first</option>
              <option value="popular">Most complete</option>
              <option value="duration">Shortest duration</option>
              <option value="level">Level</option>
            </select>
          </label>
        </aside>

        <div className="courses-main">
          {dashboard ? (
            <section className="section-card section-card-featured">
              <div className="dashboard-section-heading">
                <div>
                  <p className="eyebrow">Recommended for you</p>
                  <h2>{dashboard.currentCourse}</h2>
                </div>
                <p className="support-copy">
                  Placement level {dashboard.currentLevel} · next lesson {dashboard.nextLesson?.title ?? "ready in your path"}
                </p>
              </div>
              <div className="section-card-footer">
                <Button to={currentCourseId ? buildCoursePath(currentCourseId) : "/dashboard"}>Open recommended path</Button>
                <Button to={dashboard.nextLesson ? buildLessonPath(dashboard.nextLesson) : "/dashboard"} variant="secondary">
                  Continue next lesson
                </Button>
              </div>
            </section>
          ) : null}

          <div className="courses-toolbar">
            <p className="support-copy">{filteredCourses.length} course{filteredCourses.length === 1 ? "" : "s"} available</p>
            <Button to="/onboarding" variant="secondary">Take placement test</Button>
          </div>

          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-card-visual">
                  <span className="course-card-level">{course.level}</span>
                  <strong>{course.intensity ?? "Guided path"}</strong>
                </div>

                <div className="course-card-content">
                  <div className="stack-sm">
                    <p className="eyebrow">Structured course</p>
                    <h2>{course.title}</h2>
                    <p>{course.summary ?? `Structured ${course.level} learning path with guided units and quizzes.`}</p>
                  </div>

                  <div className="course-card-badges">
                    {course.id === currentCourseId ? <span className="course-badge-strong">current path</span> : null}
                    {course.id === recommendedCourseId && course.id !== currentCourseId ? <span className="course-badge-strong">placement match</span> : null}
                    <span>{course.unitCount ?? 0} units</span>
                    <span>{course.lessonCount ?? 0} lessons</span>
                    <span>{course.estimatedWeeks ?? 4} weeks</span>
                  </div>

                  <div className="course-card-footer">
                    <div className="stack-sm">
                      <span className="metric-label">Best for</span>
                      <strong>
                        {course.id === currentCourseId
                          ? "your active path"
                          : course.id === recommendedCourseId
                            ? "best placement match"
                            : `${course.level} self-paced learners`}
                      </strong>
                    </div>
                    <Button to={buildCoursePath(course)} variant="secondary">Explore course</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
