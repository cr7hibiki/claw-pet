# Claw-Pet 🦞

一个基于 React、Live2D 和 OpenClaw 的桌宠项目。当前仓库已经恢复出 **最小可运行的 Tauri 2 桌面闭环**：可以启动桌面窗口，也可以完成桌面构建。

## 当前事实

截至当前仓库状态：

- 前端工程可构建：`npm run build` 成功
- Vite 开发端口固定为 `1420`
- `npm run tauri:dev` 已成功启动桌面程序
- `npm run tauri:build` 已成功生成桌面产物
- `src-tauri` 最小工程骨架已恢复
- `public/standalone.html` 仍然保留，但它只是临时展示页，不是主入口

## 当前项目结构

```text
claw-pet/
├── src/                    # React 前端源码
├── public/                 # 静态资源与 standalone 页面
├── src-tauri/              # 最小 Tauri 2 桌面工程
├── dist/                   # 前端构建输出
├── package.json            # npm 脚本与依赖
├── vite.config.ts          # Vite 配置（dev 端口 1420）
├── README.md
├── LIVE2D_SETUP.md
├── LIVE2D_STATUS.md
├── TAURI_STATUS.md
├── TAURI_FIX_STATUS.md
└── TEST_RESULTS.md
```

## 当前阶段目标

最小 Tauri 闭环已经达成，下一阶段不再是“恢复桌面工程存在性”，而是分层恢复桌宠能力：

1. 保持桌面壳稳定
2. 恢复 Live2D 桌面端渲染
3. 恢复 OpenClaw Gateway 桌面端通信
4. 最后再考虑插件、托盘、开机启动等增强能力

## 开发命令

```bash
# 安装依赖
npm install

# 前端开发（浏览器）
npm run dev

# 前端构建
npm run build

# Tauri 桌面开发
npm run tauri:dev

# Tauri 桌面构建
npm run tauri:build
```

## 运行入口说明

### 1. 浏览器开发入口

```bash
npm run dev
```

访问：`http://localhost:1420/`

说明：
- 用于验证 React 页面、Live2D 资源和前端交互
- 适合纯前端调试

### 2. Tauri 桌面入口

```bash
npm run tauri:dev
npm run tauri:build
```

说明：
- 这是当前桌面端主入口
- `tauri:dev` 用于桌面开发
- `tauri:build` 用于生成桌面构建产物

### 3. 临时 standalone 页面

文件：`public/standalone.html`

说明：
- 这是临时独立页面
- 可用于快速展示桌宠样式和简单状态面板
- 不能替代 Tauri 桌面入口

## 已达成的桌面基线

- 最小 `src-tauri` 工程已恢复
- Vite 与 Tauri dev 端口已对齐
- Windows 开发所需图标资源已生成
- `tauri:dev` 已能启动桌面程序
- `tauri:build` 已能生成桌面产物

## 暂未纳入本轮恢复范围

- websocket/dialog 等 Tauri 插件恢复
- 系统托盘、开机启动
- 高级透明窗口/原生系统集成
- Live2D 与 Gateway 的完整桌面联调

## 技术栈

- React 18
- TypeScript
- Vite 5
- Zustand
- Live2D Cubism SDK for Web
- Tauri 2

## 下一阶段顺序

建议按以下顺序恢复：

1. 保持桌面壳稳定
2. 恢复 Live2D 渲染
3. 恢复 OpenClaw Gateway 通信
4. 再恢复 Tauri 插件与高级桌面能力

## 相关文档

- `LIVE2D_SETUP.md`：Live2D 配置说明
- `LIVE2D_STATUS.md`：Live2D 当前状态
- `TAURI_STATUS.md`：Tauri 当前状态与最小闭环结果
- `TAURI_FIX_STATUS.md`：Tauri 修复过程记录
- `TEST_RESULTS.md`：已有测试与验证记录
