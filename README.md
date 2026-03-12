# Claw-Pet 🦞

一个支持 OpenClaw 的 Live2D 桌面宠物应用。

## 项目结构

```
claw-pet/
├── src/                          # 前端源码
│   ├── components/                # UI 组件
│   │   ├── PetDisplay.tsx      # Live2D 宠物显示
│   ├── MessageBubble.tsx     # 消息气泡
│   ├── ChatDialog.tsx       # 输入对话框
│   └── MessageDetailModal.tsx # 消息详情弹窗
│   ├── lib/                     # 工具库
│   │   ├── live2d/            # Live2D SDK 集成
│   │   │   ├── Framework/     # 从 SDK 复制
│   │   │   ├── Core/          # 从 SDK 复制
│   │   │   ├── HaruLoader.ts  # Haru 模型加载器
│   │   ├── openclaw/          # OpenClaw 客户端
│   │   ├── protocol.ts      # 协议定义
│   │   └── types.ts        # 类型定义
│   ├── state/                   # 状态管理
│   │   └── store.ts          # Zustand store
│   ├── App.css                  # 全局样式
│   ├── App.tsx                 # 主应用组件
│   └── main.tsx                # 应用入口
├── src-tauri/                  # Rust 后端
│   ├── src/
│   │   ├── lib.rs             # Tauri 主逻辑
│   │   └── main.rs           # 应用入口
│   ├── capabilities/            # 权限配置
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── README.md
├── public/                     # 静态资源
│   ├── models/                # Live2D 模型文件（Haru）
│   ├── examples/             # 示例代码
│   └── index.html
├── dist/                        # 前端构建输出
├── package.json                # 依赖管理
├── tsconfig.json + tsconfig.node.json
└── vite.config.ts
```

## 当前状态

### ✅ 阶段 1 完成度：100%

**已完成：**
- ✅ 项目结构创建
- ✅ Tauri 配置（透明窗口、无边框、alwaysOnTop）
- ✅ 所有依赖安装
- ✅ Zustand Store 实现
- ✅ OpenClaw WebSocket 客户端
- ✅ 所有 UI 组件（PetDisplay、MessageBubble、ChatDialog、MessageDetailModal）
- ✅ 主应用组件
- ✅ Rust 编译成功
- ✅ Live2D SDK 下载和配置

**进行中：**
- 🔄 应用窗口启动中

**待完成（阶段 2）：**
- ⏳ Live2D 渲染器初始化
- ⏳ Haru 模型加载
- ⏳ 动画循环实现
- ⏳ 动作和表情触发
- ⏳ OpenClaw Gateway 完整连接和消息处理

## 功能特性

### 已实现
- ✅  transparent 窗口
- ✅ 无边框设计
- ✅ 可拖动区域
- ✅ Zustand Store 状态管理
- ✅ WebSocket 客户端
- ✅ 消息气泡 UI
- ✅ 输入对话框
- ✅ 消息详情弹窗
- ✅ 系统托盘基础框架

### 待实现（阶段 2-3）
- ⏳ Live2D 动画渲染
- ⏳ 动作和表情播放
- ⏳ OpenClaw Gateway 完整连接和消息处理

## 开发命令

```bash
# 安装依赖（已完成）
npm install

# 开发模式
npm run tauri dev

# 构建生产版本
npm run tauri build
npm run tauri build
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **状态管理**：Zustand 4.5
- **渲染引擎**：Live2D Cubism SDK for Web
- **桌面框架**：Tauri 2
- **WebSocket**：@tauri-apps/plugin-websocket 2.0.0
- **构建工具**：Vite 5
- **Rust**：Tauri 2

## Live2D 配置

### 已集成 SDK

- **Core**：Live2D Cubism Core（必需）
- **Framework**：Live2D Cubism Framework（必需）
- **Haru 模型**：`public/models/Haru/` 目录

### Haru 模型详情

**基本信息**
- **模型名称**：Haru
- **来源**：Live2D Cubism Web Samples
- **许可证**：BSD（可在开源项目中使用）

**模型文件包含**：
- `Haru.moc3` - 模型文件
- `Haru.model3.json` - 模型配置
- `Haru.cdi3.json` - Cubism IDE 集成配置
- `Haru.physics3.json` - 物理模拟配置
- `Haru.pose3.json` - 动态定义

**资源文件**：
- `Haru.2048/` - 纹理目录
  - `texture_00.png` - 纹理 0
- `texture_01.png` - 纹理 1

**动作文件**：
- `motions/` - 动作目录
  - `haru_g_idle.motion3.json` - 待机动画
  - `haru_g_m01-27.motion3.json` - 27 个动作
  - 其他动作

**表情文件**：
- `expressions/` - 8 个表情（F01-F08.exp3.json）

**音频文件**：
- `sounds/` - 4 个音效文件

## OpenClaw 配置

- **Gateway URL**：ws://127.0.0.1:18789
- **角色**：operator
- **作用域**：operator.read, operator.write
- **认证**：无（默认配置）

## 快速开始

1. 运行应用
   ```bash
   npm run tauri dev
   ```

2. 测试 Live2D 模型
   - 查看 Haru 在画布效果
   - 测试点击动作和表情
   - 测试消息显示

3. 测试 OpenClaw 连接
   - 检查 WebSocket 连接
   - 测试消息发送和接收

## 注意事项

- **Live2D 模型加载**：首次加载可能需要时间（模型文件较大）
- **动作触发**：确保使用正确的动作名称和索引
- **性能**：Live2D 渲染需要较多资源，注意性能优化
- **错误处理**：添加完善的错误处理和日志记录

## 开发说明

### 代码组织

- `src/lib/live2d/`：Live2D SDK 集成
  - `src/components/`：UI 组件
- `src/state/`：状态管理
- `src/lib/openclaw/`：OpenClaw 客户端

### 扩展功能（后续阶段）

- **阶段 4**：系统托盘
- **阶段 5**：连接状态管理
- **阶段 6**：配置界面
- **阶段 7**：高级 Live2D 特性（物理、眼动等）

## 许可证

MIT License

## 下一步

1. 完成 Live2D 集成
2. 完善错误处理
3. 测试 OpenClaw Gateway 集成
4. 添加系统托盘
5. 优化性能

---

**开始吧！**
