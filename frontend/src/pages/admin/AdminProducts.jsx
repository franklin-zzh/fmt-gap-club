import { useState, useEffect } from 'react';
import { products as productsApi } from '@/api/entityApi';
import { Plus, Pencil, Trash2, X, Package, Upload } from 'lucide-react';

const CATEGORIES = [
  { value: 'growth', label: '儿童成长' },
  { value: 'vitality', label: '青少年活力' },
  { value: 'balance', label: '女性平衡' },
  { value: 'energy', label: '男性能量' },
  { value: 'maternal', label: '孕产营养' },
  { value: 'senior', label: '银发健康' },
  { value: 'recovery', label: '运动恢复' },
  { value: 'gut', label: '肠道微生态' },
  { value: 'immune', label: '免疫守护' },
  { value: 'sleep', label: '安神助眠' },
];

// Map frontend form fields to backend API fields
function toBackendProduct(data) {
  return {
    name: data.name,
    subtitle: data.subtitle || '',
    description: data.description || '',
    target_group: data.target_audience || '',
    tags: data.bio_markers || [],
    image_url: data.image_url || '',
    order_index: data.order || 0,
  };
}

// Map backend API response to frontend form fields
function toFrontendProduct(prod) {
  return {
    id: prod.id,
    name: prod.name,
    subtitle: prod.subtitle || '',
    description: prod.description || '',
    target_audience: prod.target_group || '',
    bio_markers: prod.tags || [],
    image_url: prod.image_url || '',
    category: prod.category || 'growth',
    order: prod.order_index || 0,
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const prods = await productsApi.list();
      setProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      const backendData = toBackendProduct(data);
      if (editing) {
        await productsApi.update(editing.id, backendData);
      } else {
        await productsApi.create(backendData);
      }
      setShowForm(false);
      setEditing(null);
      loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除此产品？')) return;
    try {
      await productsApi.delete(id);
      loadProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Product Management</span>
          <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>产品管理</h1>
          <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>管理十款营养包的产品信息与展示内容。</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: '#6B705C' }}
        >
          <Plus className="w-4 h-4" /> 新增产品
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6B705C' }}>加载中...</div>
      ) : products.length === 0 ? (
        <div className="rounded-[24px] p-16 text-center" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
          <Package className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: '#6B705C' }} />
          <p className="text-sm" style={{ color: '#5C5C5C' }}>暂无产品，点击右上角新增</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const fp = toFrontendProduct(p);
            return (
              <div key={p.id} className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
                <div className="h-40" style={{ background: p.image_url ? `url(${p.image_url})` : 'linear-gradient(135deg, #B2B8A3, #E8D5B7)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold" style={{ color: '#2C2C2C' }}>{p.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#5C5C5C' }}>{p.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(fp); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(178,184,163,0.15)', color: '#6B705C' }}>
                      <Pencil className="w-3 h-3" /> 编辑
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(192,57,43,0.1)', color: '#c0392b' }}>
                      <Trash2 className="w-3 h-3" /> 删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onClose }) {
  const [data, setData] = useState({
    name: product?.name || '',
    subtitle: product?.subtitle || '',
    description: product?.description || '',
    target_audience: product?.target_audience || '',
    bio_markers: product?.bio_markers || [],
    image_url: product?.image_url || '',
    category: product?.category || 'growth',
    order: product?.order || 0,
  });
  const [markerInput, setMarkerInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const inputStyle = { background: '#F5F2EB', border: '1px solid #E8D5B7', borderRadius: '12px', padding: '12px 16px', color: '#2C2C2C', fontSize: '14px', width: '100%' };
  const labelStyle = { color: '#6B705C', fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block' };

  const addMarker = () => {
    if (markerInput.trim()) {
      setData({ ...data, bio_markers: [...data.bio_markers, markerInput.trim()] });
      setMarkerInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onMouseDown={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] p-8" style={{ background: '#FDFBF7' }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{product ? '编辑产品' : '新增产品'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" style={{ color: '#2C2C2C' }} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>产品名称</label>
            <input style={inputStyle} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>英文副标题</label>
            <input style={inputStyle} value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>产品简介</label>
            <textarea style={{ ...inputStyle, minHeight: '80px' }} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>适用人群</label>
              <input style={inputStyle} value={data.target_audience} onChange={(e) => setData({ ...data, target_audience: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>分类</label>
              <select style={inputStyle} value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>产品图片</label>
            {/* Image preview */}
            {data.image_url ? (
              <div className="relative mb-3 rounded-xl overflow-hidden" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
                <img src={data.image_url} alt="product preview" className="w-full h-40 object-cover" />
                <button
                  onClick={() => setData({ ...data, image_url: '' })}
                  className="absolute top-2 right-2 p-1.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="relative mb-3 rounded-xl flex flex-col items-center justify-center h-40 cursor-pointer transition-all hover:opacity-80"
                style={{ background: '#F5F2EB', border: '1px dashed #E8D5B7', color: '#6B705C' }}
                onClick={() => document.getElementById('product-image-input')?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6B705C', borderTopColor: 'transparent' }} />
                    <span className="text-xs">上传中...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 opacity-40" />
                    <span className="text-xs">点击选择图片</span>
                    <span className="text-xs opacity-50">支持 JPG / PNG / GIF / WebP</span>
                  </div>
                )}
              </div>
            )}
            <input
              id="product-image-input"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const result = await productsApi.uploadImage(file);
                  setData({ ...data, image_url: result.url });
                } catch (err) {
                  console.error('Upload failed:', err);
                  alert('图片上传失败，请重试');
                } finally {
                  setUploading(false);
                  // Reset file input so the same file can be re-selected
                  e.target.value = '';
                }
              }}
            />
            <input
              style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }}
              value={data.image_url}
              onChange={(e) => setData({ ...data, image_url: e.target.value })}
              placeholder="或手动输入图片URL"
            />
          </div>
          <div>
            <label style={labelStyle}>关键生物指标</label>
            <div className="flex gap-2 mb-2">
              <input style={inputStyle} value={markerInput} onChange={(e) => setMarkerInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMarker())} placeholder="输入后回车添加" />
              <button onClick={addMarker} className="px-4 rounded-xl text-sm font-medium text-white" style={{ background: '#6B705C' }}>添加</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.bio_markers.map((m, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5" style={{ background: 'rgba(178,184,163,0.15)', color: '#6B705C' }}>
                  {m}
                  <button onClick={() => setData({ ...data, bio_markers: data.bio_markers.filter((_, idx) => idx !== i) })}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>排序</label>
            <input type="number" style={inputStyle} value={data.order} onChange={(e) => setData({ ...data, order: parseInt(e.target.value) || 0 })} />
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
