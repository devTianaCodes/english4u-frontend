import { useEffect, useMemo, useState } from "react";
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

const emptyUnitForm = {
  courseId: "",
  title: "",
  summary: "",
  checkpointLabel: ""
};

const emptyLessonForm = {
  courseId: "",
  unitId: "",
  title: "",
  summary: "",
  duration: "12 min",
  focus: "Core practice"
};

function createEmptyQuizQuestions() {
  return Array.from({ length: 3 }, () => ({
    prompt: "",
    correct: "",
    distractorOne: "",
    distractorTwo: ""
  }));
}

function createEmptyQuizForm() {
  return {
    lessonId: "",
    title: "",
    description: "",
    questions: createEmptyQuizQuestions()
  };
}

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
    return `${item.courseTitle} · ${item.unitTitle} · ${item.duration} · ${item.focus}`;
  }

  if (collectionKey === "quizzes") {
    return `${item.courseTitle} · ${item.unitTitle} · ${item.questionCount} questions · ${
      item.hasCustomContent ? "Custom content" : "Default content"
    }`;
  }

  if (collectionKey === "users") {
    return `${item.role} · ${item.currentCourse} · streak ${item.streak}`;
  }

  return "";
}

function getDefaultCourseId(courseOptions, unitOptions = []) {
  return courseOptions[0]?.id ?? unitOptions[0]?.courseId ?? "";
}

function getDefaultUnitId(courseId, unitOptions) {
  return unitOptions.find((unit) => unit.courseId === courseId)?.id ?? unitOptions[0]?.id ?? "";
}

function buildQuizFormFromItem(item) {
  const rawQuestions = Array.isArray(item?.questions) ? item.questions : [];
  const questions = Array.from({ length: 3 }, (_, index) => {
    const question = rawQuestions[index];
    const options = question?.options ?? [];
    const correctOption = options.find((option) => option.isCorrect);
    const distractors = options.filter((option) => !option.isCorrect);

    return {
      prompt: question?.prompt ?? "",
      correct: correctOption?.text ?? "",
      distractorOne: distractors[0]?.text ?? "",
      distractorTwo: distractors[1]?.text ?? ""
    };
  });

  return {
    lessonId: item?.lessonId ?? "",
    title: item?.title ?? "",
    description: item?.description ?? "",
    questions
  };
}

function buildQuizPayload(form) {
  return {
    lessonId: form.lessonId,
    title: form.title,
    description: form.description,
    questions: form.questions.map((question) => ({
      prompt: question.prompt,
      options: [
        { text: question.correct, isCorrect: true },
        { text: question.distractorOne, isCorrect: false },
        { text: question.distractorTwo, isCorrect: false }
      ]
    }))
  };
}

export default function AdminCollectionPage({ collectionKey, title, description }) {
  const [items, setItems] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [unitForm, setUnitForm] = useState(emptyUnitForm);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [quizForm, setQuizForm] = useState(createEmptyQuizForm());
  const [editingId, setEditingId] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const supportsCourseCrud = collectionKey === "courses";
  const supportsUnitCrud = collectionKey === "units";
  const supportsLessonCrud = collectionKey === "lessons";
  const supportsQuizCrud = collectionKey === "quizzes";
  const supportsCrud = supportsCourseCrud || supportsUnitCrud || supportsLessonCrud || supportsQuizCrud;

  const filteredUnitOptions = useMemo(() => {
    if (!supportsLessonCrud) {
      return [];
    }

    return unitOptions.filter((unit) => unit.courseId === lessonForm.courseId);
  }, [lessonForm.courseId, supportsLessonCrud, unitOptions]);

  useEffect(() => {
    let isCancelled = false;

    async function loadCollection() {
      setIsLoading(true);

      try {
        const requests = [apiRequest(`/admin/${collectionKey}`)];

        if (supportsUnitCrud || supportsLessonCrud) {
          requests.push(apiRequest("/admin/courses"));
        }

        if (supportsLessonCrud) {
          requests.push(apiRequest("/admin/units"));
        }

        if (supportsQuizCrud) {
          requests.push(apiRequest("/admin/lessons"));
        }

        const [response, coursesResponse, unitsResponse, lessonsResponse] = await Promise.all(requests);

        if (isCancelled) {
          return;
        }

        const nextItems = response.items ?? [];
        const nextCourseOptions = coursesResponse?.items ?? [];
        const nextUnitOptions = unitsResponse?.items ?? [];
        const nextLessonOptions = lessonsResponse?.items ?? [];

        setItems(nextItems);
        setCourseOptions(nextCourseOptions);
        setUnitOptions(nextUnitOptions);
        setLessonOptions(nextLessonOptions);

        if (supportsUnitCrud) {
          setUnitForm((current) => ({
            ...current,
            courseId: current.courseId || getDefaultCourseId(nextCourseOptions)
          }));
        }

        if (supportsLessonCrud) {
          const defaultCourseId = lessonForm.courseId || getDefaultCourseId(nextCourseOptions, nextUnitOptions);
          const defaultUnitId = lessonForm.unitId || getDefaultUnitId(defaultCourseId, nextUnitOptions);

          setLessonForm((current) => ({
            ...current,
            courseId: current.courseId || defaultCourseId,
            unitId: current.unitId || defaultUnitId
          }));
        }

        if (supportsQuizCrud) {
          const defaultQuizItem = nextItems.find((item) => item.lessonId === quizForm.lessonId) ?? nextItems[0] ?? null;

          if (defaultQuizItem) {
            setQuizForm(buildQuizFormFromItem(defaultQuizItem));
            setEditingId(defaultQuizItem.id);
          } else {
            setQuizForm(createEmptyQuizForm());
            setEditingId(null);
          }
        }

        setError("");
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
  }, [collectionKey, supportsLessonCrud, supportsQuizCrud, supportsUnitCrud]);

  function resetForms(
    nextCourseOptions = courseOptions,
    nextUnitOptions = unitOptions,
    nextLessonOptions = lessonOptions,
    nextItems = items
  ) {
    const defaultCourseId = getDefaultCourseId(nextCourseOptions, nextUnitOptions);
    const defaultUnitId = getDefaultUnitId(defaultCourseId, nextUnitOptions);
    const defaultQuizItem = nextItems[0] ?? null;

    setEditingId(defaultQuizItem?.id ?? null);
    setCourseForm(emptyCourseForm);
    setUnitForm({
      ...emptyUnitForm,
      courseId: defaultCourseId
    });
    setLessonForm({
      ...emptyLessonForm,
      courseId: defaultCourseId,
      unitId: defaultUnitId
    });
    setQuizForm(defaultQuizItem ? buildQuizFormFromItem(defaultQuizItem) : createEmptyQuizForm());
  }

  function handleCourseChange(event) {
    const { checked, name, type, value } = event.target;

    setCourseForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : name === "estimatedWeeks" ? Number(value) : value
    }));
    setSaveMessage("");
  }

  function handleUnitChange(event) {
    const { name, value } = event.target;

    setUnitForm((current) => ({
      ...current,
      [name]: value
    }));
    setSaveMessage("");
  }

  function handleLessonChange(event) {
    const { name, value } = event.target;

    if (name === "courseId") {
      const nextUnitId = getDefaultUnitId(value, unitOptions);

      setLessonForm((current) => ({
        ...current,
        courseId: value,
        unitId: nextUnitId
      }));
      setSaveMessage("");
      return;
    }

    setLessonForm((current) => ({
      ...current,
      [name]: value
    }));
    setSaveMessage("");
  }

  function handleQuizChange(event) {
    const { name, value } = event.target;

    if (name === "lessonId") {
      const nextItem = items.find((item) => item.lessonId === value);

      if (nextItem) {
        setQuizForm(buildQuizFormFromItem(nextItem));
        setEditingId(nextItem.id);
      } else {
        setQuizForm((current) => ({
          ...current,
          lessonId: value
        }));
        setEditingId(value ? `${value}-quiz` : null);
      }

      setSaveMessage("");
      return;
    }

    setQuizForm((current) => ({
      ...current,
      [name]: value
    }));
    setSaveMessage("");
  }

  function handleQuizQuestionChange(index, field, value) {
    setQuizForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value
            }
          : question
      )
    }));
    setSaveMessage("");
  }

  function startEdit(item) {
    if (supportsCourseCrud) {
      setEditingId(item.id);
      setCourseForm({
        title: item.title,
        level: item.level,
        summary: item.summary ?? "",
        intensity: item.intensity ?? "",
        estimatedWeeks: item.estimatedWeeks ?? 4,
        published: Boolean(item.published)
      });
    }

    if (supportsUnitCrud) {
      setEditingId(item.id);
      setUnitForm({
        courseId: item.courseId,
        title: item.title,
        summary: item.summary ?? "",
        checkpointLabel: item.checkpointLabel ?? ""
      });
    }

    if (supportsLessonCrud) {
      setEditingId(item.id);
      setLessonForm({
        courseId: item.courseId,
        unitId: item.unitId,
        title: item.title,
        summary: item.summary ?? "",
        duration: item.duration ?? "12 min",
        focus: item.focus ?? "Core practice"
      });
    }

    if (supportsQuizCrud) {
      setEditingId(item.id);
      setQuizForm(buildQuizFormFromItem(item));
    }

    setSaveMessage("");
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
      const nextItems = editingId ? items.map((item) => (item.id === editingId ? nextItem : item)) : [nextItem, ...items];
      const nextCourseOptions = editingId
        ? courseOptions.map((item) => (item.id === editingId ? nextItem : item))
        : [nextItem, ...courseOptions];

      setItems(nextItems);
      setCourseOptions(nextCourseOptions);
      setSaveMessage(editingId ? "Course updated." : "Course created.");
      resetForms(nextCourseOptions, unitOptions, lessonOptions, nextItems);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleUnitSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveMessage("");

    try {
      const response = await apiRequest(
        editingId ? `/admin/${collectionKey}/${editingId}` : `/admin/${collectionKey}`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(unitForm)
        }
      );

      const nextItem = response.item;
      const nextItems = editingId ? items.map((item) => (item.id === editingId ? nextItem : item)) : [nextItem, ...items];
      const nextUnitOptions = editingId
        ? unitOptions.map((item) => (item.id === editingId ? nextItem : item))
        : [nextItem, ...unitOptions];

      setItems(nextItems);
      setUnitOptions(nextUnitOptions);
      setSaveMessage(editingId ? "Unit updated." : "Unit created.");
      resetForms(courseOptions, nextUnitOptions, lessonOptions, nextItems);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleLessonSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveMessage("");

    try {
      const response = await apiRequest(
        editingId ? `/admin/${collectionKey}/${editingId}` : `/admin/${collectionKey}`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(lessonForm)
        }
      );

      const nextItem = response.item;
      const nextItems = editingId ? items.map((item) => (item.id === editingId ? nextItem : item)) : [nextItem, ...items];
      const nextLessonOptions = editingId
        ? lessonOptions.map((item) => (item.id === editingId ? nextItem : item))
        : [nextItem, ...lessonOptions];

      setItems(nextItems);
      setLessonOptions(nextLessonOptions);
      setSaveMessage(editingId ? "Lesson updated." : "Lesson created.");
      resetForms(courseOptions, unitOptions, nextLessonOptions, nextItems);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleQuizSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveMessage("");

    try {
      const targetQuizId = editingId ?? (quizForm.lessonId ? `${quizForm.lessonId}-quiz` : null);

      if (!targetQuizId) {
        throw new Error("Select a lesson before saving the quiz");
      }

      const response = await apiRequest(`/admin/${collectionKey}/${targetQuizId}`, {
        method: "PUT",
        body: JSON.stringify(buildQuizPayload(quizForm))
      });

      const nextItem = response.item;
      const nextItems = items.map((item) => (item.id === targetQuizId ? nextItem : item));

      setItems(nextItems);
      setEditingId(nextItem.id);
      setQuizForm(buildQuizFormFromItem(nextItem));
      setSaveMessage("Quiz updated.");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    setSaveMessage("");

    try {
      const response = await apiRequest(`/admin/${collectionKey}/${id}`, {
        method: "DELETE"
      });

      if (supportsQuizCrud && response?.item) {
        const nextItem = response.item;
        const nextItems = items.map((item) => (item.id === id ? nextItem : item));

        setItems(nextItems);
        setEditingId(nextItem.id);
        setQuizForm(buildQuizFormFromItem(nextItem));
        setSaveMessage("Quiz reset to default content.");
        return;
      }

      const nextItems = items.filter((item) => item.id !== id);
      setItems(nextItems);

      if (supportsUnitCrud) {
        const nextUnitOptions = unitOptions.filter((item) => item.id !== id);
        setUnitOptions(nextUnitOptions);

        if (editingId === id) {
          resetForms(courseOptions, nextUnitOptions, lessonOptions, nextItems);
          return;
        }
      }

      if (supportsLessonCrud) {
        const nextLessonOptions = lessonOptions.filter((item) => item.id !== id);
        setLessonOptions(nextLessonOptions);

        if (editingId === id) {
          resetForms(courseOptions, unitOptions, nextLessonOptions, nextItems);
          return;
        }
      }

      if (editingId === id) {
        resetForms(courseOptions, unitOptions, lessonOptions, nextItems);
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
                <button className="button button-ghost" onClick={() => resetForms()} type="button">
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

      {supportsUnitCrud ? (
        <SectionCard
          eyebrow={editingId ? "Edit unit" : "Create unit"}
          title={editingId ? "Update learning unit" : "Add a new unit"}
          footer={
            <>
              <button className="button" form="unit-admin-form" type="submit">
                {editingId ? "Save changes" : "Create unit"}
              </button>
              {editingId ? (
                <button className="button button-ghost" onClick={() => resetForms()} type="button">
                  Cancel edit
                </button>
              ) : null}
            </>
          }
        >
          <form className="form-grid form-grid-double" id="unit-admin-form" onSubmit={handleUnitSubmit}>
            <label>
              Parent course
              <select name="courseId" onChange={handleUnitChange} value={unitForm.courseId}>
                {courseOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unit title
              <input name="title" onChange={handleUnitChange} type="text" value={unitForm.title} />
            </label>
            <label className="profile-field-span">
              Summary
              <input name="summary" onChange={handleUnitChange} type="text" value={unitForm.summary} />
            </label>
            <label className="profile-field-span">
              Checkpoint label
              <input name="checkpointLabel" onChange={handleUnitChange} type="text" value={unitForm.checkpointLabel} />
            </label>
          </form>
        </SectionCard>
      ) : null}

      {supportsLessonCrud ? (
        <SectionCard
          eyebrow={editingId ? "Edit lesson" : "Create lesson"}
          title={editingId ? "Update lesson content" : "Add a new lesson"}
          footer={
            <>
              <button className="button" disabled={filteredUnitOptions.length === 0} form="lesson-admin-form" type="submit">
                {editingId ? "Save changes" : "Create lesson"}
              </button>
              {editingId ? (
                <button className="button button-ghost" onClick={() => resetForms()} type="button">
                  Cancel edit
                </button>
              ) : null}
            </>
          }
        >
          <form className="form-grid form-grid-double" id="lesson-admin-form" onSubmit={handleLessonSubmit}>
            <label>
              Parent course
              <select name="courseId" onChange={handleLessonChange} value={lessonForm.courseId}>
                {courseOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Parent unit
              <select name="unitId" onChange={handleLessonChange} value={lessonForm.unitId}>
                {filteredUnitOptions.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="profile-field-span">
              Lesson title
              <input name="title" onChange={handleLessonChange} type="text" value={lessonForm.title} />
            </label>
            <label className="profile-field-span">
              Summary
              <input name="summary" onChange={handleLessonChange} type="text" value={lessonForm.summary} />
            </label>
            <label>
              Duration
              <input name="duration" onChange={handleLessonChange} type="text" value={lessonForm.duration} />
            </label>
            <label>
              Focus area
              <input name="focus" onChange={handleLessonChange} type="text" value={lessonForm.focus} />
            </label>
            {filteredUnitOptions.length === 0 ? (
              <p className="form-error form-error-span">Create a unit first before adding lessons to this course.</p>
            ) : null}
          </form>
        </SectionCard>
      ) : null}

      {supportsQuizCrud ? (
        <SectionCard
          eyebrow="Quiz studio"
          title="Edit assessment content"
          footer={
            <>
              <button className="button" disabled={!quizForm.lessonId} form="quiz-admin-form" type="submit">
                Save quiz
              </button>
              {editingId ? (
                <button className="button button-ghost" onClick={() => handleDelete(editingId)} type="button">
                  Reset to default
                </button>
              ) : null}
            </>
          }
        >
          <form className="form-grid" id="quiz-admin-form" onSubmit={handleQuizSubmit}>
            <label>
              Lesson
              <select name="lessonId" onChange={handleQuizChange} value={quizForm.lessonId}>
                {lessonOptions.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {`${lesson.courseTitle} / ${lesson.unitTitle} / ${lesson.title}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quiz title
              <input name="title" onChange={handleQuizChange} type="text" value={quizForm.title} />
            </label>
            <label>
              Description
              <input name="description" onChange={handleQuizChange} type="text" value={quizForm.description} />
            </label>

            {quizForm.questions.map((question, index) => (
              <div key={`quiz-question-${index}`} className="section-card section-card-default">
                <p className="eyebrow">{`Question ${String(index + 1).padStart(2, "0")}`}</p>
                <div className="form-grid">
                  <label>
                    Prompt
                    <input
                      onChange={(event) => handleQuizQuestionChange(index, "prompt", event.target.value)}
                      type="text"
                      value={question.prompt}
                    />
                  </label>
                  <label>
                    Correct answer
                    <input
                      onChange={(event) => handleQuizQuestionChange(index, "correct", event.target.value)}
                      type="text"
                      value={question.correct}
                    />
                  </label>
                  <label>
                    Distractor 1
                    <input
                      onChange={(event) => handleQuizQuestionChange(index, "distractorOne", event.target.value)}
                      type="text"
                      value={question.distractorOne}
                    />
                  </label>
                  <label>
                    Distractor 2
                    <input
                      onChange={(event) => handleQuizQuestionChange(index, "distractorTwo", event.target.value)}
                      type="text"
                      value={question.distractorTwo}
                    />
                  </label>
                </div>
              </div>
            ))}
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
                {item.description ? <p className="support-copy">{item.description}</p> : null}
              </div>
              {supportsCrud ? (
                <div className="admin-actions">
                  <button className="button button-ghost" onClick={() => startEdit(item)} type="button">
                    Edit
                  </button>
                  <button className="button button-ghost" onClick={() => handleDelete(item.id)} type="button">
                    {supportsQuizCrud ? "Reset" : "Delete"}
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
