'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// 简化的牌库映射 (实际项目可以完善78张)
// 这里使用 sacred-texts 的公开 CDN
const TAROT_IMAGES: Record<string, string> = {
  "愚人": "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg",
  "魔术师": "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg",
  "女祭司": "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg",
  "皇后": "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg",
  "皇帝": "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg",
  "教皇": "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg",
  "恋人": "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg",
  "战车": "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg",
  "力量": "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg",
  "隐士": "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg",
  "命运之轮": "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg",
  "正义": "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg",
  "倒吊人": "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg",
  "死神": "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg",
  "节制": "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg",
  "恶魔": "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg",
  "高塔": "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg",
  "星星": "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg",
  "月亮": "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg",
  "太阳": "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg",
  "审判": "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg",
  "世界": "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg",
};

const CARDS_POOL = Object.keys(TAROT_IMAGES);

export default function Home() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickedCards, setPickedCards] = useState<string[]>([]);

  const startDivination = async () => {
    if (!question.trim()) return alert("请先默念你的问题...");
    setLoading(true);
    setResult("");
    setPickedCards([]);

    // 1. 随机抽3张
    const shuffled = [...CARDS_POOL].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3);
    setPickedCards(picked);

    try {
      const res = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cards: picked }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e) {
      setResult("🔮 信号干扰，请重试...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-purple-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          CYBER TAROT
        </h1>
        <p className="text-gray-500 mb-8 tracking-widest">AI DRIVEN DESTINY</p>

        {/* 输入区 */}
        <div className="w-full flex gap-2 mb-10">
          <input 
            type="text" 
            placeholder="在此输入你的困惑..."
            className="flex-1 p-4 rounded-xl bg-gray-900/50 border border-gray-800 focus:border-purple-500 outline-none text-lg transition-all"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startDivination()}
          />
          <button 
            onClick={startDivination}
            disabled={loading}
            className="px-8 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "连接中..." : "占卜"}
          </button>
        </div>

        {/* 卡牌展示区 */}
        {pickedCards.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 w-full">
            {pickedCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center animate-in fade-in zoom-in duration-700" style={{animationDelay: `${index * 150}ms`}}>
                <div className="relative w-full aspect-[3/5] rounded-lg overflow-hidden border-2 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform">
                  <img 
                    src={TAROT_IMAGES[card]} 
                    alt={card} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-3 text-sm font-bold text-purple-300">{card}</span>
              </div>
            ))}
          </div>
        )}

        {/* 结果区 (Markdown渲染) */}
        {result && (
          <div className="w-full bg-gray-900/60 border border-purple-500/20 p-8 rounded-2xl backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-10">
            <article className="prose prose-invert prose-purple max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}