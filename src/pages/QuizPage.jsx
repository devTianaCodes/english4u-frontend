import { useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";

export default function QuizPage() {
  const { quizId } = useParams();

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Quiz" title={quizId} footer={<button className="button">Submit answers</button>}>
        <p>The quiz layer will support multiple-choice and fill-in-the-blank exercises with saved attempts.</p>
      </SectionCard>

      <SectionCard eyebrow="Question 01" title="Choose the correct sentence">
        <div className="quiz-options">
          <button className="quiz-option">She go to work every day.</button>
          <button className="quiz-option">She goes to work every day.</button>
          <button className="quiz-option">She going to work every day.</button>
        </div>
      </SectionCard>
    </div>
  );
}
