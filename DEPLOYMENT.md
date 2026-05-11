# BizBroker AI - Vercel部署指南

## 方法一：Vercel Dashboard部署（推荐）

### 1. 访问Vercel
- 打开 https://vercel.com
- 使用GitHub账号登录（sight-saber）

### 2. 导入项目
1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 找到并选择 `sight-saber/bizbroker-ai-vercel`
4. 点击 "Import"

### 3. 配置项目

**Framework Preset:** Next.js（自动检测）

**Root Directory:** ./（默认）

**Build Command:** `npm run build`（自动）

**Output Directory:** .next（自动）

### 4. 配置环境变量

在 "Environment Variables" 部分添加以下变量：

#### 必需的环境变量：

```env
ANTHROPIC_API_KEY
```
值：`sk-ant-api03-xxxxxxxxxx-your-actual-key-here`

#### 可选的环境变量（暂时使用占位符）：

```env
AIRTABLE_API_KEY
```
值：`patTEMPORARY_PLACEHOLDER_KEY`

```env
AIRTABLE_BASE_ID
```
值：`appTEMPORARY_BASE_ID`

```env
RESEND_API_KEY
```
值：`re_TEMPORARY_PLACEHOLDER`

```env
RESEND_FROM_EMAIL
```
值：`noreply@bizbroker.local`

```env
ADMIN_EMAIL
```
值：`admin@bizbroker.local`

```env
NEXT_PUBLIC_APP_URL
```
值：`https://bizbroker-ai-vercel.vercel.app`（或Vercel分配的域名）

**注意：** NEXT_PUBLIC_APP_URL 在第一次部署后再设置（需要知道Vercel分配的域名）

### 5. 部署
1. 点击 "Deploy"
2. 等待构建完成（约2-3分钟）
3. 点击 "Visit" 查看部署结果

### 6. 获取部署URL
部署成功后，Vercel会提供一个URL，例如：
- `https://bizbroker-ai-vercel.vercel.app`
- 或 `https://bizbroker-ai-vercel-sight-saber.vercel.app`

### 7. 更新NEXT_PUBLIC_APP_URL
1. 复制部署URL
2. 在Vercel Dashboard → Settings → Environment Variables
3. 编辑 `NEXT_PUBLIC_APP_URL` 的值
4. 在 Deployments 页面点击 "Redeploy"

---

## 方法二：Vercel CLI部署

### 1. 安装Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录Vercel
```bash
vercel login
```

### 3. 首次部署
```bash
vercel
```

按提示操作：
- Set up and deploy? `Y`
- Which scope? 选择你的账号
- Link to existing project? `N`
- Project name? `bizbroker-ai` 或默认
- Directory? `./`
- Override settings? `N`

### 4. 添加环境变量
```bash
vercel env add ANTHROPIC_API_KEY production
# 粘贴你的API key

vercel env add AIRTABLE_API_KEY production
# 输入：patTEMPORARY_PLACEHOLDER_KEY

vercel env add AIRTABLE_BASE_ID production
# 输入：appTEMPORARY_BASE_ID

vercel env add RESEND_API_KEY production
# 输入：re_TEMPORARY_PLACEHOLDER

vercel env add RESEND_FROM_EMAIL production
# 输入：noreply@bizbroker.local

vercel env add ADMIN_EMAIL production
# 输入：admin@bizbroker.local

vercel env add NEXT_PUBLIC_APP_URL production
# 输入：你的Vercel URL
```

### 5. 生产部署
```bash
vercel --prod
```

---

## 部署后验证

### 1. 检查主页
访问你的Vercel URL，应该看到：
- ✅ 5个AI Agent卡片
- ✅ 动画效果正常
- ✅ 响应式设计

### 2. 测试AI对话
点击任意Agent卡片：
- ✅ 对话功能正常
- ✅ Claude API响应
- ✅ Markdown渲染

### 3. 检查Dashboard
访问 `/dashboard`：
- ✅ UI正常显示
- ⚠️ 数据为空（预期，因为未配置Airtable）

---

## 故障排查

### 构建失败
**检查：**
- Environment Variables是否正确设置
- ANTHROPIC_API_KEY是否有效
- Build logs中的具体错误

### API错误
**Airtable 404错误（预期）：**
- 这是正常的，因为使用了占位符
- AI功能不受影响
- 配置真实Airtable后会消失

**Claude API错误：**
- 检查ANTHROPIC_API_KEY是否正确
- 检查API配额

### 页面无法访问
- 等待部署完全完成
- 清除浏览器缓存
- 检查Vercel状态页面

---

## 配置Airtable（可选，之后进行）

### 1. 创建Airtable Base
参考 `airtable-setup-guide.md`

### 2. 更新Vercel环境变量
1. 进入 Vercel Dashboard
2. Settings → Environment Variables
3. 编辑 `AIRTABLE_API_KEY` 和 `AIRTABLE_BASE_ID`
4. 填入真实值
5. Redeploy

### 3. 配置Resend邮件（可选）
1. 注册 https://resend.com
2. 获取API Key
3. 更新Vercel环境变量
4. Redeploy

---

## 性能优化

### 已启用的优化
- ✅ Vercel新加坡节点 (sin1)
- ✅ API超时30秒
- ✅ 静态页面生成
- ✅ 代码分割
- ✅ 图片优化

### 监控
- Vercel Analytics（自动）
- Vercel Speed Insights（可选）

---

## 域名配置（可选）

### 自定义域名
1. 在Vercel Dashboard → Settings → Domains
2. 添加你的域名（例如：bizbroker.sg）
3. 按提示配置DNS记录
4. 等待SSL证书生成

---

## 持续部署

每次推送到GitHub的main分支时：
- ✅ 自动触发部署
- ✅ 构建新版本
- ✅ 自动上线

### 测试分支
推送到其他分支会创建预览部署，不影响生产环境。

---

## 成本

### Vercel免费套餐包含
- 100GB带宽/月
- 无限部署
- 自动HTTPS
- 全球CDN

### 升级Pro（如需要）
- ~USD 20/月
- 更高带宽
- 更多并发构建
- 优先支持

---

**部署文档版本：** v1.0
**更新日期：** 2026-05-11
**项目：** BizBroker AI
