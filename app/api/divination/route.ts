import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化客户端
const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL,
});

export async function POST(req: Request) {
  try {
    // --- 新增调试代码 Start ---
  console.log("正在尝试占卜...");
  console.log("API_KEY 状态:", process.env.AI_API_KEY ? "✅ 已读取" : "❌ 未读取 (是 undefined)");
  console.log("BASE_URL:", process.env.AI_BASE_URL);
  // --- 新增调试代码 End ---
    // 1. 解析前端传来的数据
    const { question, cards } = await req.json();

    console.log("收到请求:", { question, cards }); // 方便你在控制台看日志

    // 2. 准备 Prompt (提示词)
    const systemPrompt = `
      你是一位赛博朋克风格的塔罗牌占卜师。
      你的用户是现代年轻人，请用“一针见血”且带点“冷幽默”的语气解读。
      
      规则：
      1. 解读用户抽到的牌：${cards.join(', ')}。
      2. 结合用户的问题：${question}。
      3. 输出格式要清晰，分三段：【牌面解析】、【当下指引】、【未来预示】。
      4. 不要长篇大论，控制在 300 字以内。
    `;

    // 3. 调用 AI
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "开始占卜" }, // 这里可以简单触发
      ],
    });

    const reply = completion.choices[0].message.content;

    // 4. 返回结果
    return NextResponse.json({ result: reply });

  } catch (error) {
    console.error("AI 调用失败:", error);
    return NextResponse.json({ error: "与母体连接中断..." }, { status: 500 });
  }
}