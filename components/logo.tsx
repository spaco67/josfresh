import { Sprout } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Sprout className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">JosFresh</span>
    </Link>
  );
}