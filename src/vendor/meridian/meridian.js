import { jsx as l, jsxs as r } from "react/jsx-runtime";
import o from "react";
const I = ({ children: s }) => /* @__PURE__ */ l("div", { className: "pulse-root", style: { padding: 24 }, children: s }), m = o.forwardRef(
  ({ variant: s = "secondary", size: a = "md", loading: i = !1, leadingIcon: e, className: n, children: t, disabled: c, ...d }, p) => {
    const h = ["pulse-btn", `pulse-btn--${s}`, `pulse-btn--${a}`, n].filter(Boolean).join(" ");
    return /* @__PURE__ */ r("button", { ref: p, className: h, disabled: c || i, ...d, children: [
      i ? /* @__PURE__ */ l("span", { className: "pulse-btn__spinner", "aria-hidden": "true" }) : e,
      t
    ] });
  }
);
m.displayName = "Button";
const x = ({ tone: s = "neutral", pill: a = !1, className: i, children: e, ...n }) => {
  const t = ["pulse-badge", `pulse-badge--${s}`, a ? "pulse-badge--pill" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ l("span", { className: t, ...n, children: e });
};
function N(s) {
  const a = s.trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "" : a.length === 1 ? a[0].slice(0, 2).toUpperCase() : (a[0][0] + a[a.length - 1][0]).toUpperCase();
}
const f = ({ src: s, name: a, size: i = "md", className: e, ...n }) => {
  const [t, c] = o.useState(!1), d = ["pulse-avatar", `pulse-avatar--${i}`, e].filter(Boolean).join(" ");
  return s && !t ? /* @__PURE__ */ l(
    "img",
    {
      className: d,
      src: s,
      alt: a,
      onError: () => c(!0),
      ...n
    }
  ) : /* @__PURE__ */ l("span", { className: d, role: "img", "aria-label": a, ...n, children: N(a) });
}, C = ({ people: s, size: a = "sm", max: i = 4 }) => {
  const e = s.slice(0, i), n = s.length - e.length;
  return /* @__PURE__ */ r("span", { className: "pulse-avatar-stack", children: [
    e.map((t, c) => /* @__PURE__ */ l(f, { name: t.name, src: t.src, size: a }, c)),
    n > 0 && /* @__PURE__ */ r("span", { className: `pulse-avatar pulse-avatar--${a}`, style: { marginLeft: -8, boxShadow: "0 0 0 2px var(--pulse-surface-canvas)" }, children: [
      "+",
      n
    ] })
  ] });
}, _ = o.forwardRef(
  ({ label: s, required: a, helperText: i, error: e, size: n = "md", id: t, className: c, ...d }, p) => {
    const h = o.useId(), u = t ?? h;
    return /* @__PURE__ */ r("div", { className: ["pulse-field", e ? "pulse-field--error" : ""].filter(Boolean).join(" "), children: [
      s && /* @__PURE__ */ r("label", { className: "pulse-field__label", htmlFor: u, children: [
        s,
        a && /* @__PURE__ */ l("span", { className: "pulse-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          ref: p,
          id: u,
          className: ["pulse-input", `pulse-input--${n}`, c].filter(Boolean).join(" "),
          ...d
        }
      ),
      (e || i) && /* @__PURE__ */ l("span", { className: ["pulse-field__helper", e ? "pulse-field__helper--error" : ""].filter(Boolean).join(" "), children: e ?? i })
    ] });
  }
);
_.displayName = "Input";
const v = o.forwardRef(
  ({ label: s, required: a, helperText: i, error: e, id: n, className: t, rows: c = 3, ...d }, p) => {
    const h = o.useId(), u = n ?? h;
    return /* @__PURE__ */ r("div", { className: ["pulse-field", e ? "pulse-field--error" : ""].filter(Boolean).join(" "), children: [
      s && /* @__PURE__ */ r("label", { className: "pulse-field__label", htmlFor: u, children: [
        s,
        a && /* @__PURE__ */ l("span", { className: "pulse-field__required", children: "*" })
      ] }),
      /* @__PURE__ */ l(
        "textarea",
        {
          ref: p,
          id: u,
          rows: c,
          className: ["pulse-textarea", t].filter(Boolean).join(" "),
          ...d
        }
      ),
      (e || i) && /* @__PURE__ */ l("span", { className: ["pulse-field__helper", e ? "pulse-field__helper--error" : ""].filter(Boolean).join(" "), children: e ?? i })
    ] });
  }
);
v.displayName = "Textarea";
const b = o.forwardRef(
  ({ label: s, helperText: a, size: i = "md", options: e, id: n, className: t, ...c }, d) => {
    const p = o.useId(), h = n ?? p;
    return /* @__PURE__ */ r("div", { className: "pulse-field", children: [
      s && /* @__PURE__ */ l("label", { className: "pulse-field__label", htmlFor: h, children: s }),
      /* @__PURE__ */ l("select", { ref: d, id: h, className: ["pulse-select", `pulse-select--${i}`, t].filter(Boolean).join(" "), ...c, children: e.map((u) => /* @__PURE__ */ l("option", { value: u.value, children: u.label }, u.value)) }),
      a && /* @__PURE__ */ l("span", { className: "pulse-field__helper", children: a })
    ] });
  }
);
b.displayName = "Select";
const g = o.forwardRef(({ label: s, className: a, ...i }, e) => /* @__PURE__ */ r("label", { className: ["pulse-checkbox", a].filter(Boolean).join(" "), children: [
  /* @__PURE__ */ l("input", { ref: e, type: "checkbox", ...i }),
  s
] }));
g.displayName = "Checkbox";
const w = o.forwardRef(({ label: s, className: a, ...i }, e) => /* @__PURE__ */ r("label", { className: ["pulse-radio", a].filter(Boolean).join(" "), children: [
  /* @__PURE__ */ l("input", { ref: e, type: "radio", ...i }),
  s
] }));
w.displayName = "Radio";
const y = o.forwardRef(({ label: s, checked: a, className: i, ...e }, n) => /* @__PURE__ */ r("label", { className: ["pulse-switch", i].filter(Boolean).join(" "), children: [
  s,
  /* @__PURE__ */ l("span", { className: ["pulse-switch__track", a ? "pulse-switch__track--on" : ""].filter(Boolean).join(" "), children: /* @__PURE__ */ l("span", { className: "pulse-switch__thumb" }) }),
  /* @__PURE__ */ l("input", { ref: n, type: "checkbox", checked: a, ...e })
] }));
y.displayName = "Switch";
const R = ({ items: s, value: a, onChange: i }) => /* @__PURE__ */ l("div", { className: "pulse-tabs", role: "tablist", children: s.map((e) => /* @__PURE__ */ l(
  "button",
  {
    role: "tab",
    "aria-selected": e.value === a,
    className: ["pulse-tab", e.value === a ? "pulse-tab--active" : ""].filter(Boolean).join(" "),
    onClick: () => i(e.value),
    children: e.label
  },
  e.value
)) }), S = ({ items: s, value: a, onChange: i }) => /* @__PURE__ */ l("div", { className: "pulse-segmented", role: "tablist", children: s.map((e) => /* @__PURE__ */ l(
  "button",
  {
    role: "tab",
    "aria-selected": e.value === a,
    className: ["pulse-segment", e.value === a ? "pulse-segment--active" : ""].filter(Boolean).join(" "),
    onClick: () => i(e.value),
    children: e.label
  },
  e.value
)) }), $ = ({ content: s, children: a }) => /* @__PURE__ */ r("span", { className: "pulse-tooltip-wrap", children: [
  a,
  /* @__PURE__ */ l("span", { className: "pulse-tooltip", role: "tooltip", children: s })
] }), E = ({ title: s, compact: a, interactive: i, className: e, children: n, ...t }) => /* @__PURE__ */ r(
  "div",
  {
    className: ["pulse-card", a ? "pulse-card--compact" : "", i ? "pulse-card--interactive" : "", e].filter(Boolean).join(" "),
    ...t,
    children: [
      s && /* @__PURE__ */ l("h4", { className: "pulse-card__title", children: s }),
      n
    ]
  }
), A = ({ label: s, value: a, delta: i }) => /* @__PURE__ */ r("div", { className: "pulse-stat-card", children: [
  /* @__PURE__ */ l("div", { className: "pulse-stat-card__label", children: s }),
  /* @__PURE__ */ l("div", { className: "pulse-stat-card__value", children: a }),
  i && /* @__PURE__ */ r("div", { className: `pulse-stat-card__delta pulse-stat-card__delta--${i.direction}`, children: [
    i.direction === "up" ? "↑" : "↓",
    " ",
    i.text,
    /* @__PURE__ */ l("span", { className: "pulse-stat-card__delta-window", children: i.window })
  ] })
] }), B = ({ label: s = "Generated" }) => /* @__PURE__ */ r("span", { className: "pulse-ai-badge", children: [
  /* @__PURE__ */ l("span", { className: "pulse-ai-badge__spark", "aria-hidden": "true" }),
  s
] }), F = ({
  title: s,
  scope: a,
  summary: i,
  impact: e = [],
  evidence: n = [],
  onAddToRoadmap: t,
  onMarkDuplicate: c
}) => /* @__PURE__ */ r("div", { className: "pulse-insight-card", children: [
  /* @__PURE__ */ r("div", { className: "pulse-insight-card__head", children: [
    /* @__PURE__ */ l("h3", { className: "pulse-insight-card__title", children: s }),
    /* @__PURE__ */ l(B, {})
  ] }),
  /* @__PURE__ */ l("div", { className: "pulse-insight-card__scope", children: a }),
  /* @__PURE__ */ l("p", { className: "pulse-insight-card__body", children: i }),
  e.length > 0 && /* @__PURE__ */ l("div", { className: "pulse-insight-card__impact", children: e.map((d, p) => /* @__PURE__ */ r("span", { children: [
    /* @__PURE__ */ l("strong", { children: d.value }),
    " ",
    d.label
  ] }, p)) }),
  n.length > 0 && /* @__PURE__ */ l("div", { className: "pulse-insight-card__evidence", children: n.map((d, p) => /* @__PURE__ */ r("div", { className: "pulse-evidence-chip", children: [
    /* @__PURE__ */ l(f, { name: d.name, size: "xs" }),
    /* @__PURE__ */ r("span", { children: [
      '"',
      d.quote,
      '"',
      /* @__PURE__ */ r("span", { className: "pulse-evidence-chip__source", children: [
        "— ",
        d.source
      ] })
    ] })
  ] }, p)) }),
  /* @__PURE__ */ r("div", { className: "pulse-insight-card__actions", children: [
    c && /* @__PURE__ */ l(m, { variant: "secondary", size: "sm", onClick: c, children: "Mark as duplicate" }),
    t && /* @__PURE__ */ l(m, { variant: "primary", size: "sm", onClick: t, children: "Add to roadmap" })
  ] })
] }), q = ({ open: s, onClose: a, title: i, size: e = "md", footer: n, children: t }) => (o.useEffect(() => {
  if (!s) return;
  const c = (d) => {
    d.key === "Escape" && a();
  };
  return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
}, [s, a]), s ? /* @__PURE__ */ l("div", { className: "pulse-modal-scrim", onClick: a, children: /* @__PURE__ */ r(
  "div",
  {
    className: ["pulse-modal", e !== "md" ? `pulse-modal--${e}` : ""].filter(Boolean).join(" "),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "pulse-modal-title",
    onClick: (c) => c.stopPropagation(),
    children: [
      /* @__PURE__ */ r("div", { className: "pulse-modal__header", children: [
        /* @__PURE__ */ l("h2", { id: "pulse-modal-title", className: "pulse-modal__title", children: i }),
        /* @__PURE__ */ l("button", { className: "pulse-modal__close", onClick: a, "aria-label": "Close", children: "×" })
      ] }),
      /* @__PURE__ */ l("div", { className: "pulse-modal__body", children: t }),
      n && /* @__PURE__ */ l("div", { className: "pulse-modal__footer", children: n })
    ]
  }
) }) : null);
function L({ columns: s, rows: a, rowKey: i }) {
  return /* @__PURE__ */ l("div", { className: "pulse-table-wrap", children: /* @__PURE__ */ r("table", { className: "pulse-table", children: [
    /* @__PURE__ */ l("thead", { children: /* @__PURE__ */ l("tr", { children: s.map((e) => /* @__PURE__ */ l("th", { "data-align": e.align === "right" ? "right" : void 0, children: e.header }, e.key)) }) }),
    /* @__PURE__ */ l("tbody", { children: a.map((e) => /* @__PURE__ */ l("tr", { children: s.map((n) => /* @__PURE__ */ l("td", { "data-align": n.align === "right" ? "right" : void 0, children: n.render(e) }, n.key)) }, i(e))) })
  ] }) });
}
export {
  B as AIBadge,
  F as AIInsightCard,
  f as Avatar,
  C as AvatarStack,
  x as Badge,
  m as Button,
  E as Card,
  g as Checkbox,
  _ as Input,
  q as Modal,
  I as PulseRoot,
  w as Radio,
  S as SegmentedControl,
  b as Select,
  A as StatCard,
  y as Switch,
  L as Table,
  R as Tabs,
  v as Textarea,
  $ as Tooltip
};
