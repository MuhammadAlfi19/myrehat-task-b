"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Home, MapPin, Plus } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function BuyHomestayPage() {
	const { data: session, isPending: sessionLoading } = authClient.useSession();

	const {
		data: listings,
		isPending,
		isError,
		refetch,
	} = useQuery(orpc.listing.list.queryOptions());

	return (
		<main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
			<div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
				<div>
					<p className="mb-2 text-sm font-medium text-emerald-600">
						BuyHomestay Marketplace
					</p>

					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Explore Homestay Opportunities
					</h1>

					<p className="text-muted-foreground mt-3 text-sm sm:text-base">
						Discover properties, land, Airbnb profiles, and established homestay
						businesses.
					</p>
				</div>

				{!sessionLoading && (
					<Link
						href={session ? "/buy-homestay/new" : "/login"}
						className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
					>
						<Plus className="h-4 w-4" />
						Create Listing
					</Link>
				)}
			</div>

			{isPending && (
				<div className="text-muted-foreground rounded-xl border p-12 text-center">
					Loading listings...
				</div>
			)}

			{isError && (
				<div className="rounded-xl border p-12 text-center">
					<h2 className="font-semibold">Unable to load listings</h2>

					<p className="text-muted-foreground mt-2 text-sm">
						Please check your connection and try again.
					</p>

					<button
						type="button"
						onClick={() => refetch()}
						className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium"
					>
						Try Again
					</button>
				</div>
			)}

			{!isPending && !isError && listings?.length === 0 && (
				<div className="rounded-xl border border-dashed px-6 py-16 text-center">
					<Home className="text-muted-foreground mx-auto mb-4 h-10 w-10" />

					<h2 className="text-lg font-semibold">No listings yet</h2>

					<p className="text-muted-foreground mt-2 text-sm">
						Be the first to share a homestay opportunity.
					</p>
				</div>
			)}

			{!isPending && !isError && listings && listings.length > 0 && (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{listings.map((item) => {
						const phone = item.contactWa.replace(/\D/g, "");

						return (
							<article
								key={item.id}
								className="bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
							>
								<div className="flex h-36 items-center justify-center bg-emerald-50 dark:bg-emerald-950/30">
									<Home className="h-12 w-12 text-emerald-700 dark:text-emerald-400" />
								</div>

								<div className="space-y-4 p-5">
									<span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
										{item.category}
									</span>

									<div>
										<h2 className="text-lg font-semibold">{item.title}</h2>

										<p className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
											<MapPin className="h-4 w-4" />
											{item.location}
										</p>
									</div>

									<p className="text-xl font-bold">
										RM {Number(item.price).toLocaleString("en-MY")}
									</p>

									<a
										href={`https://wa.me/${phone}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
									>
										Contact via WhatsApp
										<ArrowRight className="h-4 w-4" />
									</a>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</main>
	);
}
