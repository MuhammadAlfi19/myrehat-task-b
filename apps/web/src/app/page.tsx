"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	CheckCircle2,
	House,
	MapPin,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<main className="min-h-screen">
			<section className="relative isolate overflow-hidden bg-[#F4FAF6] px-4 py-10 text-slate-900 sm:px-6 sm:py-24 lg:py-32 dark:bg-[#10251B] dark:text-white">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-40 right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-800/20"
				/>

				<div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<div className="space-y-7">
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
							<CheckCircle2 className="h-4 w-4" />A simpler way to find your
							next stay
						</div>

						<div className="space-y-5">
							<h1 className="max-w-3xl text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
								Book homestays directly with hosts
							</h1>

							<p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
								Discover welcoming homestays and connect directly with hosts.
								Explore your options with more clarity, convenience, and
								confidence.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								href="/buy-homestay"
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
							>
								Explore BuyHomestay
								<ArrowRight className="h-4 w-4" />
							</Link>

							<Link
								href="/login"
								className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-6 py-3.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
							>
								Get Started
							</Link>
						</div>

						<div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-slate-600 dark:text-slate-300">
							<span className="inline-flex items-center gap-2">
								<ShieldCheck className="h-4 w-4 text-emerald-700" />
								Direct host connection
							</span>

							<span className="inline-flex items-center gap-2">
								<MapPin className="h-4 w-4 text-emerald-700" />
								Explore locations
							</span>
						</div>
					</div>

					<div className="relative">
						<div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-3 shadow-2xl shadow-emerald-900/10 dark:border-emerald-900 dark:bg-slate-900">
							<div className="flex min-h-[260px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white sm:min-h-[400px] sm:p-10">
								<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
									<House className="h-7 w-7" />
								</div>

								<div className="space-y-4">
									<p className="text-sm font-medium text-emerald-100">
										YOUR NEXT STAY STARTS HERE
									</p>

									<h2 className="max-w-sm text-3xl leading-tight font-semibold sm:text-4xl">
										Find a place that feels like home.
									</h2>

									<p className="max-w-sm text-sm leading-relaxed text-emerald-50">
										Browse opportunities and connect with people behind the
										places.
									</p>
								</div>
							</div>
						</div>

						<div className="absolute right-5 -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:right-[-1rem] sm:left-auto dark:border-slate-800 dark:bg-slate-950">
							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
								<CheckCircle2 className="h-6 w-6" />
							</div>

							<div>
								<p className="text-sm font-semibold text-slate-900 dark:text-white">
									Discover. Connect. Stay.
								</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									A straightforward homestay experience
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<div className="mb-8">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Explore more with MyRehat
					</h2>

					<p className="text-muted-foreground mt-3">
						Find opportunities that suit your plans.
					</p>
				</div>

				<Link
					href="/buy-homestay"
					className="group bg-card flex flex-col justify-between gap-5 rounded-2xl border p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
				>
					<div className="flex items-center gap-4">
						<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
							<House className="h-7 w-7" />
						</div>

						<div>
							<h3 className="text-lg font-semibold">BuyHomestay Marketplace</h3>
							<p className="text-muted-foreground mt-1 text-sm">
								Explore properties, land, Airbnb profiles, and businesses.
							</p>
						</div>
					</div>

					<ArrowRight className="h-5 w-5 text-emerald-700 transition-transform group-hover:translate-x-1" />
				</Link>

				<p className="text-muted-foreground mt-6 text-xs">
					API Status:{" "}
					{healthCheck.isLoading
						? "Checking..."
						: healthCheck.data
							? "Connected"
							: "Disconnected"}
				</p>
			</section>
		</main>
	);
}
