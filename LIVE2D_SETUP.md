# Claw-Pet Live2D 模型指南

## 当前状态

Claw-Pet 正在使用**占位符**显示 Live2D 宠物，因为真实的 Live2D 模型文件尚未配置。

## 如何添加 Live2D 模型

### 步骤 1: 获取 Live2D 模型文件

你可以从以下来源获取 Live2D 模型：

1. **Live2D 官方示例**
   - 访问 Live2D Cubism 官网下载示例模型
   - 网址: https://www.live2d.com/download/cubism-sdk

2. **开源项目**
   - GitHub 上的 Live2D 模型项目
   - 搜索关键词: "Live2D model", "Cubism model"

3. **自己创建**
   - 使用 Live2D Cubism Editor 创建自己的模型
   - 导出为 .moc3 格式

### 步骤 2: 放置模型文件

将以下文件放置在 `public/models/Haru/` 目录下：

```
public/models/Haru/
├── Haru.moc3              # 模型文件
├── Haru.model3.json       # 模型配置
├── Haru.2048/             # 纹理目录
│   └── texture_00.png     # 纹理图片
├── Haru.physics3.json     # 物理效果（可选）
├── Haru.pose3.json        # 姿态配置（可选）
└── motions/               # 动作目录（可选）
    └── *.motion3.json     # 动作文件
```

### 步骤 3: 配置模型

编辑 `Haru.model3.json` 文件，确保包含正确的文件引用：

```json
{
  "Version": 3,
  "FileReferences": {
    "Moc": "Haru.moc3",
    "Textures": [
      "Haru.2048/texture_00.png"
    ],
    "Motions": {
      "Idle": [
        {
          "File": "motions/idle.motion3.json"
        }
      ],
      "Tap": [
        {
          "File": "motions/tap.motion3.json"
        }
      ]
    }
  }
}
```

### 步骤 4: 重启应用

文件放置完成后：
1. 重启开发服务器
2. 应用会自动加载新的 Live2D 模型
3. 点击宠物可以触发动作和表情

## 测试模型

### 手动测试

1. 打开浏览器控制台
2. 访问应用的加载器实例
3. 手动触发动作:

```javascript
// 访问全局加载器（需要暴露）
window.petLoader.playMotion('Tap', 0);
window.petLoader.setExpression('angry');
```

### 查看状态

- 点击宠物显示信息面板
- 查看 Live2D 模型加载状态
- 检查控制台日志

## 故障排除

### 模型未加载

1. 检查文件路径是否正确
2. 查看浏览器控制台错误信息
3. 确认所有必需文件都存在
4. 检查文件权限

### 动作不播放

1. 确认动作文件存在于 motions/ 目录
2. 检查 model3.json 中的动作配置
3. 验证动作文件格式正确

### 纹理缺失

1. 确认纹理文件存在
2. 检查纹理路径配置
3. 验证纹理格式（支持 PNG, JPEG）

## 推荐模型

### 免费模型

1. **Hiyori Free**
   - 免费的 Live2D 模型
   - 适合测试和开发

2. **Unity-chan Live2D**
   - 官方示例模型
   - 完整的动作和表情

### 付费模型

1. **Booth Store**
   - 日本角色商店
   - 大量高质量的 Live2D 模型

2. **DLsite**
   - 数字内容商店
   - 各种类型的 Live2D 模型

## 技术支持

如果遇到问题，可以：

1. 查看 Live2D 官方文档
2. 检查 pixi-live2d-display 的 GitHub Issues
3. 在项目 Issues 中提问

---

**注意**: 请确保你拥有使用 Live2D 模型的合法权限。尊重创作者的版权和使用条款。