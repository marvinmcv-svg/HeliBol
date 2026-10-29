import { InputFloatingLabel } from "./input-floating-label";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <form className="w-full max-w-xs space-y-3">
        <InputFloatingLabel label="Full name" />
        <InputFloatingLabel label="Email address" type="email" defaultValue="ava@kinetik.dev" />
        <InputFloatingLabel label="Company" error="Company is required" />
      </form>
    </div>
  );
}
