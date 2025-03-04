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
  }, []); // Chỉ gọi lần đầu để lấy dữ liệu ban đầu

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <Link 
          href="/products/add" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Tên sản phẩm:</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>
          
          <div>
            <label className="block mb-2">Loại sản phẩm:</label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Tất cả</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </form>
      
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Không tìm thấy sản phẩm</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Mã sản phẩm</th>
                <th className="px-4 py-2 border">Tên sản phẩm</th>
                <th className="px-4 py-2 border">Ngày nhập</th>
                <th className="px-4 py-2 border">Số lượng</th>
                <th className="px-4 py-2 border">Loại sản phẩm</th>
                <th className="px-4 py-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.id}</td>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">
                    {moment(product.importDate).format('DD/MM/YYYY')}
                  </td>
                  <td className="px-4 py-2 border">{product.quantity}</td>
                  <td className="px-4 py-2 border">{categoryMap[product.categoryId]}</td>
                  <td className="px-4 py-2 border">
                    <Link 
                      href={`/products/${product.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Xem
                    </Link>
                    <Link 
                      href={`/products/edit/${product.id}`}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
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