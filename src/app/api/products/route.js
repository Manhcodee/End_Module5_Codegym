import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), 'db.json');

// Đọc dữ liệu từ file db.json
async function getData() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Lưu dữ liệu vào file db.json
async function saveData(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// GET: Lấy danh sách sản phẩm và categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const searchName = searchParams.get('name');
    const categoryId = searchParams.get('categoryId');
    
    const data = await getData();

    if (id) {
      const product = data.products.find(p => p.id === id);
      if (!product) {
        return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    let filteredProducts = [...data.products];

    // Tìm kiếm theo tên (gần đúng)
    if (searchName) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Tìm kiếm theo thể loại
    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
    }

    // Sắp xếp theo số lượng tăng dần
    filteredProducts.sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json({
      ...data,
      products: filteredProducts
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi đọc dữ liệu' },
      { status: 500 }
    );
  }
}

// POST: Thêm sản phẩm mới
export async function POST(request) {
  try {
    const data = await getData();
    const newProduct = await request.json();

    // Kiểm tra các ràng buộc
    if (newProduct.name.length > 100) {
      return NextResponse.json(
        { error: 'Tên sản phẩm không được dài quá 100 ký tự' },
        { status: 400 }
      );
    }

    data.products.push(newProduct);
    await saveData(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi thêm sản phẩm' },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật sản phẩm
export async function PUT(request) {
  try {
    const data = await getData();
    const updatedProduct = await request.json();

    // Kiểm tra các ràng buộc
    if (updatedProduct.name.length > 100) {
      return NextResponse.json(
        { error: 'Tên sản phẩm không được dài quá 100 ký tự' },
        { status: 400 }
      );
    }

    const index = data.products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    data.products[index] = updatedProduct;
    await saveData(data);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật sản phẩm' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu mã sản phẩm' },
        { status: 400 }
      );
    }

    const data = await getData();
    const index = data.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    data.products.splice(index, 1);
    await saveData(data);

    return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi xóa sản phẩm' },
      { status: 500 }
    );
  }
} 