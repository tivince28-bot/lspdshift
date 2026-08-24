import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { _ as CircleHelp, a as Trash2, c as Plus, d as MapPinned, f as Hand, g as Download, h as EyeOff, l as Pentagon, m as Eye, n as Users, o as Square, p as Funnel, r as Upload, s as Search, t as X, u as Pencil, v as CircleDot } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, g as Slot, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
import { t as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSjg5Jle.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
function todayIsoDate() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
/** Compress an image file to a JPEG data URL for the public board. */
function readImageFile(file, maxEdge = 480) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("No canvas"));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .72));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Could not read image"));
		};
		img.src = url;
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]", {
	variants: { variant: {
		default: "bg-surface-2 text-muted",
		ok: "bg-ok/15 text-ok",
		danger: "bg-danger/15 text-danger",
		outline: "border border-border text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,opacity,transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface-2/80",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			danger: "bg-danger text-fg hover:bg-danger/90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 px-2.5 text-xs",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg shadow-none transition-[border-color,box-shadow] duration-[var(--motion-quick)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-20 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2 touch-none select-none p-px",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
var GANG_STATUSES = [
	"active",
	"dormant",
	"unknown"
];
var TERRITORY_KINDS = [
	"turf",
	"contested",
	"claimed"
];
var PIN_KINDS = [
	"graffiti",
	"throw-up",
	"mural",
	"stencil",
	"slap",
	"other"
];
var PIN_KIND_LABEL = {
	graffiti: "Graffiti",
	"throw-up": "Throw-up",
	mural: "Mural",
	stencil: "Stencil",
	slap: "Slap",
	other: "Other"
};
var TERRITORY_KIND_LABEL = {
	turf: "Turf",
	contested: "Contested",
	claimed: "Claimed"
};
var GANG_STATUS_LABEL = {
	active: "Active",
	dormant: "Dormant",
	unknown: "Unknown"
};
var GANG_COLOR_PRESETS = [
	"#b33a3a",
	"#2f7a3a",
	"#c4a035",
	"#2a7f98",
	"#5c3d8a",
	"#2f4f8a",
	"#8a5a2f",
	"#1f1f1f",
	"#d8d4c8",
	"#6a3d5c",
	"#3d6a5c",
	"#7a4a1f"
];
function GangPanel({ gangs, territories, pins, query, onQuery, selectedGangId, hiddenGangIds, showUnassigned, onSelectGang, onToggleHidden, onToggleUnassigned, onNewGang }) {
	const q = query.trim().toLowerCase();
	const filtered = q ? gangs.filter((g) => g.name.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q) || g.leader.toLowerCase().includes(q)) : gangs;
	const unassignedTurf = territories.filter((t) => !t.gangId).length;
	const unassignedPins = pins.filter((p) => !p.gangId).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-4 pt-4 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-wide text-fg",
					children: "Gangs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [gangs.length, " on the board"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: onNewGang,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => onQuery(e.target.value),
						placeholder: "Search gangs",
						className: "pl-9"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "min-h-0 flex-1 px-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1 pb-4",
					children: [filtered.map((g) => {
						const turfN = territories.filter((t) => t.gangId === g.id).length;
						const pinN = pins.filter((p) => p.gangId === g.id).length;
						const hidden = hiddenGangIds.has(g.id);
						const selected = selectedGangId === g.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-stretch gap-1 rounded-lg pr-1 transition-colors duration-[var(--motion-quick)]", selected ? "bg-surface-2" : "hover:bg-surface-2/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onSelectGang(g.id),
								className: "flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 shrink-0 rounded-full",
									style: { background: g.color }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-baseline gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm font-medium text-fg",
											children: g.name
										}), g.tag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-subtle",
											children: g.tag
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 flex items-center gap-2 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: g.status === "active" ? "ok" : "default",
											children: GANG_STATUS_LABEL[g.status]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											turfN,
											" turf · ",
											pinN,
											" tag",
											pinN === 1 ? "" : "s"
										] })]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "self-center rounded-md p-2 text-subtle hover:bg-surface hover:text-fg",
								onClick: () => onToggleHidden(g.id),
								"aria-label": hidden ? "Show on map" : "Hide on map",
								children: hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})]
						}) }, g.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-stretch gap-1 rounded-lg pr-1", showUnassigned ? "" : "opacity-50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 shrink-0 rounded-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-fg",
									children: "Unassigned"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: [
										unassignedTurf,
										" turf · ",
										unassignedPins,
										" tag",
										unassignedPins === 1 ? "" : "s"
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "self-center rounded-md p-2 text-subtle hover:bg-surface hover:text-fg",
							onClick: onToggleUnassigned,
							"aria-label": showUnassigned ? "Hide unassigned" : "Show unassigned",
							children: showUnassigned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" })
						})]
					}) })]
				})
			})
		]
	});
}
function Dialog({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, { ...props });
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal$1, { ...props });
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-[2000] bg-bg/70", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-[2010] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-1 text-muted hover:bg-surface-2 hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-6", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function SelectField({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children
	});
}
function ColorSwatches({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-1.5",
		children: [GANG_COLOR_PRESETS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("size-7 rounded-md border transition-[transform,box-shadow] duration-[var(--motion-quick)]", value.toLowerCase() === c.toLowerCase() ? "border-fg scale-105" : "border-border hover:border-muted"),
			style: { background: c },
			onClick: () => onChange(c),
			"aria-label": c
		}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "size-7 overflow-hidden rounded-md border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value,
				onChange: (e) => onChange(e.target.value),
				className: "size-10 -translate-x-1 -translate-y-1 cursor-pointer",
				"aria-label": "Custom color"
			})
		})]
	});
}
function ImageField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: value,
				alt: "",
				className: "size-12 rounded-md object-cover shadow-[var(--shadow-border)]"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-md bg-surface-2 text-xs text-subtle",
				children: "none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					className: "text-xs text-muted file:mr-2 file:rounded-md file:border-0 file:bg-surface-2 file:px-2 file:py-1 file:text-xs file:text-fg",
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						readImageFile(file).then(onChange).catch(() => {});
						e.target.value = "";
					}
				}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-left text-xs text-muted hover:text-fg",
					onClick: () => onChange(""),
					children: "Remove"
				}) : null]
			})]
		})]
	});
}
function Field$1({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function GangFormDialog({ open, onOpenChange, initial, onSubmit }) {
	const [name, setName] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)(GANG_COLOR_PRESETS[0]);
	const [status, setStatus] = (0, import_react.useState)("active");
	const [leader, setLeader] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [members, setMembers] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName(initial?.name ?? "");
		setTag(initial?.tag ?? "");
		setColor(initial?.color ?? GANG_COLOR_PRESETS[0]);
		setStatus(initial?.status ?? "active");
		setLeader(initial?.leader ?? "");
		setDescription(initial?.description ?? "");
		setMembers(initial?.members ?? "");
		setNotes(initial?.notes ?? "");
		setLogo(initial?.logo ?? "");
	}, [open, initial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial?.id ? "Edit gang" : "New gang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Name, color, leader, and an optional logo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim()) return;
					onSubmit({
						name: name.trim(),
						tag: tag.trim().toUpperCase(),
						color,
						status,
						leader: leader.trim(),
						description: description.trim(),
						members: members.trim(),
						notes: notes.trim(),
						logo
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Ballas",
							autoFocus: true,
							required: true,
							maxLength: 80
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Tag",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: tag,
								onChange: (e) => setTag(e.target.value),
								placeholder: "BLS",
								maxLength: 12
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								children: GANG_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: GANG_STATUS_LABEL[s]
								}, s))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Color",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatches, {
							value: color,
							onChange: setColor
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Leader",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: leader,
							onChange: (e) => setLeader(e.target.value),
							placeholder: "Unknown",
							maxLength: 80
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3,
							maxLength: 2e3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Members (one per line)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: members,
							onChange: (e) => setMembers(e.target.value),
							rows: 3,
							maxLength: 4e3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 2,
							maxLength: 4e3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "Logo (optional)",
						value: logo,
						onChange: setLogo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save gang"
						})]
					})
				]
			})]
		})
	});
}
function TerritoryFormDialog({ open, onOpenChange, gangs, onSubmit }) {
	const [name, setName] = (0, import_react.useState)("");
	const [gangId, setGangId] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("turf");
	const [notes, setNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName("");
		setGangId(gangs[0]?.id ?? "");
		setKind("turf");
		setNotes("");
	}, [open, gangs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New territory" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Assign the turf you just drew. Drag corners later to reshape it." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				if (!name.trim()) return;
				onSubmit({
					name: name.trim(),
					gangId: gangId || null,
					kind,
					color: null,
					notes: notes.trim()
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Davis block",
						autoFocus: true,
						required: true,
						maxLength: 80
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Gang",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: gangId,
							onChange: (e) => setGangId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Unassigned"
							}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g.id,
								children: g.name
							}, g.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Kind",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: TERRITORY_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: TERRITORY_KIND_LABEL[k]
							}, k))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						rows: 3,
						maxLength: 4e3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => onOpenChange(false),
						children: "Discard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save territory"
					})]
				})
			]
		})] })
	});
}
function PinFormDialog({ open, onOpenChange, gangs, onSubmit }) {
	const [name, setName] = (0, import_react.useState)("");
	const [gangId, setGangId] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("graffiti");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [dateFound, setDateFound] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName("");
		setGangId(gangs[0]?.id ?? "");
		setKind("graffiti");
		setNotes("");
		setDateFound(todayIsoDate());
		setImage("");
	}, [open, gangs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New gang tag" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A colored dot on the map for graffiti found at this spot." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim()) return;
					onSubmit({
						name: name.trim(),
						gangId: gangId || null,
						kind,
						color: null,
						notes: notes.trim(),
						dateFound,
						image
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Tag type / name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Davis alley throw-up",
							autoFocus: true,
							required: true,
							maxLength: 80
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Kind",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								value: kind,
								onChange: (e) => setKind(e.target.value),
								children: PIN_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									children: PIN_KIND_LABEL[k]
								}, k))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Gang",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
								value: gangId,
								onChange: (e) => setGangId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Unassigned"
								}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: g.id,
									children: g.name
								}, g.id))]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Date found",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dateFound,
							onChange: (e) => setDateFound(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3,
							maxLength: 4e3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "Photo (optional)",
						value: image,
						onChange: setImage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "Discard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save tag"
						})]
					})
				]
			})]
		})
	});
}
function HelpDialog({ open, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "How it works" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Draw turf, drop gang tags, click anything for the file." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-3 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Map"
					}), " — Atlas (pause-menu), Satellite (aerial with street names), or Print (paper map with street names). Switch them in the header."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Territory"
					}), " — click corners, then double-click or Enter to close. Right-click undoes. Esc cancels."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Box"
					}), " — click and drag a rectangle."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Tag"
					}), " — click the map to drop a colored graffiti marker."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg",
						children: "Reshape"
					}), " — select a territory, then drag the corner dots. Selected tags can be dragged too."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The board is public and shared — no sign-in. Anyone can add turf and tags. Export JSON for a backup." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onOpenChange(false),
					children: "Got it"
				})
			})
		] })
	});
}
function FiltersDialog({ open, onOpenChange, gangs, showTerritories, showTags, turfGang, tagGang, onShowTerritories, onShowTags, onTurfGang, onTagGang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Filters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Toggle layers and limit them to one gang." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: showTerritories,
							onChange: (e) => onShowTerritories(e.target.checked)
						}), "Show territories"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Territories for",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: turfGang,
							onChange: (e) => onTurfGang(e.target.value),
							disabled: !showTerritories,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All gangs"
							}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g.id,
								children: g.name
							}, g.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: showTags,
							onChange: (e) => onShowTags(e.target.checked)
						}), "Show gang tags"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Tags for",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: tagGang,
							onChange: (e) => onTagGang(e.target.value),
							disabled: !showTags,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All gangs"
							}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g.id,
								children: g.name
							}, g.id))]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onOpenChange(false),
					children: "Done"
				})
			})
		] })
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function InspectorPanel({ selection, gangs, territories, pins, onClose, onFocus, onEditGang, onSaveGang, onSaveTerritory, onSavePin, onDelete, onSelectTerritory, onSelectPin }) {
	if (!selection) return null;
	if (selection.type === "gang") {
		const g = gangs.find((x) => x.id === selection.id);
		if (!g) return null;
		const turf = territories.filter((t) => t.gangId === g.id);
		const marks = pins.filter((p) => p.gangId === g.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PanelShell, {
			title: g.name,
			subtitle: g.tag || "Gang file",
			color: g.color,
			onClose,
			onFocus,
			onDelete,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => onEditGang(g),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Edit"]
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: g.status === "active" ? "ok" : "default",
						children: GANG_STATUS_LABEL[g.status]
					}), g.leader ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						children: ["Lead ", g.leader]
					}) : null]
				}),
				g.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: g.logo,
					alt: "",
					className: "h-24 w-full rounded-md object-cover shadow-[var(--shadow-border)]"
				}) : null,
				g.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: g.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
						value: g.status,
						onChange: (e) => onSaveGang({
							...g,
							status: e.target.value
						}),
						children: GANG_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: GANG_STATUS_LABEL[s]
						}, s))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Color",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatches, {
						value: g.color,
						onChange: (color) => onSaveGang({
							...g,
							color
						})
					})
				}),
				g.members ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Members" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1.5 space-y-1 text-sm text-fg",
					children: g.members.split("\n").map((line) => line.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line) : null)
				})] }) : null,
				g.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: g.notes
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Zones"
				}), turf.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "No turf drawn yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: turf.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full rounded-md px-2 py-1.5 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => onSelectTerritory(t.id),
						children: [t.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-subtle",
							children: TERRITORY_KIND_LABEL[t.kind]
						})]
					}) }, t.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Tags"
				}), marks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "No tags yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: marks.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full rounded-md px-2 py-1.5 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => onSelectPin(p.id),
						children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-subtle",
							children: PIN_KIND_LABEL[p.kind]
						})]
					}) }, p.id))
				})] })
			]
		});
	}
	if (selection.type === "territory") {
		const t = territories.find((x) => x.id === selection.id);
		if (!t) return null;
		const owner = gangs.find((g) => g.id === t.gangId);
		const color = t.color ?? owner?.color ?? "#8b8e96";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PanelShell, {
			title: t.name,
			subtitle: "Territory",
			color,
			onClose,
			onFocus,
			onDelete,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Drag the corner dots on the map to reshape this territory."
				}),
				owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface-2 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: "Controlling gang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium text-fg",
							children: owner.name
						}),
						owner.leader ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Leader ", owner.leader]
						}) : null,
						owner.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: owner.description
						}) : null
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: t.name,
						onBlur: (e) => {
							const name = e.target.value.trim();
							if (name && name !== t.name) onSaveTerritory({
								...t,
								name
							});
						},
						maxLength: 80
					}, t.id + t.name)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Gang",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: t.gangId ?? "",
							onChange: (e) => onSaveTerritory({
								...t,
								gangId: e.target.value || null
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Unassigned"
							}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g.id,
								children: g.name
							}, g.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kind",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							value: t.kind,
							onChange: (e) => onSaveTerritory({
								...t,
								kind: e.target.value
							}),
							children: TERRITORY_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: TERRITORY_KIND_LABEL[k]
							}, k))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						defaultValue: t.notes,
						rows: 4,
						onBlur: (e) => {
							const notes = e.target.value;
							if (notes !== t.notes) onSaveTerritory({
								...t,
								notes
							});
						},
						maxLength: 4e3
					}, t.id + "-notes")
				})
			]
		});
	}
	const pin = pins.find((x) => x.id === selection.id);
	if (!pin) return null;
	const color = pin.color ?? gangs.find((g) => g.id === pin.gangId)?.color ?? "#8b8e96";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PanelShell, {
		title: pin.name,
		subtitle: PIN_KIND_LABEL[pin.kind],
		color,
		onClose,
		onFocus,
		onDelete,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [
					"Drag this tag on the map to move it. X ",
					pin.lng.toFixed(0),
					" · Y",
					" ",
					pin.lat.toFixed(0)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tag type / name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					defaultValue: pin.name,
					onBlur: (e) => {
						const name = e.target.value.trim();
						if (name && name !== pin.name) onSavePin({
							...pin,
							name
						});
					},
					maxLength: 80
				}, pin.id + pin.name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Kind",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
						value: pin.kind,
						onChange: (e) => onSavePin({
							...pin,
							kind: e.target.value
						}),
						children: PIN_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: PIN_KIND_LABEL[k]
						}, k))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Gang",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: pin.gangId ?? "",
						onChange: (e) => onSavePin({
							...pin,
							gangId: e.target.value || null
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Unassigned"
						}), gangs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: g.id,
							children: g.name
						}, g.id))]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Date found",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					defaultValue: pin.dateFound,
					onBlur: (e) => {
						if (e.target.value !== pin.dateFound) onSavePin({
							...pin,
							dateFound: e.target.value
						});
					}
				}, pin.id + "-date")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					defaultValue: pin.notes,
					rows: 4,
					onBlur: (e) => {
						const notes = e.target.value;
						if (notes !== pin.notes) onSavePin({
							...pin,
							notes
						});
					},
					maxLength: 4e3
				}, pin.id + "-notes")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "Photo",
				value: pin.image,
				onChange: (image) => onSavePin({
					...pin,
					image
				})
			})
		]
	});
}
function PanelShell({ title, subtitle, color, onClose, onFocus, onDelete, extra, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 border-b border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 size-3 shrink-0 rounded-full",
						style: { background: color }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl leading-tight tracking-wide text-fg",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: subtitle
						})]
					}),
					extra,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						onClick: onClose,
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "min-h-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 px-4 py-4",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: onFocus,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-3.5" }), "Fly to"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					className: "ml-auto text-danger",
					onClick: onDelete,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Delete"]
				})]
			})
		]
	});
}
/**
* GTA V game XY → shared labeled atlas/satellite/print images (same crop & scale).
* CRS fitted so Paleto, Chiliad, downtown LS and the port line up with game coords.
*/
var CRS_A = .01605;
var CRS_B = 51.2;
var CRS_C = -.01745;
var CRS_D = 137.8;
var MAP_CENTER = [-900, 50];
var TILE_STYLES = {
	atlas: {
		url: "https://s.rsg.sc/sc/images/games/GTAV/map/game/{z}/{x}/{y}.jpg",
		overlay: "/maps/atlas-labeled.jpg",
		background: "#2f4148",
		label: "Atlas"
	},
	satellite: {
		url: "https://s.rsg.sc/sc/images/games/GTAV/map/render/{z}/{x}/{y}.jpg",
		overlay: "/maps/satellite-labeled.jpg",
		background: "#0c2a4e",
		label: "Satellite"
	},
	print: {
		url: "https://s.rsg.sc/sc/images/games/GTAV/map/print/{z}/{x}/{y}.jpg",
		overlay: "/maps/print-labeled.jpg",
		background: "#4aa8c8",
		label: "Print"
	}
};
var MAX_BOUNDS = [[-3600, -3800], [7800, 4500]];
var JUMP_TARGETS = [
	{
		id: "ls",
		name: "Los Santos",
		lat: -900,
		lng: 50,
		zoom: 4
	},
	{
		id: "sandy",
		name: "Sandy Shores",
		lat: 3665,
		lng: 2050,
		zoom: 5
	},
	{
		id: "paleto",
		name: "Paleto Bay",
		lat: 6465,
		lng: -110,
		zoom: 5
	},
	{
		id: "state",
		name: "San Andreas",
		lat: 1800,
		lng: 200,
		zoom: 2
	}
];
var TRANSPARENT_TILE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var TILE_EXTENT = {
	0: {
		maxX: 0,
		maxY: 0
	},
	1: {
		maxX: 0,
		maxY: 1
	},
	2: {
		maxX: 1,
		maxY: 2
	},
	3: {
		maxX: 3,
		maxY: 5
	},
	4: {
		maxX: 7,
		maxY: 11
	},
	5: {
		maxX: 15,
		maxY: 23
	},
	6: {
		maxX: 31,
		maxY: 47
	},
	7: {
		maxX: 63,
		maxY: 95
	}
};
/**
* Game-XY bounds of the labeled satellite/print images (MapGenie crop).
* Fitted to RSG landmarks; SW is min lat/lng, NE is max.
*/
var LABELED_BOUNDS = [[-3437.36, -4582.76], [7894.6, 7745.05]];
function gangColor(gangs, gangId, fallback) {
	if (fallback) return fallback;
	if (!gangId) return "#8b8e96";
	return gangs.find((g) => g.id === gangId)?.color ?? "#8b8e96";
}
function pinHtml(color) {
	return `<span class="ls-pin-dot" style="background:${color}"></span>`;
}
function closeEnough(L, a, b, map, px = 14) {
	return map.latLngToLayerPoint(a).distanceTo(map.latLngToLayerPoint(b)) <= px;
}
function makeCrs(L) {
	return L.extend({}, L.CRS.Simple, {
		projection: L.Projection.LonLat,
		scale(zoom) {
			return Math.pow(2, zoom);
		},
		zoom(scale) {
			return Math.log(scale) / Math.LN2;
		},
		distance(latlng1, latlng2) {
			const dx = latlng2.lng - latlng1.lng;
			const dy = latlng2.lat - latlng1.lat;
			return Math.sqrt(dx * dx + dy * dy);
		},
		transformation: new L.Transformation(CRS_A, CRS_B, CRS_C, CRS_D),
		infinite: true
	});
}
function makeTileLayer(L, urlTemplate) {
	return new (L.TileLayer.extend({ getTileUrl(coords) {
		const extent = TILE_EXTENT[coords.z];
		if (!extent || coords.x < 0 || coords.y < 0 || coords.x > extent.maxX || coords.y > extent.maxY) return TRANSPARENT_TILE;
		return L.TileLayer.prototype.getTileUrl.call(this, coords);
	} }))(urlTemplate, {
		minZoom: 1,
		maxZoom: 7,
		maxNativeZoom: 7,
		noWrap: true,
		errorTileUrl: TRANSPARENT_TILE,
		attribution: "San Andreas atlas"
	});
}
function applyLabeledOverlay(L, map, overlay, layerRef, tiles) {
	const bounds = L.latLngBounds(LABELED_BOUNDS[0], LABELED_BOUNDS[1]);
	if (overlay) {
		if (layerRef.current) {
			layerRef.current.setUrl(overlay);
			layerRef.current.setBounds(bounds);
			if (!map.hasLayer(layerRef.current)) layerRef.current.addTo(map);
		} else layerRef.current = L.imageOverlay(overlay, bounds, {
			pane: "basemap",
			interactive: false,
			opacity: 1
		}).addTo(map);
		tiles?.setOpacity(0);
	} else {
		if (layerRef.current && map.hasLayer(layerRef.current)) map.removeLayer(layerRef.current);
		tiles?.setOpacity(1);
	}
}
function gangName(gangs, id) {
	if (!id) return "Unassigned";
	return gangs.find((g) => g.id === id)?.name ?? "Unknown";
}
function MapCanvas(props) {
	const hostRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const Lref = (0, import_react.useRef)(null);
	const tileRef = (0, import_react.useRef)(null);
	const labeledRef = (0, import_react.useRef)(null);
	const turfLayerRef = (0, import_react.useRef)(null);
	const pinLayerRef = (0, import_react.useRef)(null);
	const drawLayerRef = (0, import_react.useRef)(null);
	const vertexLayerRef = (0, import_react.useRef)(null);
	const turfById = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const pinById = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const propsRef = (0, import_react.useRef)(props);
	propsRef.current = props;
	const toolRef = (0, import_react.useRef)(props.tool);
	toolRef.current = props.tool;
	const draftRef = (0, import_react.useRef)([]);
	const rectStartRef = (0, import_react.useRef)(null);
	const draggingVertexRef = (0, import_react.useRef)(false);
	const workingPolyRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let map = null;
		async function boot() {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			await Promise.resolve({});
			if (cancelled || !hostRef.current) return;
			Lref.current = L;
			map = L.map(hostRef.current, {
				crs: makeCrs(L),
				center: MAP_CENTER,
				zoom: 4,
				minZoom: 1,
				maxZoom: 7,
				maxBounds: L.latLngBounds(MAX_BOUNDS[0], MAX_BOUNDS[1]),
				maxBoundsViscosity: .7,
				zoomControl: true,
				attributionControl: true,
				doubleClickZoom: false,
				zoomSnap: 1,
				zoomDelta: 1,
				wheelPxPerZoomLevel: 80,
				zoomAnimation: true,
				markerZoomAnimation: true
			});
			map.attributionControl.setPrefix("");
			map.attributionControl.setPosition("bottomleft");
			map.zoomControl.setPosition("bottomright");
			mapRef.current = map;
			map.createPane("basemap");
			const basePane = map.getPane("basemap");
			if (basePane) {
				basePane.style.zIndex = "250";
				basePane.style.pointerEvents = "none";
			}
			const initial = TILE_STYLES[propsRef.current.tileStyle];
			const tiles = makeTileLayer(L, initial.url).addTo(map);
			tileRef.current = tiles;
			hostRef.current.style.background = initial.background;
			applyLabeledOverlay(L, map, initial.overlay, labeledRef, tiles);
			turfLayerRef.current = L.featureGroup().addTo(map);
			pinLayerRef.current = L.featureGroup().addTo(map);
			drawLayerRef.current = L.layerGroup().addTo(map);
			vertexLayerRef.current = L.layerGroup().addTo(map);
			map.on("mousemove", (e) => {
				propsRef.current.onCursor(e.latlng.lat, e.latlng.lng);
				if (toolRef.current === "polygon" && draftRef.current.length > 0) paintDraft(L, [...draftRef.current, e.latlng], false);
				if (toolRef.current === "rect" && rectStartRef.current) paintRect(L, rectStartRef.current, e.latlng);
			});
			map.on("mousedown", (e) => {
				if (toolRef.current !== "rect") return;
				if (e.originalEvent.button !== 0) return;
				rectStartRef.current = e.latlng;
				map?.dragging.disable();
			});
			map.on("mouseup", (e) => {
				if (toolRef.current !== "rect" || !rectStartRef.current) return;
				const start = rectStartRef.current;
				rectStartRef.current = null;
				map?.dragging.enable();
				drawLayerRef.current?.clearLayers();
				const dy = Math.abs(start.lat - e.latlng.lat);
				const dx = Math.abs(start.lng - e.latlng.lng);
				if (dy > 40 || dx > 40) propsRef.current.onCreateTerritory(rectToPolygon(start, e.latlng));
			});
			map.on("click", (e) => {
				const tool = toolRef.current;
				if (tool === "pin") {
					propsRef.current.onCreatePin(e.latlng.lat, e.latlng.lng);
					return;
				}
				if (tool === "polygon") {
					const pts = draftRef.current;
					if (pts.length >= 3 && closeEnough(L, pts[0], e.latlng, map)) {
						finishPolygon();
						return;
					}
					pts.push(e.latlng);
					paintDraft(L, pts, false);
					return;
				}
				if (tool === "pan") propsRef.current.onSelect(null);
			});
			map.on("dblclick", () => {
				if (toolRef.current === "polygon" && draftRef.current.length >= 3) finishPolygon();
			});
			map.on("contextmenu", (e) => {
				e.originalEvent.preventDefault();
				if (toolRef.current === "polygon" && draftRef.current.length > 0) {
					draftRef.current.pop();
					paintDraft(L, draftRef.current, false);
					return;
				}
				cancelDraft();
			});
			const ro = new ResizeObserver(() => {
				map?.invalidateSize({ animate: false });
			});
			ro.observe(hostRef.current);
			map.__ro = ro;
			requestAnimationFrame(() => map?.invalidateSize({ animate: false }));
			const onKey = (ev) => {
				const tag = ev.target?.tagName;
				if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
				if (ev.key === "Escape") cancelDraft();
				if ((ev.key === "Enter" || ev.key === " ") && toolRef.current === "polygon" && draftRef.current.length >= 3) {
					ev.preventDefault();
					finishPolygon();
				}
			};
			window.addEventListener("keydown", onKey);
			map.__onKey = onKey;
			syncAll();
		}
		function finishPolygon() {
			const pts = draftRef.current;
			if (pts.length < 3) return;
			const polygon = pts.map((p) => ({
				lat: p.lat,
				lng: p.lng
			}));
			draftRef.current = [];
			drawLayerRef.current?.clearLayers();
			propsRef.current.onCreateTerritory(polygon);
		}
		function cancelDraft() {
			draftRef.current = [];
			rectStartRef.current = null;
			drawLayerRef.current?.clearLayers();
		}
		function paintDraft(L, pts, closed) {
			const layer = drawLayerRef.current;
			if (!layer) return;
			layer.clearLayers();
			if (pts.length === 0) return;
			L.polyline(pts, {
				color: "#ecece6",
				weight: 2,
				dashArray: "5 6",
				interactive: false
			}).addTo(layer);
			if (closed) L.polygon(pts, {
				color: "#ecece6",
				weight: 1,
				fillColor: "#ecece6",
				fillOpacity: .12,
				interactive: false
			}).addTo(layer);
			pts.forEach((p, i) => {
				L.circleMarker(p, {
					radius: i === 0 ? 6 : 4,
					color: "#0c0d0f",
					weight: 2,
					fillColor: "#ecece6",
					fillOpacity: 1,
					interactive: false
				}).addTo(layer);
			});
		}
		function paintRect(L, a, b) {
			const layer = drawLayerRef.current;
			if (!layer) return;
			layer.clearLayers();
			L.rectangle(L.latLngBounds(a, b), {
				color: "#ecece6",
				weight: 2,
				dashArray: "5 6",
				fillColor: "#ecece6",
				fillOpacity: .12,
				interactive: false
			}).addTo(layer);
		}
		function rectToPolygon(a, b) {
			const south = Math.min(a.lat, b.lat);
			const north = Math.max(a.lat, b.lat);
			const west = Math.min(a.lng, b.lng);
			const east = Math.max(a.lng, b.lng);
			return [
				{
					lat: south,
					lng: west
				},
				{
					lat: south,
					lng: east
				},
				{
					lat: north,
					lng: east
				},
				{
					lat: north,
					lng: west
				}
			];
		}
		boot();
		return () => {
			cancelled = true;
			const m = mapRef.current;
			if (m) {
				const key = m.__onKey;
				if (key) window.removeEventListener("keydown", key);
				m.__ro?.disconnect();
				m.remove();
			}
			mapRef.current = null;
		};
	}, []);
	function syncVertices() {
		const L = Lref.current;
		const layer = vertexLayerRef.current;
		if (!L || !layer) return;
		if (draggingVertexRef.current) return;
		layer.clearLayers();
		const p = propsRef.current;
		const sel = p.selection;
		if (p.tool !== "pan" || sel?.type !== "territory") return;
		const t = p.territories.find((x) => x.id === sel.id);
		if (!t) return;
		const poly = turfById.current.get(t.id);
		workingPolyRef.current = t.polygon.map((pt) => ({ ...pt }));
		t.polygon.forEach((pt, i) => {
			const marker = L.marker([pt.lat, pt.lng], {
				draggable: true,
				zIndexOffset: 1200,
				icon: L.divIcon({
					className: "ls-vertex-wrap",
					html: `<span class="ls-vertex"></span>`,
					iconSize: [14, 14],
					iconAnchor: [7, 7]
				})
			});
			marker.on("mousedown", (e) => {
				L.DomEvent.stopPropagation(e);
			});
			marker.on("click", (e) => {
				L.DomEvent.stopPropagation(e);
			});
			marker.on("dragstart", () => {
				draggingVertexRef.current = true;
			});
			marker.on("drag", () => {
				const ll = marker.getLatLng();
				const next = (workingPolyRef.current ?? t.polygon).map((q, j) => j === i ? {
					lat: ll.lat,
					lng: ll.lng
				} : q);
				workingPolyRef.current = next;
				poly?.setLatLngs(next.map((q) => L.latLng(q.lat, q.lng)));
			});
			marker.on("dragend", () => {
				draggingVertexRef.current = false;
				const next = workingPolyRef.current;
				if (next && next.length >= 3) propsRef.current.onUpdatePolygon(t.id, next);
			});
			marker.addTo(layer);
		});
	}
	function syncAll() {
		const L = Lref.current;
		const map = mapRef.current;
		const turfLayer = turfLayerRef.current;
		const pinLayer = pinLayerRef.current;
		if (!L || !map || !turfLayer || !pinLayer) return;
		const p = propsRef.current;
		const visibleTurf = p.territories.filter((t) => {
			if (t.gangId && p.hiddenGangIds.has(t.gangId)) return false;
			if (!t.gangId && !p.showUnassigned) return false;
			return t.polygon.length >= 3;
		});
		const visiblePins = p.pins.filter((pin) => {
			if (pin.gangId && p.hiddenGangIds.has(pin.gangId)) return false;
			if (!pin.gangId && !p.showUnassigned) return false;
			return true;
		});
		const nextTurf = new Set(visibleTurf.map((t) => t.id));
		for (const [id, layer] of turfById.current) if (!nextTurf.has(id)) {
			turfLayer.removeLayer(layer);
			turfById.current.delete(id);
		}
		for (const t of visibleTurf) {
			const color = gangColor(p.gangs, t.gangId, t.color);
			const selected = p.selection?.type === "territory" && p.selection.id === t.id;
			const style = {
				color,
				weight: selected ? 3.5 : t.kind === "contested" ? 2.5 : 2,
				dashArray: t.kind === "contested" ? "6 5" : void 0,
				fillColor: color,
				fillOpacity: selected ? .5 : .36,
				opacity: .95
			};
			const latlngs = t.polygon.map((pt) => L.latLng(pt.lat, pt.lng));
			let poly = turfById.current.get(t.id);
			const tip = `${t.name} · ${gangName(p.gangs, t.gangId)}`;
			if (!poly) {
				poly = L.polygon(latlngs, style);
				poly.on("click", (e) => {
					L.DomEvent.stopPropagation(e);
					if (toolRef.current !== "pan") return;
					propsRef.current.onSelect({
						type: "territory",
						id: t.id
					});
				});
				poly.bindTooltip(tip, {
					sticky: true,
					opacity: .95,
					className: "ls-tip"
				});
				poly.addTo(turfLayer);
				turfById.current.set(t.id, poly);
			} else if (!draggingVertexRef.current) {
				poly.setLatLngs(latlngs);
				poly.setStyle(style);
				poly.setTooltipContent(tip);
			} else poly.setStyle(style);
			if (selected) poly.bringToFront();
		}
		const nextPins = new Set(visiblePins.map((pin) => pin.id));
		for (const [id, layer] of pinById.current) if (!nextPins.has(id)) {
			pinLayer.removeLayer(layer);
			pinById.current.delete(id);
		}
		for (const pin of visiblePins) {
			const color = gangColor(p.gangs, pin.gangId, pin.color);
			const selected = p.selection?.type === "pin" && p.selection.id === pin.id;
			const icon = L.divIcon({
				className: `ls-pin${selected ? " is-selected" : ""}`,
				html: pinHtml(color),
				iconSize: [22, 22],
				iconAnchor: [11, 11]
			});
			let marker = pinById.current.get(pin.id);
			const tip = `${pin.name} · ${gangName(p.gangs, pin.gangId)}`;
			if (!marker) {
				marker = L.marker([pin.lat, pin.lng], {
					icon,
					draggable: false,
					riseOnHover: true,
					zIndexOffset: selected ? 800 : 200
				});
				marker.on("click", (e) => {
					L.DomEvent.stopPropagation(e);
					if (toolRef.current !== "pan") return;
					propsRef.current.onSelect({
						type: "pin",
						id: pin.id
					});
				});
				marker.on("dragend", () => {
					const ll = marker?.getLatLng();
					if (ll) propsRef.current.onMovePin(pin.id, ll.lat, ll.lng);
				});
				marker.bindTooltip(tip, {
					opacity: .95,
					className: "ls-tip"
				});
				marker.addTo(pinLayer);
				pinById.current.set(pin.id, marker);
			} else {
				marker.setLatLng([pin.lat, pin.lng]);
				marker.setIcon(icon);
				marker.setZIndexOffset(selected ? 800 : 200);
				marker.setTooltipContent(tip);
			}
			if (selected) marker.dragging?.enable();
			else marker.dragging?.disable();
		}
		syncVertices();
	}
	(0, import_react.useEffect)(() => {
		syncAll();
	});
	(0, import_react.useEffect)(() => {
		const L = Lref.current;
		const map = mapRef.current;
		if (!L || !map) return;
		const style = TILE_STYLES[props.tileStyle];
		if (hostRef.current) hostRef.current.style.background = style.background;
		const current = tileRef.current;
		if (current) current.setUrl(style.url);
		else {
			const next = makeTileLayer(L, style.url).addTo(map);
			tileRef.current = next;
			next.bringToBack();
		}
		map.getContainer().style.background = style.background;
		applyLabeledOverlay(L, map, style.overlay, labeledRef, tileRef.current);
	}, [props.tileStyle]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		map.getContainer().style.cursor = props.tool === "pan" ? "" : "crosshair";
		if (props.tool !== "polygon") {
			draftRef.current = [];
			drawLayerRef.current?.clearLayers();
		}
		if (props.tool !== "rect") rectStartRef.current = null;
		if (props.tool === "rect") map.dragging.disable();
		else map.dragging.enable();
	}, [props.tool]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		const L = Lref.current;
		if (!map || !L || !props.focus) return;
		if (props.focus.kind === "point") {
			const z = props.focus.zoom ?? Math.max(map.getZoom(), 5);
			map.flyTo([props.focus.lat, props.focus.lng], z, { duration: .55 });
		} else if (props.focus.points.length >= 1) {
			const b = L.latLngBounds(props.focus.points.map((pt) => L.latLng(pt.lat, pt.lng)));
			map.fitBounds(b.pad(.4), {
				maxZoom: 6,
				animate: true
			});
		}
	}, [props.focus]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "ls-map h-full w-full"
	});
}
function TooltipProvider({ delayDuration = 250, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, { ...props });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, { ...props });
}
function TooltipContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 rounded-md bg-fg px-2 py-1 text-xs text-bg shadow-[var(--shadow-border)]", className),
		...props
	}) });
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var gangStatus = _enum([
	"active",
	"dormant",
	"unknown"
]);
var territoryKind = _enum([
	"turf",
	"contested",
	"claimed"
]);
var pinKind = _enum([
	"graffiti",
	"throw-up",
	"mural",
	"stencil",
	"slap",
	"other"
]);
var latLng = object({
	lat: number(),
	lng: number()
});
var gangInput = object({
	id: string().min(1),
	name: string().min(1).max(80),
	tag: string().max(12).default(""),
	color: string().min(4).max(16),
	status: gangStatus.default("active"),
	leader: string().max(80).default(""),
	description: string().max(2e3).default(""),
	members: string().max(4e3).default(""),
	notes: string().max(4e3).default(""),
	logo: string().max(4e5).default("")
});
var territoryInput = object({
	id: string().min(1),
	gangId: string().nullable().default(null),
	name: string().min(1).max(80),
	kind: territoryKind.default("turf"),
	color: string().max(16).nullable().default(null),
	polygon: array(latLng).min(3).max(200),
	notes: string().max(4e3).default("")
});
var pinInput = object({
	id: string().min(1),
	gangId: string().nullable().default(null),
	name: string().min(1).max(80),
	kind: pinKind.default("graffiti"),
	color: string().max(16).nullable().default(null),
	lat: number(),
	lng: number(),
	notes: string().max(4e3).default(""),
	dateFound: string().max(32).default(""),
	image: string().max(4e5).default("")
});
var listBoard = createServerFn({ method: "GET" }).handler(createSsrRpc("1678c0ce9cf5e5855f534bbe484f5d912f849adbb25be4b052440661b6622093"));
var upsertGang = createServerFn({ method: "POST" }).validator((d) => gangInput.parse(d)).handler(createSsrRpc("add49301031c26dff9f8f3332ad72a4ae9a85bfa56cfd2dfbba3e853b7df1082"));
var deleteGang = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(createSsrRpc("42e5fa216a365ebcfa5177b7eb1c22df48ca0758625bb847654f067cd85c69b1"));
var upsertTerritory = createServerFn({ method: "POST" }).validator((d) => territoryInput.parse(d)).handler(createSsrRpc("1a89d2d7230127a4459fe28aea42a5551b0fe7b7192adb172375e8a5cd6ea2ba"));
var deleteTerritory = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(createSsrRpc("a487e89a8913ebe8f5bb341ff3755b365b4732986d06c597126a088e65248c01"));
var upsertPin = createServerFn({ method: "POST" }).validator((d) => pinInput.parse(d)).handler(createSsrRpc("009c229b773fbbc3829f72547ba61a43535c368b5bf7492eea2b2e37de3b53ca"));
var deletePin = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(createSsrRpc("9891d80107180abe55dd593cf6a3fe3a900482bf120040c2830324d702de3b96"));
var boardInput = object({
	gangs: array(gangInput).max(200),
	territories: array(territoryInput).max(400),
	pins: array(pinInput).max(800)
});
var importBoard = createServerFn({ method: "POST" }).validator((d) => boardInput.parse(d)).handler(createSsrRpc("0fea9bf3b563d1391c1ead4c38c9b34c39b16367254b58afddb9266070a88e38"));
function gangPayload(g) {
	return {
		id: g.id,
		name: g.name,
		tag: g.tag ?? "",
		color: g.color,
		status: g.status,
		leader: g.leader ?? "",
		description: g.description ?? "",
		members: g.members ?? "",
		notes: g.notes ?? "",
		logo: g.logo ?? ""
	};
}
function turfPayload(t) {
	return {
		id: t.id,
		gangId: t.gangId ?? null,
		name: t.name,
		kind: t.kind,
		color: t.color ?? null,
		polygon: t.polygon,
		notes: t.notes ?? ""
	};
}
function pinPayload(p) {
	return {
		id: p.id,
		gangId: p.gangId ?? null,
		name: p.name,
		kind: p.kind,
		color: p.color ?? null,
		lat: p.lat,
		lng: p.lng,
		notes: p.notes ?? "",
		dateFound: p.dateFound ?? "",
		image: p.image ?? ""
	};
}
function useBoard() {
	const [board, setBoard] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const reload = (0, import_react.useCallback)(async () => {
		try {
			const next = await listBoard();
			setBoard(next);
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not load the board";
			setError(message);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		reload();
	}, [reload]);
	(0, import_react.useEffect)(() => {
		const onFocus = () => {
			reload();
		};
		window.addEventListener("focus", onFocus);
		return () => window.removeEventListener("focus", onFocus);
	}, [reload]);
	const saveGang = (0, import_react.useCallback)(async (g) => {
		try {
			const saved = await upsertGang({ data: gangPayload(g) });
			setBoard((b) => {
				if (!b) return b;
				const exists = b.gangs.some((x) => x.id === saved.id);
				return {
					...b,
					gangs: exists ? b.gangs.map((x) => x.id === saved.id ? saved : x) : [...b.gangs, saved]
				};
			});
		} catch {
			toast.error("Could not save gang");
			await reload();
		}
	}, [reload]);
	const saveTerritory = (0, import_react.useCallback)(async (t) => {
		try {
			const saved = await upsertTerritory({ data: turfPayload(t) });
			setBoard((b) => {
				if (!b) return b;
				const exists = b.territories.some((x) => x.id === saved.id);
				return {
					...b,
					territories: exists ? b.territories.map((x) => x.id === saved.id ? saved : x) : [...b.territories, saved]
				};
			});
		} catch {
			toast.error("Could not save territory");
			await reload();
		}
	}, [reload]);
	const savePin = (0, import_react.useCallback)(async (p) => {
		try {
			const saved = await upsertPin({ data: pinPayload(p) });
			setBoard((b) => {
				if (!b) return b;
				const exists = b.pins.some((x) => x.id === saved.id);
				return {
					...b,
					pins: exists ? b.pins.map((x) => x.id === saved.id ? saved : x) : [...b.pins, saved]
				};
			});
		} catch {
			toast.error("Could not save tag");
			await reload();
		}
	}, [reload]);
	const removeGang = (0, import_react.useCallback)(async (id) => {
		try {
			await deleteGang({ data: { id } });
			setBoard((b) => {
				if (!b) return b;
				return {
					gangs: b.gangs.filter((g) => g.id !== id),
					territories: b.territories.map((t) => t.gangId === id ? {
						...t,
						gangId: null
					} : t),
					pins: b.pins.map((p) => p.gangId === id ? {
						...p,
						gangId: null
					} : p)
				};
			});
		} catch {
			toast.error("Could not remove gang");
			await reload();
		}
	}, [reload]);
	const removeTerritory = (0, import_react.useCallback)(async (id) => {
		try {
			await deleteTerritory({ data: { id } });
			setBoard((b) => b ? {
				...b,
				territories: b.territories.filter((t) => t.id !== id)
			} : b);
		} catch {
			toast.error("Could not remove territory");
			await reload();
		}
	}, [reload]);
	const removePin = (0, import_react.useCallback)(async (id) => {
		try {
			await deletePin({ data: { id } });
			setBoard((b) => b ? {
				...b,
				pins: b.pins.filter((p) => p.id !== id)
			} : b);
		} catch {
			toast.error("Could not remove tag");
			await reload();
		}
	}, [reload]);
	const replaceBoard = (0, import_react.useCallback)(async (incoming) => {
		try {
			const next = await importBoard({ data: {
				gangs: incoming.gangs.map(gangPayload),
				territories: incoming.territories.map(turfPayload),
				pins: incoming.pins.map(pinPayload)
			} });
			setBoard(next);
		} catch {
			toast.error("Could not import that file");
			await reload();
		}
	}, [reload]);
	return {
		board,
		gangs: board?.gangs ?? [],
		territories: board?.territories ?? [],
		pins: board?.pins ?? [],
		isLoading: !board && !error,
		error,
		reload,
		saveGang,
		saveTerritory,
		savePin,
		removeGang,
		removeTerritory,
		removePin,
		replaceBoard
	};
}
var MAP_SAFE = {
	lat: -900,
	lng: 50
};
var TOOLS = [
	{
		id: "pan",
		label: "Pan",
		hint: "1",
		icon: Hand
	},
	{
		id: "polygon",
		label: "Territory",
		hint: "2",
		icon: Pentagon
	},
	{
		id: "rect",
		label: "Box",
		hint: "3",
		icon: Square
	},
	{
		id: "pin",
		label: "Tag",
		hint: "4",
		icon: CircleDot
	}
];
var HINT = {
	pan: "Click a territory or tag for its file. Drag corners to reshape a selected territory.",
	polygon: "Click corners. Double-click or Enter to close. Right-click undoes. Esc cancels.",
	rect: "Click and drag a rectangle over the map.",
	pin: "Click the map to drop a gang tag."
};
function Desk() {
	const board = useBoard();
	const { gangs, territories, pins, isLoading, error, reload } = board;
	const [tool, setTool] = (0, import_react.useState)("pan");
	const [selection, setSelection] = (0, import_react.useState)(null);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [tileStyle, setTileStyle] = (0, import_react.useState)("atlas");
	const [hiddenGangIds, setHiddenGangIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [showUnassigned, setShowUnassigned] = (0, import_react.useState)(true);
	const [showTerritories, setShowTerritories] = (0, import_react.useState)(true);
	const [showTags, setShowTags] = (0, import_react.useState)(true);
	const [turfGang, setTurfGang] = (0, import_react.useState)("all");
	const [tagGang, setTagGang] = (0, import_react.useState)("all");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [cursor, setCursor] = (0, import_react.useState)(MAP_SAFE);
	const [mobilePanel, setMobilePanel] = (0, import_react.useState)(null);
	const [gangOpen, setGangOpen] = (0, import_react.useState)(false);
	const [editingGangId, setEditingGangId] = (0, import_react.useState)(null);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const pendingTurf = (0, import_react.useRef)(null);
	const pendingPin = (0, import_react.useRef)(null);
	const [turfOpen, setTurfOpen] = (0, import_react.useState)(false);
	const [pinOpen, setPinOpen] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const selectedGangId = selection?.type === "gang" ? selection.id : null;
	const flyToSelection = (0, import_react.useCallback)((sel) => {
		if (!sel) return;
		if (sel.type === "pin") {
			const p = pins.find((x) => x.id === sel.id);
			if (p) setFocus({
				kind: "point",
				lat: p.lat,
				lng: p.lng
			});
			return;
		}
		if (sel.type === "territory") {
			const t = territories.find((x) => x.id === sel.id);
			if (t) setFocus({
				kind: "bounds",
				points: t.polygon
			});
			return;
		}
		const turf = territories.filter((t) => t.gangId === sel.id);
		const marks = pins.filter((p) => p.gangId === sel.id);
		const points = [...turf.flatMap((t) => t.polygon), ...marks.map((p) => ({
			lat: p.lat,
			lng: p.lng
		}))];
		if (points.length) setFocus({
			kind: "bounds",
			points
		});
	}, [pins, territories]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (e.key === "1" || e.key === "v") setTool("pan");
			if (e.key === "2" || e.key === "z") setTool("polygon");
			if (e.key === "3" || e.key === "b") setTool("rect");
			if (e.key === "4" || e.key === "m") setTool("pin");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const onSelect = (0, import_react.useCallback)((sel) => {
		setSelection(sel);
		if (sel && sel.type !== "gang") setMobilePanel("file");
	}, []);
	const editingGang = (0, import_react.useMemo)(() => gangs.find((g) => g.id === editingGangId), [gangs, editingGangId]);
	async function handleDelete() {
		if (!selection) return;
		if (!window.confirm("Remove this from the board?")) return;
		if (selection.type === "gang") await board.removeGang(selection.id);
		if (selection.type === "territory") await board.removeTerritory(selection.id);
		if (selection.type === "pin") await board.removePin(selection.id);
		setSelection(null);
		toast("Removed");
	}
	function exportJson() {
		const blob = new Blob([JSON.stringify({
			gangs,
			territories,
			pins
		}, null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "ls-grid-board.json";
		a.click();
		URL.revokeObjectURL(a.href);
		toast("Board exported");
	}
	async function onImportFile(file) {
		try {
			const raw = JSON.parse(await file.text());
			if (!Array.isArray(raw.gangs)) throw new Error("Bad file");
			await board.replaceBoard(raw);
			toast("Board restored");
		} catch {
			toast.error("Could not read that file");
		}
	}
	const inspectorOpen = Boolean(selection);
	if (error && !gangs.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col items-center justify-center bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl tracking-[0.18em]",
				children: "LS GRID"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: () => void reload(),
				children: "Try again"
			})
		]
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col items-center justify-center bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tracking-[0.18em]",
			children: "LS GRID"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Opening the desk…"
		})]
	});
	const visibleTerritories = showTerritories ? territories.filter((t) => {
		if (turfGang !== "all" && t.gangId !== turfGang) return false;
		return true;
	}) : [];
	const visiblePins = showTags ? pins.filter((p) => {
		if (tagGang !== "all" && p.gangId !== tagGang) return false;
		return true;
	}) : [];
	const gangPanel = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GangPanel, {
		gangs,
		territories,
		pins,
		query,
		onQuery: setQuery,
		selectedGangId,
		hiddenGangIds,
		showUnassigned,
		onSelectGang: (id) => {
			const sel = {
				type: "gang",
				id
			};
			setSelection(sel);
			flyToSelection(sel);
		},
		onToggleHidden: (id) => {
			setHiddenGangIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
		},
		onToggleUnassigned: () => setShowUnassigned((v) => !v),
		onNewGang: () => {
			setEditingGangId(null);
			setGangOpen(true);
		}
	});
	const inspector = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectorPanel, {
		selection,
		gangs,
		territories,
		pins,
		onClose: () => {
			setSelection(null);
			setMobilePanel(null);
		},
		onFocus: () => flyToSelection(selection),
		onEditGang: (g) => {
			setEditingGangId(g.id);
			setGangOpen(true);
		},
		onSaveGang: (g) => void board.saveGang(g),
		onSaveTerritory: (t) => void board.saveTerritory(t),
		onSavePin: (p) => void board.savePin(p),
		onDelete: () => void handleDelete(),
		onSelectTerritory: (id) => {
			const sel = {
				type: "territory",
				id
			};
			setSelection(sel);
			flyToSelection(sel);
		},
		onSelectPin: (id) => {
			const sel = {
				type: "pin",
				id
			};
			setSelection(sel);
			flyToSelection(sel);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-none tracking-[0.14em] text-fg md:text-xl",
							children: "LS GRID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden text-xs text-muted sm:block",
							children: "Los Santos territory desk"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center rounded-lg bg-surface p-0.5 shadow-[var(--shadow-border)]",
						children: TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: tool === t.id ? "default" : "ghost",
								onClick: () => setTool(t.id),
								"aria-label": t.label,
								className: "rounded-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, { children: [
							t.label,
							" · ",
							t.hint
						] })] }, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center rounded-lg bg-surface p-0.5 shadow-[var(--shadow-border)]",
						children: Object.keys(TILE_STYLES).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tileStyle === k ? "default" : "ghost",
							className: "h-8 px-2.5 text-xs",
							onClick: () => setTileStyle(k),
							children: TILE_STYLES[k].label
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "hidden h-8 rounded-md border border-border bg-surface px-2 text-xs text-fg md:block",
								defaultValue: "ls",
								onChange: (e) => {
									const j = JUMP_TARGETS.find((x) => x.id === e.target.value);
									if (j) setFocus({
										kind: "point",
										lat: j.lat,
										lng: j.lng,
										zoom: j.zoom
									});
								},
								"aria-label": "Jump to area",
								children: JUMP_TARGETS.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: j.id,
									children: j.name
								}, j.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "hidden h-8 md:inline-flex",
								onClick: () => setFiltersOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }), "Filters"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								className: "md:hidden",
								onClick: () => setFiltersOpen(true),
								"aria-label": "Filters",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								className: "md:hidden",
								onClick: () => setMobilePanel((v) => v === "sets" ? null : "sets"),
								"aria-label": "Gangs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								onClick: () => setHelpOpen(true),
								"aria-label": "Help",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								onClick: exportJson,
								"aria-label": "Export",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								onClick: () => fileRef.current?.click(),
								"aria-label": "Import",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) onImportFile(f);
									e.target.value = "";
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-80 shrink-0 flex-col border-r border-border bg-surface md:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GangPanel, {
						gangs,
						territories,
						pins,
						query,
						onQuery: setQuery,
						selectedGangId,
						hiddenGangIds,
						showUnassigned,
						onSelectGang: (id) => {
							const sel = {
								type: "gang",
								id
							};
							setSelection(sel);
							flyToSelection(sel);
						},
						onToggleHidden: (id) => {
							setHiddenGangIds((prev) => {
								const next = new Set(prev);
								if (next.has(id)) next.delete(id);
								else next.add(id);
								return next;
							});
						},
						onToggleUnassigned: () => setShowUnassigned((v) => !v),
						onNewGang: () => {
							setEditingGangId(null);
							setGangOpen(true);
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, {
							gangs,
							territories: visibleTerritories,
							pins: visiblePins,
							hiddenGangIds,
							showUnassigned,
							tileStyle,
							tool,
							selection,
							focus,
							onSelect,
							onCreateTerritory: (polygon) => {
								pendingTurf.current = polygon;
								setTurfOpen(true);
								setTool("pan");
							},
							onCreatePin: (lat, lng) => {
								pendingPin.current = {
									lat,
									lng
								};
								setPinOpen(true);
							},
							onMovePin: (id, lat, lng) => {
								const p = pins.find((x) => x.id === id);
								if (p) board.savePin({
									...p,
									lat,
									lng
								});
							},
							onUpdatePolygon: (id, polygon) => {
								const t = territories.find((x) => x.id === id);
								if (t) board.saveTerritory({
									...t,
									polygon
								});
							},
							onCursor: (lat, lng) => setCursor({
								lat,
								lng
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute top-3 left-3 right-3 md:right-auto md:max-w-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-bg/80 px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)] backdrop-blur-sm",
								children: HINT[tool]
							})
						}),
						inspectorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-x-0 bottom-0 z-20 flex max-h-[58vh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border)] md:inset-auto md:top-14 md:right-3 md:bottom-12 md:w-80 md:rounded-xl",
							children: inspector
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex shrink-0 items-center justify-between gap-3 border-t border-border px-3 py-1.5 font-mono text-xs tabular-nums text-muted md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"X ",
					cursor.lng.toFixed(0),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-subtle",
						children: "·"
					}),
					"Y ",
					cursor.lat.toFixed(0)
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden sm:inline",
					children: [
						TILE_STYLES[tileStyle].label,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-subtle",
							children: "·"
						}),
						gangs.length,
						" gangs · ",
						territories.length,
						" turf · ",
						pins.length,
						" tags"
					]
				})]
			}),
			mobilePanel === "sets" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-30 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/60",
					onClick: () => setMobilePanel(null),
					"aria-label": "Close"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-surface shadow-[var(--shadow-border)]",
					children: gangPanel
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GangFormDialog, {
				open: gangOpen,
				onOpenChange: setGangOpen,
				initial: editingGang,
				onSubmit: async (data) => {
					const id = editingGangId ?? uid("gang");
					await board.saveGang({
						id,
						...data
					});
					setGangOpen(false);
					setSelection({
						type: "gang",
						id
					});
					toast(editingGangId ? "Gang updated" : "Gang added");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerritoryFormDialog, {
				open: turfOpen,
				onOpenChange: (v) => {
					setTurfOpen(v);
					if (!v) pendingTurf.current = null;
				},
				gangs,
				onSubmit: async (data) => {
					const polygon = pendingTurf.current;
					if (!polygon) return;
					const id = uid("turf");
					await board.saveTerritory({
						id,
						polygon,
						...data
					});
					pendingTurf.current = null;
					setTurfOpen(false);
					setSelection({
						type: "territory",
						id
					});
					toast("Territory added");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinFormDialog, {
				open: pinOpen,
				onOpenChange: (v) => {
					setPinOpen(v);
					if (!v) pendingPin.current = null;
				},
				gangs,
				onSubmit: async (data) => {
					const loc = pendingPin.current;
					if (!loc) return;
					const id = uid("pin");
					await board.savePin({
						id,
						lat: loc.lat,
						lng: loc.lng,
						...data
					});
					pendingPin.current = null;
					setPinOpen(false);
					setSelection({
						type: "pin",
						id
					});
					toast("Tag added");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpDialog, {
				open: helpOpen,
				onOpenChange: setHelpOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiltersDialog, {
				open: filtersOpen,
				onOpenChange: setFiltersOpen,
				gangs,
				showTerritories,
				showTags,
				turfGang,
				tagGang,
				onShowTerritories: setShowTerritories,
				onShowTags: setShowTags,
				onTurfGang: setTurfGang,
				onTagGang: setTagGang
			})
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Desk, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: "bottom-right",
		toastOptions: { className: "ls-toast" }
	})] });
}
//#endregion
export { Home as component };
