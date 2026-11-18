import { D as e, a as t, i as n, o as r, r as i, t as a } from "./shared-runtime-dom.esm-bundler.js";
// src/AdSlot.vue
var o = {
	__name: "AdSlot",
	props: {
		size: {
			type: String,
			default: "banner",
			validator: (e) => ["banner", "sidebar"].includes(e)
		},
		width: {
			type: String,
			default: ""
		},
		height: {
			type: String,
			default: ""
		}
	},
	setup(a) {
		let o = a, s = i(() => ({
			width: o.width || (o.size === "sidebar" ? "300px" : "728px"),
			height: o.height || (o.size === "sidebar" ? "250px" : "90px"),
			maxWidth: "100%"
		}));
		return (i, a) => (r(), n("a", {
			href: "https://ru.wikipedia.org/",
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "Открыть Википедию в новой вкладке",
			class: "flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 text-left shadow-sm transition hover:border-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-slate-800",
			style: e(s.value)
		}, [...a[0] ||= [t("<span class=\"flex min-w-0 items-center gap-3\"><span aria-hidden=\"true\" class=\"font-display text-4xl text-slate-800 dark:text-white\">W</span><span class=\"min-w-0\"><span class=\"block text-sm font-bold text-slate-900 dark:text-white\">Википедия</span><span class=\"block text-xs text-slate-600 dark:text-slate-300\">Свободная энциклопедия для любознательных</span></span></span><span aria-hidden=\"true\" class=\"shrink-0 text-lg text-brand-700 dark:text-brand-300\">↗</span>", 2)]], 4));
	}
}, s = document.getElementById("ad-slot");
s && a(o, { size: "banner" }).mount(s);
