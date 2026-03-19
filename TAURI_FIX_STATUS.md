# Tauri 修复过程记录

## 当前结论

Tauri 修复工作已经完成最关键的一步：

**项目已从“仓库无法被识别为 Tauri 项目”，恢复到“最小 Tauri 2 桌面闭环可运行”。**

## 修复路径回顾

### 起点
最初的真实状态是：
- `npm run build` 成功
- `npm run tauri:dev` 失败
- CLI 报错：当前目录不是 Tauri 项目
- 仓库缺失 `src-tauri`

### 本轮修复动作

1. 校准文档，让 README 和状态文档先承认仓库现实
2. 重建最小 `src-tauri` 工程：
   - `Cargo.toml`
   - `build.rs`
   - `src/main.rs`
   - `tauri.conf.json`
   - `capabilities/default.json`
3. 固定 Vite 端口为 `1420` 且 `strictPort: true`
4. 生成 Windows 开发所需图标资源
5. 验证 `tauri:dev`
6. 验证 `tauri:build`

## 关键失败模式如何演进

### 阶段 1：不是 Tauri 项目
```text
Couldn't recognize the current folder as a Tauri project.
```

### 阶段 2：Cargo manifest 不匹配
```text
can't find library `claw_pet_lib`
```

### 阶段 3：Windows 图标资源缺失
```text
`icons/icon.ico` not found
```

### 阶段 4：最小闭环达成
- `npm run tauri:dev` 成功
- `npm run tauri:build` 成功

## 当前成果

### 开发态

```bash
npm run tauri:dev
```

结果：成功。

关键输出：
- Vite 启动在 `http://localhost:1420/`
- Rust 编译完成
- `target\\debug\\claw-pet.exe` 运行

### 构建态

```bash
npm run tauri:build
```

结果：成功。

关键输出：
- `release` 构建完成
- 产物位于：`src-tauri/target/release/claw-pet.exe`

## 当前策略为何有效

这次没有继续追旧的 API 兼容历史，而是先恢复“最小工程存在性”。
这样做把问题拆成了明确的几层：

1. 工程存在性
2. 配置正确性
3. 平台资源完整性
4. 业务能力恢复

前 3 层现在已经打通，第 4 层留给下一阶段。

## 下一阶段

现在不应该回头继续泛化“修 Tauri”，而应该进入分层恢复：

1. 先恢复 Live2D 桌面渲染
2. 再恢复 OpenClaw Gateway 通信
3. 最后再考虑插件、托盘、开机启动等增强能力
