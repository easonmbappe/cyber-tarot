'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// 引入数据 (确保路径对，如果报错试试改用 ../data/tarot-data)
import { FULL_TAROT_DECK, TAROT_CARDS_LIST } from '@/data/tarot-data';

// 引入你刚才写的背景组件 (确保路径对，如果报错试试改用 ../components/CosmicBackground)
import CosmicBackground from '../components/CosmicBackground';

export default function Home() {
  // 定义状态
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickedCards, setPickedCards] = useState<string[]>([]);

  // 核心占卜逻辑
  const startDivination = async () => {
    if (!question.trim()) {
      alert("请先默念你的问题，心诚则灵...");
      return;
    }

    setLoading(true);
    setResult("");
    setPickedCards([]);

    // 洗牌算法
    const shuffled = [...TAROT_CARDS_LIST].sort(() => 0.5 - Math.random());
    // 抽 3 张
    const picked = shuffled.slice(0, 3);
    setPickedCards(picked);

    try {
      // 调用后端 API
      const res = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cards: picked
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setResult(data.result);
    } catch (e) {
      console.error(e);
      setResult("🔮 宇宙信号收到强烈干扰，请稍后再试...");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 最外层容器：设置相对定位(relative)和隐藏溢出(overflow-hidden)
    <div className="min-h-screen bg-[#050505] text-purple-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden relative">

      {/* 1. 放置宇宙背景组件 */}
      {/* 它内部是 fixed/absolute 定位，会自己沉在底下 */}
      <CosmicBackground />

      {/* 2. 内容容器：关键是 z-10 和 relative */}
      {/* 这样才能确保按钮和输入框在星星上面，可以被点击 */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">

          {/* === 标题区 === */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
              CYBER TAROT
            </h1>
            <p className="text-gray-500 tracking-[0.5em] text-xs md:text-sm uppercase">
              Driven Destiny
            </p>
          </div>

          {/* === 交互区 === */}
          <div className="w-full max-w-2xl flex flex-col md:flex-row gap-3 mb-12">
            <input
              type="text"
              placeholder="在此输入你心中的困惑 (例如: 我最近的财运如何?)"
              className="flex-1 p-4 rounded-xl bg-gray-900/80 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-lg transition-all placeholder-gray-600 backdrop-blur-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && startDivination()}
            />
            <button
              onClick={startDivination}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "正在连接..." : "开始占卜"}
            </button>
          </div>

          {/* === 卡牌展示区 === */}
          {pickedCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
              {pickedCards.map((cardName, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative w-48 aspect-[3/5] rounded-lg overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/80 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <img
                      src={FULL_TAROT_DECK[cardName]}
                      alt={cardName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  </div>
                  <span className="mt-4 text-sm font-bold text-purple-300 tracking-wider group-hover:text-white transition-colors">
                    {cardName}
                  </span>
                  <span className="text-xs text-gray-600 uppercase mt-1">
                    {['Past', 'Present', 'Future'][index]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* === AI 解读结果区 === */}
          {result && (
            <div className="w-full bg-gray-900/60 border border-purple-500/30 p-8 md:p-10 rounded-2xl backdrop-blur-md shadow-2xl animate-in fade-in duration-1000">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                <span className="text-2xl">🔮</span>
                <h2 className="text-xl font-bold text-white">解读报告</h2>
              </div>
              <article className="prose prose-invert prose-purple max-w-none prose-p:leading-relaxed prose-headings:text-purple-300 prose-strong:text-pink-400">
                <ReactMarkdown>{result}</ReactMarkdown>
              </article>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}