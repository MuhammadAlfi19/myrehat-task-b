"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

const categories = [
	"Buy Property",
	"Buy land to build homestay",
	"Buy Airbnb Profile",
	"Buy Airbnb Business",
] as const;

type Category = (typeof categories)[number];

export default function CreateListingPage() {
	const router = useRouter();

	const { data: session, isPending: sessionLoading } = authClient.useSession();

	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState<Category>("Buy Property");
	const [contactWa, setContactWa] = useState("");
	const [error, setError] = useState("");

	const createListing = useMutation(
		orpc.listing.create.mutationOptions({
			onSuccess: () => {
				router.push("/buy-homestay");
			},
		}),
	);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		const parsedPrice = Number(price);

		if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
			setError("Please enter a valid positive price.");
			return;
		}

		try {
			await createListing.mutateAsync({
				title: title.trim(),
				price: parsedPrice,
				location: location.trim(),
				category,
				contactWa: contactWa.trim(),
			});
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Unable to create listing.",
			);
		}
	}

	if (sessionLoading) {
		return (
			<main className="mx-auto max-w-2xl p-8">
				<p>Checking your session...</p>
			</main>
		);
	}

	if (!session) {
		return (
			<main className="mx-auto max-w-2xl px-4 py-16 text-center">
				<h1 className="text-2xl font-bold">Sign in to create a listing</h1>

				<p className="text-muted-foreground mt-3">
					You need an account before publishing a BuyHomestay listing.
				</p>

				<Link
					href="/login"
					className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white"
				>
					Go to Login
				</Link>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
			<Link
				href="/buy-homestay"
				className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to listings
			</Link>

			<div className="mb-8">
				<h1 className="text-3xl font-bold">Create BuyHomestay Listing</h1>

				<p className="text-muted-foreground mt-3">
					Share your property or Airbnb business opportunity with potential
					buyers.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-card space-y-6 rounded-xl border p-6"
			>
				<div className="space-y-2">
					<label htmlFor="title" className="block text-sm font-medium">
						Listing Title
					</label>

					<input
						id="title"
						type="text"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Example: Modern Homestay in KL"
						maxLength={150}
						required
						className="bg-background w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="price" className="block text-sm font-medium">
						Price (RM)
					</label>

					<input
						id="price"
						type="number"
						min="0.01"
						step="any"
						value={price}
						onChange={(event) => setPrice(event.target.value)}
						placeholder="350000"
						required
						className="bg-background w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="location" className="block text-sm font-medium">
						Location
					</label>

					<input
						id="location"
						type="text"
						value={location}
						onChange={(event) => setLocation(event.target.value)}
						placeholder="Kuala Lumpur, Malaysia"
						maxLength={200}
						required
						className="bg-background w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="category" className="block text-sm font-medium">
						Category
					</label>

					<select
						id="category"
						value={category}
						onChange={(event) => setCategory(event.target.value as Category)}
						required
						className="bg-background w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
					>
						{categories.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label htmlFor="contactWa" className="block text-sm font-medium">
						WhatsApp Contact
					</label>

					<input
						id="contactWa"
						type="tel"
						value={contactWa}
						onChange={(event) => setContactWa(event.target.value)}
						placeholder="60123456789"
						maxLength={30}
						required
						className="bg-background w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
					/>

					<p className="text-muted-foreground text-xs">
						Include your country code without spaces.
					</p>
				</div>

				{error && (
					<p
						role="alert"
						className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
					>
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={createListing.isPending}
					className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
				>
					{createListing.isPending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Publishing...
						</>
					) : (
						"Publish Listing"
					)}
				</button>
			</form>
		</main>
	);
}
