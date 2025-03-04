import ProductForm from '../../../components/ProductForm';

export default function EditProduct({ params }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProductForm productId={params.id} />
    </main>
  );
} 