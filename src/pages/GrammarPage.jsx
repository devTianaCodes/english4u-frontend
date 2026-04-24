import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { apiRequest, endpoints } from "../services/api.js";
import { buildLessonPath, buildQuizPath } from "../services/paths.js";

const SAVED_TOPICS_KEY = "e4u-saved-grammar-topics";

function loadSavedTopicIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_TOPICS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export default function GrammarPage() {
  const { topicId } = useParams();
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState(null);
  const [error, setError] = useState("");
  const [savedTopicIds, setSavedTopicIds] = useState(loadSavedTopicIds);

  const selectedTopicId = useMemo(() => topicId ?? topics[0]?.id ?? null, [topicId, topics]);
  const savedTopics = useMemo(
    () => topics.filter((entry) => savedTopicIds.includes(entry.id)),
    [topics, savedTopicIds]
  );
  const isSaved = topic ? savedTopicIds.includes(topic.id) : false;

  useEffect(() => {
    let isCancelled = false;

    async function loadTopics() {
      try {
        const response = await apiRequest(endpoints.grammarTopics);

        if (!isCancelled) {
          setTopics(response.topics ?? []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadTopics();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!selectedTopicId) {
      return undefined;
    }

    async function loadTopic() {
      try {
        const response = await apiRequest(`${endpoints.grammarTopics}/${selectedTopicId}`);

        if (!isCancelled) {
          setTopic(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadTopic();

    return () => {
      isCancelled = true;
    };
  }, [selectedTopicId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SAVED_TOPICS_KEY, JSON.stringify(savedTopicIds));
  }, [savedTopicIds]);

  function toggleSavedTopic() {
    if (!topic) {
      return;
    }

    setSavedTopicIds((current) =>
      current.includes(topic.id) ? current.filter((entry) => entry !== topic.id) : [...current, topic.id]
    );
  }

  if (!topics.length && !error) {
    return (
      <div className="stack-lg">
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="grammar-hero">
        <div className="grammar-hero-copy">
          <p className="eyebrow">Grammar hub</p>
          <h1>Reusable grammar guides for the E4U path</h1>
          <p>
            Jump from a lesson into a concise grammar explanation, then go straight back into the related practice and quizzes.
          </p>
        </div>

        <div className="grammar-hero-stats">
          <div className="catalog-stat-card">
            <strong>{topics.length}</strong>
            <span>core topics</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{topic?.level ?? "--"}</strong>
            <span>current level</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{topic?.lessonCount ?? 0}</strong>
            <span>related lessons</span>
          </div>
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="grammar-layout">
        <aside className="grammar-sidebar">
          <div className="grammar-sidebar-stack">
            {savedTopics.length ? (
              <div className="section-card">
                <p className="eyebrow">Saved topics</p>
                <div className="grammar-topic-list">
                  {savedTopics.map((entry) => (
                    <Link
                      key={entry.id}
                      className={`grammar-topic-link ${selectedTopicId === entry.id ? "grammar-topic-link-active" : ""}`}
                      to={`/grammar/${entry.id}`}
                    >
                      <div className="grammar-topic-link-header">
                        <strong>{entry.title}</strong>
                        <span className="grammar-topic-tag">Saved</span>
                      </div>
                      <span>{entry.level} · {entry.lessonCount} lesson{entry.lessonCount === 1 ? "" : "s"}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="section-card">
              <p className="eyebrow">Topics</p>
              <div className="grammar-topic-list">
                {topics.map((entry) => (
                  <Link
                    key={entry.id}
                    className={`grammar-topic-link ${selectedTopicId === entry.id ? "grammar-topic-link-active" : ""}`}
                    to={`/grammar/${entry.id}`}
                  >
                    <div className="grammar-topic-link-header">
                      <strong>{entry.title}</strong>
                      {savedTopicIds.includes(entry.id) ? <span className="grammar-topic-tag">Saved</span> : null}
                    </div>
                    <span>{entry.level} · {entry.lessonCount} lesson{entry.lessonCount === 1 ? "" : "s"}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="grammar-main">
          {topic ? (
            <>
              <section className="section-card section-card-featured">
                <p className="eyebrow">{topic.level} grammar topic</p>
                <h2>{topic.title}</h2>
                <p>{topic.summary}</p>
                <div className="button-row">
                  <Button onClick={toggleSavedTopic} variant="secondary">
                    {isSaved ? "Remove from saved" : "Save topic"}
                  </Button>
                </div>
                <div className="grammar-rule-grid">
                  {topic.rules.map((rule) => (
                    <article key={rule} className="grammar-note-card">
                      <strong>Rule</strong>
                      <p>{rule}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grammar-detail-grid">
                <article className="section-card">
                  <p className="eyebrow">Examples</p>
                  <div className="stack-sm">
                    {topic.examples.map((example) => (
                      <div key={example} className="grammar-example-card">
                        <strong>Example</strong>
                        <p>{example}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="section-card">
                  <p className="eyebrow">Coach note</p>
                  <h2>How to use this topic</h2>
                  <p>{topic.coachNote}</p>
                </article>
              </section>

              <section className="section-card">
                <div className="dashboard-section-heading">
                  <div>
                    <p className="eyebrow">Related lessons</p>
                    <h2>Practice this concept in context</h2>
                  </div>
                  <p className="support-copy">Each lesson keeps the same grammar point inside vocabulary, reading, and quiz work.</p>
                </div>
                <div className="dashboard-progress-list">
                  {topic.relatedLessons.map((lesson) => (
                    <article key={lesson.id} className="course-progress-card">
                      <div className="course-progress-copy">
                        <p className="eyebrow">{lesson.courseTitle}</p>
                        <h3>{lesson.title}</h3>
                        <p>{lesson.summary}</p>
                      </div>
                      <div className="button-row">
                        <Button to={buildLessonPath(lesson)}>Open lesson</Button>
                        <Button to={buildQuizPath(`${lesson.id}-quiz`)} variant="secondary">Quiz</Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
