import SectionCard from "../components/layout/SectionCard.jsx";

export default function AdminCollectionPage({ title, description }) {
  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Admin CMS" title={title} footer={<button className="button">Create new</button>}>
        <p>{description}</p>
      </SectionCard>

      <div className="grid grid-2">
        <SectionCard eyebrow="Draft item" title={`${title} draft`}>
          <p>Placeholder row for list rendering, search, filters, and form entry points.</p>
        </SectionCard>
        <SectionCard eyebrow="Workflow" title="Publishing notes">
          <p>Content will support draft and published states so learners only see approved material.</p>
        </SectionCard>
      </div>
    </div>
  );
}
