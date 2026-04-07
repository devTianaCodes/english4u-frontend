import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { apiRequest, endpoints } from "../services/api.js";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    let isCancelled = false;

    async function loadCourses() {
      try {
        const response = await apiRequest(endpoints.courses);

        if (!isCancelled) {
          setCourses(response?.items ?? []);
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
  }, []);

  const levels = Array.from(new Set(courses.map((course) => course.level))).sort();

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        !search ||
        [course.title, course.summary, course.intensity, course.level].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);

      return matchesSearch && matchesLevel;
    })
    .sort((left, right) => {
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
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

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
              <option value="popular">Most complete</option>
              <option value="duration">Shortest duration</option>
              <option value="level">Level</option>
            </select>
          </label>
        </aside>

        <div className="courses-main">
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
                    <span>{course.unitCount ?? 0} units</span>
                    <span>{course.lessonCount ?? 0} lessons</span>
                    <span>{course.estimatedWeeks ?? 4} weeks</span>
                  </div>

                  <div className="course-card-footer">
                    <div className="stack-sm">
                      <span className="metric-label">Best for</span>
                      <strong>{course.level} self-paced learners</strong>
                    </div>
                    <Button to={`/courses/${course.id}`} variant="secondary">Explore course</Button>
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
