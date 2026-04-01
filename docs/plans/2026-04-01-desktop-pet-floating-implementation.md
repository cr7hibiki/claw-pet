# Desktop Pet Floating Window Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 Tauri 运行形态从“普通应用窗口”收敛为“可拖动、默认置顶、透明无边框的桌宠承载层”，并在前端 Tauri 模式下去除页面壳感。

**Architecture:** 采用窗口层与前端层双层收敛：窗口层通过 `tauri.conf.json` 调整窗口属性（尺寸、透明、无边框、置顶）；前端层继续复用 `isTauriRuntime` 做显示分流，仅在 Tauri 下去掉背景与调试型 UI。浏览器模式保持调试可见性，不引入新的模式状态或设置系统。

**Tech Stack:** Tauri 2, React 18, TypeScript 5, Vite 5, Zustand, pixi-live2d-display

---

### Task 1: 固化窗口层桌宠参数（Tauri）

**Files:**
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/src-tauri/tauri.conf.json`

**Step 1: 写失败检查目标**

记录失败条件：

```text
- 启动后仍是大尺寸普通窗口
- 窗口有边框或非透明底板
- 默认不置顶
```

**Step 2: 运行当前基线启动（验证失败）**

Run: `npm run tauri:dev`
Expected: 现状为普通窗口形态（FAIL for target）

**Step 3: 写最小实现（窗口参数）**

在 `windows[0]` 中将参数收敛到桌宠承载层（示例目标值，实际实现可按模型可见尺寸微调）：

```json
{
  "label": "main",
  "title": "Claw-Pet",
  "width": 360,
  "height": 520,
  "resizable": false,
  "fullscreen": false,
  "visible": true,
  "decorations": false,
  "transparent": true,
  "alwaysOnTop": true
}
```

**Step 4: 启动验证窗口行为**

Run: `npm run tauri:dev`
Expected:
- 无边框
- 透明背景可生效
- 默认置顶
- 仍可拖动（配合前端 drag region）

**Step 5: Commit**

```bash
git add src-tauri/tauri.conf.json
git commit -m "feat(tauri): configure floating desktop-pet window defaults"
```

---

### Task 2: 在 App 层去掉 Tauri 页面底板背景

**Files:**
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/src/App.tsx`
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/src/App.css`

**Step 1: 写失败检查目标**

```text
- Tauri 下仍能看到整屏渐变背景
- 浏览器下调试背景被误删
```

**Step 2: 运行当前行为检查（确认失败）**

Run: `npm run dev`
Expected: 浏览器下有背景（这是基线）

Run: `npm run tauri:dev`
Expected: 当前 Tauri 下仍有页面底板（FAIL for target）

**Step 3: 写最小实现（runtime class 分流）**

在 `src/App.tsx` 根节点增加按环境的 class（示例）：

```tsx
<div
  className={`app-container ${isTauriRuntime ? 'runtime-tauri' : 'runtime-browser'}`}
  data-tauri-drag-region
>
```

在 `src/App.css` 增加分流样式：

```css
.app-container.runtime-browser {
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 40%),
    linear-gradient(140deg, #1e3a5f 0%, #275a7a 40%, #1a6c5f 100%);
}

.app-container.runtime-tauri {
  background: transparent;
}
```

并保留状态栏仅浏览器显示的逻辑。

**Step 4: 运行验证**

Run: `npm run build`
Expected: PASS

Run: `npm run tauri:dev`
Expected: Tauri 下不再有整屏页面背景

Run: `npm run dev`
Expected: 浏览器调试背景仍在

**Step 5: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "fix(app): remove panel-style background in tauri runtime"
```

---

### Task 3: 在 PetDisplay 层隐藏 Tauri 调试壳并收敛 fallback 卡片

**Files:**
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/src/components/PetDisplay.tsx`
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/src/components/PetDisplay.css`

**Step 1: 写失败检查目标**

```text
- Tauri 下仍出现“查看状态”按钮与状态面板
- Tauri fallback 时仍是大玻璃卡片（强页面感）
- 点击宠物动作/聊天链路回归
```

**Step 2: 运行当前检查（确认失败）**

Run: `npm run tauri:dev`
Expected: 当前可见调试型 UI（FAIL for target）

**Step 3: 写最小实现（runtime 分流，不引入新全局状态）**

在 `PetDisplay.tsx` 内部增加运行时判断：

```tsx
const isTauriRuntime = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
```

仅浏览器显示调试 UI：

```tsx
{!isTauriRuntime ? (
  <button className="info-toggle" onClick={() => setShowInfo((value) => !value)}>
    {showInfo ? '隐藏状态' : '查看状态'}
  </button>
) : null}

{!isTauriRuntime && showInfo ? <div className="info-panel">...</div> : null}
```

fallback 显示按运行时分流：

```tsx
{modelStatus === 'fallback' ? (
  <div className="pet-placeholder-overlay" onClick={handleClick}>
    {!isTauriRuntime ? (
      <div className="pet-placeholder-card">...</div>
    ) : (
      <div className="pet-placeholder-chip">Claw-Pet</div>
    )}
  </div>
) : null}
```

在 `PetDisplay.css` 为 `pet-placeholder-chip` 提供简洁样式，避免大面积卡片背景；并确保 `pet-container` 在 Tauri 下不引入额外底板。

**Step 4: 运行验证**

Run: `npm run build`
Expected: PASS

Run: `npm run tauri:dev`
Expected:
- 调试按钮/面板隐藏
- fallback 样式简化，无大玻璃卡片
- 点击宠物仍触发动作与聊天

Run: `npm run dev`
Expected: 浏览器下调试按钮/面板仍可用

**Step 5: Commit**

```bash
git add src/components/PetDisplay.tsx src/components/PetDisplay.css
git commit -m "fix(pet-display): hide debug chrome in tauri and simplify fallback"
```

---

### Task 4: 回归验证与计划文档同步

**Files:**
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/docs/plans/2026-03-27-desktop-pet-dual-mode.md`
- Modify: `C:/Users/cr7hi/workspace/rust/claw-pet/.worktrees/app-runtime-shell-split/docs/plans/2026-04-01-desktop-pet-floating-design.md`（可选：补充“实现状态”小节）

**Step 1: 执行最终验证清单（浏览器 + Tauri）**

Run: `npm run build`
Expected: PASS

Run: `npm run dev`
Expected: 浏览器调试壳正常

Run: `npm run tauri:dev`
Expected:
- 桌宠窗口无边框透明
- 默认置顶
- 可拖动
- 无页面底板感
- 交互链路可用

**Step 2: 记录验证结果**

在计划文档中更新已完成项：

```markdown
- [x] Tauri 窗口参数收敛（透明/无边框/默认置顶）
- [x] App 层去底板背景
- [x] PetDisplay 调试壳分流
```

**Step 3: Commit**

```bash
git add docs/plans/2026-03-27-desktop-pet-dual-mode.md docs/plans/2026-04-01-desktop-pet-floating-design.md
git commit -m "docs(plan): record floating desktop-pet rollout status"
```
