"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/buy-homestay", label: "BuyHomestay" },
	{ to: "/dashboard", label: "Dashboard" },
	{ to: "/ai", label: "AI Chat" },
] as const;

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="bg-background border-b">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
				<Link
					href="/"
					className="text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400"
				>
					MyRehat
				</Link>

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-6 text-sm font-medium md:flex"
				>
					{links.map(({ to, label }) => (
						<Link
							key={to}
							href={to}
							className="text-muted-foreground transition-colors hover:text-emerald-700"
						>
							{label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />

					<button
						type="button"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						aria-controls="mobile-navigation"
						onClick={() => setMenuOpen(!menuOpen)}
						className="rounded-lg border p-2 md:hidden"
					>
						{menuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>
			</div>

			{menuOpen && (
				<nav
					id="mobile-navigation"
					aria-label="Mobile navigation"
					className="border-t px-4 py-3 md:hidden"
				>
					<div className="flex flex-col gap-1">
						{links.map(({ to, label }) => (
							<Link
								key={to}
								href={to}
								onClick={() => setMenuOpen(false)}
								className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-3 text-sm font-medium"
							>
								{label}
							</Link>
						))}
					</div>
				</nav>
			)}
		</header>
	);
}
