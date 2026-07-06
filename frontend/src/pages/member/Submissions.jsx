import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { submissions as submissionsApi } from '@/api/entityApi';
import { UploadCloud, FileText, CheckCircle, Clock, Loader } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: '待处理', icon: Clock, color: '#D4A373' },
  processing: { label: '分析中', icon: Loader, color: '#6B705C' },
  completed: { label: '已完成', icon: CheckCircle, color: '#B2B8A3' },
  rejected: { label: '已驳回', icon: Clock, color: '#c0392b' },
};

export default function Submissions() {
  const { user } = useOutletContext();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    try {
      const subs = await submissionsApi.list();
      setSubmissions(Array.isArray(subs) ? subs : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('answers', JSON.stringify({ notes }));
      await submissionsApi.create(formData);
      setNotes('');
      loadSubmissions();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Data Submission</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>数据提交</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>上传您的健康检测报告、体检数据或样本信息，AI模型将为您生成专属营养方案。</p>
      </div>

      <div
        className="rounded-[32px] p-12 mb-8 cursor-pointer transition-all"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        style={{
          background: dragOver ? 'rgba(178,184,163,0.15)' : '#F5F2EB',
          border: `2px dashed ${dragOver ? '#6B705C' : '#E8D5B7'}`,
        }}
      >
        <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: '#6B705C' }}>
            <UploadCloud className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>
            {uploading ? '正在上传...' : '拖拽文件到此处或点击上传'}
          </h3>
          <p className="text-sm" style={{ color: '#5C5C5C' }}>支持 PDF、JPG、PNG、DOC 格式，最大 25MB</p>
        </div>
      </div>

      <div className="rounded-[24px] p-6 mb-8" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
        <label className="text-sm font-medium block mb-3" style={{ color: '#2C2C2C' }}>补充说明（可选）</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="请描述您的健康状况、检测项目或特殊需求..."
          className="w-full p-4 rounded-2xl text-sm resize-none"
          style={{ background: '#F5F2EB', border: '1px solid #E8D5B7', color: '#2C2C2C', minHeight: '100px' }}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#2C2C2C' }}>提交记录</h2>
        {loading ? (
          <div className="text-center py-10" style={{ color: '#6B705C' }}>加载中...</div>
        ) : submissions.length === 0 ? (
          <div className="rounded-[24px] p-12 text-center" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
            <FileText className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: '#6B705C' }} />
            <p className="text-sm" style={{ color: '#5C5C5C' }}>暂无提交记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const config = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
              const Icon = config.icon;
              return (
                <div key={sub.id} className="rounded-[20px] p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(178,184,163,0.15)' }}>
                    <FileText className="w-5 h-5" style={{ color: '#6B705C' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-CN') : ''}
                      {sub.summary ? ` · ${sub.summary}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
