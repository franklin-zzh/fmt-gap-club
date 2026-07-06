import { useState, useEffect } from 'react';
import { users as usersApi } from '@/api/entityApi';
import { Search, Users } from 'lucide-react';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const users = await usersApi.list();
      setMembers(users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(
    (m) => !search || (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Member Management</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>会员管理</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>查看与管理所有注册会员。</p>
      </div>

      <div className="rounded-[24px] p-4 mb-6 flex items-center gap-3" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
        <Search className="w-4 h-4 ml-2" style={{ color: '#6B705C' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索邮箱..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: '#2C2C2C' }}
        />
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B705C' }}>加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] p-16 text-center" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
          <Users className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: '#6B705C' }} />
          <p className="text-sm" style={{ color: '#5C5C5C' }}>暂无会员</p>
        </div>
      ) : (
        <div className="rounded-[24px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #E8D5B7', background: '#F5F2EB' }}>
                <th className="text-left text-xs font-semibold px-6 py-4" style={{ color: '#6B705C' }}>邮箱</th>
                <th className="text-left text-xs font-semibold px-6 py-4" style={{ color: '#6B705C' }}>角色</th>
                <th className="text-left text-xs font-semibold px-6 py-4" style={{ color: '#6B705C' }}>状态</th>
                <th className="text-left text-xs font-semibold px-6 py-4" style={{ color: '#6B705C' }}>注册时间</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #E8D5B7' }}>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>{m.email || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: m.role === 'admin' ? 'rgba(212,163,115,0.15)' : 'rgba(178,184,163,0.15)', color: m.role === 'admin' ? '#D4A373' : '#6B705C' }}>
                      {m.role === 'admin' ? '管理员' : '会员'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${m.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {m.is_active ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#5C5C5C' }}>
                    {m.created_at ? new Date(m.created_at).toLocaleDateString('zh-CN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
