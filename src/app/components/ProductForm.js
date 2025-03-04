'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

export default function ProductForm({ productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    importDate: '',
    quantity: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách categories
        const response = await fetch('/api/products');
        const data = await response.json();
        setCategories(data.categories);

        // Nếu có productId, lấy thông tin sản phẩm để cập nhật
        if (productId) {
          const product = data.products.find(p => p.id === productId);
          if (product) {
            setFormData({
              ...product,
              importDate: moment(product.importDate).format('YYYY-MM-DD')
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [productId]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length > 100) {
      newErrors.name = 'Tên sản phẩm không được dài quá 100 ký tự';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn loại sản phẩm';
    }

    if (moment(formData.importDate).isAfter(moment())) {
      newErrors.importDate = 'Ngày nhập không được lớn hơn ngày hiện tại';
    }

    if (!Number.isInteger(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Số lượng phải là số nguyên lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: productId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(productId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        router.push('/');
      } else {
        alert('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {productId ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
      </h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">Mã sản phẩm:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            readOnly={!!productId}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Ngày nhập:</label>
          <input
            type="date"
            name="importDate"
            value={formData.importDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.importDate && <p className="text-red-500">{errors.importDate}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Số lượng:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Loại sản phẩm:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500">{errors.categoryId}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {productId ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
} 