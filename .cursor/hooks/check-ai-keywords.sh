#!/usr/bin/env bash

# 检查 AI 输出中是否出现“高风险变量名声明”。
# 仅记录日志提示，不阻断生成，避免影响正常代码产出。

set -u

input="$(cat)"
text="$(printf '%s' "$input" | jq -r '.text // ""')"

# 前端常见易引发歧义/冲突的变量名（仅在变量声明场景检测）
RISKY_VAR_NAMES=(
  "event"
  "name"
  "status"
  "location"
  "history"
  "top"
  "self"
  "parent"
  "frames"
  "length"
  "window"
  "document"
  "navigator"
  "screen"
  "origin"
  "nodeName"
  "action"
  "method"
)

matched=()
for var_name in "${RISKY_VAR_NAMES[@]}"; do
  # 只检测变量声明，避免普通文本中出现关键词导致误报
  if printf '%s' "$text" | rg -i --multiline --quiet -- "(const|let|var)[[:space:]]+${var_name}[[:space:]]*="; then
    matched+=("$var_name")
  fi
done

if [ ${#matched[@]} -gt 0 ]; then
  mkdir -p .cursor/hooks/logs
  ts="$(date '+%Y-%m-%d %H:%M:%S')"
  {
    printf '[%s] 命中高风险变量名声明: %s\n' "$ts" "$(IFS=', '; echo "${matched[*]}")"
    printf '---\n'
    printf '%s\n' "$text"
    printf '\n\n'
  } >> .cursor/hooks/logs/ai-keyword-alert.log
fi

# afterAgentResponse 当前不消费输出，返回空对象即可（不阻断）
printf '{}\n'
