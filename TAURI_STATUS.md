# Tauri 当前状态

## 结论

当前仓库已经恢复出 **最小可运行的 Tauri 2 项目**。

已验证事实：
- `npm run build` 成功
- `npm run tauri:dev` 成功
- `npm run tauri:build` 成功
- `src-tauri` 已重新存在并能参与 dev/build 流程

## 已达成的最小闭环

当前最小成功标准已经满足：

1. 仓库重新拥有最小 `src-tauri` 工程
2. `npm run tauri:dev` 能打开桌面程序
3. `npm run tauri:build` 能完成桌面构建
4. React 前端已经被正确接入 Tauri 壳层

## 当前仓库里有什么

### 已存在
- React 前端工程
- Live2D 相关代码与模型资源
- OpenClaw 客户端与状态管理代码
- `public/standalone.html` 临时展示页
- `src-tauri` 最小 Tauri 2 工程
- `tauri:dev` / `tauri:build` npm 脚本

### 已恢复的关键项
- `src-tauri/Cargo.toml`
- `src-tauri/build.rs`
- `src-tauri/src/main.rs`
- `src-tauri/tauri.conf.json`
- `src-tauri/capabilities/default.json`
- `src-tauri/icons/*`

## 当前不做的事

为了避免问题重新混在一起，这一轮仍然 **不包含**：

- websocket/dialog 插件恢复
- 系统托盘、开机启动
- Live2D 桌面端联调
- OpenClaw Gateway 桌面端联调
- 高级窗口特性和视觉打磨

## 推荐恢复顺序

1. 保持最小桌面壳稳定
2. 恢复 Live2D 桌面渲染
3. 恢复 OpenClaw Gateway 桌面通信
4. 最后引入 Tauri 插件与高级桌面功能

## 当前入口说明

### 浏览器开发

```bash
npm run dev
```

Vite 端口：`1420`

### 前端构建

```bash
npm run build
```

### Tauri 桌面开发

```bash
npm run tauri:dev
```

当前状态：成功。

关键结果：
- Vite 成功启动在 `1420`
- Rust/Tauri 成功编译
- `target\\debug\\claw-pet.exe` 成功运行

### Tauri 桌面构建

```bash
npm run tauri:build
```

当前状态：成功。

关键结果：
- 完成 release 构建
- 产物路径：`src-tauri/target/release/claw-pet.exe`
