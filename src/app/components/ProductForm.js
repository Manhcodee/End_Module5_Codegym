'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import Link from 'next/link';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setCategories(data.categories);

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
        console.error('Error:', error);
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
      setIsLoading(true);
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
        const data = await response.json();
        alert(data.error || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      setIsLoading(false);
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          {productId ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
        </h1>
        <Link href="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Quay lại
        </Link>
      </div>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Mã sản phẩm:</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="form-control"
                    required
                    readOnly={!!productId}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên sản phẩm:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Ngày nhập:</label>
                  <input
                    type="date"
                    name="importDate"
                    value={formData.importDate}
                    onChange={handleChange}
                    className={`form-control ${errors.importDate ? 'is-invalid' : ''}`}
                    required
                  />
                  {errors.importDate && (
                    <div className="invalid-feedback">{errors.importDate}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Số lượng:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                    required
                  />
                  {errors.quantity && (
                    <div className="invalid-feedback">{errors.quantity}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Loại sản phẩm:</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                    required
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="invalid-feedback">{errors.categoryId}</div>
                  )}
                </div>
              </div>
            </div>

            <hr />

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {productId ? 'Cập nhật' : 'Thêm mới'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 