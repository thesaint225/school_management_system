For a modern school-management dashboard, I'd use a vertical glassmorphism sidebar with:

translucent glass background
subtle border
backdrop blur
active navigation item with a soft highlight
icons in their own containers
smooth hover animation
clear active state
responsive behavior
a small section label
sidebar footer for user/settings
1. Change your HTML slightly
<aside class="sidebar">

  <!-- Brand -->
  <div class="sidebar-brand">
    <div class="brand-logo">E</div>

    <div class="brand-text">
      <strong>EduManage</strong>
      <span>School Management</span>
    </div>
  </div>


  <!-- Navigation -->
  <nav class="main-nav" aria-label="Primary Navigation">

    <div class="nav-section-label">
      MAIN MENU
    </div>

    <a href="#dashboardSection"
       class="nav-btn active"
       data-nav="overview">

      <span class="nav-icon" aria-hidden="true">📊</span>
      <span class="nav-label">Overview</span>
    </a>


    <a href="#calendarSection"
       class="nav-btn"
       data-nav="calendar">

      <span class="nav-icon" aria-hidden="true">📅</span>
      <span class="nav-label">Calendar</span>
    </a>


    <a href="#attendanceSection"
       class="nav-btn"
       data-nav="attendance">

      <span class="nav-icon" aria-hidden="true">📋</span>
      <span class="nav-label">Attendance</span>
    </a>


    <a href="#achieversSection"
       class="nav-btn"
       data-nav="achievers">

      <span class="nav-icon" aria-hidden="true">🏆</span>
      <span class="nav-label">Achievers</span>
    </a>


    <a href="#studentsSection"
       class="nav-btn"
       data-nav="students">

      <span class="nav-icon" aria-hidden="true">👨‍🎓</span>
      <span class="nav-label">Students</span>
    </a>


    <div class="nav-section-label nav-section-secondary">
      COMMUNICATION
    </div>


    <a href="#contactSection"
       class="nav-btn"
       data-nav="contact">

      <span class="nav-icon" aria-hidden="true">✉️</span>
      <span class="nav-label">Contact</span>
    </a>

  </nav>


  <!-- Sidebar footer -->
  <div class="sidebar-footer">

    <a href="#" class="nav-btn">
      <span class="nav-icon">⚙️</span>
      <span class="nav-label">Settings</span>
    </a>

    <div class="sidebar-user">
      <div class="user-avatar">
        HM
      </div>

      <div class="user-info">
        <strong>Administrator</strong>
        <span>School Admin</span>
      </div>
    </div>

  </div>

</aside>
2. The glassmorphism sidebar

Replace your current .main-nav styling with this structure:

/* =========================================================
   SIDEBAR
   ========================================================= */

.sidebar {
  position: fixed;

  top: 18px;
  left: 18px;
  bottom: 18px;

  width: 250px;

  display: flex;
  flex-direction: column;

  padding: 18px 14px;

  background:
    linear-gradient(
      145deg,
      hsla(0, 0%, 100%, 0.72),
      hsla(0, 0%, 100%, 0.48)
    );

  border: 1px solid hsla(0, 0%, 100%, 0.7);

  border-radius: 24px;

  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);

  box-shadow:
    0 10px 35px hsla(217, 30%, 20%, 0.08),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.8);

  z-index: 1000;
}
3. Brand
/* =========================================================
   SIDEBAR BRAND
   ========================================================= */

.sidebar-brand {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 8px 10px 22px;

  margin-bottom: 8px;
}


.brand-logo {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background: var(--primary-600);

  color: white;

  font-size: 18px;
  font-weight: 800;

  box-shadow:
    0 6px 14px hsla(217, 80%, 50%, 0.22);
}


.brand-text {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.brand-text strong {
  font-size: 15px;
  font-weight: 800;

  color: var(--text-main);
}


.brand-text span {
  margin-top: 2px;

  font-size: 10px;
  font-weight: 500;

  color: var(--text-muted);
}
4. Navigation itself

Notice that .main-nav is no longer a pill.

/* =========================================================
   MAIN NAVIGATION
   ========================================================= */

.main-nav {
  display: flex;
  flex-direction: column;

  gap: 5px;

  flex: 1;

  padding: 4px 0;
}
5. Section labels

This gives you:

MAIN MENU

Overview
Calendar
Attendance
Achievers
Students

COMMUNICATION

Contact

CSS:

/* =========================================================
   NAV SECTION LABEL
   ========================================================= */

.nav-section-label {
  padding: 12px 12px 7px;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.1em;

  color: var(--text-muted);

  opacity: 0.75;
}


.nav-section-secondary {
  margin-top: 10px;
}
6. Navigation buttons

This is the most important part.

/* =========================================================
   NAV BUTTON
   ========================================================= */

.nav-btn {
  position: relative;

  display: flex;
  align-items: center;

  gap: 12px;

  width: 100%;

  min-height: 46px;

  padding: 8px 10px;

  border-radius: 13px;

  color: var(--text-muted);

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
7. Icon containers

Instead of letting the emoji float by itself, give it a small glass container.

/* =========================================================
   NAV ICON
   ========================================================= */

.nav-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: hsla(0, 0%, 100%, 0.35);

  border: 1px solid hsla(0, 0%, 100%, 0.45);

  font-size: 16px;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}


.nav-label {
  flex: 1;
}
8. Hover effect
/* =========================================================
   NAV HOVER
   ========================================================= */

.nav-btn:hover {
  color: var(--text-main);

  background: hsla(0, 0%, 100%, 0.45);

  transform: translateX(2px);
}


.nav-btn:hover .nav-icon {
  background: hsla(0, 0%, 100%, 0.7);

  transform: scale(1.04);
}
9. The active state

This is where the glassmorphism really starts to look good.

/* =========================================================
   ACTIVE NAV ITEM
   ========================================================= */

.nav-btn.active {
  color: var(--primary-600);

  background:
    linear-gradient(
      135deg,
      hsla(0, 0%, 100%, 0.8),
      hsla(0, 0%, 100%, 0.52)
    );

  border: 1px solid hsla(0, 0%, 100%, 0.8);

  box-shadow:
    0 5px 16px hsla(217, 30%, 25%, 0.07),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}


.nav-btn.active .nav-icon {
  background: var(--primary-50);

  border-color: hsla(217, 80%, 55%, 0.15);

  box-shadow:
    0 4px 10px hsla(217, 80%, 50%, 0.08);
}

And add the little active indicator:

.nav-btn.active::before {
  content: "";

  position: absolute;

  left: -14px;

  top: 50%;

  width: 3px;
  height: 22px;

  transform: translateY(-50%);

  border-radius: 0 4px 4px 0;

  background: var(--primary-600);

  box-shadow:
    0 0 10px hsla(217, 80%, 55%, 0.35);
}

This gives you:

                    │
                    │
        ┌───────────┴───────────────┐
        │ 📊   Overview             │
        └───────────────────────────┘

        ┌───────────────────────────┐
        │ 📅   Calendar             │
        └───────────────────────────┘

The active item gets the little vertical indicator on the left.

10. Sidebar user section
/* =========================================================
   SIDEBAR FOOTER
   ========================================================= */

.sidebar-footer {
  margin-top: auto;

  padding-top: 12px;

  border-top: 1px solid hsla(217, 30%, 50%, 0.1);
}


.sidebar-user {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-top: 8px;

  padding: 10px;

  border-radius: 13px;

  background: hsla(0, 0%, 100%, 0.28);

  border: 1px solid hsla(0, 0%, 100%, 0.4);
}


.user-avatar {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: var(--primary-600);

  color: white;

  font-size: 10px;
  font-weight: 800;
}


.user-info {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.user-info strong {
  font-size: 11px;
  font-weight: 700;

  color: var(--text-main);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.user-info span {
  margin-top: 2px;

  font-size: 9px;

  color: var(--text-muted);
}
11. Your page content needs to move over

Because the sidebar is fixed at 250px, your main content shouldn't sit underneath it.

Something like:

.main-content {
  margin-left: 286px;
  padding: 20px 24px;
}

Your overall structure could therefore be:

┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─────────────────┐   ┌───────────────────────────────────┐ │
│  │                 │   │                                   │ │
│  │  E EduManage    │   │         Dashboard                 │ │
│  │                 │   │                                   │ │
│  │ MAIN MENU       │   │   ┌───────┐ ┌───────┐ ┌───────┐  │ │
│  │                 │   │   │       │ │       │ │       │  │ │
│  │ 📊 Overview     │   │   │ Stats │ │ Stats │ │ Stats │  │ │
│  │ 📅 Calendar     │   │   │       │ │       │ │       │  │ │
│  │ 📋 Attendance   │   │   └───────┘ └───────┘ └───────┘  │ │
│  │ 🏆 Achievers    │   │                                   │ │
│  │ 👨‍🎓 Students    │   │                                   │ │
│  │                 │   │                                   │ │
│  │ COMMUNICATION   │   │                                   │ │
│  │                 │   │                                   │ │
│  │ ✉️ Contact      │   │                                   │ │
│  │                 │   │                                   │ │
│  │                 │   │                                   │ │
│  │ ⚙️ Settings     │   │                                   │ │
│  │                 │   │                                   │ │
│  │ ┌─────────────┐ │   │                                   │ │
│  │ │ HM Admin    │ │   │                                   │ │
│  │ └─────────────┘ │   │                                   │ │
│  └─────────────────┘   └───────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
One recommendation about the emojis

For a production-quality version of your SMS, I would eventually replace:

📊
📅
📋
🏆
👨‍🎓
✉️
⚙️

with Lucide icons or another SVG icon library.