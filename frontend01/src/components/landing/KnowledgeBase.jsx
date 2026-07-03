import { motion } from 'framer-motion';
import { FileText, ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BOTANICAL_IMG = 'https://media.base44.com/images/public/6a3ceb81f16bfca94f3c8790/6137ae0e4_generated_image.png';

const CATEGORY_LABELS = {
  knowledge: '知识库',
  research: '科研文献',
  knowledge_base: '知识库',
  scientific_literature: '科研文献',
  whitepaper: '技术白皮书',
  case_study: '案例研究',
};

const DEFAULT_ARTICLES = [
  {
    title: '肠道微生态与精准营养：从菌群到个性化干预',
    category: 'whitepaper',
    summary: '系统阐述肠道菌群如何影响营养吸收与代谢，以及基于微生态检测的个性化营养干预策略。',
    author: 'FMT研究院',
    publish_date: '2025-03-15',
  },
  {
    title: '维生素D与免疫调节：一项基于10万样本的队列研究',
    category: 'scientific_literature',
    summary: '大规模队列研究证实维生素D水平与呼吸道感染风险呈显著负相关，为免疫营养包配方提供循证依据。',
    author: 'Nature Reviews Immunology',
    publish_date: '2025-02-28',
  },
  {
    title: 'AI驱动的营养推荐系统：算法架构与临床验证',
    category: 'knowledge_base',
    summary: '深度解析FMT微生态AI匹配引擎的技术架构，以及在前瞻性临床研究中的推荐准确率验证结果。',
    author: 'FMT技术团队',
    publish_date: '2025-01-20',
  },
];

export default function KnowledgeBase({ articles, loading }) {
  // Map backend field names, fall back to defaults
  const displayArticles = Array.isArray(articles) && articles.length > 0
    ? articles.slice(0, 3).map(a => ({
        ...a,
        category: a.category || 'knowledge',
        author: a.author || '',
        publish_date: a.publish_date || a.published_at ? new Date(a.published_at).toLocaleDateString('zh-CN') : '',
      }))
    : DEFAULT_ARTICLES;

  return (
    <section id="knowledge" className="relative py-32 md:py-40" style={{ background: '#FDFBF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>
            Knowledge & Research
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] mt-5 mb-6" style={{ color: '#2C2C2C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
            知识库 · 科研文献
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#5C5C5C' }}>
            透明、可溯源的科学证据体系。每一份推荐背后，都有严谨的科研支撑。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {displayArticles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-[24px] p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(107, 112, 92, 0.2)', boxShadow: '0 4px 24px rgba(108,112,92,0.04)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(178,184,163,0.15)', color: '#6B705C' }}
                >
                  {CATEGORY_LABELS[article.category] || article.category}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: '#6B705C' }} />
              </div>
              <h3 className="text-base font-bold mb-3 leading-snug" style={{ color: '#2C2C2C' }}>
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#5C5C5C' }}>
                {article.summary}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6B705C' }}>
                <FileText className="w-3 h-3" />
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.publish_date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] overflow-hidden grid md:grid-cols-2 items-center"
          style={{ background: '#F5F2EB', border: '1px solid rgba(107, 112, 92, 0.2)' }}
        >
          <div className="p-10 md:p-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6B705C' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>
                Technical Whitepaper
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] mb-4" style={{ color: '#2C2C2C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>>
              技术白皮书 · 透明可信
            </h3>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#5C5C5C' }}>
              我们公开核心算法逻辑、知识库构建方法论与临床验证数据。加入会员，获取完整技术白皮书与个性化营养方案。
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: '#6B705C' }}
            >
              获取白皮书 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="h-64 md:h-full relative">
            <img src={BOTANICAL_IMG} alt="科研原料" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}