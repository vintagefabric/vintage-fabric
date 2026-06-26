import { WHATSAPP } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";

/**
 * "Chat with us" button, ALWAYS uses the Accounts (office) WhatsApp number
 * per the critical contact rule (plan §1). Pass an optional prefilled message.
 */
export function WhatsAppButton({
  message,
  label = "Chat on WhatsApp",
  className = "btn-gold",
}: {
  message?: string;
  label?: string;
  className?: string;
}) {
  const href = message ? WHATSAPP.withText(message) : WHATSAPP.link;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`${label} (opens WhatsApp)`}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}

/** Fixed floating WhatsApp action, shown site-wide. */
export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Vintage Fabric on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center
                 rounded-full bg-[#25D366] text-white shadow-card transition-transform
                 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-wine focus:ring-offset-2"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
