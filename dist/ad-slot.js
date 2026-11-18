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
		return (i, a) => (r(), t("div", {
			role: "complementary",
			"aria-label": "Рекламное место",
			class: "flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-600 dark:bg-slate-800",
			style: e(s.value)
		}, [...a[0] ||= [n("span", { class: "px-3 text-sm font-medium text-slate-500 dark:text-slate-300" }, "Рекламное место", -1)]], 4));
	}
}, s = document.getElementById("ad-slot");
s && a(o, { size: "banner" }).mount(s);
