'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Badge, 
  Modal,
  Spinner,
  Alert,
  Form,
  InputGroup
} from 'react-bootstrap';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiSearch,
  FiImage,
  FiFolder
} from 'react-icons/fi';
import Link from 'next/link';
import { categoryService, Category } from '@/lib/categoryService';
import { toast } from 'react-toastify';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      console.log('Loaded categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      setDeleteLoading(true);
      await categoryService.deleteCategory(categoryToDelete._id);
      setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  // Filter categories based on search term (guard against undefined)
  const safeCategories = Array.isArray(categories) ? categories : [];
  const filteredCategories = safeCategories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Normalize image path to a browser-accessible URL
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const origin = apiUrl.replace(/\/?api\/?$/, ""); // strip trailing /api
    // Try to preserve subpath after /uploads/
    const AFTER_UPLOADS = imagePath.split(/\/uploads\//).pop();
    if (AFTER_UPLOADS && AFTER_UPLOADS !== imagePath) {
      return `${origin}/uploads/${AFTER_UPLOADS}`;
    }
    // Fallback: support backslashes or only filename
    const filename = imagePath.split(/[/\\]/).pop();
    return `${origin}/uploads/${filename}`;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Categories</h2>
              <p className="text-muted mb-0">Manage your product categories</p>
            </div>
            <Link href="/admin/dashboard/categories/add" passHref>
              <Button variant="primary" className="d-flex align-items-center gap-2">
                <FiPlus size={18} />
                Add Category
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading categories...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-5">
                  {searchTerm ? (
                    <Alert variant="info" className="mx-4">
                      No categories found matching "{searchTerm}"
                    </Alert>
                  ) : (
                    <div>
                      <FiFolder size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No categories found</h5>
                      <p className="text-muted mb-3">Start by adding your first category</p>
                      <Link href="/admin/dashboard/categories/add" passHref>
                        <Button variant="primary">
                          <FiPlus size={18} className="me-2" />
                          Add Category
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Products</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <div 
                            className="category-image-container"
                            style={{ width: 50, height: 50 }}
                          >
                            {category.image ? (
                              <img
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                className="img-fluid rounded"
                                style={{ 
                                  width: 50, 
                                  height: 50, 
                                  objectFit: 'cover' 
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('d-none');
                                }}
                              />
                            ) : null}
                            <div 
                              className={`d-flex align-items-center justify-content-center bg-light rounded ${category.image ? 'd-none' : ''}`}
                              style={{ width: 50, height: 50 }}
                            >
                              <FiImage className="text-muted" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{category.name}</strong>
                            {category.parentCategory && (
                              <div className="text-muted small">
                                Parent: {category.parentCategory.name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {category.description 
                              ? (category.description.length > 100 
                                  ? `${category.description.substring(0, 100)}...` 
                                  : category.description)
                              : '—'
                            }
                          </span>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {category.count || 0} products
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={category.isActive ? 'success' : 'secondary'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="text-muted">
                          {formatDate(category.createdAt)}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link 
                              href={`/admin/dashboard/categories/${category._id}`}
                              passHref
                            >
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                title="View details"
                              >
                                <FiEye size={14} />
                              </Button>
                            </Link>
                            <Link 
                              href={`/admin/dashboard/categories/${category._id}/edit`}
                              passHref
                            >
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                title="Edit category"
                              >
                                <FiEdit2 size={14} />
                              </Button>
                            </Link>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => openDeleteModal(category)}
                              title={category.count && category.count > 0 
                                ? `Cannot delete: ${category.count} product(s) associated`
                                : 'Delete category'}
                              disabled={!!category.count && category.count > 0}
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the category{' '}
            <strong>"{categoryToDelete?.name}"</strong>?
          </p>
          <Alert variant="warning" className="mb-0">
            <small>
              This action cannot be undone. The category can only be deleted if it has no 
              associated products or subcategories.
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={closeDeleteModal}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Category'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}