# MCP 安装与配置清单

本文档用于统一维护当前项目的 MCP 能力，包含每个 MCP 的功能说明、触发条件与安装方法。  
文档已去除个人敏感信息，所有路径均使用通用写法（如 `~` 或 `/path/to/...`）。

## 1. 前置准备

在安装任意 MCP 前，先确认本机具备以下环境：

- Node.js 18+（用于 `npx` 类型 MCP）
- Python 3.10+（用于 Python 包类型 MCP）
- Cursor 已安装并可读取 `~/.cursor/mcp.json`

## 2. MCP 清单（功能 + 触发条件 + 安装方法）

### 2.1 `neural-memory`

- 功能：跨会话长期记忆、结构化存储和检索历史上下文。
- 作用：让助手在多轮任务中持续记住关键约束、偏好和决策信息。
- 触发条件：
  - 需要跨会话延续上下文；
  - 需要记录长期偏好、规则、项目约定；
  - 需要从历史记忆中检索信息辅助当前任务。
- 安装方法（Python）：
  1. 安装包：`python3 -m pip install --user neural-memory`
  2. 找到可执行文件：`python3 -m site --user-base`
  3. 将命令路径写入 MCP 配置（建议绝对路径）。
- 配置示例：

```json
{
  "mcpServers": {
    "user-neural-memory": {
      "command": "/path/to/python-user-bin/neural-memory",
      "args": []
    }
  }
}
```

### 2.2 `playwright`

- 功能：浏览器自动化操作、页面交互测试、流程回归验证。
- 作用：用于本地 Web 应用自动化测试、端到端流程核对和 UI 行为验证。
- 触发条件：
  - 需要自动执行页面点击/输入/断言；
  - 需要复现并验证前端问题；
  - 需要回归关键业务流程。
- 安装方法（Node）：
  1. 直接使用 `npx` 启动：`npx -y @playwright/mcp@latest`
  2. 如首次执行较慢，等待依赖拉取完成后重试。
- 配置示例：

```json
{
  "mcpServers": {
    "user-playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### 2.3 `filesystem`

- 功能：在授权目录内执行文件读取、写入、检索和管理操作。
- 作用：让助手可直接处理项目文件（受目录白名单约束）。
- 触发条件：
  - 需要批量读写项目文件；
  - 需要在仓库内进行内容检索与修改；
  - 需要做文档、代码、配置文件维护。
- 安装方法（Node）：
  1. 直接使用 `npx` 启动：`npx -y @modelcontextprotocol/server-filesystem`
  2. 在 `args` 中声明允许访问的目录（最小权限原则）。
- 配置示例：

```json
{
  "mcpServers": {
    "user-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/workspace",
        "/path/to/another-allowed-dir"
      ]
    }
  }
}
```

### 2.4 `sequential-thinking`

- 功能：多步骤链式推理、复杂任务分解与中间过程校验。
- 作用：提升复杂问题求解的稳定性与可解释性。
- 触发条件：
  - 任务依赖多阶段推导；
  - 需要显式拆解步骤和验证过程；
  - 需要降低“跳步结论”风险。
- 安装方法（Node）：
  1. 直接使用 `npx` 启动：`npx -y @modelcontextprotocol/server-sequential-thinking`
- 配置示例：

```json
{
  "mcpServers": {
    "user-sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### 2.5 `web_reader`

- 功能：抓取网页内容并转换为结构化文本（如 Markdown）。
- 作用：用于网页资料阅读、链接内容提取、信息汇总。
- 触发条件：
  - 需要从 URL 获取正文内容；
  - 需要将网页内容转为可分析文本；
  - 需要做在线资料摘要或对比。
- 安装方法（Node）：
  1. 安装可用包并启动（示例）：`npx -y mcp-web-reader`
  2. 若包不可用，切换到组织内约定的替代包名并更新配置。
- 配置示例：

```json
{
  "mcpServers": {
    "user-web_reader": {
      "command": "npx",
      "args": ["-y", "mcp-web-reader"]
    }
  }
}
```

## 3. 统一安装流程（推荐）

1. 打开配置文件：`~/.cursor/mcp.json`
2. 在 `mcpServers` 中增加或更新目标 MCP 配置
3. 保存后重启 Cursor 使配置生效
4. 在工具列表确认 MCP 服务可见并可调用

## 4. 验证与排障

- 启动失败优先检查：
  - 本地命令是否存在（`command` 路径是否正确）
  - 依赖是否安装成功（`pip` / `npx`）
  - `mcp.json` 是否为合法 JSON
- 若仅某个 MCP 不可用：
  - 单独执行其 `command + args` 观察报错
  - 修正后重启 Cursor 再次验证

## 5. 安全与维护建议

- 使用最小权限：`filesystem` 仅授权必要目录
- 不在文档和配置中写入个人身份信息、密钥、Token
- 每月复核一次 MCP 可用性与调用频率，低频项可降级维护优先级
