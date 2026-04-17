---
name: eastmoney-fund-api
description: Provides guidance for using Eastmoney Fund API endpoints (fundmobapi.eastmoney.com). Use when working with fund data APIs, fetching fund information, charts, or when the user asks about Eastmoney API usage, parameters, or data structures.
---

# Eastmoney Fund API

## Overview

This project uses **Eastmoney Fund Mobile API** (`https://fundmobapi.eastmoney.com/`) to fetch fund data including basic info, valuations, charts, holdings, and manager details.

## Base URLs

```
# 基金信息 API（净值、详情等）
https://fundmobapi.eastmoney.com/

# 实时估值 API（交易时段实时估值）
https://fundgz.1234567.com.cn/

# 基金详情数据 API（包含分时估值走势 Data_gzTrend）
https://fund.eastmoney.com/
```

## Quick Reference

### Common Parameters

**Wap Platform** (most APIs):

- `deviceid`: `"Wap"`
- `plat`: `"Wap"`
- `product`: `"EFund"`
- `version`: `"2.0.0"`
- `Uid`: `""` (empty string)
- `_`: timestamp (use `Date.now()` or `new Date().getTime()`)

**Android Platform** (FundMNFInfo only):

- `plat`: `"Android"`
- `appType`: `"ttjj"`
- `product`: `"EFund"`
- `Version`: `"1"`
- `deviceid`: user unique ID

## API Endpoints

### 0. 实时估值 API（推荐）- Real-time Fund Valuation

**Base URL**: `https://fundgz.1234567.com.cn/`

**Path**: `/js/{基金代码}.js`

**Purpose**: 获取基金交易时段的实时估值数据（最重要的实时数据接口）

**Parameters**:

- `rt`: 时间戳（防止缓存，使用 `Date.now()`）

**完整 URL 示例**:

```
https://fundgz.1234567.com.cn/js/000001.js?rt=1738460640000
```

**Response Format**: JSONP（需要解析）

```javascript
jsonpgz({
  fundcode: '000001',
  name: '华夏成长混合',
  jzrq: '2026-01-30',
  dwjz: '1.1670',
  gsz: '1.1539',
  gszzl: '-1.13',
  gztime: '2026-02-02 09:44',
})
```

**Fields**:

- `fundcode`: 基金代码
- `name`: 基金名称
- `jzrq`: 净值日期（上一个交易日）
- `dwjz`: 单位净值（上一个交易日收盘）
- `gsz`: **估算净值（实时）**
- `gszzl`: **估算涨跌幅（实时，百分比）**
- `gztime`: **估值时间（实时更新）**

**解析示例**:

```javascript
function parseJsonp(jsonpStr) {
  const match = jsonpStr.match(/jsonpgz\((.*)\);?/)
  if (match && match[1]) {
    return JSON.parse(match[1])
  }
  return null
}

// 使用
const response = await fetch(`https://fundgz.1234567.com.cn/js/000001.js?rt=${Date.now()}`)
const text = await response.text()
const data = parseJsonp(text)
// data.gsz = "1.1539" (实时估值)
// data.gszzl = "-1.13" (实时涨跌幅)
```

**重要说明**:

- 这是获取交易时段实时估值的**唯一可靠接口**
- `FundMNFInfo` 接口在交易时段 GSZ/GSZZL 字段返回 null
- 非交易时段（收盘后、节假日）返回最后一个交易日的数据
- 开发环境需配置代理解决跨域问题

**Usage**: `src/api/fund.ts` - `fetchFundList()` 函数

---

### 1. FundMNFInfo - Fund Basic Info List

**Path**: `/FundMNewApi/FundMNFInfo`

**Purpose**: Batch fetch fund basic information (code, name, NAV, valuation, etc.)

**Parameters**:

- `pageIndex`: `1`
- `pageSize`: `200`
- `plat`: `"Android"`
- `appType`: `"ttjj"`
- `product`: `"EFund"`
- `Version`: `"1"`
- `deviceid`: user unique ID
- `Fcodes`: fund codes (comma-separated, e.g., `"000001,000002"`)

**Response**: `res.data.Datas` - array of fund objects

**Fields**:

- `FCODE`: fund code
- `SHORTNAME`: fund name
- `NAV`: net asset value
- `GSZ`: estimated value
- `GSZZL`: estimated change percentage
- `NAVCHGRT`: NAV change percentage

**Usage locations**:

- `src/background.js` (line 162) - badge updates
- `src/popup/App.vue` (line 1030) - fund list
- `src/options/App.vue` (line 334) - data export

### 2. FundVarietieValuationDetail - Valuation Chart Data

**Path**: `/FundMApi/FundVarietieValuationDetail.ashx`

**Purpose**: Get real-time fund valuation data for charts

**⚠️ 重要限制**: 非指数类基金可能返回空数据（官方限制），建议使用 `pingzhongdata` 接口作为替代

**Parameters**:

- `FCODE`: fund code (required)
- `deviceid`: `"Wap"`
- `plat`: `"Wap"`
- `product`: `"EFund"`
- `version`: `"2.0.0"`
- `_`: timestamp

**Response**: `res.data.Datas` - string array, each element format: `"date,time,valuation"`

**Data parsing**:

```javascript
const data = res.data.Datas.map(item => item.split(','))
// Result: [["date", "time", "valuation"], ...]
```

**Usage**: `src/api/fund.ts` - `fetchValuationDetail()`

---

### 2.1 pingzhongdata - 基金详情数据（含分时估值走势）

**Base URL**: `https://fund.eastmoney.com/`

**Path**: `/pingzhongdata/{基金代码}.js`

**Purpose**: 获取基金完整数据，包括当日估值分时走势（Data_gzTrend）

**⭐ 推荐**: 这是获取分时估值走势的更可靠接口，支持更多基金类型

**Parameters**:

- `v`: 时间戳（防止缓存，使用 `Date.now()`）

**完整 URL 示例**:

```
https://fund.eastmoney.com/pingzhongdata/000001.js?v=1738460640000
```

**Response Format**: JavaScript 变量声明（需要正则提取）

```javascript
var fS_name = "华夏成长混合";
var fS_code = "000001";
var Data_gzTrend = [{"x":1738382820000,"y":1.1539},{"x":1738383420000,"y":1.1545},...];
var Data_netWorthTrend = [...];
// ... 更多数据
```

**关键字段**:

- `Data_gzTrend`: **当日估值分时走势（实时折线图数据）**
  - `x`: 时间戳（毫秒）
  - `y`: 估值
- `Data_netWorthTrend`: 历史净值走势
- `fS_name`: 基金名称
- `fS_code`: 基金代码

**解析示例**:

```javascript
function parsePingzhongData(jsContent) {
  const result = { gzTrend: [], fundName: '', fundCode: '' }

  // 提取 Data_gzTrend
  const gzTrendMatch = jsContent.match(/var\s+Data_gzTrend\s*=\s*(\[[\s\S]*?\]);/)
  if (gzTrendMatch && gzTrendMatch[1]) {
    result.gzTrend = JSON.parse(gzTrendMatch[1])
  }

  // 提取基金名称
  const nameMatch = jsContent.match(/var\s+fS_name\s*=\s*"([^"]+)"/)
  if (nameMatch) result.fundName = nameMatch[1]

  return result
}

// 使用
const response = await fetch(`https://fund.eastmoney.com/pingzhongdata/000001.js?v=${Date.now()}`)
const jsContent = await response.text()
const data = parsePingzhongData(jsContent)
// data.gzTrend = [{x: 时间戳, y: 估值}, ...]
```

**防抖建议**:

- 请求频率不宜过高，建议使用防抖（500ms+）
- 避免频繁请求导致 IP 被封

**Usage**: `src/api/fund.ts` - `fetchGzTrend()`, `fetchValuationDetailWithFallback()`

### 3. FundYieldDiagramNew - Yield Chart Data

**Path**: `/FundMApi/FundYieldDiagramNew.ashx`

**Purpose**: Get fund yield comparison chart data

**Parameters**:

- `FCODE`: fund code (required)
- `RANGE`: time range
  - `y`: 1 month
  - `3y`: 3 months (quarter)
  - `6y`: 6 months (half year)
  - `n`: 1 year
  - `3n`: 3 years
  - `5n`: 5 years
- `deviceid`: `"Wap"`
- `plat`: `"Wap"`
- `product`: `"EFund"`
- `version`: `"2.0.0"`
- `_`: timestamp

**Response**:

- `res.data.Datas` - yield data array
- `res.data.Expansion.INDEXNAME` - benchmark index name

**Fields**:

- `PDATE`: date
- `YIELD`: fund yield
- `INDEXYIED`: benchmark yield

**Usage**: `src/common/charts2.vue` (line 151, when `chartType == "LJSY"`)

### 4. FundNetDiagram - NAV Chart Data

**Path**: `/FundMApi/FundNetDiagram.ashx`

**Purpose**: Get fund NAV (net asset value) chart data

**Parameters**: Same as FundYieldDiagramNew (including `RANGE`)

**Response**: `res.data.Datas` - NAV data array

**Fields**:

- `FSRQ`: date
- `DWJZ`: unit NAV
- `LJJZ`: cumulative NAV
- `JZZZL`: daily growth rate

**Usage**: `src/common/charts2.vue` (line 185, when `chartType != "LJSY"`)

### 5. FundBaseTypeInformation - Fund Details

**Path**: `/FundMApi/FundBaseTypeInformation.ashx`

**Purpose**: Get detailed fund information (type, company, manager, scale, etc.)

**Parameters**:

- `FCODE`: fund code (required)
- `deviceid`: `"Wap"`
- `plat`: `"Wap"`
- `product`: `"EFund"`
- `version`: `"2.0.0"`
- `Uid`: `""`
- `_`: timestamp

**Response**: `res.data.Datas` - fund detail object

**Key fields**:

- `SYL_Y`, `SYL_3Y`, `SYL_6Y`, `SYL_1N`: yields (1m, 3m, 6m, 1y)
- `RANKM`, `RANKQ`, `RANKHY`, `RANKY`: rankings
- `DWJZ`, `LJJZ`: NAV values
- `FTYPE`: fund type
- `JJGS`: fund company
- `JJJL`: fund manager
- `ENDNAV`: fund scale

**Usage**: `src/common/fundInfo.vue` (line 96)

### 6. FundManagerList - Manager History

**Path**: `/FundMApi/FundManagerList.ashx`

**Purpose**: Get fund manager change history

**Parameters**: Same as FundBaseTypeInformation

**Response**: `res.data.Datas` - manager list array

**Fields**:

- `MGRID`: manager ID
- `MGRNAME`: manager name
- `FEMPDATE`: start date
- `LEMPDATE`: end date
- `DAYS`: tenure days
- `PENAVGROWTH`: tenure growth

**Usage**: `src/common/managerDetail.vue` (line 97)

### 7. FundMangerDetail - Manager Details

**Path**: `/FundMApi/FundMangerDetail.ashx`

**Purpose**: Get current manager detailed information

**Parameters**: Same as FundBaseTypeInformation

**Response**: `res.data.Datas` - manager detail array

**Fields**:

- `MGRID`: manager ID
- `MGRNAME`: manager name
- `PHOTOURL`: photo URL
- `FEMPDATE`: appointment date
- `DAYS`: management years
- `RESUME`: resume

**Usage**: `src/common/managerDetail.vue` (line 103)

### 8. FundMNInverstPosition - Fund Holdings

**Path**: `/FundMNewApi/FundMNInverstPosition`

**Purpose**: Get fund stock holdings information

**Parameters**: Same as FundBaseTypeInformation

**Response**:

- `res.data.Datas.fundStocks` - holdings array
- `res.data.Expansion` - cutoff date

**Fields**:

- `GPDM`: stock code
- `GPJC`: stock name
- `JZBL`: holding percentage
- `PCTNVCHG`: change from previous period
- `PCTNVCHGTYPE`: change type (new/reduced)

**Usage**: `src/common/positionDetail.vue` (line 84)

## Usage Patterns

### Making API Requests

```javascript
// Example: Fetch fund basic info
const params = {
  pageIndex: 1,
  pageSize: 200,
  plat: 'Android',
  appType: 'ttjj',
  product: 'EFund',
  Version: '1',
  deviceid: userId,
  Fcodes: '000001,000002',
}

const response = await fetch(
  `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?${new URLSearchParams(params)}`
)
const data = await response.json()
const funds = data.data.Datas
```

### Wap Platform Request

```javascript
// Example: Fetch fund details
const params = {
  FCODE: '000001',
  deviceid: 'Wap',
  plat: 'Wap',
  product: 'EFund',
  version: '2.0.0',
  Uid: '',
  _: Date.now(),
}

const response = await fetch(
  `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx?${new URLSearchParams(params)}`
)
const data = await response.json()
const fundInfo = data.data.Datas
```

## Important Notes

1. **实时估值 vs 净值数据**:
   - **实时估值**：使用 `fundgz.1234567.com.cn` API（交易时段实时更新）
   - **净值数据**：使用 `fundmobapi.eastmoney.com` API（T-1 数据，收盘后更新）
   - `FundMNFInfo` 接口的 GSZ/GSZZL 字段在交易时段返回 null，不能用于实时估值
2. **Timestamp parameter**: Most APIs use `_` or `rt` parameter with timestamp to prevent caching
3. **Device ID**:
   - Wap platform: fixed `"Wap"`
   - Android platform: user-generated unique ID
4. **Fund codes**: Multiple codes use comma separation: `"000001,000002"`
5. **Data parsing**:
   - Some APIs return string arrays that need splitting (e.g., `FundVarietieValuationDetail`)
   - 实时估值 API 返回 JSONP 格式，需要正则提取 JSON
6. **Error handling**: Always add proper error handling for API calls
7. **跨域问题**: 开发环境需要配置 Vite proxy，生产环境需要后端代理

## Complete Documentation

For complete API documentation including all parameters, response structures, and usage locations, see:

- `API_DOCUMENTATION.md` in project root
