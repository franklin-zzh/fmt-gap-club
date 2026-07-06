import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { submissions as submissionsApi } from '@/api/entityApi';
import { FileText, Sparkles } from 'lucide-react';

export default function Reports() {
  const { user } = useOutletContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadReports();
  }, [user]);

  const loadReports = async () => {
    try {
      // Show completed submissions as reports (they contain AI recommendations)
      const subs = await submissionsApi.list();
      setReports(Array.isArray(subs) ? subs.filter(s => s.status === 'completed' || s.recommendations?.length > 0) : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Nutrition Reports</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>营养报告</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>查看您的专属营养分析报告与AI推荐方案。</p>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B705C' }}>加载中...</div>
      ) : reports.length === 0 ? (
        <div className="rounded-[32px] p-16 text-center" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(178,184,163,0.2)' }}>
            <FileText className="w-8 h-8" style={{ color: '#6B705C' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>暂无营养报告</h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#5C5C5C' }}>
            请先完善健康档案并提交健康数据，AI模型分析完成后将为您生成专属营养报告。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="rounded-[28px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
              <div className="p-8" style={{ borderBottom: '1px solid #E8D5B7' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" style={{ color: '#D4A373' }} />
                      <span className="text-xs tracking-[0.15em] uppercase font-light" style={{ color: '#6B705C' }}>AI Precision Report</span>
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>专属营养分析报告</h3>
                    <p className="text-xs mt-1" style={{ color: '#5C5C5C' }}>
                      生成于 {report.created_at ? new Date(report.created_at).toLocaleDateString('zh-CN') : ''}
                    </p>
                  </div>
                </div>
                {report.summary && (
                  <p className="text-sm leading-relaxed" style={{ color: '#5C5C5C' }}>{report.summary}</p>
                )}
              </div>

              {report.recommendations && report.recommendations.length > 0 && (
                <div className="p-8">
                  <h4 className="text-sm font-bold mb-5" style={{ color: '#2C2C2C' }}>推荐营养方案</h4>
                  <div className="space-y-4">
                    {report.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: '#F5F2EB' }}>
                        <div className="relative w-16 h-16 shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#E8D5B7" strokeWidth="5" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#D4A373" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28 * (rec.match_score || 0) / 100} ${2 * Math.PI * 28}`} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{rec.match_score || 0}%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold mb-1" style={{ color: '#2C2C2C' }}>{rec.product_name || '营养包'}</div>
                          <p className="text-xs leading-relaxed" style={{ color: '#5C5C5C' }}>{rec.reason || '基于您的健康档案与数据匹配推荐'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
