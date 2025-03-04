'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []); // gọi lần đầu để lấy dữ liệu

  const fetchData = async (search = false) => {
    try {
      setIsLoading(true);
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (search && searchName) {
        params.append('name', searchName);
      }
      if (search && searchCategory) {
        params.append('categoryId', searchCategory);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      // Lưu danh sách categories
      setCategoryMap(data.categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {}));
      setCategories(data.categories);
      
      // Lưu danh sách sản phẩm đã được sắp xếp
      setProducts(data.products);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(true);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchCategory('');
    fetchData(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Xóa sản phẩm thành công!');
          fetchData(true);
        } else {
          alert('Có lỗi xảy ra khi xóa sản phẩm!');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Danh sách sản phẩm</h1>
        <Link 
          href="/products/add" 
          className="btn btn-primary"
        >
          <i className="fas fa-plus me-2"></i>
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Tên sản phẩm:</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="form-control"
                placeholder="Nhập tên sản phẩm..."
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Loại sản phẩm:</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="form-select"
              >
                <option value="">Tất cả</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-primary me-2"
              >
                <i className="fas fa-search me-2"></i>
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                <i className="fas fa-redo me-2"></i>
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <i className="fas fa-info-circle me-2"></i>
          Không tìm thấy sản phẩm
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Ngày nhập</th>
                    <th>Số lượng</th>
                    <th>Loại sản phẩm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{moment(product.importDate).format('DD/MM/YYYY')}</td>
                      <td>{product.quantity}</td>
                      <td>{categoryMap[product.categoryId]}</td>
                      <td>
                        <Link 
                          href={`/products/${product.id}`}
                          className="btn btn-sm btn-info me-2"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link 
                          href={`/products/edit/${product.id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}