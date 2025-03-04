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
          
          // Lấy thông tin category
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
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Mã sản phẩm:</p>
            <p>{product.id}</p>
          </div>
          
          <div>
            <p className="font-semibold">Tên sản phẩm:</p>
            <p>{product.name}</p>
          </div>
          
          <div>
            <p className="font-semibold">Ngày nhập:</p>
            <p>{moment(product.importDate).format('DD/MM/YYYY')}</p>
          </div>
          
          <div>
            <p className="font-semibold">Số lượng:</p>
            <p>{product.quantity}</p>
          </div>
          
          <div>
            <p className="font-semibold">Loại sản phẩm:</p>
            <p>{category.name}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href={`/products/edit/${product.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sửa
          </Link>
          
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Xóa
          </button>
          
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
} 