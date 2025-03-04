'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import Link from 'next/link';

export default function ProductDetail({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/products?id=${params.id}`);
        const productData = await response.json();
        
        if (response.ok) {
          setProduct(productData);
          
          const categoriesResponse = await fetch('/api/products');
          const data = await categoriesResponse.json();
          const productCategory = data.categories.find(c => c.id === productData.categoryId);
          setCategory(productCategory);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const response = await fetch(`/api/products?id=${params.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Xóa sản phẩm thành công!');
          router.push('/');
        } else {
          alert('Có lỗi xảy ra khi xóa sản phẩm!');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  if (!product || !category) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Chi tiết sản phẩm</h1>
        <Link href="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Quay lại
        </Link>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Mã sản phẩm:</label>
                <p className="form-control-plaintext">{product.id}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Tên sản phẩm:</label>
                <p className="form-control-plaintext">{product.name}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Ngày nhập:</label>
                <p className="form-control-plaintext">
                  {moment(product.importDate).format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Số lượng:</label>
                <p className="form-control-plaintext">{product.quantity}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Loại sản phẩm:</label>
                <p className="form-control-plaintext">{category.name}</p>
              </div>
            </div>
          </div>

          <hr />

          <div className="d-flex gap-2">
            <Link
              href={`/products/edit/${product.id}`}
              className="btn btn-warning"
            >
              <i className="fas fa-edit me-2"></i>
              Sửa
            </Link>
            
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              <i className="fas fa-trash me-2"></i>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 