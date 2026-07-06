import { useState, useEffect } from 'react';
import { articles as articlesApi } from '@/api/entityApi';
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { value: 'knowledge', label: '知识库' },
  { value: 'research', label: '科研文献' },
];

// Map frontend form fields to backend
function toBackendArticle(data) {
  return {
    title: data.title,
    category: data.category || 'knowledge',
    summary: data.summary || '',
    content: data.content || '',
    published_at: data.publish_date ? new Date(data.publish_date).toISOString() : null,
  };
}

export default function AdminKnowledge() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const arts = await articlesApi.list();
      setArticles(arts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      const backendData = toBackendArticle(data);
      if (editing) {
        await articlesApi.update(editing.id, backendData);
      } else {
        await articlesApi.create(backendData);
      }
      setShowForm(false);
      setEditing(null);
      loadArticles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除此文章？')) return;
    try {
      await articlesApi.delete(id);
      loadArticles();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Knowledge Management</span>
          <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>知识库管理</h1>
          <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>管理公开技术知识库、科研文献与白皮书内容。</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: '#6B705C' }}
        >
          <Plus className="w-4 h-4" /> 新增文章
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B705C' }}>加载中...</div>
      ) : articles.length === 0 ? (
        <div className="rounded-[24px] p-16 text-center" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
          <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: '#6B705C' }} />
          <p className="text-sm" style={{ color: '#5C5C5C' }}>暂无文章，点击右上角新增</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => {
            const catLabel = CATEGORIES.find((c) => c.value === a.category)?.label || a.category;
            return (
              <div key={a.id} className="rounded-[20px] p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(178,184,163,0.15)' }}>
                  <BookOpen className="w-5 h-5" style={{ color: '#6B705C' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,163,115,0.15)', color: '#D4A373' }}>
                      {catLabel}
                    </span>
                  </div>
                  <div className="text-sm font-medium truncate" style={{ color: '#2C2C2C' }}>{a.title}</div>
                  <div className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                    {a.published_at ? new Date(a.published_at).toLocaleDateString('zh-CN') : ''}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditing(a); setShowForm(true); }} className="p-2.5 rounded-full" style={{ background: 'rgba(178,184,163,0.15)', color: '#6B705C' }}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-2.5 rounded-full" style={{ background: 'rgba(192,57,43,0.1)', color: '#c0392b' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ArticleForm article={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function ArticleForm({ article, onSave, onClose }) {
  const [data, setData] = useState({
    title: article?.title || '',
    category: article?.category || 'knowledge',
    summary: article?.summary || '',
    content: article?.content || '',
    publish_date: article?.publish_date || article?.published_at || new Date().toISOString().split('T')[0],
  });

  const inputStyle = { background: '#F5F2EB', border: '1px solid #E8D5B7', borderRadius: '12px', padding: '12px 16px', color: '#2C2C2C', fontSize: '14px', width: '100%' };
  const labelStyle = { color: '#6B705C', fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] p-8" style={{ background: '#FDFBF7' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{article ? '编辑文章' : '新增文章'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" style={{ color: '#2C2C2C' }} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>标题</label>
            <input style={inputStyle} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>分类</label>
              <select style={inputStyle} value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>发布日期</label>
              <input type="date" style={inputStyle} value={typeof data.publish_date === 'string' ? data.publish_date.split('T')[0] : data.publish_date} onChange={(e) => setData({ ...data, publish_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>摘要</label>
            <textarea style={{ ...inputStyle, minHeight: '70px' }} value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>正文内容</label>
            <textarea style={{ ...inputStyle, minHeight: '150px' }} value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-full text-sm font-medium" style={{ background: 'rgba(178,184,163,0.15)', color: '#2C2C2C' }}>取消</button>
          <button onClick={() => onSave(data)} className="flex-1 py-3 rounded-full text-sm font-medium text-white" style={{ background: '#6B705C' }}>保存</button>
        </div>
      </div>
    </div>
  );
}
