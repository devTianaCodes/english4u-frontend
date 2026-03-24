import SectionCard from "../components/layout/SectionCard.jsx";

export default function RegisterPage() {
  return (
    <SectionCard eyebrow="Create account" title="Start your English path" footer={<button className="button">Create account</button>}>
      <form className="form-grid form-grid-double">
        <label>
          First name
          <input placeholder="Alex" type="text" />
        </label>
        <label>
          Last name
          <input placeholder="Morgan" type="text" />
        </label>
        <label>
          Email
          <input placeholder="alex@example.com" type="email" />
        </label>
        <label>
          Password
          <input placeholder="Create a password" type="password" />
        </label>
      </form>
    </SectionCard>
  );
}
