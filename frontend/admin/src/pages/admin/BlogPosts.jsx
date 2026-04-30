import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';

export default function BlogPosts() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    slug: '',
    short_description: '',
    content: '',
    image_url: '',
    youtube_url: '',
    category: '',
    is_published: false
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setBlogs(data);
    setLoading(false);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG, and WebP formats are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      return;
    }

    try {
      setUploadingImage(true);
      const ext = file.name.split('.').pop();
      const fileName = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
        
      setFormData({ ...formData, image_url: publicUrl });
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await supabase.from('blog_posts').update(formData).eq('id', formData.id);
      } else {
        const { id, ...insertData } = formData;
        await supabase.from('blog_posts').insert([insertData]);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchBlogs();
  };

  const openEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const openNew = () => {
    setFormData({
      id: null, title: '', slug: '', short_description: '', content: '',
      image_url: '', category: '', is_published: false
    });
    setShowModal(true);
  };

  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Post
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center border">
        <Search className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Search blogs..." 
          className="w-full outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
            ) : filteredBlogs.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{item.category || 'General'}</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-600 hover:text-blue-600"><Edit2 size={18}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-600 hover:text-red-600"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h2 className="text-xl font-bold">{formData.id ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto grow">
              <form id="blogForm" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input required type="text" className="w-full border p-2 rounded" value={formData.title} onChange={handleTitleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug *</label>
                    <input required type="text" className="w-full border p-2 rounded bg-gray-50" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <textarea rows="2" className="w-full border p-2 rounded" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
                  <input type="text" className="w-full border p-2 rounded" value={formData.youtube_url || ''} onChange={e => setFormData({...formData, youtube_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input type="text" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Featured Image</label>
                    {formData.image_url ? (
                      <div className="relative mb-2">
                        <img src={formData.image_url} alt="Preview" className="h-24 w-full object-cover rounded border" />
                        <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 shadow hover:bg-gray-100">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded cursor-pointer bg-gray-50 hover:bg-gray-100 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="text-sm text-gray-500">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
                          </div>
                          <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content (HTML allowed) *</label>
                  <textarea required rows="10" className="w-full border p-2 rounded font-mono text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                  <p className="text-xs text-gray-500 mt-1">You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, etc.</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="is_pub" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                  <label htmlFor="is_pub" className="font-medium">Publish this post</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t shrink-0 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded bg-white">Cancel</button>
              <button type="submit" form="blogForm" className="px-4 py-2 bg-blue-600 text-white rounded">Save Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
