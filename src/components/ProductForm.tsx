import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export function ProductForm({ onClose, onSuccess, product }: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    discount_price: product?.discount_price?.toString() || '',
    stock: product?.stock?.toString() || '',
    sku: product?.sku || '',
    category_id: product?.category_id?.toString() || '',
    images: product?.images || [''],
    variants: product?.variants || [],
    is_featured: product?.is_featured || false,
    is_trending: product?.is_trending || false,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          stock: parseInt(formData.stock),
          category_id: parseInt(formData.category_id),
          images: formData.images.filter(img => img.trim() !== ''),
          variants: formData.variants.filter(v => v.size.trim() !== ''),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || `Failed to ${product ? 'update' : 'add'} product`);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const removeImageField = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Add the base64 string to images array
      // If the last field is empty, replace it, otherwise add new
      const newImages = [...formData.images];
      if (newImages.length === 1 && newImages[0] === '') {
        newImages[0] = base64String;
      } else {
        newImages.push(base64String);
      }
      setFormData({ ...formData, images: newImages });
      setUploading(false);
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const addVariantField = () => setFormData({ ...formData, variants: [...formData.variants, { size: '' }] });
  const removeVariantField = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-luxury-gray border border-white/10 w-full max-w-4xl rounded-sm shadow-2xl my-8">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gold/5">
          <h2 className="text-2xl font-serif font-bold gold-text-gradient">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Product Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Slug (URL)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Category</label>
                <select
                  required
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest">Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest">SKU</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Images and Variants */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest flex justify-between items-center">
                  Product Images
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer text-gold hover:text-white transition-colors flex items-center space-x-1">
                      <Upload size={14} />
                      <span className="text-[10px]">Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                    <button type="button" onClick={addImageField} className="text-gold hover:text-white transition-colors flex items-center space-x-1">
                      <Plus size={14} />
                      <span className="text-[10px]">URL</span>
                    </button>
                  </div>
                </label>
                <div className="space-y-2">
                  {uploading && (
                    <div className="text-[10px] text-gold animate-pulse">Processing image...</div>
                  )}
                  {formData.images.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Image URL (https://...) or Uploaded Data"
                          className="flex-grow bg-luxury-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                          value={img.startsWith('data:') ? 'Image Uploaded' : img}
                          readOnly={img.startsWith('data:')}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData({ ...formData, images: newImages });
                          }}
                        />
                        <button type="button" onClick={() => removeImageField(index)} className="text-red-500 hover:text-red-400">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {img.startsWith('data:') && (
                        <div className="relative w-20 h-20 border border-white/10">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute top-0 right-0 bg-gold text-luxury-black text-[8px] px-1 font-bold">UPLOADED</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest flex justify-between items-center">
                  Sizes / Variants
                  <button type="button" onClick={addVariantField} className="text-gold hover:text-white transition-colors">
                    <Plus size={16} />
                  </button>
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.variants.map((v, index) => (
                    <div key={index} className="flex gap-1 items-center bg-white/5 border border-white/10 p-1">
                      <input
                        type="text"
                        placeholder="M, L, XL..."
                        className="w-16 bg-transparent border-none focus:ring-0 text-sm text-center"
                        value={v.size}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].size = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                      <button type="button" onClick={() => removeVariantField(index)} className="text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {formData.variants.length === 0 && (
                    <div className="text-[10px] text-gray-500 italic">No sizes added. Click + to add.</div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-gold bg-luxury-black border-white/10"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gold transition-colors">Mark as Featured Product</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-gold bg-luxury-black border-white/10"
                    checked={formData.is_trending}
                    onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gold transition-colors">Mark as Trending Product</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gold uppercase tracking-widest">Description</label>
            <textarea
              rows={4}
              className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-gray-400 hover:text-white transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="gold-gradient text-luxury-black px-12 py-3 font-bold rounded-sm hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (product ? 'Updating...' : 'Adding...') : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
