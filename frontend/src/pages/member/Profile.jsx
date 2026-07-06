import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { profiles as profilesApi } from '@/api/entityApi';
import { Save, Check } from 'lucide-react';

const HEALTH_GOALS = ['增强免疫', '改善睡眠', '体重管理', '肠道健康', '运动恢复', '抗衰老', '情绪平衡', '心血管健康'];
const LIFESTYLE_TAGS = ['久坐办公', '规律运动', '经常出差', '熬夜频繁', '素食主义', '高强度工作', '育儿期', '退休生活'];

// Map backend profile to frontend form
function toFrontendProfile(backend) {
  return {
    id: backend.id,
    gender: backend.gender || 'male',
    age: backend.age || '',
    height: backend.height || '',
    weight: backend.weight || '',
    health_goals: backend.health_goals || [],
    lifestyle_tags: backend.lifestyle_tags || [],
    allergies: backend.allergies || '',
    medical_conditions: backend.medical_history || '',
  };
}

// Map frontend form to backend
function toBackendProfile(form) {
  return {
    gender: form.gender || '',
    age: form.age ? Number(form.age) : null,
    height: form.height ? Number(form.height) : null,
    weight: form.weight ? Number(form.weight) : null,
    health_goals: form.health_goals || [],
    lifestyle_tags: form.lifestyle_tags || [],
    allergies: form.allergies || '',
    medical_history: form.medical_conditions || '',
  };
}

export default function Profile() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const backendProfile = await profilesApi.get();
      setProfile(toFrontendProfile(backendProfile));
    } catch (e) {
      console.error(e);
      setProfile({
        gender: 'male',
        age: '',
        height: '',
        weight: '',
        health_goals: [],
        lifestyle_tags: [],
        allergies: '',
        medical_conditions: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setProfile({ ...profile, [field]: value });

  const toggleArrayItem = (field, value) => {
    const arr = profile[field] || [];
    update(field, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await profilesApi.update(toBackendProfile(profile));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20" style={{ color: '#6B705C' }}>加载中...</div>;
  if (!profile) return null;

  const inputStyle = { background: '#FFFFFF', border: '1px solid #E8D5B7', borderRadius: '12px', padding: '12px 16px', color: '#2C2C2C', fontSize: '14px', width: '100%' };
  const labelStyle = { color: '#6B705C', fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', letterSpacing: '0.05em' };

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Health Profile</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>健康档案</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>完善您的个人健康信息，AI模型将基于此为您匹配最精准的营养方案。</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[24px] p-8" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#2C2C2C' }}>基本信息</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>性别</label>
              <select style={inputStyle} value={profile.gender || 'male'} onChange={(e) => update('gender', e.target.value)}>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>年龄</label>
              <input type="number" style={inputStyle} value={profile.age || ''} onChange={(e) => update('age', parseInt(e.target.value) || '')} placeholder="请输入年龄" />
            </div>
            <div>
              <label style={labelStyle}>身高 (cm)</label>
              <input type="number" style={inputStyle} value={profile.height || ''} onChange={(e) => update('height', parseInt(e.target.value) || '')} placeholder="请输入身高" />
            </div>
            <div>
              <label style={labelStyle}>体重 (kg)</label>
              <input type="number" style={inputStyle} value={profile.weight || ''} onChange={(e) => update('weight', parseInt(e.target.value) || '')} placeholder="请输入体重" />
            </div>
            <div>
              <label style={labelStyle}>过敏信息</label>
              <input style={inputStyle} value={profile.allergies || ''} onChange={(e) => update('allergies', e.target.value)} placeholder="如有过敏请填写" />
            </div>
            <div>
              <label style={labelStyle}>病史信息</label>
              <input style={inputStyle} value={profile.medical_conditions || ''} onChange={(e) => update('medical_conditions', e.target.value)} placeholder="如有病史请填写" />
            </div>
          </div>
        </div>

        <TagSection title="健康目标" options={HEALTH_GOALS} selected={profile.health_goals || []} onToggle={(v) => toggleArrayItem('health_goals', v)} />
        <TagSection title="生活方式" options={LIFESTYLE_TAGS} selected={profile.lifestyle_tags || []} onToggle={(v) => toggleArrayItem('lifestyle_tags', v)} />

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#6B705C' }}
          >
            {saved ? <><Check className="w-4 h-4" /> 已保存</> : <><Save className="w-4 h-4" /> {saving ? '保存中...' : '保存档案'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function TagSection({ title, options, selected, onToggle }) {
  return (
    <div className="rounded-[24px] p-8" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
      <h2 className="text-lg font-bold mb-6" style={{ color: '#2C2C2C' }}>{title}</h2>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: isSelected ? '#6B705C' : 'rgba(178,184,163,0.12)',
                color: isSelected ? '#FFFFFF' : '#2C2C2C',
                border: isSelected ? '1px solid #6B705C' : '1px solid #E8D5B7',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
