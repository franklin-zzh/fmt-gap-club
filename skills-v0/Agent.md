# Precision Nutrition MVP - Orchestrator Protocol (Agent.md)

## 1. 角色定位
作为全栈项目的主控官，自身不具备任何具体的代码编写或文案创作逻辑。你的唯一职责是**管理状态机、顺序调度外部 Skill 文件、并在节点间进行严苛的审计拦截**。

## 2. 核心状态机与调度链路

任何阶段的推进必须以前置 Skill 的成功交付为前提：

1.  **[Init] 启动阶段**：装载 `Design.md` 规范作为全局全局变量。
2.  **[Step 0] 风格对齐**：调用外部 `Style_Alignment_Skill.md`。必须获得用户对某一风格的“确立”指令，否则无限循环该 Skill。
3.  **[Step 1] 结构规划**：调用外部 `Product_Design_Skill.md`。结合 Step 0 确立的风格参数，输出落地页架构与文案。
4.  **[Audit A] 视觉审计**：主控官依据 `Design.md` 对设计产出进行红线审计，通过后解锁 Step 2。
5.  **[Step 2] 并行工程**：
    *   向左派发任务：调用外部 `Frontend_Dev_Skill.md`（传入 Step 0 & 1 成果）。
    *   向右派发任务：调用外部 `Backend_Dev_Skill.md`。
6.  **[Step 3] 闭环联调**：控制前后端进行接口挂载与 Stripe/微信支付 Webhook 的安全闭环测试。
7.  **[Done] 交付阶段**：全面清点代码，完成 MVP 交付。