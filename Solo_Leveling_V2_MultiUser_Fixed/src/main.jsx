import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const TODAY = new Date().toISOString().slice(0, 10);
const STATUSES = ["In progress", "At risk", "Complete"];
const REASONS = [
  "Waiting for another person",
  "Vendor/customer did not respond",
  "Priority changed",
  "Didn't understand the task",
  "Technical problem",
  "Skill gap",
  "Not enough time",
];
// Demo-only rule table. Production: server-side AI + task history/evidence.
const REASON_CLASS = {
  "Waiting for another person":
    "Dependency — check who owns the blocking action",
  "Vendor/customer did not respond":
    "External dependency — verify follow-up attempts",
  "Priority changed": "Prioritisation — confirm the change was communicated",
  "Didn't understand the task": "Clarity gap — review how the task was briefed",
  "Technical problem": "Technical — look for a repeatable cause",
  "Skill gap": "Capability — route to training, not penalty",
  "Not enough time": "Capacity — review workload and estimates",
};
const DEMO_FOUNDER = { email: "founder@company.com", password: "demo123" };

const seed = {
  founder: {
    id: "founder",
    name: "Founder",
    role: "Founder / Admin",
    level: 24,
    score: 81,
    xp: 2480,
    skills: {
      Execution: 82,
      Ownership: 85,
      Quality: 78,
      Negotiation: 74,
      Leadership: 83,
    },
  },
  employees: [
    {
      id: "nishanth",
      name: "Nishanth",
      role: "Vendor Operations",
      level: 17,
      score: 78,
      xp: 1840,
      skills: {
        Execution: 84,
        Ownership: 76,
        Quality: 79,
        Negotiation: 54,
        Leadership: 60,
      },
    },
    {
      id: "arun",
      name: "Arun",
      role: "Marketing",
      level: 14,
      score: 72,
      xp: 1420,
      skills: {
        Execution: 68,
        Ownership: 70,
        Quality: 75,
        Negotiation: 62,
        Leadership: 58,
      },
    },
    {
      id: "shreya",
      name: "Shreya",
      role: "Customer Operations",
      level: 19,
      score: 86,
      xp: 2210,
      skills: {
        Execution: 90,
        Ownership: 88,
        Quality: 84,
        Negotiation: 71,
        Leadership: 76,
      },
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Onboard 10 vendors",
      owner: "nishanth",
      due: "2026-10-10",
      status: "In progress",
      evidence: "7/10",
    },
    {
      id: 2,
      title: "Launch product reels campaign",
      owner: "arun",
      due: "2026-10-12",
      status: "At risk",
      evidence: "Brief + assets",
    },
    {
      id: 3,
      title: "Resolve pending customer leads",
      owner: "shreya",
      due: "2026-10-09",
      status: "Complete",
      evidence: "24/24",
    },
  ],
  blockers: [],
};

const everyone = (d) => [d.founder, ...d.employees];
const person = (d, id) => everyone(d).find((p) => p.id === id);
const isOverdue = (t) => t.status !== "Complete" && t.due < TODAY;

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(seed);
  if (!user) return <Login employees={seed.employees} onLogin={setUser} />;
  return (
    <Shell
      user={user}
      data={data}
      setData={setData}
      logout={() => setUser(null)}
    />
  );
}

function Login({ employees, onLogin }) {
  const [mode, setMode] = useState("founder");
  const [email, setEmail] = useState(DEMO_FOUNDER.email);
  const [password, setPassword] = useState(DEMO_FOUNDER.password);
  const [employeeId, setEmployeeId] = useState(employees[0].id);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (mode === "employee")
      return onLogin({ type: "employee", id: employeeId });
    if (
      email.trim().toLowerCase() === DEMO_FOUNDER.email &&
      password === DEMO_FOUNDER.password
    )
      return onLogin({ type: "founder", id: "founder" });
    setError("Invalid founder email or password.");
  };

  return (
    <div className="login">
      <form className="loginCard" onSubmit={submit}>
        <div className="logo">
          ⚔ <b>SOLO</b> <span>LEVELING</span>
        </div>
        <p className="muted">AI Performance & Growth OS</p>
        <h1>Enter the system</h1>
        <div className="roleSwitch">
          {["founder", "employee"].map((m) => (
            <button
              type="button"
              key={m}
              className={mode === m ? "on" : ""}
              onClick={() => {
                setMode(m);
                setError("");
              }}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        {mode === "founder" ? (
          <>
            <input
              aria-label="Founder email"
              placeholder="Founder email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <input
              aria-label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </>
        ) : (
          <select
            aria-label="Employee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="primary full">
          Sign in
        </button>
        <small className="muted">
          Demo authentication only. Production should use secure password/SSO
          authentication.
        </small>
      </form>
    </div>
  );
}

function Shell({ user, data, setData, logout }) {
  const [page, setPage] = useState("home");
  const isFounder = user.type === "founder";
  const me = person(data, user.id);
  const nav = isFounder
    ? [
        ["home", "Command Center"],
        ["team", "Team"],
        ["tasks", "Tasks"],
        ["blockers", "Blockers"],
        ["training", "AI Training"],
        ["advisor", "Founder Advisor"],
      ]
    : [
        ["home", "My Dashboard"],
        ["tasks", "My Tasks"],
        ["blockers", "My Blockers"],
        ["training", "My Training"],
      ];
  const title = nav.find((x) => x[0] === page)?.[1];

  return (
    <div className="app">
      <aside>
        <div className="brand">
          ⚔ SOLO <span>LEVELING</span>
        </div>
        <div className="role">{isFounder ? "ADMIN / FOUNDER" : "EMPLOYEE"}</div>
        {nav.map(([id, n]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            ◈ {n}
          </button>
        ))}
        <button className="logout" onClick={logout}>
          ↪ Sign out
        </button>
      </aside>
      <main>
        <header>
          <div>
            <div className="eyebrow">AI Performance & Growth OS</div>
            <h1>{title}</h1>
          </div>
          <div className="userchip">
            {isFounder ? "👑" : "⚔"} {me.name}
          </div>
        </header>
        {page === "home" && <Home user={user} data={data} />}
        {page === "team" && isFounder && <Team data={data} />}
        {page === "tasks" && (
          <Tasks user={user} data={data} setData={setData} />
        )}
        {page === "blockers" && (
          <Blockers user={user} data={data} setData={setData} />
        )}
        {page === "training" && <Training user={user} data={data} />}
        {page === "advisor" && isFounder && <Advisor />}
      </main>
    </div>
  );
}

function Home({ user, data }) {
  const isFounder = user.type === "founder";
  const p = person(data, user.id);
  const tasks = isFounder
    ? data.tasks
    : data.tasks.filter((t) => t.owner === user.id);
  const done = tasks.filter((t) => t.status === "Complete").length;
  const overdue = tasks.filter(isOverdue).length;
  return (
    <>
      <div className="cards">
        <Metric
          label="Level"
          value={p.level}
          sub={`${p.xp.toLocaleString()} XP`}
        />
        <Metric
          label="Performance"
          value={`${p.score}/100`}
          sub={p.score >= 80 ? "Strong" : "Needs attention"}
        />
        <Metric label="Tasks" value={tasks.length} sub={`${done} completed`} />
        <Metric
          label="Overdue"
          value={overdue}
          sub={overdue ? "Needs follow-up" : "All on schedule"}
        />
      </div>
      <div className="cols">
        <section className="panel">
          <h2>{isFounder ? "Company Snapshot" : "My Current Quests"}</h2>
          {tasks.length === 0 && (
            <p className="muted">No tasks assigned yet.</p>
          )}
          {tasks.map((t) => (
            <div className="task" key={t.id}>
              <div>
                <b>{t.title}</b>
                <small>
                  Due {t.due} • {t.evidence}
                </small>
              </div>
              <StatusPill task={t} />
            </div>
          ))}
        </section>
        <section className="panel ai">
          <h2>
            🤖 AI Insight <small>(sample data)</small>
          </h2>
          {isFounder ? (
            <>
              <Insight
                t="FACT"
                d="31% of delayed work currently waits for founder approval."
              />
              <Insight
                t="ANALYSIS"
                d="Operational decision rights may be too centralized."
              />
              <Insight
                t="RECOMMENDATION"
                d="Delegate 3 repeatable approval categories and measure cycle time for 14 days."
              />
            </>
          ) : (
            <>
              <Insight
                t="YOUR STRENGTH"
                d={`${topSkill(p)} is currently your strongest dimension.`}
              />
              <Insight
                t="GROWTH AREA"
                d={`Your ${lowSkill(p)} skill needs targeted practice.`}
              />
              <Insight
                t="NEXT QUEST"
                d={`Complete a 7-day ${lowSkill(p).toLowerCase()} simulation.`}
              />
            </>
          )}
        </section>
      </div>
    </>
  );
}
const sortedSkills = (p) =>
  Object.entries(p.skills).sort((a, b) => b[1] - a[1]);
const topSkill = (p) => sortedSkills(p)[0][0];
const lowSkill = (p) => sortedSkills(p).at(-1)[0];

const StatusPill = ({ task }) => (
  <span
    className={
      task.status === "Complete"
        ? "good"
        : task.status === "At risk" || isOverdue(task)
          ? "warn"
          : "pill"
    }
  >
    {isOverdue(task) && task.status !== "At risk" ? "Overdue" : task.status}
  </span>
);
const Metric = ({ label, value, sub }) => (
  <div className="metricCard">
    <small>{label}</small>
    <strong>{value}</strong>
    <span>{sub}</span>
  </div>
);
const Insight = ({ t, d }) => (
  <div className="insight">
    <b>{t}</b>
    <span>{d}</span>
  </div>
);

function Team({ data }) {
  return (
    <section className="panel">
      <h2>Team Intelligence</h2>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Role</th>
              <th>Level</th>
              <th>Score</th>
              <th>Open tasks</th>
            </tr>
          </thead>
          <tbody>
            {data.employees.map((e) => (
              <tr key={e.id}>
                <td>
                  <b>{e.name}</b>
                </td>
                <td>{e.role}</td>
                <td>{e.level}</td>
                <td>
                  <b>{e.score}</b>/100
                </td>
                <td>
                  {
                    data.tasks.filter(
                      (t) => t.owner === e.id && t.status !== "Complete",
                    ).length
                  }
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <b>Founder</b>
              </td>
              <td>{data.founder.role}</td>
              <td>{data.founder.level}</td>
              <td>
                <b>{data.founder.score}</b>/100
              </td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Tasks({ user, data, setData }) {
  const isFounder = user.type === "founder";
  const visible = isFounder
    ? data.tasks
    : data.tasks.filter((t) => t.owner === user.id);
  const [showForm, setShowForm] = useState(false);
  const blank = {
    title: "",
    owner: data.employees[0].id,
    due: TODAY,
    evidence: "",
  };
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  const update = (id, status) =>
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) =>
        t.id === id && (isFounder || t.owner === user.id)
          ? { ...t, status }
          : t,
      ),
    }));

  const create = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Task title is required.");
    if (!form.due) return setError("Due date is required.");
    setData((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        {
          id: Math.max(0, ...d.tasks.map((t) => t.id)) + 1,
          title: form.title.trim(),
          owner: form.owner,
          due: form.due,
          status: "In progress",
          evidence: form.evidence.trim() || "Not submitted",
        },
      ],
    }));
    setForm(blank);
    setError("");
    setShowForm(false);
  };

  return (
    <>
      <section className="panel">
        <div className="panelHead">
          <h2>{isFounder ? "All Work" : "My Work"}</h2>
          {isFounder && (
            <button className="primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cancel" : "+ Create Task"}
            </button>
          )}
        </div>
        {isFounder && showForm && (
          <form className="subForm" onSubmit={create}>
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
            />
            <label>Owner</label>
            <select
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            >
              {data.employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <label>Due date</label>
            <input
              type="date"
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
            />
            <label>Expected evidence</label>
            <input
              value={form.evidence}
              onChange={(e) => setForm({ ...form, evidence: e.target.value })}
              placeholder="e.g. 10/10 vendors onboarded"
            />
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="primary">
              Save task
            </button>
          </form>
        )}
        {visible.length === 0 && <p className="muted">No tasks to show.</p>}
        {visible.map((t) => (
          <div className="task big" key={t.id}>
            <div>
              <b>{t.title}</b>
              <small>
                Owner: {person(data, t.owner)?.name ?? t.owner} • Due: {t.due}
                {isOverdue(t) ? " • OVERDUE" : ""}
              </small>
              <small>Evidence: {t.evidence}</small>
            </div>
            <select
              aria-label={`Status for ${t.title}`}
              value={t.status}
              onChange={(e) => update(t.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </section>
      <section className="panel ai">
        <h2>Evidence rule</h2>
        <p>
          Performance is based on responsibility → KPI → task → evidence →
          result → business impact. Activity alone is not treated as
          performance.
        </p>
      </section>
    </>
  );
}

function Blockers({ user, data, setData }) {
  const isFounder = user.type === "founder";
  const open = data.tasks.filter(
    (t) => t.status !== "Complete" && (isFounder || t.owner === user.id),
  );
  const [taskId, setTaskId] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [why, setWhy] = useState("");
  const [error, setError] = useState("");
  const log = data.blockers.filter((b) => isFounder || b.by === user.id);

  const submit = (e) => {
    e.preventDefault();
    const id = Number(taskId || open[0]?.id);
    if (!id) return setError("There is no open task to report a blocker on.");
    if (why.trim().length < 10)
      return setError("Please explain what happened (at least a few words).");
    setData((d) => ({
      ...d,
      blockers: [
        {
          id: Date.now(),
          taskId: id,
          by: user.id,
          reason,
          why: why.trim(),
          result: REASON_CLASS[reason],
        },
        ...d.blockers,
      ],
    }));
    setWhy("");
    setError("");
  };

  return (
    <>
      <section className="panel">
        <h2>Why wasn't the work completed?</h2>
        <p className="muted">
          Every missed commitment gets an explanation before a performance
          penalty is considered.
        </p>
        <form onSubmit={submit}>
          <label>Task</label>
          <select
            value={taskId || open[0]?.id || ""}
            onChange={(e) => setTaskId(e.target.value)}
          >
            {open.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <label>Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <label>What happened?</label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Explain what prevented completion..."
          />
          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="primary"
            disabled={open.length === 0}
          >
            Ask Solo Leveling AI
          </button>
        </form>
      </section>
      <section className="panel ai">
        <h2>Investigation Result</h2>
        {log.length === 0 && (
          <div className="insight">Submit an explanation to begin.</div>
        )}
        {log.map((b) => (
          <div className="insight" key={b.id}>
            <b>
              {data.tasks.find((t) => t.id === b.taskId)?.title} — {b.reason}
            </b>
            <span>
              AI classification (demo rules): {b.result}. Next: compare with
              task history, dependencies and evidence before adjusting the
              score.
            </span>
          </div>
        ))}
      </section>
    </>
  );
}

const FOUNDER_QUESTS = [
  ["Delegation & Decision Rights", "5 days • 4 lessons • 1 exercise", 120],
  ["Priority Management", "3 days • 3 lessons • 1 practical quest", 80],
];
const QUESTS = {
  Negotiation: [
    "Negotiation Fundamentals",
    "7 days • 5 lessons • 2 simulations",
    150,
  ],
  Leadership: [
    "Leading Without Micromanaging",
    "5 days • 4 lessons • 1 exercise",
    120,
  ],
  Execution: [
    "Priority Management",
    "3 days • 3 lessons • 1 practical quest",
    80,
  ],
  Ownership: [
    "Ownership & Follow-through",
    "4 days • 3 lessons • 1 exercise",
    90,
  ],
  Quality: ["Quality Checklists", "3 days • 3 lessons • 1 practical quest", 80],
};

function Training({ user, data }) {
  const p = person(data, user.id);
  const weakest = sortedSkills(p)
    .slice(-2)
    .reverse()
    .map(([s]) => QUESTS[s]);
  const quests = user.type === "founder" ? FOUNDER_QUESTS : weakest;
  return (
    <div className="cols">
      <section className="panel">
        <h2>Recommended Training</h2>
        {quests.map(([name, meta, xp]) => (
          <div className="quest" key={name}>
            <b>{name}</b>
            <span>{meta}</span>
            <em>+{xp} XP</em>
          </div>
        ))}
      </section>
      <section className="panel">
        <h2>Skill Profile</h2>
        {Object.entries(p.skills).map(([s, v]) => (
          <div className="skill" key={s}>
            <div>
              <span>{s}</span>
              <b>{v}</b>
            </div>
            <div className="bar">
              <i style={{ width: v + "%" }} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Advisor() {
  return (
    <>
      <section className="panel ai">
        <h2>
          👑 Founder Advisor <small>(sample data)</small>
        </h2>
        <Insight
          t="FACT"
          d="Approval dependency is associated with a meaningful share of current delays."
        />
        <Insight
          t="ANALYSIS"
          d="You may be retaining routine operational decisions."
        />
        <Insight
          t="RECOMMENDATION"
          d="Define decision rights and delegate low-risk approvals."
        />
        <Insight
          t="CONFIDENCE"
          d="Medium — production data is required before making a consequential management decision."
        />
      </section>
      <section className="panel">
        <h2>Founder Quest</h2>
        <div className="quest">
          <b>Reduce Approval Bottleneck</b>
          <span>
            Delegate 3 repeatable approval categories and measure approval cycle
            time.
          </span>
          <em>+200 XP</em>
        </div>
      </section>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
