import { useEffect, useState } from "react";
import SectionCard from "../components/layout/SectionCard.jsx";
import { apiRequest } from "../services/api.js";

const emptyCourseForm = {
  title: "",
  level: "A1",
  summary: "",
  intensity: "",
  estimatedWeeks: 4,
  published: false
};

function summarizeItem(collectionKey, item) {
  if (collectionKey === "courses") {
    return `${item.level} · ${item.unitCount} units · ${item.lessonCount} lessons`;
  }

  if (collectionKey === "levels") {
    return `${item.code} · ${item.unitCount} units`;
  }

  if (collectionKey === "units") {
    return `${item.courseTitle} · ${item.lessonCount} lessons · ${item.checkpointLabel}`;
  }

  if (collectionKey === "lessons") {
    return `${item.courseTitle} · ${item.unitTitle} · ${item.duration}`;
  }

  if (collectionKey === "quizzes") {
    return `${item.courseTitle} · ${item.unitTitle}`;
  }

  if (collectionKey === "users") {
    return `${item.role} · ${item.currentCourse} · streak ${item.streak}`;
  }

  return "";
}

export default function AdminCollectionPage({ collectionKey, title, description }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingId, setEditingId] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const supportsCourseCrud = collectionKey === "courses";

  useEffect(() => {
    let isCancelled = false;

    async function loadCollection() {
      setIsLoading(true);

      try {
        const response = await apiRequest(`/admin/${collectionKey}`);

        if (!isCancelled) {
          setItems(response.items ?? []);
          setError("");
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCollection();

    return () => {
      isCancelled = true;
    };
  }, [collectionKey]);

  function handleCourseChange(event) {
    const { checked, name, type, value } = event.target;

    setCourseForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : name === "estimatedWeeks" ? Number(value) : value
    }));
    setSaveMessage("");
  }

  function startEdit(item) {
    setEditingId(item.id);
    setCourseForm({
      title: item.title,
      level: item.level,
      summary: item.summary ?? "",
      intensity: item.intensity ?? "",
      estimatedWeeks: item.estimatedWeeks ?? 4,
      published: Boolean(item.published)
    });
    setSaveMessage("");
  }

  function resetCourseForm() {
    setEditingId(null);
    setCourseForm(emptyCourseForm);
  }

  async function handleCourseSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveMessage("");

    try {
      const response = await apiRequest(
        editingId ? `/admin/${collectionKey}/${editingId}` : `/admin/${collectionKey}`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(courseForm)
        }
      );

      const nextItem = response.item;

      setItems((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? nextItem : item));
        }

        return [nextItem, ...current];
      });

      setSaveMessage(editingId ? "Course updated." : "Course created.");
      resetCourseForm();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    setSaveMessage("");

    try {
      await apiRequest(`/admin/${collectionKey}/${id}`, {
        method: "DELETE"
      });

      setItems((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        resetCourseForm();
      }
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Admin CMS" title={title}>
        <p>{description}</p>
        {error ? <p className="form-error">{error}</p> : null}
        {saveMessage ? <p className="success-copy">{saveMessage}</p> : null}
      </SectionCard>

      {supportsCourseCrud ? (
        <SectionCard
          eyebrow={editingId ? "Edit course" : "Create course"}
          title={editingId ? "Update learning path" : "Add a new learning path"}
          footer={
            <>
              <button className="button" form="course-admin-form" type="submit">
                {editingId ? "Save changes" : "Create course"}
              </button>
              {editingId ? (
                <button className="button button-ghost" onClick={resetCourseForm} type="button">
                  Cancel edit
                </button>
              ) : null}
            </>
          }
        >
          <form className="form-grid form-grid-double" id="course-admin-form" onSubmit={handleCourseSubmit}>
            <label>
              Title
              <input name="title" onChange={handleCourseChange} type="text" value={courseForm.title} />
            </label>
            <label>
              Level
              <select name="level" onChange={handleCourseChange} value={courseForm.level}>
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
              </select>
            </label>
            <label className="profile-field-span">
              Summary
              <input name="summary" onChange={handleCourseChange} type="text" value={courseForm.summary} />
            </label>
            <label>
              Intensity label
              <input name="intensity" onChange={handleCourseChange} type="text" value={courseForm.intensity} />
            </label>
            <label>
              Estimated weeks
              <input
                min="1"
                name="estimatedWeeks"
                onChange={handleCourseChange}
                type="number"
                value={courseForm.estimatedWeeks}
              />
            </label>
            <label className="checkbox-row">
              <input checked={courseForm.published} name="published" onChange={handleCourseChange} type="checkbox" />
              <span>Published</span>
            </label>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Collection" title={`${title} overview`}>
        {isLoading ? <p>Loading collection...</p> : null}
        {!isLoading && items.length === 0 ? <p>No items yet.</p> : null}
        <div className="admin-list">
          {items.map((item) => (
            <div key={item.id} className="admin-row">
              <div>
                <p className="eyebrow">{item.id}</p>
                <h3>{item.title ?? item.name}</h3>
                <p className="support-copy">{summarizeItem(collectionKey, item)}</p>
                {item.summary ? <p className="support-copy">{item.summary}</p> : null}
              </div>
              {supportsCourseCrud ? (
                <div className="admin-actions">
                  <button className="button button-ghost" onClick={() => startEdit(item)} type="button">
                    Edit
                  </button>
                  <button className="button button-ghost" onClick={() => handleDelete(item.id)} type="button">
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
