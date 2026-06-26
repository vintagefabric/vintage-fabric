import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="container-vf flex flex-col items-center py-28 text-center">
      <LogoMark size={120} />
      <h1 className="mt-8 text-4xl">Page not found</h1>
      <div className="rule-gold mx-auto mt-4" />
      <p className="mt-5 max-w-md text-ink-soft">
        The page you're looking for isn't here. It may have moved, or the link may be incomplete.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/collections" className="btn-outline">Browse collections</Link>
      </div>
    </div>
  );
}
