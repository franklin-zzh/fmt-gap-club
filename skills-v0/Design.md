# Precision Nutrition MVP - Visual & UX Specification (Design.md)

## 1. 品牌定位与调性 (Brand Positioning)
* **核心定位**：高端生物科技、精准定制、值得绝对信赖的每日健康管理。
* **设计原则**：去繁从简（Minimalism）、社论感排版（Editorial Layout）、精密感。
* **绝对禁止（去AI感）**：
    * 禁止使用大面积的刺眼霓虹渐变色（典型AI风格）。
    * 禁止使用泛滥的糖果色 3D 浮空图标。
    * 禁止使用毫无逻辑的“毛玻璃（Glassmorphism）”堆叠。

## 2. 色彩系统 (Color Palette)
* **主色 (Primary)**：深邃墨绿 `#0A2F1D` (代表生命力、高科技萃取、极高信任度)
* **辅助色 (Accent)**：香槟哑金 `#D4AF37` 或 科技钛银 `#E5E7EB` (用于强调会员尊贵感、精密感)
* **背景色 (Background)**：纯白 `#FFFFFF` 与 柔和浅灰 `#F9FAFB` 交替，留白率保持在 40% 以上。
* **文本色 (Text)**：深炭黑 `#111827` (确保极佳的可读性)

## 3. 字体与排版 (Typography & Layout)
* **字体选择**：英文优先使用 Inter / Playfair Display (大标题社论感)，中文优先使用 兰亭黑 / 苹方。
* **信息架构 (以“10种营养包”展示为例)**：
    * 拒绝传统的 10 宫格网状死板排列。
    * 采用 **3+3+4 错落式不对称网格 (Asymmetric Grid)**，或**大图横向平滑滚动卡片 (Horizontal Carousel)**。
    * 每种营养包只突出 1 个最核心的生物学标签（如：高纯度、高吸收率），点击后展示微动效翻转。

## 4. 付费黄金路径 (The Paid Happy Path)
* **极简原则**：从游客到支付成功，链路控制在 3 次点击以内。
* **步骤设计**：
    1.  [Landing Page] 情感共鸣与科技背书 -> 点击“定制我的营养包”
    2.  [Drawer/弹窗] 动态套餐选择（月付/季付/年付）及核心权益对比（拒绝跳转新页面，降低流失率）
    3.  [Checkout UI] 极简标准支付组件（Stripe/微信/支付宝），剔除所有无关干扰元素。