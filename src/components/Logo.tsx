import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/nocheplateadalogo.png"
      alt="Noche Plateada"
      width={1672}
      height={941}
      priority
      className={`h-auto w-full max-w-md select-none ${className}`}
    />
  );
}
